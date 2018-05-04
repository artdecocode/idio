export default async (ctx, next) => {
  ctx.setTitle('Test Website | ABOUT')
  ctx.Content = 'ABOUT US'
  await next()
}
