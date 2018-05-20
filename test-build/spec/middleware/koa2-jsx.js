"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rqt = _interopRequireDefault(require("rqt"));

var _snapshotContext = _interopRequireWildcard(require("snapshot-context"));

var _context = _interopRequireWildcard(require("../../context"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line
// eslint-disable-line no-unused-vars

/** @type {Object.<string, (api: Context, sApi: SnapshotContext)>} */
const generatorTestSuite = {
  context: [_context.default, _snapshotContext.default],

  async 'serves pretty html with wireframe'(api, snapshot) {
    const {
      start,
      snapshotDir
    } = api;
    const {
      test,
      setDir
    } = snapshot;
    setDir(snapshotDir);
    const t = 'hello world';
    const {
      url
    } = await start({
      middleware: {
        koa2Jsx: {
          use: true,
          config: {
            pretty: true
          },
          wireframe: true
        },
        page: {
          function: (app, {
            text
          }) => {
            return async (ctx, next) => {
              ctx.setTitle('Idio tests | main page');
              ctx.Content = text;
              await next();
            };
          },
          config: {
            text: t
          },
          use: true
        }
      }
    });
    const actual = await (0, _rqt.default)(url);
    await test('koa2Jsx/pretty-wireframe.html', actual);
  }

};
var _default = generatorTestSuite;
exports.default = _default;
//# sourceMappingURL=koa2-jsx.js.map