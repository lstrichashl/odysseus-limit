'use strict';
var OdysseusLimiter = require('../index');
var redis = require('redis-mock');
var chai = require('chai');

chai.should();
var assert = chai.assert;

describe('store', function(){
    var store, redis_client;
    beforeEach(function () {
        redis_client = redis.createClient();
        store = new OdysseusLimiter.RedisStore({client:redis_client});
    });
    describe('events', function(){
        it('should inherit from Store', function(){
            assert.instanceOf(store, OdysseusLimiter.Store);
            assert.instanceOf(store, require('events').EventEmitter);
        });
        it('should emit ready when connected', function(done){
            redis_client = redis.createClient();
            var mystore = new OdysseusLimiter.RedisStore({client:redis_client});
            mystore.once('ready', function (error) {
                done();
            });
        });
        it('should emit error when there is error', function(done){
            store.once('error', function (error) {
                done();
            });
            store.emit('error', {message: 'error-mock'});
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