"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = async (ctx, next) => {
  ctx.setTitle('Test Website | BLOG');
  ctx.Content = 'BLOG POSTS';
  await next();
};

exports.default = _default;