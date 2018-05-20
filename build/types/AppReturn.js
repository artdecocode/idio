"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _koaRouter = _interopRequireDefault(require("koa-router"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
const AppReturn = {};
var _default = AppReturn;
exports.default = _default;
//# sourceMappingURL=AppReturn.js.map