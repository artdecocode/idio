import Idio from '../../Components/Idio.jsx'

export default async (ctx) => {
  const n = ctx.session.views || 1
  ctx.setTitle('Count views')
  ctx.session.views = n + 1
  ctx.Content = <Idio>{`${n} views`}</Idio>
}
