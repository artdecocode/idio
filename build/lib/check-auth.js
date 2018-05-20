"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = () => async (ctx, next) => {
  if (ctx.session && ctx.session.user) {
    return await next();
  }

  throw new Error('User not authorized');
};

exports.default = _default;
//# sourceMappingURL=check-auth.js.map