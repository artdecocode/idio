export default async (ctx, next) => {
  ctx.setTitle('Test Website | MAIN PAGE')
  ctx.Content = 'MAIN PAGE'
  await next()
}
