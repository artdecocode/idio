"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = startApp;

var _util = require("util");

var _serverDestroy = _interopRequireDefault(require("server-destroy"));

var _koaRouter = _interopRequireDefault(require("koa-router"));

var _database = _interopRequireDefault(require("../services/database"));

var _createApp = _interopRequireDefault(require("./create-app"));

var _types = require("../types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line no-unused-vars
const debuglog = (0, _util.debuglog)('idio');
const DEFAULT_PORT = 5000;
const DEFAULT_HOST = '0.0.0.0';
const DEFAULT_MONGO = 'mongodb://localhost:27017'; // async function connectToDatabase(url) {
//   debuglog('connecting to the database')
//   const db = new Database()
//   // mongod --dbpath=data --port 27017 or use deamon
//   await db.connect(url)
//   debuglog('connected to the database')
//   return db
// }

async function disconnectFromDatabase(db) {
  await db.disconnect();
  debuglog('disconnected from the database');
}

async function destroy(server) {
  await new Promise(resolve => {
    server.on('close', resolve);
    server.destroy();
  });
  debuglog('destroyed the server');
}

function listen(app, port, hostname = '0.0.0.0') {
  return new Promise(resolve => {
    const server = app.listen(port, hostname, () => resolve(server));
  });
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
    autoConnect = true
  } = config; // close all connections when running nodemon

  process.once('SIGUSR2', async () => {
    await app.destroy();
    process.kill(process.pid, 'SIGUSR2');
  });
  const db = new _database.default();
  const appMeta = await (0, _createApp.default)(config, db);
  const {
    app
  } = appMeta;
  const server = await listen(app, port, host);
  (0, _serverDestroy.default)(server);

  app.destroy = async () => {
    await Promise.all([disconnectFromDatabase(db), destroy(server)]);
  };

  const {
    port: serverPort
  } = server.address();
  const url = `http://localhost:${serverPort}`;
  const router = (0, _koaRouter.default)();

  const connect = async () => {
    await db.connect(databaseURL);
  };

  if (autoConnect) {
    await connect();
  }

  return { ...appMeta,
    router,
    url,
    ...(autoConnect ? {} : {
      connect
    })
  };
}