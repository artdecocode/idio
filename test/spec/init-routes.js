const { equal } = require('zoroaster/assert')
const rqt = require('rqt')
const bodyparser = require('koa-bodyparser')
const { initRoutes } = require('../..')
import context, { Context } from '../context' // eslint-disable-line no-unused-vars

const initRoutesTestSuite = {
  context,
  async 'should not throw when files are found'({ start, routesDirWithFiles }) {
    const { router } = await start()
    await initRoutes(routesDirWithFiles, router)
  },
  async 'should use routes'({ start, routesDir }) {
    const body = bodyparser()
    let getMiddlewareCalls = 0
    const { app, url, router } = await start()

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
    })
    equal(post, `test default post request: ${message}`)

    const postAlias = await rqt(`${url}/alias`, {
      data: JSON.stringify({ message }),
    })
    equal(postAlias, `test default post request: ${message}`)
  },
  async 'should use routes (modules)'({ start, routesDirModules }) {
    const body = bodyparser()
    let getMiddlewareCalls = 0
    const { app, url, router } = await start()

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
    })
    equal(post, `test default post request: ${message}`)

    const postAlias = await rqt(`${url}/alias`, {
      data: JSON.stringify({ message }),
    })
    equal(postAlias, `test default post request: ${message}`)
  },
}

module.exports = initRoutesTestSuite
