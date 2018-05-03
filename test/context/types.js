const { AppReturn, Config } = require('../../src/types') // eslint-disable-line

/**
 * @typedef {Object} ContextAPI
 * @property {function(Config):Promise<AppReturn>} start Call startApp method from
 * the source code. The config argument will be passed as is and it's `port`
 * value will override default `0` (to start on random port) if present. To
 * access the server, `url` property can be used. The context will destroy
 * the server at the end of each test.
 * @property {function():Promise<string>} readFixture Reads a fixture
 * (chapter 1 of Dracula) and returns as a string
 */


/**
 * @typedef {Object} TestSuite A test Suite
 * @property {function} context A context constructor
 * @property {function(ContextAPI)} [any] a test case
 */

module.exports = {
  /**
   * @type {ContextAPI}
   */
  ContextAPI: {}, // eslint-disable-line
  /**
   * @type {TestSuite} A Test Suite Context
   */
  TestSuite: {}, // eslint-disable-line
}
