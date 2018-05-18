const { spawnSync } = require('child_process')

const param = process.argv[3] || 'homepage'

const { stdout } = spawnSync('yarn', ['info', process.argv[2], '--json'])
const { data } = JSON.parse(stdout)

const d = data[param]
console.log(d)
