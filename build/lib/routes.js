"use strict";

var _koaRouter = _interopRequireDefault(require("koa-router"));

var _wrote = require("wrote");

var _path = require("path");

var _util = require("util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debuglog = (0, _util.debuglog)('idio');
const log = console.log;
let fsevents;

try {
  fsevents = require('fsevents');
} catch (e) {
  /* ignore fsevents */
}

const filterJsx = route => /\.jsx?$/.test(route);

const removeExtension = route => {
  return `${route.replace(/\.jsx?$/, '')}`;
};

const reducePaths = (acc, {
  route,
  fn,
  path
}) => {
  fn.path = path;
  return { ...acc,
    [route]: fn
  };
};

const findChildrenInCache = (dir, file) => {
  const path = (0, _path.resolve)(dir, file);
  const item = require.cache[path];
  if (!item) return [];
  const {
    children
  } = item;
  const res = children.map(({
    id
  }) => id);
  return res;
};

const importRoute = (dir, file, defaultImports = false) => {
  const route = `/${removeExtension(file)}`;
  const path = (0, _path.resolve)(dir, file);

  const mod = require(path);

  const fn = defaultImports ? mod.default : mod;
  fn._route = true;
  return {
    route,
    fn,
    path
  };
};

const getName = (method, path) => `${method.toUpperCase()} ${path}`;
/**
 *
 * @param {Object} routes
 * @param {string} method
 * @param {Router} router
 * @param {function} [getMiddleware]
 * @param {{string:[string]}} [aliases]
 * @returns {[string]} An array of routes.
 */


const addRoutes = (routes, method, router, getMiddleware, aliases = {}) => {
  const res = Object.keys(routes).reduce((acc, route) => {
    const fn = routes[route];
    const middleware = typeof getMiddleware == 'function' ? getMiddleware(fn) : [fn];
    const name = getName(method, route);
    router[method](name, route, ...middleware);
    const a = aliases[route] || [];
    const al = a.map(alias => {
      const aliasName = getName(method, alias);
      router[method](aliasName, alias, ...middleware);
      return alias;
    });
    return { ...acc,
      [route]: al
    };
  }, {});
  return res;
};

const readRoutes = async (dir, {
  filter = filterJsx,
  defaultImports = false
} = {}) => {
  const {
    content: topLevel
  } = await (0, _wrote.readDirStructure)(dir);
  const methods = Object.keys(topLevel).reduce((acc, method) => {
    const {
      type
    } = topLevel[method];
    if (type != 'Directory') return acc;
    const {
      content: files
    } = topLevel[method];
    const modules = Object.keys(files).filter(filter).map(file => {
      const path = (0, _path.resolve)(dir, method);
      const route = importRoute(path, file, defaultImports);
      return route;
    });
    const routes = modules.reduce(reducePaths, {});
    return { ...acc,
      [method]: routes
    };
  }, {});
  return methods;
};
/**
 * @typedef {Object} InitConfig
 * @property {function} [filter] A function used to filter files found in routes directory.
 * @property {boolean} [defaultImports=false] Whether routes are written with ES6 modules and export
 * a default function
 * @property {boolean} [watch=false] Automatically reload the route when the
 * module file gets updated (does not watch child dependencies).
 */

/**
 *
 * @param {string} dir Path to the routes folder
 * @param {Router} router Instance of koa-router
 * @param {InitConfig} param2
 */


const initRoutes = async (dir, router, {
  middleware = {},
  filter = filterJsx,
  defaultImports,
  aliases = {},
  watch = false
} = {}) => {
  const methods = await readRoutes(dir, {
    filter,
    defaultImports
  });
  const res = Object.keys(methods).reduce((acc, method) => {
    const routes = methods[method];
    const getMiddleware = middleware[method];
    const methodAliases = aliases[method];
    const r = addRoutes(routes, method, router, getMiddleware, methodAliases);
    return { ...acc,
      [method]: r
    };
  }, {});

  if (watch && fsevents) {
    watchPages(methods, dir, router, defaultImports, aliases); // watchRoutes(dir, router, defaultImports, aliases)
  }

  return res;
};

const watchPages = (methods, dir, router, defaultImports, aliases) => {
  Object.keys(methods).forEach(m => {
    const method = methods[m];
    const keys = Object.keys(method);
    keys.forEach(key => {
      const {
        path
      } = method[key];
      const watcher = fsevents(path);
      log('watching %s', path);
      watcher.on('modified', () => {
        log('updated %s', path);
        onChange(path, dir, router, defaultImports, aliases);
      });
      watcher.start();
      const children = findChildrenInCache('', path);
      children.filter(c => {
        return !/node_modules/.test(c);
      }).forEach(c => {
        const w = fsevents(c);
        log('watching dependency %s', c);
        w.on('modified', p => {
          log('updated dependency %s of %s', p, path);
          onChange(path, dir, router, defaultImports, aliases);
        });
        w.start();
      });
    });
  });
};

const onChange = (path, dir, router, defaultImports, aliases) => {
  const rel = (0, _path.relative)(dir, path);
  const [method, file] = rel.split(_path.sep);
  const route = `/${removeExtension(file)}`;
  const name = getName(method, route);
  const layer = router.route(name);
  const fn = layer.stack.find(({
    _route
  }) => _route == true);
  if (!fn) return;
  const i = layer.stack.indexOf(fn);
  const children = findChildrenInCache('', path);
  children.forEach(c => {
    debuglog('removing cache for child %s', c);
    delete require.cache[c];
  });
  delete require.cache[path];
  const {
    fn: newFn
  } = importRoute(dir, rel, defaultImports);
  layer.stack[i] = newFn;
  const a = aliases[method][route] || [];
  const reloadedAliases = a.map(alias => {
    const aliasName = getName(method, alias);
    const l = router.route(aliasName);
    const fun = l.stack.find(({
      _route
    }) => _route == true);
    if (!fun) return;
    const j = l.stack.indexOf(fun);
    l.stack[j] = newFn;
    return aliasName;
  });
  console.log('> hot reloaded %s (%s)', name, reloadedAliases.join(', '));
}; // const watchRoutes = (dir, router, defaultImports, aliases) => {
//   const watcher = fsevents(dir)
//   watcher.on('change', (path) => {
//     onChange(path, dir, router, defaultImports, aliases)
//   })
//   watcher.start()
//   console.log('watching %s routes directory', dir)
// }


module.exports = {
  initRoutes,
  readRoutes,
  addRoutes
};