'use strict'
import dotenv from 'dotenv'
import packageJsonData from '../../package.json'
import graphql from 'graphql'
// import graphqlSequelizeRReactAdmin from '@molaux/graphql-sequelize-r-react-admin'
import graphqlSequelizeR from '@molaux/graphql-sequelize-r'
import jwt from 'jsonwebtoken'

dotenv.config()
const packageJson = Object.assign({}, {
  version: 'Unknown'
}, packageJsonData)
const { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLSchema } = graphql

// const {
//   extraModelFields: reactAdminFieldsGenerator,
//   extraModelQueries: reactAdminQueriesGenerator,
//   extraModelTypes: reactAdminTypesGenerator,
//   extraTypes: reactAdminExtraTypes
// } = graphqlSequelizeRReactAdmin

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

const { sequelizeToGraphQLSchemaBuilder } = graphqlSequelizeR

const schema = dbs => {
  console.log('Building API Schema...')
  const {
    modelsTypes,
    queries
  } = sequelizeToGraphQLSchemaBuilder(dbs.sakila, { 
    namespace: '',
    extraModelFields: (...args) => ({
        // ...reactAdminFieldsGenerator(...args),
      }),
    extraModelQueries: () => ({}), // reactAdminQueriesGenerator,
    extraModelTypes: (...args) => ({
        // ...reactAdminTypesGenerator(...args),
      }),
    // debug: true
   })

  return new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQueryType',
      fields: () => ({
        ...securizeAllResolvers({
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
    // subscription: new GraphQLObjectType({
    //   name: 'RootSubscriptionType',
    //   fields: () => securizeAllResolvers({
    //     ...mySubscriptions({ modelsTypes }),
    //   })
    // }),
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
          // ...otherMutations()
        })
      })
    })
  })
}
export default schema
