const { resolve } = require('path')
const { startApp, initRoutes } = require('.')

const uploadDir = resolve(__dirname, './app/upload')
const routesDir = resolve(__dirname, './app/routes')

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
      defaultImports: false, // set to true if routes are written w/ "export default"
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
  } catch (err) {
    console.log(err)
  }
})()
