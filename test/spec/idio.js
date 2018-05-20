import { ok } from 'zoroaster/assert'
import rqt from 'rqt'
import idio from '../../src'
import context, { Context } from '../context' // eslint-disable-line no-unused-vars

/** @type {Object.<string, (ctx: Context)>} */
const t = {
  context,
  async 'starts the server'({ routesJsx }) {
    const { url, app, methods, router } = await idio({
      port: 0,
      autoConnect: false,
      middleware: {
        koa2Jsx: {
          wireframe: true,
          use: true,
        },
      },
    }, {
      dir: routesJsx,
      aliases: {
        get: {
          '/index': ['/'],
        },
      },
    })
    const res = await rqt(url)
    console.log(res)
    ok(/MAIN PAGE/.test(res))
    ok(methods)
    ok(router)
    app.destroy()
  },
}

export default t
