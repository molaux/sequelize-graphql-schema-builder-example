'use strict'
import dotenv from 'dotenv'
import colors from 'colors'
import https from 'https'
import http from 'http'
import schema from './schema'
import expressJwt from 'express-jwt'
import jwt from 'jsonwebtoken'
import express from 'express'
import fs from 'fs'
import loadModels from './models'
import apolloServerExpress from 'apollo-server-express'
// import graphqlSubscriptions from 'graphql-subscriptions'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config()
console.log(`Server starting in ${colors.red(process.env.NODE_ENV || 'development')} mode...`)

const { ApolloServer } = apolloServerExpress

const SECURED = process.env.SECURED === 'yes'

const credentials = {
  key: SECURED ? fs.readFileSync(process.env.SECURED_PRIVKEY) : null,
  cert: SECURED ? fs.readFileSync(process.env.SECURED_CERT) : null
}

const startServer = async () => {
  const databases = await loadModels()

  // sync
  await databases.sakila.sync()

  // insert sample data
  const insertQueries = fs.readFileSync(path.join(__dirname, '../data/sakila-db/sakila-data.sql')).toString().split(';')
  for (const insertQuery of insertQueries) {
    await databases.sakila.query(insertQuery)
  }

  const { Staff } = databases.sakila.models
  console.log('Staffs', await Staff.findAll())

  console.log('Building Apollo server...')
  const apolloServer = new ApolloServer({
    schema: schema(databases),
    context: ({ req, res, connection }) => ({ // add your own context here
      ...(connection ? connection.context : {}),
      databases,
      req,
      user: req ? req.user : connection ? connection.context.user : null
    }),
    subscriptions: {
      path: process.env.API_APOLLO_PATH,
      onConnect: (connectionParams, webSocket) => {
        if (connectionParams.authToken) {
          return Promise.resolve({
            user:
              (process.env.NODE_ENV || 'development') === 'development'
                ? {
                    mock: true,
                    uuid: connectionParams.uuid
                  }
                : {
                    ...jwt.verify(connectionParams.authToken, process.env.JWT_SECRET),
                    uuid: connectionParams.uuid
                  }
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
    (process.env.NODE_ENV || 'development') === 'development'
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

  if (SECURED) {
    const httpsServer = https.createServer(credentials, app)
    apolloServer.installSubscriptionHandlers(httpsServer)

    httpsServer.listen({ host: process.env.HOST, port: process.env.PORT }, () => {
      console.log(`  ${colors.brightGreen('✱')} ${colors.grey('Graphql API ready at')}           ${colors.brightGreen('https')}://${colors.brightWhite(process.env.HOST)}:${colors.brightWhite(process.env.PORT)}${colors.brightCyan(apolloServer.graphqlPath)}`)
      console.log(`  ${colors.brightGreen('✱')} ${colors.grey('Graphql subscriptions ready at')} ${colors.brightGreen('wss')}://${colors.brightWhite(process.env.HOST)}:${colors.brightWhite(process.env.PORT)}${colors.brightCyan(apolloServer.subscriptionsPath)}`)
    })
  } else {
    const httpServer = http.createServer(app)
    apolloServer.installSubscriptionHandlers(httpServer)

    httpServer.listen({ host: process.env.HOST, port: process.env.PORT }, () => {
      console.log(`  ${colors.yellow('✱')} ${colors.grey('Graphql API ready at')}           ${colors.yellow('http')}://${colors.brightWhite(process.env.HOST)}:${colors.brightWhite(process.env.PORT)}${colors.brightCyan(apolloServer.graphqlPath)}`)
      console.log(`  ${colors.yellow('✱')} ${colors.grey('Graphql subscriptions ready at')} ${colors.yellow('ws')}://${colors.brightWhite(process.env.HOST)}:${colors.brightWhite(process.env.PORT)}${colors.brightCyan(apolloServer.subscriptionsPath)}`)
    })
  }

  function exitHandler (options, err) {
    if (options.cleanup) {
      // cleanly close other connections here
    }

    if (err && err.stack) {
      console.log(err.stack)
    }

    if (options.exit) {
      process.exit()
    }
  }

  process.on('exit', exitHandler.bind(null, { cleanup: true, exit: true }))
  process.on('SIGINT', exitHandler.bind(null, { exit: true }))
  process.on('SIGUSR1', exitHandler.bind(null, { exit: true }))
  process.on('SIGUSR2', exitHandler.bind(null, { exit: true }))
  process.on('uncaughtException', exitHandler.bind(null, { exit: true }))
}

startServer()
