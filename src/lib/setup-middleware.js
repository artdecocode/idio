import session from 'koa-session'
import CSRF from 'koa-csrf'
import multer from 'koa-multer'
import bodyParser from 'koa-bodyparser'
import logger from 'koa-logger'
import { ensurePath } from 'wrote'
import { join, resolve } from 'path'
import koa2Jsx, { wireframe as koa2Wireframe, bootstrap } from 'koa2-jsx'
import compress from 'koa-compress'
import serve from 'koa-static'
import compose from 'koa-compose'
import { Z_SYNC_FLUSH } from 'zlib'
import Mount from 'koa-mount'
import checkAuth from './check-auth'

function setupStatic(app, config, {
  root = [],
  maxage,
  mount,
}) {
  const roots = Array.isArray(root) ? root : [root]
  const m = roots.map((r) => {
    const fn = serve(r, {
      maxage,
      ...config,
    })
    return fn
  })
  const c = compose(m)
  if (mount) return Mount(mount, c)
  return c
}

function setupCompress(app, config, {
  threshold = 1024,
}) {
  const fn = compress({
    threshold,
    flush: Z_SYNC_FLUSH,
    ...config,
  })
  return fn
}
function setupKoa2Jsx(app, config, {
  wireframe,
  pretty = false,
  static: _static = true,
}) {
  const fn = koa2Jsx({
    ...(wireframe ? koa2Wireframe : {}),
    static: _static,
    pretty,
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
  static: setupStatic,
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

export default async function setupMiddleware(middleware = {}, app) {
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
