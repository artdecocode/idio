const rqt = require('rqt')
const { Context } = require('../../context/types') // eslint-disable-line
const context = require('../../context')
const { snapshotContext, SnapshotContext } = require('../../context/snapshot') // eslint-disable-line

const generatorTestSuite = {
  context: [
    context,
    snapshotContext,
  ],
  /**
   * @param {Context} api
   * @param {SnapshotContext} snapshot
   */
  async 'serves pretty html with wireframe'(api, snapshot) {
    const { start } = api
    const { testSnapshot } = snapshot
    const t = 'hello world'
    const { url } = await start({
      middleware: {
        koa2Jsx: { use: true, config: { pretty: true }, wireframe: true },
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
    await testSnapshot('koa2Jsx/pretty-wireframe.html', actual)
  },
}

module.exports = generatorTestSuite

