const { equal } = require('zoroaster/assert')
const rqt = require('rqt')
const { ContextAPI } = require('../../context/types') // eslint-disable-line
const context = require('../../context')

const generatorTestSuite = {
  context,
  /**
   * @param {ContextAPI} api
   */
  async 'generates website'(api) {
    const { start, readSnapshot } = api
    const t = 'hello world'
    const { url } = await start({
      middleware: {
        koa2Jsx: { use: true, config: { pretty: true }, wireframe: true, bootstrap: true },
        page: {
          function: (app, { text }) => {
            return async (ctx, next) => {
              ctx.setTitle('Idio tests | main page')
              ctx.Content = text
              await next()
            }
          },
          config: { text: t },
          use: true,
        },
      },
    })
    const actual = await rqt(url)
    const expected = await readSnapshot('generator/page.html')
    equal(actual, expected)
  },
}

module.exports = generatorTestSuite
