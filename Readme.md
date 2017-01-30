# Odysseus Limiter
Throttle limiting requests middleware for express apps.
Backed by redis for maintainable and scalable apps.

## Example
```js
var OdysseusLimiter = require('odysseus-limit');

var store = new OdysseusLimiter.RedisStore({
    host: localhost,
    port: 6793
});

app.use(OdysseusLimiter.limit({store: store});
```

## Installation
```bash
$ npm install odysseus-limit
```

## Features
* Robust limiting