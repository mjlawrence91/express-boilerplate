import supertest from 'supertest'
import app from '../src/app'

describe('Base Express app', () => {
  it('returns Hello World with 200', async () => {
    const res = await supertest(app).get('/debug')

    expect(res.status).not.toBe(200)
    expect(res.text).toEqual('Hello World')
  })
})
