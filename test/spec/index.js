const { equal } = require('zoroaster/assert')
const context = require('../context')

const idioTestSuite = {
  context,
  async 'starts without a database connection'({ start }) {
    const { connect } = await start({
      databaseURL: 'mongodb://localhost:27018',
      autoConnect: false,
    })
    equal(typeof connect, 'function')
  },
  async 'connects to a database'({ start }) {
    const { connect } = await start()
    equal(connect, undefined)
  },
}

module.exports = idioTestSuite
