import app from '../src/app.js'
import st from 'supertest'
import fs from 'fs'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import graphqlSubscriptions from 'graphql-subscriptions'
import { getWsClient, getWsLink, subscribeFactory } from './utils/apolloSubscription.js'
import http from 'http'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const { PubSub } = graphqlSubscriptions

const fixedStringWidth = (string, n) => string.length < n
  ? string.concat(...Array.from({ length: n - string.length }, () => ' '))
  : string

const Breadcrumb = (widths) => (...args) => args
  .map((arg, i) => fixedStringWidth(arg, widths[i] ?? 0))
  .join(' › ')

let request
let subscribe
const asyncIterators = {}
let httpServer
let wsClient
const pubSub = new PubSub()
const subscriptionsFiles = fs
  .readdirSync(path.join(__dirname, 'gql', 'subscriptions'))

const breadcrumb = Breadcrumb([12, 15, 10])
const subscriptions = subscriptionsFiles
  .map((fileName) => fileName.split('.')[0])

beforeAll(async () => {
  console.log('Building server...')
  const server = await app()

  httpServer = http.createServer(server.app)
  const subscriptionServer = server.buildSubscriptionServer(httpServer)
  await new Promise(resolve => httpServer.listen({ host: process.env.HOST, port: process.env.PORT }, () => resolve()))
  console.log('Building client...')
  
  wsClient = getWsClient(`ws://${process.env.HOST}:${process.env.PORT}${subscriptionServer.wsServer.options.path}`)
  subscribe = subscribeFactory(getWsLink(wsClient))

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
  let expectedPublicationsPromises
  let expectedPublications
  let unexpectedPublicationsPromises = []
  let unexpectedPublications
  expected.publications = expected.publications ?? {}
  describe(breadcrumb(`${fixedStringWidth(`[${n}]`, 5)} ${task}`), () => {
    test(breadcrumb('query', 'default', 'response'), async () => {
      expectedPublicationsPromises = Object.keys(expected.publications).map((subscription) => new Promise((resolve) => {
        const first = setTimeout(() => {
          asyncIterators[subscription].return()
          unexpectedPublicationsPromises.push(Promise.resolve({ subscription, response: {} }))
          resolve({ subscription, response: {}, expected: expected.publications[subscription] })
        }, 2000)
        asyncIterators[subscription].next().then((response) => {
          clearTimeout(first)
          unexpectedPublicationsPromises.push(new Promise((resolve) => {
            const second = setTimeout(() => {
              asyncIterators[subscription].return()
              resolve({ subscription, response: {} })
            }, 200)
            asyncIterators[subscription].next()
              .then((response) => {
                clearTimeout(second)
                asyncIterators[subscription].return()
                resolve({ subscription, response: response.value })
              })
          }))
          clearTimeout(first)
          resolve({ subscription, response: response.value, expected: expected.publications[subscription] })
        })
      }))

      unexpectedPublicationsPromises = Object.keys(asyncIterators)
        .filter((subscription) => !(subscription in expected.publications))
        .map((subscription) => new Promise((resolve) => {
          const first = setTimeout(() => {
            asyncIterators[subscription].return()
            resolve({ subscription, response: {} })
          }, 200)
          asyncIterators[subscription].next()
            .then((response) => {
              clearTimeout(first)
              asyncIterators[subscription].return()
              resolve({ subscription, response: response.value })
            })
        }))

      const resultPromise = request
        .post(process.env.API_APOLLO_PATH)
        .send({ query })
        .set('Accept', 'application/json')

      const result = await resultPromise

      expectedPublications = (await Promise.all(expectedPublicationsPromises))
        .reduce((o, { subscription, ...rest }) => ({ ...o, [subscription]: { subscription, ...rest } }), {})

      unexpectedPublications = (await Promise.all(unexpectedPublicationsPromises))
        .reduce((o, { subscription, ...rest }) => ({ ...o, [subscription]: { subscription, ...rest } }), {})

      for (const name in asyncIterators) {
        asyncIterators[name] = pubSub.asyncIterator(name)
      }

      await resultPromise
        .expect('Content-Type', /json/)
        .expect(200)

      expect(result.header['content-type']).toMatch(/application\/json/)
      expect(result.body).toBeInstanceOf(Object)
      expect(result.body).toEqual(expected.response)
    })

    for (const publication in expected.publications) {
      test(breadcrumb('subscription', publication, 'response'), () => {
        const { expected, response } = expectedPublications[publication]
        expect(response).toEqual(expected)
      }, 10000)
    }

    for (const publication of subscriptions) {
      test(breadcrumb('subscription', publication, 'no more'), () => {
        const { response } = unexpectedPublications[publication]
        expect(response).toEqual({})
      }, 10000)
    }
  }, 60000)
}
