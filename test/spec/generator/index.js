const { deepEqual } = require('zoroaster/assert')
const { Context } = require('../../context/types') // eslint-disable-line
const context = require('../../context')
const generator = require('../../../src/generator')

const generatorTestSuite = {
  context,
  /**
   * @param {Context} api
   */
  async 'generates a website'(api) {
    const t = 'abc'
    const { url } = await api.start({
      middleware: {
        'a page': {
          /**
           * @returns {Koa.Middleware}
           */
          async function(app, { t }) {
            return async (ctx) => {
              ctx.type = 'text/plain'
              ctx.body = `${t} :: ${ctx.req.url}`
            }
          },
          config: { t },
          use: true,
        },
      },
    })
    const sitemap = await generator(url, ['test', 'test2'])
    deepEqual(sitemap, {
      test: `${t} :: /test`,
      test2: `${t} :: /test`,
    })
  },
}

module.exports = generatorTestSuite
