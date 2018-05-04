const { spawn } = require('child_process')
const { ensurePath, assertExists } = require('wrote')
const { resolve, sep: s, isAbsolute } = require('path')
const { symlink } = require('fs')
const Catchment = require('catchment')
const { scripts } = require('./package.json')

const re = /Cannot find module '(.*)' from .*?/

const [, , NPM_SCRIPT, FROM, TO] = process.argv

if (!FROM) {
  console.log('please enter path to the target node_module directory')
  process.exit(1)
}

const script = NPM_SCRIPT ? scripts[NPM_SCRIPT] : scripts['test']
const getRoot = p => p.split(s)[0]
const getLast = p => {
  const sp = p.split(s)
  return sp[sp.length - 1]
}

const sl = async (p) => {
  await new Promise(async (r, e) => {
    const path = TO ? resolve(TO, p) : resolve('node_modules', p)
    const target = resolve(FROM_NODE_MODULES, p)
    try {
      await assertExists(target)
    } catch (er) {
      er.code = 'TARGET_ENOENT'
      er.target = target
      e(er)
    }
    symlink(target, path, er => {
      return (er ? e(er) : r())
    })
  })
}

const slBin = async (p) => {
  const path = resolve('node_modules/.bin', p)
  const target = resolve(BIN_FROM, p)

  await ensurePath(path)
  await new Promise((r, e) => {
    symlink(target, path, er => {
      return (er ? e(er) : r())
    })
  })
}

const [modulePath, ...args] = script.split(' ')

const FROM_NODE_MODULES = resolve(FROM, 'node_modules')
const BIN_FROM = resolve(FROM, 'node_modules/.bin')

const run = async (m, i = 0) => {
  await new Promise(async (r, e) => {
    let f
    try {
      f = spawn(m, args, {
        stdio: 'pipe',
        execArgv: [],
      })
    } catch (err) {
      e(err)
      return
    }
    f.on('error', (err) => {
      e(err)
    })
    const exitPromise = new Promise(r1 => f.on('exit', r1))
    const c = new Catchment()
    const d = new Catchment()
    f.stderr.pipe(c)
    f.stdout.pipe(d)
    const [stdout, stderr] = await Promise.all([
      d.promise,
      c.promise,
      exitPromise,
    ])
    const res = re.exec(stderr)

    if (res == null) {
      console.log(stdout)
      console.error(stderr)
      return
    }

    const [, p] = res
    // we need to make sure that target exists?
    const path = isAbsolute(p) ? getLast(p) : getRoot(p)
    console.log('%s. %s', i + 1, path) //root, root == p ? '' : `(${p})`)
    try {
      await sl(path)
    } catch (er) {
      e(er)
    }
    r()
  })
  if (i > 1) return
  await run(m, i + 1)
}

(async () => {
  try {
    await run(modulePath)
  } catch (err) {
    const { code, stack } = err
    if (code == 'ENOENT') {
      try {
        await slBin(modulePath)
      } catch (err) {
        console.log(err)
      }
      return
    } else if (code == 'TARGET_ENOENT') {
      console.log(`Target ${err.target} does not exist`)
      return
    }
    console.log(stack)
  }
})()
