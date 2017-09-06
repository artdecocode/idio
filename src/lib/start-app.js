const debuglog = require('util').debuglog('idio')
const Database = require('../services/database')
const createApp = require('./create-app')
const router = require('koa-router')()

const DEFAULT_PORT = 5000

async function connectToDatabase(url) {
    debuglog('connecting to the database')
    const db = new Database()
    // mongod --dbpath=data --port 27017 or use deamon
    await db.connect(url)
    debuglog('connected to the database')
    return db
}


/**
 * @typedef {Object} Config
 * @property {string} databaseURL
 * @property {number} [port=5000]
 */

/**
 * Start the server.
 * @param {Config} config configuration object
 */
async function startApp(config) {
    const db = await connectToDatabase(config.databaseURL)

    // disconnect from mongo when running nodemon
    process.once('SIGUSR2', async () => {
        await db.disconnect()
        process.kill(process.pid, 'SIGUSR2')
    })

    const appMeta = await createApp(config, db)
    const { app } = appMeta

    const port = config.port || DEFAULT_PORT

    await new Promise((resolve) => {
        app.listen(port, resolve)
    })

    const url = `http://localhost:${port}`

    return Object.assign(appMeta, { router, url })
}

module.exports = startApp
