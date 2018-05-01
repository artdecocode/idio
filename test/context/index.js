const { startApp } = require('../..')
const { resolve } = require('path')

async function Context() {
  let app
  this.routesDir = resolve(__dirname, '../fixtures/routes')
  this.routesDirModules = resolve(__dirname, '../fixtures/routes-modules')
  this.routesDirWithFiles = resolve(__dirname, '../fixtures/routes-with-files')

  this.start = async (config = {}) => {
    const { app: a, url, router } = await startApp({
      port: 0,
      ...config,
    })
    app = a
    return { url, router }
  }
  this._destroy = async () => {
    if (app) await app.destroy()
  }
}

module.exports = Context
