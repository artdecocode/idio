const { resolve } = require('path')
const { read } = require('wrote')
const { startApp } = require('../..')

async function Context() {
  let a
  this.routesDir = resolve(__dirname, '../fixtures/routes')
  this.routesDirModules = resolve(__dirname, '../fixtures/routes-modules')
  this.routesDirWithFiles = resolve(__dirname, '../fixtures/routes-with-files')

  this.start = async (config = {}) => {
    const { app , url, router } = await startApp({
      port: 0,
      ...config,
    })
    a = app
    return { app, url, router }
  }
  this.readFixture = async () => {
    const dracula = await read(resolve(__dirname, '../fixtures/chapter1.txt'))
    return dracula
  }
  this._destroy = async () => {
    if (a) await a.destroy()
  }
}

module.exports = Context
