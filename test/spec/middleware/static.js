import { equal } from 'assert'
import rqt from 'rqt'
import snapshotContext, { SnapshotContext} from 'snapshot-context' // eslint-disable-line
import context, { Context } from '../../context' // eslint-disable-line no-unused-vars

/** @type {Object.<string, (api: Context)>} */
const T = {
  context,
  async 'serves static files'({ start, staticDir, readStaticFixture }) {
    const body = await readStaticFixture()
    const { url } = await start({
      middleware: {
        compress: { use: true },
        static: {
          use: true,
          root: staticDir,
        },
      },
    })
    const fullUrl = `${url}/chapter2.txt`
    const res = await rqt(fullUrl)
    equal(res, body)
  },
  async 'serves static files from specified mount point'({ start, staticDir, readStaticFixture }) {
    const body = await readStaticFixture()
    const { url } = await start({
      middleware: {
        compress: { use: true },
        static: {
          use: true,
          root: staticDir,
          mount: '/test',
        },
      },
    })
    const fullUrl = `${url}/test/chapter2.txt`
    const res = await rqt(fullUrl)
    equal(res, body)
  },
  async 'serves static files from multiple roots'({
    start, staticDir, staticDir2, readStaticFixture, readStaticFixture2,
  }) {
    const body = await readStaticFixture()
    const body2 = await readStaticFixture2()
    const { url } = await start({
      middleware: {
        compress: { use: true },
        static: {
          use: true,
          root: [staticDir, staticDir2],
        },
      },
    })
    const fullUrl = `${url}/chapter2.txt`
    const res = await rqt(fullUrl)
    equal(res, body)
    const fullUrl2 = `${url}/chapter3.txt`
    const res2 = await rqt(fullUrl2)
    equal(res2, body2)
  },
  async 'serves static files from multiple roots from mount'({
    start, staticDir, staticDir2, readStaticFixture, readStaticFixture2,
  }) {
    const body = await readStaticFixture()
    const body2 = await readStaticFixture2()
    const { url } = await start({
      middleware: {
        compress: { use: true },
        static: {
          use: true,
          root: [staticDir, staticDir2],
          mount: '/test',
        },
      },
    })
    const fullUrl = `${url}/test/chapter2.txt`
    const res = await rqt(fullUrl)
    equal(res, body)
    const fullUrl2 = `${url}/test/chapter3.txt`
    const res2 = await rqt(fullUrl2)
    equal(res2, body2)
  },
}

export default T
