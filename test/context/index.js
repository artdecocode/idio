const { resolve } = require('path')
const { read } = require('wrote')
const { startApp } = require('../..')

async function Context() {
  let app
  this.routesDir = resolve(__dirname, '../fixtures/routes')
  this.routesDirModules = resolve(__dirname, '../fixtures/routes-modules')
  this.routesDirWithFiles = resolve(__dirname, '../fixtures/routes-with-files')

  this.start = async (config = {}) => {
    const res = await startApp({
      port: 0,
      ...config,
    });
    ({ app } = res )
    return res
  }
  this.readFixture = async () => {
    const dracula = await read(resolve(__dirname, '../fixtures/chapter1.txt'))
    return dracula
  }
  this._destroy = async () => {
    if (app) await app.destroy()
  }
}

module.exports = Context
