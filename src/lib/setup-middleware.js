const session = require('koa-session')
const CSRF = require('koa-csrf')
const multer = require('koa-multer')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const { ensurePath } = require('wrote')
const { join, resolve } = require('path')
const { default: koa2Jsx, wireframe, bootstrap } = require('koa2-jsx')
const compress = require('koa-compress')
const { Z_SYNC_FLUSH } = require('zlib')

const checkAuth = require('./check-auth')

function setupCompress(app, config) {
  const fn = compress({
    threshold: 1024,
    flush: Z_SYNC_FLUSH,
    ...config,
  })
  return fn
}
function setupKoa2Jsx(app, config, { wireframe: useWireframe }) {
  const fn = koa2Jsx({
    ...(useWireframe ? wireframe : {}),
    ...config,
  })
  return fn
}
function setupCheckAuth() {
  return checkAuth()
}
function setupSession(app, config, { keys }) {
  if (!Array.isArray(keys)) {
    throw new Error('Keys must be an array')
  }
  app.keys = keys
  const ses = session(config, app)
  return ses
}
function setupCsrf(app, config) {
  const csrf = new CSRF(config)
  return csrf
}
async function setupMulter(app, config = {}) {
  if (typeof config.dest != 'string') {
    throw new Error('expecting uploadDir for multer')
  }
  const resolvedDir = resolve(config.dest)
  const uploadDirTestPath = join(resolvedDir, 'test.data')
  await ensurePath(uploadDirTestPath)
  const upload = multer(config)
  return upload
}
function setupBodyParser(app, config) {
  const bodyparser = bodyParser(config)
  return bodyparser
}
function setupLogger() {
  return logger()
}

const map = {
  session: setupSession,
  multer: setupMulter,
  csrf: setupCsrf,
  compress: setupCompress,
  bodyparser: setupBodyParser,
  checkauth: setupCheckAuth,
  logger: setupLogger,
  koa2Jsx: setupKoa2Jsx,
}

async function initMiddleware(name, conf, app) {
  const fn = typeof conf.function == 'function' ? conf.function : map[name]
  if (typeof fn !== 'function') {
    throw new Error(`Expecting function for ${name} middleware`)
  }
  const { use, config = {}, ...rest } = conf
  const res = await fn(app, config, rest)
  if (use) {
    app.use(res)
  }
  if (name == 'koa2Jsx' && use && rest.bootstrap) {
    app.use(bootstrap)
  }
  return res
}

async function setupMiddleware(middleware = {}, app) {
  const res = await Object.keys(middleware)
    .reduce(async (acc, name) => {
      const res = await acc
      const conf = middleware[name]
      const installed = await initMiddleware(name, conf, app)
      return {
        ...res,
        [name]: installed,
      }
    }, {})
  return res
}

module.exports = setupMiddleware
