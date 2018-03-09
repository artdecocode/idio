// routes/index.js
const fn = async (ctx) => {
  const n = ctx.session.views || 1
  ctx.session.views = n + 1
  ctx.body = `${n} views`
}

module.exports = fn // native
