const { equal } = require('zoroaster/assert')
const { resolve } = require('path')
const { read } = require('wrote')
const rqt = require('rqt')
const { gunzipSync } = require('zlib')
const { startApp } = require('../../..')

async function context() {
  let app, url, router
  const dracula = await read(resolve(__dirname, '../../fixtures/chapter1.txt'))
  const path = '/dracula.txt'

  this.start = async (use, config) => {
    ({ app, url, router } = await startApp({
      port: 0,
      middleware: {
        compress: { use, config },
      },
    }))
    router.get('test', path, async (ctx) => {
      ctx.body = dracula
    })
    app.use(router.routes())
    return { url: `${url}${path}` }
  }
  this.body = dracula

  this._destroy = async () => {
    if (!app) return
    await app.destroy()
  }
}

const compressTestSuite = {
  context,
  async 'should use compression'({ start, body }) {
    const { url } = await start(true)
    const res = await rqt(url, {
      headers: {
        'Accept-Encoding': 'gzip, deflate, br',
      },
      binary: true,
    })
    const actual = gunzipSync(res).toString()
    equal(actual, body)
  },
  async 'should pass threshold to the constructor'({ start, body }) {
    const { url } = await start(true, {
      threshold: body.length + 1,
    })
    const actual = await rqt(url, {
      headers: {
        'Accept-Encoding': 'gzip, deflate, br',
      },
    })
    equal(actual, body)
  },
}

module.exports = compressTestSuite
