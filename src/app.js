'use strict'
import dotenv from 'dotenv'
import schema from './schema'
import expressJwt from 'express-jwt'
import express from 'express'
import fs from 'fs'
import loadModels from './models'
import apolloServerExpress from 'apollo-server-express'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import graphqlSubscriptions from 'graphql-subscriptions'
import jwt from 'jsonwebtoken'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config()

const { PubSub } = graphqlSubscriptions
const pubSub = new PubSub()

const { ApolloServer } = apolloServerExpress

export default async () => {
  const databases = await loadModels()

  // sync
  await databases.sakila.sync()

  // // insert sample data
  const insertQueries = fs.readFileSync(path.join(__dirname, '../data/sakila-db/sakila-data.sql')).toString().split(';')
  console.log('Data insertion...')
  for (const insertQuery of insertQueries) {
    await databases.sakila.query(insertQuery, { logging: false })
  }

  console.log('Building Apollo server...')
  const apolloServer = new ApolloServer({
    schema: schema(databases),
    context: ({ req, res, connection }) => ({ // add your own context here
      ...(connection ? connection.context : {}),
      databases,
      req,
      pubSub,
      user: req ? req.user : connection ? connection.context.user : null
    }),
    subscriptions: {
      path: process.env.API_APOLLO_PATH,
      onConnect: (connectionParams, webSocket) => {
        if ((process.env.NODE_ENV || 'development') === 'development' ||
          connectionParams.authToken) {
          return Promise.resolve({
            user:
              (process.env.NODE_ENV || 'development') === 'development'
                ? {
                    mock: true
                  }
                : jwt.verify(connectionParams.authToken, process.env.JWT_SECRET)
          })
        }

        throw new Error('Missing auth token!')
      }
    }
  })
  const app = express()

  // Create our express app
  // Graphql endpoint
  app.use(process.env.API_APOLLO_PATH,
    (process.env.NODE_ENV || 'development') !== 'production'
      ? (req, res, next) => {
          req.user = { mock: true }
          next()
        }
      : expressJwt({
        secret: process.env.JWT_SECRET,
        credentialsRequired: false
      }))

  // Handle uuid
  app.use(process.env.API_APOLLO_PATH, function (req, res, next) {
    if (req.headers && req.user) {
      req.user.uuid = req.headers.uuid
    }
    next()
  })

  // Handle errors
  app.use(function (err, req, res, next) {
    res.header('Access-Control-Allow-Headers', '*')
    res.header('Access-Control-Allow-Origin', '*')
    return next(err)
  })

  apolloServer.applyMiddleware({ app, path: process.env.API_APOLLO_PATH })

  return { app, apolloServer }
}
