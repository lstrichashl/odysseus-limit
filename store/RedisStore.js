var redis = require('redis');
var util = require('util');

function RedisStore(connection){
    var that = this;
    connection.retry_strategy = function(options){
        if(options.error.code = 'ECONNREFUSED'){
            return new Error('The server refused the connection');
        }
        if(options.total_retry_time > 5000){
            return new Error('Retry time exhausted');
        }
        if(options.time_connected > 10){
            return undefined;
        }
        return Math.max(options.attempt * 100, 5000);

    };
    this.client = redis.createClient(connection);
    this.client.on('error', function(error){
        that.emit('error');
    });
    this.client.on('ready', function(error){
        that.emit('ready');
    });
}

util.inherits(RedisStore, require('./Store'));

RedisStore.prototype.checkRequestCount = function(key, onSucceed, onFailed){
    var that = this;
    this.client.send_command('KEYS', [key+'*'], function(err, res){
        if(!err){
            onSucceed(res.length);
        }
        else{
            err.key = key;
            that.emit('error', err);
            onFailed(err);
        }
    });
};

RedisStore.prototype.addRequest = function(request, onSucceed, onFailed){
    var that = this;
    that.client.send_command('SETX', [request.key, request.expire, ''], function(err, res){
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