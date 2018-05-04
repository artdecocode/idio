import rqt from 'rqt'
import { equal } from 'zoroaster/assert'
import context, { Context } from '../context' // eslint-disable-line no-unused-vars

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
  /**
   * @param {ContextAPI} api
   */
  async 'sets up middleware correctly'(api) {
    const { start } = api
    let called
    const f = Math.random() * 1000
    const m = 100
    const { url } = await start({
      host: '0.0.0.0',
      middleware: {
        simpleRoute: {
          async function(app, { multiplier }) {
            return (ctx) => {
              called = true
              ctx.body = f * multiplier
            }
          },
          config: { multiplier: m },
          use: true,
        },
      },
    })
    const res = await rqt(url)
    equal(called, true)
    equal(res, f * m)
  },
}

module.exports = idioTestSuite
