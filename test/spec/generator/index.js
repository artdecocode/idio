const { TestSuite, ContextAPI } = require('../../context/types') // eslint-disable-line
const context = require('../../context')

/**
 * @type {TestSuite}
 */
const generatorTestSuite = {
  context,
  /**
   * @param {ContextAPI} api
   */
  async 'should generate website'(api) {
    const { start } = api
    await start({
      host: '0.0.0.0',
      middleware: {

      },
    })
    await api.readFixture('a fixture')
  },
}

module.exports = generatorTestSuite
