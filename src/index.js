import startApp from './lib/start-app'
import { initRoutes2 } from './lib/routes'
import Config from './types/Config' // eslint-disable-line
import RoutesConfig from './types/RoutesConfig' // eslint-disable-line

export { default as startApp } from './lib/start-app'
export { initRoutes } from './lib/routes'

/**
 * Start the server.
 * @param {Config} config A configuration object.
 * @param {RoutesConfig} [routesConfig] A configuration object for the router.
 */
export default async function (config, routesConfig) {
  const res = await startApp(config)
  const { url, app, router, middleware, connect } = res

  if (routesConfig) {
    await initRoutes2(routesConfig, middleware, router)
    const routes = router.routes()
    app.use(routes)
  }

  return { url, app, connect }
}

/**
 * @typedef {Object.<string, (route: function) => (string|function)[]>} MiddlewareMap
 *
 * @typedef {Object.<string, string[]>} AliasMap
 *
 * @typedef {Object} RoutesConfig
 * @property {string} dir Path to the directory with routes.
 * @property {MiddlewareMap} middleware A middleware configuration for methods.
 * @property {function} [filter] Optional filter for filenames. Defaults to importing JS and JSX.
 * @property {boolean} [defaultImports=true] Whether the routes are exported with `export` keyword. Defaults to true.
 * @property {AliasMap} [aliases] a map of aliases
 */


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
 * @typedef {Object} Config
 * @property {string} [databaseURL='mongodb://localhost:27017']
 * @property {number} [port=5000]
 * @property {number} [host=0.0.0.0]
 * @property {MiddlewareConfig} [middleware]
 * @property {boolean} [autoConnect=true] Whether to automatically connect to the database.
 */
