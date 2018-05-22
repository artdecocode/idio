import { equal } from 'zoroaster/assert'
import rqt from 'rqt'
import { gunzipSync } from 'zlib'
import context, { Context } from '../../context' // eslint-disable-line no-unused-vars

function assignRoute(app, url, router, path, body) {
  router.get('test', path, async (ctx) => {
    ctx.body = body
  })
  app.use(router.routes())
  return `${url}${path}`
}

/** @type {Object.<string, (api: Context)>} */
const T = {
  context,
  async 'uses compression'({ start, readFixture }) {
    const body = await readFixture()
    const { app, url, router } = await start({
      middleware: {
        compress: { use: true },
      },
    })
    const fullUrl = assignRoute(app, url, router, '/dracula.txt', body)
    const res = await rqt(fullUrl, {
      headers: {
        'Accept-Encoding': 'gzip, deflate, br',
      },
      binary: true,
    })
    const actual = gunzipSync(res).toString()
    equal(actual, body)
  },
  async 'passes threshold to the constructor'({ start, readFixture }) {
    const body = await readFixture()
    const { app, url, router } = await start({
      middleware: {
        compress: { use: true, config: { threshold: body.length + 1 } },
      },
    })
    const fullUrl = assignRoute(app, url, router, '/dracula.txt', body)
    const actual = await rqt(fullUrl, {
      headers: {
        'Accept-Encoding': 'gzip, deflate, br',
      },
    })
    equal(actual, body)
  },
}

export default T
