export default async (ctx, next) => {
  ctx.Content = <div><h1>Hello world!</h1></div>
  await next()
}
