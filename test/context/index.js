import { resolve } from 'path'
import { read } from 'wrote'
import { startApp } from '../../src'
import { AppReturn, Config } from '../../src/types' // eslint-disable-line no-unused-vars

const SNAPSHOT_DIR = resolve(__dirname, '../snapshots')
const STATIC = resolve(__dirname, '../fixtures/static')
const STATIC2 = resolve(__dirname, '../fixtures/static2')

const readStaticFixture = async () => {
  const dracula = await read(resolve(STATIC, 'chapter2.txt'))
  return dracula
}
const readStaticFixture2 = async () => {
  const dracula = await read(resolve(STATIC2, 'chapter3.txt'))
  return dracula
}

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
  this.staticDir = STATIC
  this.staticDir2 = STATIC2

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
  this.readStaticFixture = readStaticFixture
  this.readStaticFixture2 = readStaticFixture2

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
 * @property {readStaticFixture} readStaticFixture Read chapter 2.
 * @property {readStaticFixture2} readStaticFixture2 Read chapter 3.
 * @property {STATIC} staticDir Static dir.
 * @property {STATIC2} staticDir2 Static dir 2.
 */


/**
 * @type {Context}
 */
export const Context = {}
