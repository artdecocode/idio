const MiddlewareConfig = require('./Middleware')

/**
 * @typedef {Object} Config
 * @property {string} [databaseURL='mongodb://localhost:27017']
 * @property {number} [port=5000]
 * @property {number} [host=0.0.0.0]
 * @property {MiddlewareConfig} [middleware]
 */



/**
 * @type {Config}
 */
const Config = {}

module.exports = Config
