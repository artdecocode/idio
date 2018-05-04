import { resolve } from 'path'
import { read } from 'wrote'
import { startApp } from '../..'
import { AppReturn, Config } from '../../src/types' // eslint-disable-line no-unused-vars

const SNAPSHOT_DIR = resolve(__dirname, '../snapshots')

/**
 * A context which can start a server by passing it a config. The server will
 * be destroyed at the end of the test.
 */
export default async function context() {
  let app
  this.routesDir = resolve(__dirname, '../fixtures/routes')
  this.routesJsx = resolve(__dirname, '../fixtures/routes-jsx')
  this.routesDirModules = resolve(__dirname, '../fixtures/routes-modules')
  this.routesDirWithFiles = resolve(__dirname, '../fixtures/routes-with-files')
  this.snapshotDir = SNAPSHOT_DIR

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
  this._destroy = async () => {
    if (app) await app.destroy()
  }
}


/**
 * @typedef {Object} Context
 * @property {(config: Config) => Promise<AppReturn>} start Call startApp method from
 * the source code. The config argument will be passed as is and it's `port`
 * value will override default `0` (to start on random port) if present. To
 * access the server, `url` property can be used. The context will destroy
 * the server at the end of each test.
 * @property {() => Promise<string>} readFixture Reads a fixture
 * (chapter 1 of Dracula) and returns as a string
 * @property {string} routesDir
 * @property {string} routesJsx
 * @property {string} routesDirModules
 * @property {string} routesDirWithFiles
 * @property {string} snapshotDir Directory for snapshots.
 */


/**
 * @type {Context}
 */
export const Context = {}
