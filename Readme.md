# Odysseus Limiter

  [![NPM Version][npm-image]][npm-url]
  [![Linux Build][travis-image]][travis-url]
  [![Test Coverage][coveralls-image]][coveralls-url]

Throttle limiting requests middleware for express apps.
Can be backed by redis for maintainable and scalable apps.

## Installation
```bash
$ npm install odysseus-limit
```

## Examples

In the example below, after exceed 100 requests in 10 seconds, it will not proceed to next().
Each requests have time to live of 10 seconds. So, after 10 seconds from the first request, the limiter will proceed to next():
```js
let OdysseusLimiter = require('odysseus-limit');

app.use(OdysseusLimiter.limit({amount: 100, ttl: 10000},
    (req, res, next) => {
        res.status(200).send('hello world');
    });
```

You can block requests by key. Meaning that if requests with same key where exceed the rate specified, all next requests form the same key will be blocked (until ttl of some request will expire). For example:
```js
let OdysseusLimiter = require('odysseus-limit');
let options = {
    key: (req) => { // req = requet express object
        return req.body.username;
    },
    amount: 100,
    ttl: 10000
};
app.use(OdysseusLimiter.limit(options);
```

And here you can block by IP:
```js
let OdysseusLimiter = require('odysseus-limit');
let options = {
    key: (req) => {
        return req.connection.remoteAddress;
    },
    amount: 100,
    ttl: 10000
};
app.use(OdysseusLimiter.limit(options);
```

Manage requets in redis for higher scalability:
```js
let OdysseusLimiter = require('odysseus-limit');
let options = {
    store: new OdysseusLimiter.RedisStore({
        host: 'localhost',
        port: 6379
    });
    amount: 100,
    ttl: 10000
};
app.use(OdysseusLimiter.limit(options);
```

## Classes
* ``LocalStore`` - The requests save in memory.
* ``RedisStore`` - implementation of ``Store``. The requests are save in redis.
    * options:
        * ``host`` - host of redis
        * ``port`` - port of redis
        * ``client`` - predefined redis client
* ``limit`` - An express middleware that limits requests.

### limit middleware options:

| Property  | Default   | Description |
|-----------|-----------|-------------|
| amount      | no default | as noted above |
| ttl      | no default | as noted above |
| store      | ``LocalStore`` | where the requests are managed |
| key      | 'general' | give each request a key and throttle by that key |


## More Complex Example
```js
let OdysseusLimiter = require('odysseus-limit');
let store = new OdysseusLimiter.RedisStore({
    host: 'localhost',
    port: 6379
});
let options = {
    store: store,
    key: (req) => {
        return req.body.username;
    },
    amount: (req) => {
        return req.body.isAdmin ? 1000 : 50;
    },
    ttl: (req) => {
        return req.body.isAdmin ? 10 : 10000;
    }
};
app.use(OdysseusLimiter.limit(options),
    (req, res, next) => {
        res.status(200).send('Do\'h');
    });
app.listen(9638, () => {
    console.log('Start listening to port 9638');
});
```

## Test
The tests are written with mocha, supertest and chai under the folder 'test'

Run tests with:
```bash
npm test
```


## Features
* Robust limiting.
* Highly scalable.
* Support limiting multiple routes and services.
* Open for customisation (store, key, amount and ttl).


[npm-image]: https://img.shields.io/npm/v/odysseus-limit.svg
[npm-url]: https://npmjs.org/package/odysseus-limit
[travis-image]: https://img.shields.io/travis/lstrichashl/odysseus-limit/master.svg
[travis-url]: https://travis-ci.org/lstrichashl/odysseus-limit
[coveralls-image]: https://img.shields.io/coveralls/lstrichashl/odysseus-limit/master.svg
[coveralls-url]: https://coveralls.io/r/lstrichashl/odysseus-limit?branch=master
