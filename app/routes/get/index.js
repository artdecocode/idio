// routes/index.js
const fn = async (ctx) => {
  const n = ctx.session.views || 1
  ctx.setTitle('Count views')
  ctx.session.views = n + 1
  ctx.Content = `${n} views`
}

module.exports = fn // native
