/**
 * @typedef {Object} App
 * @property {function} destroy Kill the server and disconnect from the database
 */

/**
 * @typedef {Object} AppReturn
 * @property {App} app
 * @property {string} url
 * @property {function} connect
 * @property {object} middleware
 */

/**
 * @type {AppReturn}
 */
const AppReturn = {}

module.exports = AppReturn
