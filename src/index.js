import startApp from './lib/start-app'
import { initRoutes2 } from './lib/routes'
import Config from './types/Config' // eslint-disable-line
import RoutesConfig from './types/RoutesConfig' // eslint-disable-line

export { default as startApp } from './lib/start-app'
export { initRoutes } from './lib/routes'

/**
 * Start the server.
 * @param {Config} config A configuration object.
 * @param {RoutesConfig} routesConfig A configuration object for the router.
 */
export default async function (config, routesConfig) {
  const res = await startApp(config)
  const { url, app, router, middleware } = res

  await initRoutes2(routesConfig, middleware, router)
  const routes = router.routes()
  app.use(routes)

  return { url }
}
