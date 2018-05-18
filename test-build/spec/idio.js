"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _assert = require("zoroaster/assert");

var _rqt = _interopRequireDefault(require("rqt"));

var _build = _interopRequireDefault(require("../../build"));

var _context = _interopRequireWildcard(require("../context"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line no-unused-vars

/** @type {Object.<string, (ctx: Context)>} */
const t = {
  context: _context.default,

  async 'starts the server'({
    routesJsx
  }) {
    const {
      url,
      app,
      methods
    } = await (0, _build.default)({
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
    const res = await (0, _rqt.default)(url);
    console.log(res);
    (0, _assert.ok)(/MAIN PAGE/.test(res));
    (0, _assert.ok)(methods);
    app.destroy();
  }

};
var _default = t;
exports.default = _default;