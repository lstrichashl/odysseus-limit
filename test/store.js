'use strict';
var OdysseusLimiter = require('../index');
var redis = require('redis');
var chai = require('chai');

chai.should();
var assert = chai.assert;

describe('store', function(){
    var store, app, redis_client;
    before(function () {
        redis_client = redis.createClient({host: 'localhost', port: 6379});
        store = new OdysseusLimiter.RedisStore({
            host: 'localhost',
            port: 6379
        });
    });
    beforeEach(function () {
        redis_client.send_command('flushall', function (err, res) {
            if(err) throw err;
        })
    });
    describe('events', function(){
        it('should inherit from Store', function(){
            assert.instanceOf(store, OdysseusLimiter.Store);
            assert.instanceOf(store, require('events').EventEmitter);
        });
        it('should emit connect when connected', function(done){
            var mystore = new OdysseusLimiter.RedisStore({
                host: 'localhost',
                port: 6379
            });
            mystore.once('ready', function (error) {
                done();
            });
        });
        it('should emit error when there is error', function(done){
            var mystore = new OdysseusLimiter.RedisStore({
                host: 'localhost',
                port: 6379
            });
            mystore.once('error', function (error) {
                done();
            });
            mystore.emit('error', {message: 'error-mock'});
        });
        it('should emit request when new request is entered', function(done){
            store.once('request', function (request) {
                request instanceof Object ? done(): done({message: 'error in request event'})
            });
            store.addRequest({key: 'limit.store.requestEvent', ttl: 1000000});
        });
    });
    describe('request count', function(){
        it('should return 0 requests', function(done){
            store.getRequestCount('store.consistent.0', function (count) {
                count.should.equal(0);
                done();
            }, done);
        });
        it('should return 1 request', function(done){
            store.addRequest({key: 'store.consistent.1', ttl: 1000000}, function () {
                store.getRequestCount('store.consistent.1', function (count) {
                    count.should.equal(1);
                    done();
                }, done);
            }, done);
        });
    });
});