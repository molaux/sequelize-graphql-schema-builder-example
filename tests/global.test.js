import app from '../src/app'
import st from 'supertest'
import fs from 'fs'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import graphqlSubscriptions from 'graphql-subscriptions'
import { getWsClient, getWsLink, subscribeFactory } from './utils/apolloSubscription'
import http from 'http'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const { PubSub } = graphqlSubscriptions

let request
let subscribe
const asyncIterators = {}
let httpServer
let wsClient
const pubSub = new PubSub()
beforeAll(async () => {
  const server = await app()

  httpServer = http.createServer(server.app)
  server.apolloServer.installSubscriptionHandlers(httpServer)
  await new Promise(resolve => httpServer.listen({ host: process.env.HOST, port: process.env.PORT }, () => resolve()))
  wsClient = getWsClient(`ws://${process.env.HOST}:${process.env.PORT}${server.apolloServer.subscriptionsPath}`)
  subscribe = subscribeFactory(getWsLink(wsClient))

  const subscriptionsFiles = fs
    .readdirSync(path.join(__dirname, 'gql', 'subscriptions'))

  for (const fileName of subscriptionsFiles) {
    const subscription = fs.readFileSync(path.join(__dirname, 'gql', 'subscriptions', fileName), 'utf8')
    const [name] = fileName.split('.')
    asyncIterators[name] = pubSub.asyncIterator(name)
    subscribe(subscription, (event) => pubSub.publish(name, event))
  }
  request = st(httpServer)

  return request
}, 20000)

afterAll(() => {
  wsClient.close()
  httpServer.close()
})

const requestsFiles = fs
  .readdirSync(path.join(__dirname, 'gql'))
  .filter((fileName) => !fs.lstatSync(path.join(__dirname, 'gql', fileName)).isDirectory())
  .sort()

for (const requestFile of requestsFiles) {
  const [n, task] = requestFile.split('.')
  const query = fs.readFileSync(path.join(__dirname, 'gql', requestFile), 'utf8')
  const expected = JSON.parse(fs.readFileSync(path.join(__dirname, 'json', `${n}.${task}.json`), 'utf8'))
  let publications
  test(`${task} (${n}) > query > response`, async () => {
    publications = Promise.all(Object.keys(expected.publications ?? []).map((subscription) => new Promise((resolve) => {
      return asyncIterators[subscription].next().then((response) => resolve([response.value, expected.publications[subscription]]))
    }
    )))

    const result = await request
      .post(process.env.API_APOLLO_PATH)
      .send({ query })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(result.body).toBeInstanceOf(Object)
    expect(result.body).toEqual(expected.response)
  })

  let i = 0
  for (const publication in expected.publications) {
    test(`${task} (${n}) > subscription > ${publication} > response`, async () => {
      const [response, expected] = (await publications)[i++]
      expect(response).toEqual(expected)
    })
  }
  

  test(`${task} (${n}) > subscription > all > have no additional publication`, async () => {
    const noMore = await new Promise((resolve) => {
      setTimeout(() => Object.keys(asyncIterators).map((subscription) => {
        asyncIterators[subscription].return()
        return resolve(true)
      }), 200)

      Promise.all(Object.keys(asyncIterators).map((subscription) => new Promise((resolve) =>
        asyncIterators[subscription].next().then((response) => resolve(response))
      ))).then(() => resolve(false))
    })

    expect(noMore).toEqual(true)

    for (const name in asyncIterators) {
      asyncIterators[name] = pubSub.asyncIterator(name)
    }
  })
   
}
