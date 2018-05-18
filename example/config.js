import { resolve } from 'path'

const uploadDir = resolve(__dirname, 'upload')

const sessionKey = 'secret-key'
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/idio'
const PORT = process.env.PORT || 5000

const T = {
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

export default T
