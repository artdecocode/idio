const { resolve } = require('path')
const { read } = require('wrote')
const { startApp } = require('../..')

/**
 * A context which can start a server by passing it a config. The server will
 * be destroyed at the end of the test.
 */
async function Context() {
  let app
  this.routesDir = resolve(__dirname, '../fixtures/routes')
  this.routesDirModules = resolve(__dirname, '../fixtures/routes-modules')
  this.routesDirWithFiles = resolve(__dirname, '../fixtures/routes-with-files')

  /**
   * Start a server
   * @param {Config} config
   */
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
  this.readSnapshot = async (path) => {
    const snapshot = await read(resolve(__dirname, '../snapshots', path))
    return snapshot.trim()
  }
  this._destroy = async () => {
    if (app) await app.destroy()
  }
}

module.exports = Context
