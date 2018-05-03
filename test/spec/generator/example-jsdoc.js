// @babel/register@7.0.0-beta.46
// @babel/core@7.0.0-beta.46
// @babel/plugin-transform-modules-commonjs@7.0.0-beta.46

// eslint-disable-next-line no-unused-vars
const { ContextAPI } = require('../../../src/types')

/**
 * @typedef {function} TestCase A test case
 * @param {ContextAPI} api An array of strings as arguments
 */

/**
 * @type {TestCase}
 */
async function test(api) {
  await api.start() // works here
}

const testSuite = { // eslint-disable-line
  test,
  /**
   * @type {TestCase}
   */
  async test2(api) {
    await api.start() // doesn't work here
  },
}
