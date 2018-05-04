import Router from 'koa-router'

/**
 * @typedef {Object} App
 * @property {function} destroy Kill the server and disconnect from the database
 */

/**
 * @typedef {Object} AppReturn
 * @property {App} app
 * @property {string} url
 * @property {object} middleware
 * @property {Router} router
 * @property {function} [connect]
 */

/**
 * @type {AppReturn}
 */
const AppReturn = {}

export default AppReturn

