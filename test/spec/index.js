const context = require('../context')

const idioTestSuite = {
  context,
  // async 'should start a server'() {
  //   const server = await startApp({
  //     port: 0,
  //   })
  //   const { app, url, router } = server
  //   const body = 'hello world'
  //   router.get('/', async (ctx) => {
  //     ctx.body = body
  //   })
  //   app.use(router.routes())
  //   const res = await rqt(url)
  //   equal(res, body)

  //   await app.destroy()
  // },
}

module.exports = idioTestSuite
