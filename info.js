const { spawnSync } = require('child_process')

const { stdout } = spawnSync('yarn', ['info', process.argv[2], '--json'])
const { data: { homepage } } = JSON.parse(stdout)
console.log(homepage)
