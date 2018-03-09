const assert = require('assert')
const http = require('http')
const idio = require('../../')

const idioTestSuite = {
  'should start a server': async () => {
    const res = await idio({
      port: 0,
    })
    const { app, url, router } = res
    router.get('/', async (ctx, next) => {
      ctx.body = 'hello world'
    })
    app.use(router.routes())
    const testRes = await new Promise((resolve, reject) => {
      http.get(`${url}`, resolve).on('error', reject)
    })
    const { statusCode } = testRes
    assert.equal(statusCode, 200)

    await res.app.destroy()
  },
}

module.exports = idioTestSuite
