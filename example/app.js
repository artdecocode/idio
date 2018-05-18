import { resolve } from 'path'
import { startApp, initRoutes } from 'idio'

const uploadDir = resolve(__dirname, 'upload')
const routesDir = resolve(__dirname, 'routes')

const sessionKey = 'secret-key'
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/idio'
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    const res = await startApp({
      databaseURL: DATABASE_URL,
      port: PORT,
      middleware: {
        session: { keys: [sessionKey] },
        multer: { config: { dest: uploadDir } },
        csrf: { },
        bodyparser: { },
        checkauth: { },
        logger: { use: true },
        koa2Jsx: { use: true, wireframe: true /*, bootstrap: true */  },
      },
    })
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
      watch: true,
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
