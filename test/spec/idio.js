import { ok } from 'zoroaster/assert'
import rqt from 'rqt'
import snapshotContext, { SnapshotContext } from 'snapshot-context' // eslint-disable-line no-unused-vars
import idio from '../../src'
import context, { Context } from '../context' // eslint-disable-line no-unused-vars

let app
/** @type {Object.<string, (ctx: Context, sctx: SnapshotContext)>} */
const t = {
  context:[
    context,
    snapshotContext,
    function() { // after each
      this._destroy = () => {
        if (app) {
          app.destroy()
          app = null
        }
      }
    },
  ],
  async 'starts the server'({ routesJsx, snapshotDir }, { setDir, test }) {
    setDir(snapshotDir)
    const { url, methods, router, app: a } = await idio({
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
    app = a
    const res = await rqt(url)
    ok(/MAIN PAGE/.test(res))
    ok(methods)
    ok(router)
    await test('main-page.html', res)
  },
}

export default t
