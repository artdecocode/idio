module.exports = async (ctx) => {
  const s = `your ip: ${ctx.request.ip}`
  ctx.body = s
}
