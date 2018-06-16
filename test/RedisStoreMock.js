var RedisStore = require('../store/RedisStore');

var redis = require('redis-mock');
var util = require('util');

class RedisStoreMock extends RedisStore{
    constructor(){
        super({client:redis.createClient()});
    }
}

module.exports = RedisStoreMock;