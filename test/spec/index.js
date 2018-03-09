const { equal } = require('zoroaster/assert')
const rqt = require('rqt')
const bodyparser = require('koa-bodyparser')
const context = require('../context')
const { startApp, initRoutes } = require('../..')

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
  async 'should use routes'({ routesDir }) {
    const body = bodyparser()
    let getMiddlewareCalls = 0
    const server = await startApp({
      port: 0,
    })
    const { app, url, router } = server

    await initRoutes(routesDir, router, {
      aliases: {
        get: {
          '/test': ['/alias'],
        },
        post: {
          '/test': ['/alias'],
        },
      },
      middleware: {
        get(route) {
          return [
            async (ctx, next) => {
              getMiddlewareCalls += 1
              await next()
            },
            route,
          ]
        },
        post(route) {
          return [body, route]
        },
      },
    })
    app.use(router.routes())

    const get = await rqt(`${url}/test`)
    equal(get, 'test dynamic route')
    equal(getMiddlewareCalls, 1)

    const getAlias = await rqt(`${url}/alias`)
    equal(getAlias, 'test dynamic route')
    equal(getMiddlewareCalls, 2)

    const message = 'hello world'

    const post = await rqt(`${url}/test`, {
      data: JSON.stringify({ message }),
      contentType: 'application/json',
    })
    equal(post, `test default post request: ${message}`)

    const postAlias = await rqt(`${url}/alias`, {
      data: JSON.stringify({ message }),
      contentType: 'application/json',
    })
    equal(postAlias, `test default post request: ${message}`)

    await app.destroy()
  },
  async 'should use routes (modules)'({ routesDirModules }) {
    const body = bodyparser()
    let getMiddlewareCalls = 0
    const server = await startApp({
      port: 0,
    })
    const { app, url, router } = server

    await initRoutes(routesDirModules, router, {
      defaultImports: true,
      aliases: {
        get: {
          '/test': ['/alias'],
        },
        post: {
          '/test': ['/alias'],
        },
      },
      middleware: {
        get(route) {
          return [
            async (ctx, next) => {
              getMiddlewareCalls += 1
              await next()
            },
            route,
          ]
        },
        post(route) {
          return [body, route]
        },
      },
    })
    app.use(router.routes())

    const get = await rqt(`${url}/test`)
    equal(get, 'test dynamic route')
    equal(getMiddlewareCalls, 1)

    const getAlias = await rqt(`${url}/alias`)
    equal(getAlias, 'test dynamic route')
    equal(getMiddlewareCalls, 2)

    const message = 'hello world'

    const post = await rqt(`${url}/test`, {
      data: JSON.stringify({ message }),
      contentType: 'application/json',
    })
    equal(post, `test default post request: ${message}`)

    const postAlias = await rqt(`${url}/alias`, {
      data: JSON.stringify({ message }),
      contentType: 'application/json',
    })
    equal(postAlias, `test default post request: ${message}`)

    await app.destroy()
  },
}

module.exports = idioTestSuite
