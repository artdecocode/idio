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
 * @property {boolean} wireframe Whether to set up a wireframe website. Default false.
 * @property {boolean} [static=true] Whether to render static node stream (without hydration data). Default true. Set to false for universal applications.
 * @property {boolean} [pretty=false] Pretty print HTML. Response will be served as a string and not a stream. Default false.
 * @property {boolean} [bootstrap=false] Add Bootstrap 4 to the wireframe. Default false.

 * @typedef ISignature
 * @property {boolean} use
 * @property {Object} config
 * @property {Object} [rest]

 * @typedef {Object} Static
 * @property {boolean} [use=false] Use this middleware for every request.
 * @property {string|string[]} root Root or multiple roots from which to serve files.
 * @property {string} [mount] Path from which to serve files. Defaults to `/`.
 * @property {number} [maxage=0] How long to cache file for. Defaults to no caching.
 * @property {object} [config] koa-static configuration.

 * @typedef {Object} MiddlewareConfig
 * @property {ISignature} [session]
 * @property {ISignature} [multer]
 * @property {ISignature} [csrf]
 * @property {ISignature} [compress]
 * @property {ISignature} [bodyparser]
 * @property {ISignature} [checkauth]
 * @property {ISignature} [logger]
 * @property {Static} [static]
 * @property {Koa2JSX} [koa2Jsx]
 */

/**
 * @type {MiddlewareConfig}
 */
const m = {};
var _default = m;
exports.default = _default;
//# sourceMappingURL=Middleware.js.map