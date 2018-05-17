import { debuglog as dl } from 'util'
import enableDestroy from 'server-destroy'
import Router from 'koa-router'
import Database from '../services/database'
import createApp from './create-app'
import { AppReturn, Config } from '../types' // eslint-disable-line no-unused-vars

const debuglog = dl('idio')

const DEFAULT_PORT = 5000
const DEFAULT_HOST = '0.0.0.0'
const DEFAULT_MONGO = 'mongodb://localhost:27017'

// async function connectToDatabase(url) {
//   debuglog('connecting to the database')
//   const db = new Database()
//   // mongod --dbpath=data --port 27017 or use deamon
//   await db.connect(url)
//   debuglog('connected to the database')
//   return db
// }

async function disconnectFromDatabase(db) {
  await db.disconnect()
  debuglog('disconnected from the database')
}

async function destroy(server) {
  await new Promise((resolve) => {
    server.on('close', resolve)
    server.destroy()
  })
  debuglog('destroyed the server')
}

function listen(app, port, hostname = '0.0.0.0') {
  return new Promise((resolve) => {
    const server = app.listen(port, hostname, () => resolve(server))
  })
}

/**
 * Start the server.
 * @param {Config} [config] configuration object
 * @returns {AppReturn} An object with variables
 */
export default async function startApp(config = {}) {
  const {
    databaseURL = DEFAULT_MONGO,
    port = DEFAULT_PORT,
    host = DEFAULT_HOST,
    autoConnect = true,
  } = config

  // close all connections when running nodemon
  process.once('SIGUSR2', async () => {
    await app.destroy()
    process.kill(process.pid, 'SIGUSR2')
  })

  const db = new Database()

  const appMeta = await createApp(config, db)
  const { app } = appMeta

  const server = await listen(app, port, host)

  enableDestroy(server)
  app.destroy = async () => {
    await Promise.all([
      disconnectFromDatabase(db),
      destroy(server),
    ])
  }
  const { port: serverPort } = server.address()

  const url = `http://localhost:${serverPort}`

  const router = Router()

  const connect = async () => {
    await db.connect(databaseURL)
  }
  if (autoConnect) {
    await connect()
  }
  return { ...appMeta, router, url, ...(autoConnect ? {} : { connect }) }
}
