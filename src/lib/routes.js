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

const initRoutes = async (dir, router, {
  middleware = {},
  readConf = {},
  aliases = {},
} = {}) => {
  const methods = await readRoutes(dir, readConf)
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

