"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _assert = require("zoroaster/assert");

var _snapshotContext = _interopRequireWildcard(require("snapshot-context"));

var _context = _interopRequireWildcard(require("../../context"));

var _generator = _interopRequireDefault(require("../../../build/generator"));

var _build = require("../../../build");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

// eslint-disable-line
// eslint-disable-line no-unused-vars

/**
 * @type {Object.<string, (api: Context, sApi: SnapshotContext)>}
 */
const generatorTestSuite = {
  context: [_context.default, _snapshotContext.default],

  async 'generates a website'(api) {
    const {
      start
    } = api;
    const t = 'abc';
    const {
      url
    } = await start({
      middleware: {
        'a page': {
          async function(app, {
            t
          }) {
            return async ctx => {
              ctx.type = 'text/plain';
              ctx.body = `${t} :: ${ctx.req.url}`;
            };
          },

          config: {
            t
          },
          use: true
        }
      }
    });
    const pages = {
      '/test': [],
      '/test2': []
    };
    const sitemap = await (0, _generator.default)(url, pages); // const expected = Object.keys(pages).reduce((acc, key) => {
    //   const value = pages[key]
    //   return {
    //     ...acc,
    //     [p]: `${t} :: ${p}`,
    //   }
    // }, {})

    const expected = {
      '/test': `${t} :: /test`,
      '/test2': `${t} :: /test2` // deepEqual(expected, expectedByHand)

    };
    (0, _assert.deepEqual)(sitemap, expected);
  },

  /**
   * @param {Context} api
   * @param {SnapshotContext} snapshot
   */
  async 'generates a JSX website'(api, snapshot) {
    const {
      start,
      routesJsx,
      snapshotDir
    } = api;
    const {
      test,
      setDir
    } = snapshot;
    setDir(snapshotDir);
    const {
      app,
      url,
      router
    } = await start({
      middleware: {
        koa2Jsx: {
          wireframe: true,
          use: true,
          config: {}
        }
      }
    });
    const map = await (0, _build.initRoutes)(routesJsx, router, {
      defaultImports: true
    });
    app.use(router.routes());
    const {
      get
    } = map;
    const actual = await (0, _generator.default)(url, get);
    await test('generator/full.json', actual);
  }

};
var _default = generatorTestSuite;
exports.default = _default;
//# sourceMappingURL=index.js.map