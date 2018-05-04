"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "startApp", {
  enumerable: true,
  get: function () {
    return _startApp.default;
  }
});
Object.defineProperty(exports, "initRoutes", {
  enumerable: true,
  get: function () {
    return _routes.initRoutes;
  }
});

var _startApp = _interopRequireDefault(require("./lib/start-app"));

var _routes = require("./lib/routes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }