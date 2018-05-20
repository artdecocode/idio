"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rqt = _interopRequireDefault(require("rqt"));

var _assert = require("zoroaster/assert");

var _context = _interopRequireWildcard(require("../context"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line no-unused-vars
const idioTestSuite = {
  context: _context.default,

  async 'starts without a database connection'({
    start
  }) {
    const {
      connect
    } = await start({
      databaseURL: 'mongodb://localhost:27018',
      autoConnect: false
    });
    (0, _assert.equal)(typeof connect, 'function');
  },

  async 'connects to a database'({
    start
  }) {
    const {
      connect
    } = await start();
    (0, _assert.equal)(connect, undefined);
  },

  /**
   * @param {ContextAPI} api
   */
  async 'sets up middleware correctly'(api) {
    const {
      start
    } = api;
    let called;
    const f = Math.random() * 1000;
    const m = 100;
    const {
      url
    } = await start({
      host: '0.0.0.0',
      middleware: {
        simpleRoute: {
          async function(app, {
            multiplier
          }) {
            return ctx => {
              called = true;
              ctx.body = f * multiplier;
            };
          },

          config: {
            multiplier: m
          },
          use: true
        }
      }
    });
    const res = await (0, _rqt.default)(url);
    (0, _assert.equal)(called, true);
    (0, _assert.equal)(res, f * m);
  }

};
var _default = idioTestSuite;
exports.default = _default;
//# sourceMappingURL=index.js.map