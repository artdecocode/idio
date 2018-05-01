const { initRoutes } = require('../..')
const context = require('../context')

const initRoutesTestSuite = {
  context,
  async 'should not throw when files are found'({ start, routesDirWithFiles }) {
    const { router } = await start()
    await initRoutes(routesDirWithFiles, router)
  },
}

module.exports = initRoutesTestSuite
