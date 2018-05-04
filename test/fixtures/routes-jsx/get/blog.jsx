export default async (ctx, next) => {
  ctx.setTitle('Test Website | BLOG')
  ctx.Content = 'BLOG POSTS'
  await next()
}
