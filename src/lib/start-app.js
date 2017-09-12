const debuglog = require('util').debuglog('idio')
const enableDestroy = require('server-destroy');
const router = require('koa-router')()
const Database = require('../services/database')
const createApp = require('./create-app')

const DEFAULT_PORT = 5000
const DEFAULT_HOST = '0.0.0.0'
const DEFAULT_MONGO = 'mongodb://localhost:27017'

async function connectToDatabase(url) {
    debuglog('connecting to the database')
    const db = new Database()
    // mongod --dbpath=data --port 27017 or use deamon
    await db.connect(url)
    debuglog('connected to the database')
    return db
}

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
 * @typedef {Object} Config
 * @property {string} [databaseURL='mongodb://localhost:27017']
 * @property {number} [port=5000]
 */

/**
 * @typedef {Object} App
 * @property {function} destroy Kill the server and disconnect from the database
 */

/**
 * Start the server.
 * @param {Config} [config] configuration object
 * @returns {{app, middleware, router, url}}
 */
async function startApp(config = {}) {
    const databaseUrl = config.databaseURL || DEFAULT_MONGO
    const port = Number.isInteger(config.port) ? config.port : DEFAULT_PORT
    const host = config.host || DEFAULT_HOST

    const db = await connectToDatabase(databaseUrl)

    // close all connections when running nodemon
    process.once('SIGUSR2', async () => {
        await app.destroy()
        process.kill(process.pid, 'SIGUSR2')
    })

    const appMeta = await createApp(config, db)
    const { app } = appMeta

    const server = await listen(app, port, host)

    enableDestroy(server)
    app.destroy = () => Promise.all([
        disconnectFromDatabase(db),
        destroy(server),
    ])
    const serverPort = server.address().port

    const url = `http://localhost:${serverPort}`

    return Object.assign(appMeta, { router, url })
}

module.exports = startApp
