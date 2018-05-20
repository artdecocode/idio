"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// mongoose.Promise = Promise
// /**
//  * Close a given connection to the database.
//  * @param {Connection} connection - connection to close
//  */
// async function disconnect(connection) {
//   try {
//     await connection.close()
//   } catch (error) {
//     throw error
//   }
// }
// /**
//  * Create a connection to a database at URL.
//  * @param {String} url - the url of the database
//  * @returns {Connection} An open mongoose connection.
//  */
// async function connect(url) {
//   const connection = mongoose.createConnection()
//   try {
//     await connection.openUri(url)
//     return connection
//   } catch (error) {
//     throw error
//   }
// }
function setupModels(connection, models) {
  Object.keys(models).forEach(key => {
    const schema = models[key];
    connection.model(key, schema);
  });
}

class Database {
  /**
   * Create new database instance.
   * @param {object} [modelsMap] Map of models to assign to the connection
   */
  constructor(models = {}) {
    this._models = models;
  }
  /**
   * Connect to the database.
   * @param {string} uri the url of the database to connect to
   */


  async connect(uri) {
    await _mongoose.default.connect(uri); // if (this._connection) {
    //   throw new Error('Connection already established')
    // }
    // this._connection = await connect(url)

    setupModels(_mongoose.default.connection, this._models);
  }
  /**
   * Disconnect from the database.
   * @throws {Error} An error if connection was not open
   */


  async disconnect() {
    await _mongoose.default.connection.close(); // if (!this._connection) {
    //   throw new Error('Connection not established')
    // }
    // await disconnect(this._connection)
    // this._connection = null
  }
  /**
   * Return a model for a particular schema.
   * @param {String} name name of the model
   * @returns {Model} A mongoose model.
   */


  getModel(name) {
    return _mongoose.default.connection.model(name);
  }

}

exports.default = Database;
//# sourceMappingURL=database.js.map