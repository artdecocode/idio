import rqt from 'rqt'

const getAll = (pages) => {
  const allPages = Object.keys(pages).reduce((acc, key) => {
    const aliases = pages[key]
    return [...acc, key, ...aliases]
  }, [])
  return allPages
}
const getMain = (pages) => {
  const keys = Object.keys(pages)
  return keys
}

export default async function generate(url, pages = {}) {
  const allPages = getMain(pages)
  const promises = allPages.map(async page => {
    const res = await rqt(`${url}${page}`)
    return { [page]: res }
  })
  const v = await Promise.all(promises)
  const mv = v.reduce((acc, current) => {
    return {
      ...acc,
      ...current,
    }
  }, {})
  return mv
}
