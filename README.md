# idiosyncrasy

`idiosyncrasy` is a koa2-based web-server with some pre-installed middleware.
Its purpose is to be able to quickly create a server with basic functionality.

## Example

```js
// ./bin/idiosyncrasy
#!/usr/bin/env node

const { join } = require('path')
const startApp = require('../src/lib/start-app')
const uploadDir = join(__dirname, '../upload')

const sessionKey = 'secret-key'
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/idio'
const PORT = process.env.PORT || 5000

startApp({
    databaseURL: DATABASE_URL,
    port: PORT,
    middleware: {
        session: { config: { keys: [sessionKey] } },
        multer: { config: { uploadDir } },
        csrf: { },
        bodyparser: { },
        checkauth: { },
        logger: { use: true },
    },
})
.then((res) => {
    const { url, app, router, middleware } = res
    router.get('/', middleware.session, async (ctx) => {
        const n = ctx.session.views || 1
        ctx.session.views = n + 1
        ctx.body = `${n} views`
    })
    const routes = router.routes()
    console.log(url)
    app.use(routes)
})
.catch(console.error)
```

```bash
NODE_DEBUG=idio ./bin/idiosyncrasy
```

```fs
IDIO 40620: connecting to the database
IDIO 40620: connected to the database
http://localhost:5000
```

## Standard Middleware

You can use the following standard middleware:

- _session_: extra `keys` property is required to set `app.keys`
- _multer_: `dest` property of config will be ensured
- _csrf_
- _bodyparser_
- _checkauth_: checks if `session` and `session.user` properties are in context
- _logger_: always enabled

They don't require to be passed the `function` property.

## Middleware Signature

Middleware setup requires to pass an object called `middleware` to `startApp`:

```js
startApp({
    middleware: {
    },
})
```

Each middleware can have 3 properties:

- _function_ - setup function (optional). It can be an async or normal function:

```js
const function = async(app, config) => {
    app.context.usingFunction = true

    return async(ctx, next) => {
        await next()
        if (config.debug) {
            console.error(ctx.usingFunction)
        }
    }
}
```

- _config_ - will be passed to the setup function

```js
const config = {
    debug: process.env.NODE_DEBUG === 'idio',
}
```

- _use_ - always use this middleware, will do `app.use()`

All together, setting up a custom middleware looks like this:

```js
startApp({
    middleware: {
        logger, // included in standard lib
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
            config: { debug: process.env.NODE_DEBUG === 'idio' },
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
- _middleware_: all setup middleware map with keys as names passed to the
`startApp` method, and functions as values.

Now you can set up routes and assign middleware to them:

```js
startApp({
    // ...
})
.then((res) => {
    const { url, app, router, middleware } = res
    router.get('/', middleware.session, async (ctx) => {
        const n = ctx.session.views || 1
        ctx.session.views = n + 1
        ctx.body = `${n} views`
    })
    const routes = router.routes()
    app.use(routes)
    console.log(url) // http://localhost:5000
})
```

Congrats, you have your Koa2 server with database in `ctx.app.context`.

## Database API

_towrite_

---

(c) Sobesednik Media 2017
