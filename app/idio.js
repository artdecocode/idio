import { resolve } from 'path'
import { startApp, initRoutes } from '../src'

const uploadDir = resolve(__dirname, 'upload')
const routesDir = resolve(__dirname, 'routes')

const sessionKey = process.env.SECRET_KEY || 'secret-key'
const DATABASE_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/idio'
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    const res = await startApp({
      autoConnect: false,
      databaseURL: DATABASE_URL,
      port: PORT,
      middleware: {
        session: { keys: [sessionKey], config: { httpOnly: false } },
        multer: { config: { dest: uploadDir } }, // will create uploadDir
        compress: { use: true, threshold: 2048 },
        csrf: { config: { invalidTokenStatusCode: 403 } },
        bodyparser: { config: { enableTypes: ['json'] } },
        checkauth: {},
        logger: { use: true }, // will always use this middleware
        koa2Jsx: { wireframe: true, use: true },
        // ----
        custom: {
          function: (app, config) => async (ctx, next) => {
            await next()
            console.log(`${config.text}: ${ctx.request.ip}`)
          }, config: { text: 'ip' }, use: true,
        },
        customMiddleware: {
          function: async (app, config) => {
            app.context.usingFunction = true

            return async (ctx, next) => {
              await next()
              if (config.debug) {
                console.error(ctx.app.context.usingFunction)
              }
            }
          },
          config: { debug: process.env.NODE_DEBUG == 'idio' },
          use: false,
        },
      },
    })

    const { url, app, router, middleware: { session } } = res

    await initRoutes(routesDir, router, {
      defaultImports: true,
      aliases: {
        get: {
          '/index': ['/'],
        },
      },
      middleware: {
        get: (route) => [session, route],
      },
      watch: true,
    })

    console.log(url)

    const routes = router.routes()
    app.use(routes)
  } catch ({ message, stack }) {
    if (process.env.DEBUG) {
      console.log(stack)
    } else {
      console.log(message)
    }
    process.exit(1)
  }
})()