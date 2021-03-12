import _ApolloClient from '@apollo/client/core'
import ws from 'ws'
import subscriptionsTransportWs from 'subscriptions-transport-ws'
import apolloLinkWs from '@apollo/client/link/ws'
import gql from 'graphql-tag'

const { SubscriptionClient } = subscriptionsTransportWs
const { WebSocketLink } = apolloLinkWs
const { ApolloLink: { execute } } = _ApolloClient

export const getWsClient = function (wsurl) {
  return new SubscriptionClient(wsurl, {}, ws)
}

export const getWsLink = function (client) {
  return new WebSocketLink(client)
}

export const subscribeFactory = (link) => (query, next) => {
  return execute(link, { query: gql`${query}` }).subscribe({
    next,
    error: (e) => { throw Error(`received error ${e}`) }
  })
}
