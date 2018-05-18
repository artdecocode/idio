# idio

[![npm version](https://badge.fury.io/js/idio.svg)](https://badge.fury.io/js/idio)

`idio` is a koa2-based web server with some pre-installed middleware and Mongo support out of the box. Its purpose is to be able to quickly create a server with basic functionality. It also supports automatic initialisation of routes from a given directory, and watching those routes for updates (with `idio-dev`). That means that the whole server does not need to be restarted when a single route changes.

## Example

```js
// example.js
import { resolve } from 'path'
import { startApp, initRoutes } from 'idio'

const uploadDir = resolve(__dirname, 'upload')
const routesDir = resolve(__dirname, 'routes')

const sessionKey = 'secret-key'
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/idio'
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    const res = await startApp({
      databaseURL: DATABASE_URL,
      port: PORT,
      middleware: {
        session: { keys: [sessionKey] },
        multer: { config: { dest: uploadDir } },
        compress: { use: true, threshold: 2048 },
        csrf: { },
        bodyparser: { },
        checkauth: { },
        logger: { use: true },
        koa2Jsx: { use: true, wireframe: true /*, bootstrap: true */ },
      },
    })
    const { url, app, router, middleware: { session, bodyparser } } = res

    await initRoutes(routesDir, router, {
      defaultImports: false, // set to true if routes are written w/ "export default"
      filter(file) { return /\.js/.test(file) },
      aliases: {
        get: {
          '/index': ['/'],
        },
      },
      middleware: {
        get(route) {
          return [
            session,
            route,
          ]
        },
        post(route) {
          return [
            bodyparser,
            route,
          ]
        },
      },
    })
    const routes = router.routes()
    app.use(routes)

    console.log(url)
  } catch (err) {
    console.log(err)
  }
})()
```

```js
// app/routes/index.js
const fn = async (ctx) => {
  const n = ctx.session.views || 1
  ctx.session.views = n + 1
  ctx.body = `${n} views`
}

module.exports = fn // native
export default fn // or ES6, using babel
```

```bash
NODE_DEBUG=idio bin/idio
```

```fs
IDIO 40620: connecting to the database
IDIO 40620: connected to the database
http://localhost:5000
```

## Connecting to Mongo

`idio` will try to automatically connect to the Mongo database when creating
a new app. To prevent this, `autoConnect` option can be set to `false`, and a
`connect` property will be set on the returned object, so that a connection
can be established manually. This feature is useful when no database is required
for a website.

```js
const { connect } = await startApp({
  databaseURL: 'mongodb://localhost:27017',
  autoConnect: false,
})
await connect()
```

```js
// when no database is required
await startApp({
  autoConnect: false,
})
```

## Watching Routes Updates

If you use `initRoutes`, for development purposes you can pass the returned object to the `watchRoutes` function from `idio-dev` which allows to perform hot route reload without restarting the whole server.

```js
import { watchRoutes } from 'idio-dev'

const methods = await initRoutes(routesDir, router)
watchRoutes(methods, dir, router, defaultImports, aliases)
```

```sh
watching idio/routes routes directory
# update routes/ip
> hot reloaded GET /ip
```

## Standard Middleware

You can use the following standard middleware:

- _session_: extra `keys` property is required to set `app.keys`
- _multer_: `dest` property of config will be ensured
- _compress_: compression
- _csrf_
- _bodyparser_
- _checkauth_: checks if `session` and `session.user` properties are in context
- _logger_: logs request information, no configuration
- _koa2Jsx_: JSX templating, accepts `wireframe` and `bootstrap` boolean config
properties to enable these features.

They don't require to be passed the `function` property.

## Middleware Signature

Middleware set-up requires to pass an object called `middleware` to `startApp`:

```js
startApp({
  middleware: { /* ... */ },
})
```

Each middleware can have 3 properties:

- _function_ - constructor function (optional). It can be an async or normal function:

```js
const function = async (app, config) => {
  app.context.usingFunction = true

  return async(ctx, next) => {
    await next()
    if (config.debug) {
        console.error(ctx.usingFunction)
    }
  }
}
```

- _config_ - will be passed to the middleware constructor

```js
const config = {
  debug: process.env.NODE_DEBUG == 'idio',
}
```

- _use_ - whether to always use this middleware, will do `app.use()`

All together, setting up a custom middleware looks like this:

```js
startApp({
  middleware: {
    logger: {}, // included in standard lib
    customMiddleware: {
      function: async(app, config) => {
        app.context.usingFunction = true

        return async(ctx, next) => {
          await next()
          if (config.debug) {
              console.error(ctx.usingFunction)
          }
        }
      },
      config: { debug: process.env.NODE_DEBUG == 'idio' },
      use: true,
    },
  },
})
```

## Routes and Accessing Middleware

After the Koa server has been started, the promise will resolve with an object
containing 4 properties: `{ url, app, router, middleware }`.

- _url_: server url
- _app_: Koa app
- _router_: router, not enabled yet (see below)
- _middleware_: all set up middleware map with keys as names passed to the
`startApp` method, and functions as values.

Now you can set up routes and assign middleware to them:

```js
const { url, app, router, middleware: { session } } = await startApp({
  // ...
})
router.get('/', session, async (ctx) => {
  const n = ctx.session.views || 1
  ctx.session.views = n + 1
  ctx.body = `${n} views`
})
const routes = router.routes()
app.use(routes)

console.log(url) // http://localhost:5000
```

Congrats, you have your Koa2 server with database in `ctx.app.context`.

## destroy Method

An app can be destroyed (with all connections killed) by using `app.destroy`
method. This can be useful for testing - a database connection and http server
will be stopped.

## Database API

_towrite_

## todo

- use subdirectories when reading routes
- jsdoc for middleware settings

---

(c) [Art Deco Code][1] 2018

[1]: https://artdeco.bz
