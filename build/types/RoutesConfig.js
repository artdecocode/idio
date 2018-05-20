"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * @typedef {Object.<string, (route: function) => (string|function)[]>} MiddlewareMap
 */

/**
 * @typedef {Object.<string, string[]>} AliasMap
 */

/**
 * @typedef {Object} RoutesConfig
 * @property {string} dir Path to the directory with routes.
 * @property {MiddlewareMap} middleware A middleware configuration for methods.
 * @property {function} [filter] Optional filter for filenames. Defaults to importing JS and JSX.
 * @property {boolean} [defaultImports=true] Whether the routes are exported with `export` keyword. Defaults to true.
 * @property {AliasMap} [aliases] a map of aliases
 */

/**
 * @type {RoutesConfig}
 */
const RoutesConfig = {};
var _default = RoutesConfig;
exports.default = _default;
//# sourceMappingURL=RoutesConfig.js.map