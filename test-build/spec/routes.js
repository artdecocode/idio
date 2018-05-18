"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _assert = require("zoroaster/assert");

var _context = _interopRequireWildcard(require("../context"));

var _routes = require("../../build/lib/routes");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

// eslint-disable-line no-unused-vars
const RoutesTestSuite = {
  context: _context.default,

  async initRoutes({
    routesDir
  }) {
    const res = await (0, _routes.readRoutes)(routesDir);
    (0, _assert.deepEqual)(Object.keys(res), ['get', 'post']);
    (0, _assert.deepEqual)(Object.keys(res.get), ['/about', '/test']);
    (0, _assert.deepEqual)(Object.keys(res.post), ['/test']);
    (0, _assert.equal)(typeof res.get['/test'], 'function');
    (0, _assert.equal)(typeof res.get['/about'], 'function');
    (0, _assert.equal)(typeof res.post['/test'], 'function');
  },

  async initRoutesDefault({
    routesDirModules
  }) {
    const res = await (0, _routes.readRoutes)(routesDirModules, {
      defaultImports: true
    });
    (0, _assert.deepEqual)(Object.keys(res), ['get', 'post']);
    (0, _assert.deepEqual)(Object.keys(res.get), ['/test']);
    (0, _assert.deepEqual)(Object.keys(res.post), ['/test']);
    (0, _assert.equal)(typeof res.get['/test'], 'function');
    (0, _assert.equal)(typeof res.post['/test'], 'function');
  },

  addRoutes() {
    const routes = {
      async '/test'(ctx) {
        ctx.body = 'hello world';
      },

      async '/test2'(ctx) {
        ctx.body = 'hello world 2';
      }

    };
    const addedRoutes = [];
    const router = {
      get(...route) {
        addedRoutes.push(route);
      }

    };

    const middleware = () => {};

    const getMiddleware = route => [middleware, route];

    (0, _routes.addRoutes)(routes, 'get', router, getMiddleware, {
      '/test': ['/', '/alias']
    });
    (0, _assert.deepEqual)(addedRoutes, [['GET /test', '/test', middleware, routes['/test']], ['GET /', '/', middleware, routes['/test']], ['GET /alias', '/alias', middleware, routes['/test']], ['GET /test2', '/test2', middleware, routes['/test2']]]);
  }

};
var _default = RoutesTestSuite;
exports.default = _default;