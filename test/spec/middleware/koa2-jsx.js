import rqt from 'rqt'
import snapshotContext, { SnapshotContext} from 'snapshot-context' // eslint-disable-line
import context, { Context } from '../../context' // eslint-disable-line no-unused-vars

const page = {
  function: (app, { Content }) => {
    return async (ctx, next) => {
      ctx.setTitle('Idio tests | Main Page')
      ctx.Content = Content
      await next()
    }
  },
  config: { Content: <div><h1>hello world</h1></div> },
  use: true,
}

/** @type {Object.<string, (api: Context, sApi: SnapshotContext)>} */
const generatorTestSuite = {
  context: [
    context,
    snapshotContext,
  ],
  async 'serves static pretty html'({ start, snapshotDir }, { setDir, test }) {
    setDir(snapshotDir)
    const { url } = await start({
      middleware: {
        koa2Jsx: { use: true, pretty: true, wireframe: true },
        page,
      },
    })
    const actual = await rqt(url)
    await test('koa2Jsx/static-pretty.html', actual)
  },
  async 'serves pretty html'({ start, snapshotDir }, { setDir, test }) {
    setDir(snapshotDir)
    const { url } = await start({
      middleware: {
        koa2Jsx: { use: true, pretty: true, static: false, wireframe: true },
        page,
      },
    })
    const actual = await rqt(url)
    await test('koa2Jsx/pretty.html', actual)
  },
  async 'serves static node stream'({ start, snapshotDir }, { setDir, test }) {
    setDir(snapshotDir)
    const { url } = await start({
      middleware: {
        koa2Jsx: { use: true, wireframe: true },
        page,
      },
    })
    const actual = await rqt(url)
    await test('koa2Jsx/static.html', actual)
  },
  async 'serves node stream'({ start, snapshotDir }, { setDir, test }) {
    setDir(snapshotDir)
    const { url } = await start({
      middleware: {
        koa2Jsx: { use: true, static: false, wireframe: true },
        page,
      },
    })
    const actual = await rqt(url)
    await test('koa2Jsx/node.html', actual)
  },
}

export default generatorTestSuite
