var redis = require('redis');
var util = require('util');

function RedisStore(options){
    var that = this;
    if(options.client){
        this.client = options.client;
    } else {
        options.retry_strategy = function (options) {
            if (options.error.code = 'ECONNREFUSED') {
                return new Error('The server refused the connection');
            }
            if (options.total_retry_time > 5000) {
                return new Error('Retry time exhausted');
            }
            if (options.time_connected > 10) {
                return undefined;
            }
            return Math.max(options.attempt * 100, 5000);

        };
        this.client = redis.createClient(options);
    }
    this.client.on('error', function(error){
        that.emit('error');
    });
    this.client.on('ready', function(error){
        that.emit('ready');
    });
}

util.inherits(RedisStore, require('./Store'));

RedisStore.prototype.getRequestCount = function(key, onSucceed, onFailed){
    var that = this;
    var now = Date.now();
    that.client.ZREMRANGEBYSCORE([key, '-inf', now], function(err, res){
        if(!err) {
            that.client.ZCARD([key], function (err, res) {
                if (!err) {
                    onSucceed(res);
                }
                else{
                    err.key = key;
                    that.emit('error', err);
                    onFailed(err);
                }
            });
        }
        else {
            err.key = key;
            that.emit('error', err);
            onFailed(err);
        }
    });
};

RedisStore.prototype.addRequest = function(request, onSucceed, onFailed){
    var that = this;
    var now = Date.now();
    that.client.ZADD([request.key, now + request.ttl, now], function(err, res){
        if(!err){
            that.emit('request', request);
            onSucceed(res);
        }
        else {
            that.emit('error', err);
            onFailed(err);
        }
    });
};

module.exports = RedisStore;