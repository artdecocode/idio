const { equal } = require('zoroaster/assert')
const rqt = require('rqt')
const { ContextAPI } = require('../../context/types') // eslint-disable-line
const context = require('../../context')

const generatorTestSuite = {
  context,
  /**
   * @param {ContextAPI} api
   */
  async 'generates a website'() {

  },
}

module.exports = generatorTestSuite
