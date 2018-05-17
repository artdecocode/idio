import { deepEqual } from 'zoroaster/assert'
import snapshotContext, { SnapshotContext} from 'snapshot-context' // eslint-disable-line
import context, { Context } from '../../context' // eslint-disable-line no-unused-vars
import generator from '../../../src/generator'
import { initRoutes } from '../../../src'

/**
 * @type {Object.<string, (api: Context, sApi: SnapshotContext)>}
 */
const generatorTestSuite = {
  context: [ context, snapshotContext ],
  async 'generates a website'(api) {
    const { start } = api
    const t = 'abc'
    const { url } = await start({
      middleware: {
        'a page': {
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
    const pages = {'/test': [], '/test2': []}
    const sitemap = await generator(url, pages)
    // const expected = Object.keys(pages).reduce((acc, key) => {
    //   const value = pages[key]
    //   return {
    //     ...acc,
    //     [p]: `${t} :: ${p}`,
    //   }
    // }, {})
    const expected = {
      '/test': `${t} :: /test`,
      '/test2': `${t} :: /test2`,
    }
    // deepEqual(expected, expectedByHand)
    deepEqual(sitemap, expected)
  },
  /**
   * @param {Context} api
   * @param {SnapshotContext} snapshot
   */
  async 'generates a JSX website'(api, snapshot) {
    const { start, routesJsx, snapshotDir } = api
    const { test, setDir } = snapshot
    setDir(snapshotDir)
    const { app, url, router } = await start({
      middleware: {
        koa2Jsx: {
          wireframe: true,
          use: true,
          config: {

          },
        },
      },
    })
    const map = await initRoutes(routesJsx, router, {
      defaultImports: true,
    })
    app.use(router.routes())
    const { get } = map
    const actual = await generator(url, get)
    await test('generator/full.json', actual)
  },
}

export default generatorTestSuite
