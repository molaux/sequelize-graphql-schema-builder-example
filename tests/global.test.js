import app from '../src/app'
import st from 'supertest'
import fs from 'fs'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let request
beforeAll(async () => {
  request = st(await app())
  return request
}, 20000)

const gqlFiles = fs.readdirSync(path.join(__dirname, 'gql')).sort()
for (const gqlFile of gqlFiles) {
  const [n, task] = gqlFile.split('.')
  const query = fs.readFileSync(path.join(__dirname, 'gql', gqlFile), 'utf8')
  const expected = JSON.parse(fs.readFileSync(path.join(__dirname, 'json', `${n}.${task}.json`), 'utf8'))

  test(`${task} request ${n}`, async () => {
    const result = await request
      .post(process.env.API_APOLLO_PATH)
      .send({ query })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)

    expect(result.body).toBeInstanceOf(Object)
    expect(result.body).toEqual(expected)
    return result
  })
}
