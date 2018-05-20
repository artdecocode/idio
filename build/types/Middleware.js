"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * @typedef {Object} Koa2JsxConfig
 * @property {function} View A Redux connected container
 * @property {function} [reducer] A root reducer to create the store
 * @property {Object} [actions] A map of action creators
 * @property {function} [render] An optional render function. Stream rendering
 * is used by default.

 * @typedef {Object} Koa2JSX
 * @property {boolean} use Use middleware on every page (calls app.use())
 * @property {Koa2JsxConfig} [config] Middleware configuration
 * @property {boolean} wireframe Whether to set up a wireframe website.
 * @property {boolean} bootstrap Whether to add Bootstrap 4.

 * @typedef ISignature
 * @property {boolean} use
 * @property {Object} config
 * @property {Object} [rest]

 * @typedef {Object} MiddlewareConfig
 * @property {ISignature} [session]
 * @property {ISignature} [multer]
 * @property {ISignature} [csrf]
 * @property {ISignature} [compress]
 * @property {ISignature} [bodyparser]
 * @property {ISignature} [checkauth]
 * @property {ISignature} [logger]
 * @property {Koa2JSX} [koa2Jsx]
 */

/**
 * @type {MiddlewareConfig}
 */
const m = {};
var _default = m;
exports.default = _default;
//# sourceMappingURL=Middleware.js.map