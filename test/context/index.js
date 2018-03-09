const { resolve } = require('path')

async function Context() {
  this.routesDir = resolve(__dirname, '../fixtures/routes')
  this.routesDirModules = resolve(__dirname, '../fixtures/routes-modules')
}

module.exports = Context
