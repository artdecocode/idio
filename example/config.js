import { resolve, dirname } from 'path'

const uploadDir = resolve(__dirname, 'upload')
const routesDir = resolve(__dirname, 'routes')

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/idio'
const PORT = process.env.PORT || 5000

const react = resolve(dirname(require.resolve('react')), 'umd')
const STATIC = resolve(__dirname, 'static')

export default {
  databaseURL: DATABASE_URL,
  port: PORT,
  middleware: {
    session: { keys: ['secret-key'] },
    multer: { config: { dest: uploadDir } },
    csrf: { },
    bodyparser: { },
    checkauth: { },
    logger: { use: true },
    static: {
      use: true,
      root: [STATIC, react],
      mount: '/scripts',
      maxage: process.env.NODE_ENV == 'production' ?  1000 * 60 * 60 * 24 * 10 : 0,
    },
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
