"use strict";

module.exports = async ctx => {
  const {
    message
  } = ctx.request.body;
  ctx.body = `test default post request: ${message}`;
};