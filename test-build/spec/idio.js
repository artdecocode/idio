"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _assert = require("zoroaster/assert");

var _rqt = _interopRequireDefault(require("rqt"));

var _snapshotContext = _interopRequireWildcard(require("snapshot-context"));

var _build = _interopRequireDefault(require("../../build"));

var _context = _interopRequireWildcard(require("../context"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line no-unused-vars
// eslint-disable-line no-unused-vars
let app;
/** @type {Object.<string, (ctx: Context, sctx: SnapshotContext)>} */

const t = {
  context: [_context.default, _snapshotContext.default, function () {
    // after each
    this._destroy = () => {
      if (app) {
        app.destroy();
        app = null;
      }
    };
  }],

  async 'starts the server'({
    routesJsx,
    snapshotDir
  }, {
    setDir,
    test
  }) {
    setDir(snapshotDir);
    const {
      url,
      methods,
      router,
      app: a
    } = await (0, _build.default)({
      port: 0,
      autoConnect: false,
      middleware: {
        koa2Jsx: {
          wireframe: true,
          use: true
        }
      }
    }, {
      dir: routesJsx,
      aliases: {
        get: {
          '/index': ['/']
        }
      }
    });
    app = a;
    const res = await (0, _rqt.default)(url);
    (0, _assert.ok)(/MAIN PAGE/.test(res));
    (0, _assert.ok)(methods);
    (0, _assert.ok)(router);
    await test('main-page.html', res);
  }

};
var _default = t;
exports.default = _default;
//# sourceMappingURL=idio.js.map