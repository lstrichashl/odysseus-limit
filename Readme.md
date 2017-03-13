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

## Classes
* ``Store`` - interface that expose two functions:
    * addRequest - gets ``key`` and ``ttl``(time to live) in milliseconds. After the ttl expires the request is deleted
    * getRequestCount - gets all requests by key.
* ``RedisStore`` - implementation of ``Store``. The requests are save in redis. Redis is menaging the ttl issue.
* ``limit`` - An express middleware that limits requests.
    * options
        * ``store`` - instance of ``store``
        * ``key`` - function that gets express request, returns the request key.
        * ``amount`` - function that gets express request, returns the block limit for the specific key
        * ``ttl`` - function that gets express request, returns the ttl of the request.

## More Complex Example
```js
var OdysseusLimiter = require('odysseus-limit');
var store = new OdysseusLimiter.RedisStore({
    host: 'localhost',
    port: 6379
});
var options = {
    store: store,
    key: function (req) {
        return req.query.key;
    },
    amount: function(req){
        return 4;
    },
    ttl: function (req) {
        return 1000000;
    }
};
app.use(OdysseusLimiter.limit(options),
    function(req,res,next){
        res.status(200).send('Do\'h');
    });
app.listen(9638, function(){
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