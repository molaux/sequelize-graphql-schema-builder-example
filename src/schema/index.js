'use strict'
import dotenv from 'dotenv'
import packageJsonData from '../../package.json'
import graphql from 'graphql'
import sequelizeGraphQLSchemaBuilder from '@molaux/sequelize-graphql-schema-builder'
import jwt from 'jsonwebtoken'
import Sequelize from 'sequelize'
import _GraphQLJSON from 'graphql-type-json'
const { GraphQLJSON } = _GraphQLJSON
const { QueryTypes } = Sequelize

dotenv.config()
const packageJson = Object.assign({}, {
  version: 'Unknown'
}, packageJsonData)

const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLSchema,
  GraphQLList
} = graphql

const securizeResolver = resolver => (parent, args, { user, ...context }, ...rest) => {
  if (!user) {
    throw Error('Unauthenticated')
  } else {
    return resolver(parent, args, { user, ...context }, ...rest)
  }
}

const securizeAllResolvers = o => {
  for (const key in o) {
    if (typeof o[key].resolve === 'function') {
      o[key].resolve = securizeResolver(o[key].resolve)
    }
    if (typeof o[key].subscribe === 'function') {
      o[key].subscribe = securizeResolver(o[key].subscribe)
    }
  }
  return o
}

const { schemaBuilder } = sequelizeGraphQLSchemaBuilder

const schema = dbs => {
  console.log('Building API Schema...')
  const {
    // modelsTypes,
    queries,
    mutations,
    subscriptions
  } = schemaBuilder(dbs.sakila)

  return new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQueryType',
      fields: () => ({
        ...securizeAllResolvers({
          sql: {
            name: 'Raw SQL query',
            type: new GraphQLList(GraphQLJSON),
            args: {
              request: { type: GraphQLString }
            },
            resolve: (_, { request }, { databases }) => {
              return databases.sakila.query(request, { raw: true, type: QueryTypes.SELECT })
            }
          },
          ...queries
          // ... otherQueries
        }),
        // non secured query
        version: {
          type: new GraphQLNonNull(GraphQLString),
          resolve: () => packageJson.version
        }
      })
    }),
    subscription: new GraphQLObjectType({
      name: 'RootSubscriptionType',
      fields: () => securizeAllResolvers(subscriptions)
    }),
    mutation: new GraphQLObjectType({
      name: 'RootMutationType',
      fields: () => ({
        login: {
          type: GraphQLString,
          args: {
            login: {
              type: new GraphQLNonNull(GraphQLString)
            },
            password: {
              type: new GraphQLNonNull(GraphQLString)
            }
          },
          // implement your own authentication logic here
          resolve: (_, { login: uid, password }, { ldapAuth, req }) => jwt.sign({
            uid
          }, process.env.JWT_SECRET /*, { expiresIn: '1y' } */)
        },
        ...securizeAllResolvers({
          ...mutations
          // ...otherMutations()
        })
      })
    })
  })
}
export default schema
