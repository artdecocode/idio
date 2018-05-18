"use strict";

module.exports = {
  async default(ctx) {
    const {
      message
    } = ctx.request.body;
    ctx.body = `test default post request: ${message}`;
  }

};