"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createApp;

var _koa = _interopRequireDefault(require("koa"));

var _setupMiddleware = _interopRequireDefault(require("./setup-middleware"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function createApp(config, database) {
  const app = new _koa.default();
  app.context.database = database;
  app.context.config = config;
  const middleware = await (0, _setupMiddleware.default)(config.middleware, app);

  if (app.env == 'production') {
    app.proxy = true;
  }

  return {
    app,
    middleware
  };
}