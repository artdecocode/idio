const Koa = require('koa')

const setupMiddleware = require('./setup-middleware')

async function createApp(config, database) {
  const app = new Koa()

  app.context.database = database
  app.context.config = config

  const middleware = await setupMiddleware(config.middleware, app)

  if (app.env == 'production') {
    app.proxy = true
  }

  return {
    app,
    middleware,
  }
}

module.exports = createApp
