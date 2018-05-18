import { resolve } from 'path'

const uploadDir = resolve(__dirname, 'upload')
const routesDir = resolve(__dirname, 'routes')

const sessionKey = 'secret-key'
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/idio'
const PORT = process.env.PORT || 5000

export default {
  databaseURL: DATABASE_URL,
  port: PORT,
  middleware: {
    session: { keys: [sessionKey] },
    multer: { config: { dest: uploadDir } },
    csrf: { },
    bodyparser: { },
    checkauth: { },
    logger: { use: true },
    koa2Jsx: { use: true, wireframe: true /*, bootstrap: true */ },
    // ----
    custom: {
      function(app, config) {
        return async (ctx, next) => {
          await next()
          console.log(`${config.text}: ${ctx.request.ip}`)
        }
      },
      config: { text: 'ip' },
      use: true,
    },
    customMiddleware: {
      async function(app, config) {
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
}

export const routesConfig = {
  dir: routesDir,
  defaultImports: true,
  aliases: {
    get: {
      '/index': ['/'],
    },
  },
  middleware: {
    get: route => ['session', route],
    post: route => ['bodyparser', route],
  },
}
