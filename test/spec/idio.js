import { ok } from 'zoroaster/assert'
import rqt from 'rqt'
import idio from '../../src'
import context, { Context } from '../context' // eslint-disable-line no-unused-vars

/** @type {Object.<string, (ctx: Context)>} */
const t = {
  context,
  async 'starts the server'({ routesJsx }) {
    const { url, app, methods } = await idio({
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
    app.destroy()
  },
}

export default t
