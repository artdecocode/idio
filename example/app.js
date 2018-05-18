/* yarn example */
import idio from 'idio'
import config, { routesConfig } from './config'

(async () => {
  try {
    const { url } = await idio(config, routesConfig)
    console.log(url) // eslint-disable-line
  } catch ({ stack }) {
    console.log(stack) // eslint-disable-line
    process.exit(1)
  }
})()
