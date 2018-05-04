import rqt from 'rqt'
import context, { Context } from '../../context' // eslint-disable-line no-unused-vars
import snapshotContext, { SnapshotContext} from 'snapshot-context' // eslint-disable-line

/** @type {Object.<string, (api: Context, sApi: SnapshotContext)>} */
const generatorTestSuite = {
  context: [
    context,
    snapshotContext,
  ],
  async 'serves pretty html with wireframe'(api, snapshot) {
    const { start, snapshotDir } = api
    const { test, setDir } = snapshot
    setDir(snapshotDir)
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
    await test('koa2Jsx/pretty-wireframe.html', actual)
  },
}

module.exports = generatorTestSuite

