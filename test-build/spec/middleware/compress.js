"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _assert = require("zoroaster/assert");

var _rqt = _interopRequireDefault(require("rqt"));

var _zlib = require("zlib");

var _context = _interopRequireWildcard(require("../../context"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line no-unused-vars
function assignRoute(app, url, router, path, body) {
  router.get('test', path, async ctx => {
    ctx.body = body;
  });
  app.use(router.routes());
  return `${url}${path}`;
}

const compressTestSuite = {
  context: _context.default,

  /** @param {Context} api */
  async 'should use compression'(api) {
    const {
      start,
      readFixture
    } = api;
    const body = await readFixture();
    const {
      app,
      url,
      router
    } = await start({
      middleware: {
        compress: {
          use: true
        }
      }
    });
    const fullUrl = assignRoute(app, url, router, '/dracula.txt', body);
    const res = await (0, _rqt.default)(fullUrl, {
      headers: {
        'Accept-Encoding': 'gzip, deflate, br'
      },
      binary: true
    });
    const actual = (0, _zlib.gunzipSync)(res).toString();
    (0, _assert.equal)(actual, body);
  },

  async 'should pass threshold to the constructor'({
    start,
    readFixture
  }) {
    const body = await readFixture();
    const {
      app,
      url,
      router
    } = await start({
      middleware: {
        compress: {
          use: true,
          config: {
            threshold: body.length + 1
          }
        }
      }
    });
    const fullUrl = assignRoute(app, url, router, '/dracula.txt', body);
    const actual = await (0, _rqt.default)(fullUrl, {
      headers: {
        'Accept-Encoding': 'gzip, deflate, br'
      }
    });
    (0, _assert.equal)(actual, body);
  }

};
var _default = compressTestSuite;
exports.default = _default;
//# sourceMappingURL=compress.js.map