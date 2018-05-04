import Koa from 'koa'
import setupMiddleware from './setup-middleware'

export default async function createApp(config, database) {
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
