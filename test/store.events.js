'use strict';
var OdysseusLimiter = require('../index');
var RedisStoreMock = require('./RedisStoreMock');
var redis = require('redis-mock');
var chai = require('chai');

chai.should();
var assert = chai.assert;

describe('store', function(){
    var store, redis_client;
    beforeEach(function () {
        store = new RedisStoreMock()
    });
    describe('events', function(){
        it('should inherit from Store', function(){
            assert.instanceOf(store, OdysseusLimiter.Store);
            assert.instanceOf(store, require('events').EventEmitter);
        });
        it('should emit ready when connected', function(done){
            redis_client = redis.createClient();
            var mystore = new RedisStoreMock
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
});