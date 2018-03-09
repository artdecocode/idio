const session = require('koa-session')
const CSRF = require('koa-csrf')
const multer = require('koa-multer')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const { ensurePath } = require('wrote')
const { join, resolve } = require('path')
const checkAuth = require('./check-auth')

function setupCheckAuth(app, config) {
  return checkAuth(config)
}

function setupSession(app, config) {
  if (!Array.isArray(config.keys)) {
    throw new Error('Keys must be an array')
  }
  app.keys = config.keys
  const ses = session(config.config, app)
  return ses
}
function setupCsrf(app, config) {
  const csrf = new CSRF(config.config)
  return csrf
}
async function setupMulter(app, config) {
  if (!(config.config && typeof config.config.dest === 'string')) {
    throw new Error('expecting uploadDir for multer')
  }
  const resolvedDir = resolve(config.config.dest)
  const uploadDirTestPath = join(resolvedDir, 'test.data')
  await ensurePath(uploadDirTestPath)
  const upload = multer(config.config)
  return upload
}
function setupBodyParser(app, config) {
  const bodyparser = bodyParser(config.config)
  return bodyparser
}
function setupLogger() {
  return logger()
}

const map = {
  session: setupSession,
  multer: setupMulter,
  csrf: setupCsrf,
  bodyparser: setupBodyParser,
  checkauth: setupCheckAuth,
  logger: setupLogger,
}

async function initMiddleware(name, conf, app) {
  const fn = typeof conf.function === 'function' ? conf.function : map[name]
  if (typeof fn !== 'function') {
    throw new Error(`Expecting function for ${name} middleware`)
  }
  const res = await fn(app, conf.config || {})
  if (conf.use) {
    app.use(res)
  }
  return res
}

async function setupMiddleware(middleware, app) {
  if (typeof middleware !== 'object') {
    return {}
  }
  const res = await Object.keys(middleware)
    .reduce(async (accP, name) => {
      const acc = await accP
      const conf = middleware[name]
      const installed = await initMiddleware(name, conf, app)
      return Object.assign({}, acc, {
        [name]: installed,
      })
    }, Promise.resolve({}))
  return res
}

module.exports = setupMiddleware
