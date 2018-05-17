export default async (ctx) => {
  const s = `Your ip: ${ctx.request.ip}`
  ctx.body = s
}
