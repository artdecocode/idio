const { readDirStructure } = require('wrote')
const { resolve } = require('path')

const filterJsx = route => /\.jsx?$/.test(route)

const removeExtension = (route) => {
  return `${route.replace(/\.jsx?$/, '')}`
}

const reducePaths = (acc, { route, fn }) => {
  return {
    ...acc,
    [route]: fn,
  }
}

const importRoute = (dir, file, defaultImports = false) => {
  const route = `/${removeExtension(file)}`
  const path = resolve(dir, file)
  const mod = require(path)
  const fn = defaultImports ? mod.default : mod
  return { route, fn }
}

const addRoutes = (routes, method, router, getMiddleware, aliases = {}) => {
  Object.keys(routes).forEach((route) => {
    const fn = routes[route]
    const middleware = typeof getMiddleware === 'function' ? getMiddleware(fn) : [fn]
    router[method](route, ...middleware)
    const a = aliases[route] || []
    a.forEach((alias) => {
      router[method](alias, ...middleware)
    })
  })
}

const readRoutes = async (dir, {
  filter = filterJsx,
  defaultImports = false,
} = {}) => {
  const { content: topLevel } = await readDirStructure(dir)
  const methods = Object.keys(topLevel).reduce((acc, method) => {
    const { content: files } = topLevel[method]
    const modules = Object.keys(files)
      .filter(filter)
      .map(file => importRoute(resolve(dir, method), file, defaultImports))

    const routes = modules.reduce(reducePaths, {})
    return {
      ...acc,
      [method]: routes,
    }
  }, {})
  return methods
}

/**
 * @typedef {Object} InitConfig
 * @property {function} [filter] A function used to filter files found in routes directory.
 * @property {boolean} [defaultImports=false] Whether routes are written with ES6 modules and export
 * a default function
 */

/**
 *
 * @param {string} dir Path to the routes folder
 * @param {*} router Instance of koa-router
 * @param {InitConfig} param2
 */
const initRoutes = async (dir, router, {
  middleware = {},
  filter,
  defaultImports,
  aliases = {},
} = {}) => {
  const methods = await readRoutes(dir, { filter, defaultImports })
  Object.keys(methods).forEach((method) => {
    const routes = methods[method]
    const getMiddleware = middleware[method]
    const methodAliases = aliases[method]
    addRoutes(routes, method, router, getMiddleware, methodAliases)
  })
}

module.exports = {
  initRoutes,
  readRoutes,
  addRoutes,
}

