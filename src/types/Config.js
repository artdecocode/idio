/**
 * @typedef {Object} Middleware
 * @property {*} session
 * @property {*} multer
 * @property {*} csrf
 * @property {*} compress
 * @property {*} bodyparser
 * @property {*} checkauth
 * @property {*} logger
 * @property {*} koa2Jsx
 */

/**
 * @typedef {Object} Config
 * @property {string} [databaseURL='mongodb://localhost:27017']
 * @property {number} [port=5000]
 * @property {number} [host=0.0.0.0]
 * @property {Middleware} [middleware]
 */



/**
 * @type {Config}
 */
const Config = {}

module.exports = Config
