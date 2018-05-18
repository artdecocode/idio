import { resolve } from 'path'
import { startApp, initRoutes } from 'idio'
import config from './config'

const routesDir = resolve(__dirname, 'routes')

;(async () => {
  try {
    const res = await startApp(config)
    const { url, app, router, middleware: { session, bodyparser } } = res

    await initRoutes(routesDir, router, {
      defaultImports: true,
      filter(file) { return /\.js/.test(file) },
      aliases: {
        get: {
          '/index': ['/'],
        },
      },
      middleware: {
        get(route) {
          return [
            session,
            route,
          ]
        },
        post(route) {
          return [
            bodyparser,
            route,
          ]
        },
      },
    })
    const routes = router.routes()
    app.use(routes)

    console.log(url)
  } catch ({ message, stack }) {
    if (process.env.DEBUG) {
      console.log(stack)
    } else {
      console.log(message)
    }
    process.exit(1)
  }
})()
