const debuglog = require('util').debuglog('idio')
const enableDestroy = require('server-destroy')
const Router = require('koa-router')
const Database = require('../services/database')
const createApp = require('./create-app')
// eslint-disable-next-line no-unused-vars
const { AppReturn, Config } = require('../types')

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
async function startApp(config = {}) {
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
  return {...appMeta, router, url, ...(autoConnect ? {} : { connect }) }
}

module.exports = startApp
