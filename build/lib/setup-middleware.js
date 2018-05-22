"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setupMiddleware;

var _koaSession = _interopRequireDefault(require("koa-session"));

var _koaCsrf = _interopRequireDefault(require("koa-csrf"));

var _koaMulter = _interopRequireDefault(require("koa-multer"));

var _koaBodyparser = _interopRequireDefault(require("koa-bodyparser"));

var _koaLogger = _interopRequireDefault(require("koa-logger"));

var _wrote = require("wrote");

var _path = require("path");

var _koa2Jsx = _interopRequireWildcard(require("koa2-jsx"));

var _koaCompress = _interopRequireDefault(require("koa-compress"));

var _koaStatic = _interopRequireDefault(require("koa-static"));

var _koaCompose = _interopRequireDefault(require("koa-compose"));

var _zlib = require("zlib");

var _koaMount = _interopRequireDefault(require("koa-mount"));

var _checkAuth = _interopRequireDefault(require("./check-auth"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setupStatic(app, config, {
  root = [],
  maxage,
  mount
}) {
  const roots = Array.isArray(root) ? root : [root];
  const m = roots.map(r => {
    const fn = (0, _koaStatic.default)(r, {
      maxage,
      ...config
    });
    return fn;
  });
  const c = (0, _koaCompose.default)(m);
  if (mount) return (0, _koaMount.default)(mount, c);
  return c;
}

function setupCompress(app, config, {
  threshold = 1024
}) {
  const fn = (0, _koaCompress.default)({
    threshold,
    flush: _zlib.Z_SYNC_FLUSH,
    ...config
  });
  return fn;
}

function setupKoa2Jsx(app, config, {
  wireframe,
  pretty = false,
  static: _static = true
}) {
  const fn = (0, _koa2Jsx.default)({ ...(wireframe ? _koa2Jsx.wireframe : {}),
    static: _static,
    pretty,
    ...config
  });
  return fn;
}

function setupCheckAuth() {
  return (0, _checkAuth.default)();
}

function setupSession(app, config, {
  keys
}) {
  if (!Array.isArray(keys)) {
    throw new Error('Keys must be an array');
  }

  app.keys = keys;
  const ses = (0, _koaSession.default)(config, app);
  return ses;
}

function setupCsrf(app, config) {
  const csrf = new _koaCsrf.default(config);
  return csrf;
}

async function setupMulter(app, config = {}) {
  if (typeof config.dest != 'string') {
    throw new Error('expecting uploadDir for multer');
  }

  const resolvedDir = (0, _path.resolve)(config.dest);
  const uploadDirTestPath = (0, _path.join)(resolvedDir, 'test.data');
  await (0, _wrote.ensurePath)(uploadDirTestPath);
  const upload = (0, _koaMulter.default)(config);
  return upload;
}

function setupBodyParser(app, config) {
  const bodyparser = (0, _koaBodyparser.default)(config);
  return bodyparser;
}

function setupLogger() {
  return (0, _koaLogger.default)();
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
  static: setupStatic
};

async function initMiddleware(name, conf, app) {
  const fn = typeof conf.function == 'function' ? conf.function : map[name];

  if (typeof fn !== 'function') {
    throw new Error(`Expecting function for ${name} middleware`);
  }

  const {
    use,
    config = {},
    ...rest
  } = conf;
  const res = await fn(app, config, rest);

  if (use) {
    app.use(res);
  }

  if (name == 'koa2Jsx' && use && rest.bootstrap) {
    app.use(_koa2Jsx.bootstrap);
  }

  return res;
}

async function setupMiddleware(middleware = {}, app) {
  const res = await Object.keys(middleware).reduce(async (acc, name) => {
    const res = await acc;
    const conf = middleware[name];
    const installed = await initMiddleware(name, conf, app);
    return { ...res,
      [name]: installed
    };
  }, {});
  return res;
}
//# sourceMappingURL=setup-middleware.js.map