"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _assert = require("zoroaster/assert");

var _rqt = _interopRequireDefault(require("rqt"));

var _koaBodyparser = _interopRequireDefault(require("koa-bodyparser"));

var _context = _interopRequireWildcard(require("../context"));

var _build = require("../../build");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line no-unused-vars
const initRoutesTestSuite = {
  context: _context.default,

  async 'should not throw when files are found'({
    start,
    routesDirWithFiles
  }) {
    const {
      router
    } = await start();
    await (0, _build.initRoutes)(routesDirWithFiles, router);
  },

  async 'should use routes'({
    start,
    routesDir
  }) {
    const body = (0, _koaBodyparser.default)();
    let getMiddlewareCalls = 0;
    const {
      app,
      url,
      router
    } = await start();
    await (0, _build.initRoutes)(routesDir, router, {
      aliases: {
        get: {
          '/test': ['/alias']
        },
        post: {
          '/test': ['/alias']
        }
      },
      middleware: {
        get(route) {
          return [async (ctx, next) => {
            getMiddlewareCalls += 1;
            await next();
          }, route];
        },

        post(route) {
          return [body, route];
        }

      }
    });
    app.use(router.routes());
    const get = await (0, _rqt.default)(`${url}/test`);
    (0, _assert.equal)(get, 'test dynamic route');
    (0, _assert.equal)(getMiddlewareCalls, 1);
    const getAlias = await (0, _rqt.default)(`${url}/alias`);
    (0, _assert.equal)(getAlias, 'test dynamic route');
    (0, _assert.equal)(getMiddlewareCalls, 2);
    const message = 'hello world';
    const post = await (0, _rqt.default)(`${url}/test`, {
      data: JSON.stringify({
        message
      })
    });
    (0, _assert.equal)(post, `test default post request: ${message}`);
    const postAlias = await (0, _rqt.default)(`${url}/alias`, {
      data: JSON.stringify({
        message
      })
    });
    (0, _assert.equal)(postAlias, `test default post request: ${message}`);
  },

  async 'should use routes (modules)'({
    start,
    routesDirModules
  }) {
    const body = (0, _koaBodyparser.default)();
    let getMiddlewareCalls = 0;
    const {
      app,
      url,
      router
    } = await start();
    await (0, _build.initRoutes)(routesDirModules, router, {
      defaultImports: true,
      aliases: {
        get: {
          '/test': ['/alias']
        },
        post: {
          '/test': ['/alias']
        }
      },
      middleware: {
        get(route) {
          return [async (ctx, next) => {
            getMiddlewareCalls += 1;
            await next();
          }, route];
        },

        post(route) {
          return [body, route];
        }

      }
    });
    app.use(router.routes());
    const get = await (0, _rqt.default)(`${url}/test`);
    (0, _assert.equal)(get, 'test dynamic route');
    (0, _assert.equal)(getMiddlewareCalls, 1);
    const getAlias = await (0, _rqt.default)(`${url}/alias`);
    (0, _assert.equal)(getAlias, 'test dynamic route');
    (0, _assert.equal)(getMiddlewareCalls, 2);
    const message = 'hello world';
    const post = await (0, _rqt.default)(`${url}/test`, {
      data: JSON.stringify({
        message
      })
    });
    (0, _assert.equal)(post, `test default post request: ${message}`);
    const postAlias = await (0, _rqt.default)(`${url}/alias`, {
      data: JSON.stringify({
        message
      })
    });
    (0, _assert.equal)(postAlias, `test default post request: ${message}`);
  }

};
var _default = initRoutesTestSuite;
exports.default = _default;