const { resolve } = require('path')
const jsdiff = require('diff')
const { equal } = require('zoroaster/assert')
const reloquent = require('reloquent')
const { read, write, createWritable, ensurePath } = require('wrote')

function c(t, color) {
  switch (color) {
    case 'red':
      return `\x1b[31m${t}\x1b[0m`
    case 'green':
      return `\x1b[32m${t}\x1b[0m`
    case 'grey':
      return t
    default:
      return t
  }
}

async function snapshotContext() {
  this.saveSnapshot = async (path, snapshot) => {
    const p = resolve(__dirname, '../snapshots', path)
    await ensurePath(p)
    const ws = await createWritable(p)
    await write(ws, snapshot)
  }
  this.promptSnapshot = async (snapshot) => {
    console.log(snapshot) // eslint-disable-line
    const { promise } = reloquent('save snapshot?')
    const answer = await promise
    return answer == 'y'
  }
  Object.assign(this, {
    promptAndSave: async (
      path,
      actual,
      err = new Error('could not test missing snapshot'),
    ) => {
      if (!actual) throw new Error('give snapshot to save')
      const res = await this.promptSnapshot(actual)
      if (res) {
        await this.saveSnapshot(path, actual)
      } else {
        throw err
      }
    },
    readSnapshot: async (path) => {
      const snapshot = await read(resolve(__dirname, '../snapshots', path))
      return snapshot.trim()
    },
    testSnapshot: async (path, actual) => {
      let expected
      try {
        expected = await this.readSnapshot(path)
        equal(actual, expected)
      } catch (err) {
        if (err.code != 'ENOENT') {
          const diff = jsdiff.diffChars(actual, expected)
          diff.forEach(({ added, removed, value }) => {
            const color = added ? 'green' :
              removed ? 'red' : 'grey'

            const p = added || removed ? value.replace(/ /g, '_') : value
            const colored = c(p, color)
            process.stderr.write(colored)
          })

          throw new Error('Result did not match expected')
        }
        await this.promptAndSave(path, actual)
      }
    },
  })
}

/**
 * @typedef {Object} SnapshotContext
 * @property {function(string):Promise<string>} readSnapshot
 * @property {function(string, string):Promise<string>} saveSnapshot
 * @property {function(string):Promise<boolean>} promptSnapshot
 * @property {function(string, string)} testSnapshot
 */


module.exports = {
  snapshotContext,
  /**
   * @type {SnapshotContext}
   */
  SnapshotContext: {},
}

