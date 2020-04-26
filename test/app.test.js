import supertest from 'supertest'
import app from '../src/app'

describe('Base Express app', () => {
  it('returns Hello World with 200', async () => {
    const res = await supertest(app).get('/debug')

    expect(res.status).toBe(200)
    expect(res.text).toEqual('Hello World')
  })

  it('uses HTTP/2', async () => {
    const res = await supertest(app).get('/debug')

    // console.log(Object.keys(res))

    expect(res.status).toBe(200)
    expect(res.text).toEqual('Hello World')
  })
})
