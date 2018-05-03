const rqt = require('rqt')

async function generate(url, pages = []) {
  const promises = pages.map(async page => {
    const res = await rqt(`${url}/${page}`)
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

module.exports = generate
