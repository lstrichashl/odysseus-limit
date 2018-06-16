var OdysseusLimiter = require('../index');
var RedisStoreMock = require('./RedisStoreMock');
var chai = require('chai');

chai.should();
var assert = chai.assert;

[OdysseusLimiter.LocalStore, RedisStoreMock].forEach(function(Store){
    describe('store - ' + Store.name, function() {
        beforeEach(function () {
            store = new Store();
        });
        describe('request count', function(){
            it('should be 0 requests', function(done){
                store.getRequestCount('store.consistent.0', function (count) {
                    count.should.equal(0);
                    done();
                }, done);
            });
            it('should count only by my key', function(done){
                store.addRequest({key: 'store.consistent.2', ttl: 1000000});
                store.addRequest({key: 'store.consistent.1', ttl: 1000000}, function () {
                    store.getRequestCount('store.consistent.1', function (count) {
                        count.should.equal(1);
                        done();
                    }, done);
                }, done);
            });
            it('should count only not expired requests', function(done){
                store.addRequest({key: 'store.consistent.1', ttl: 1000000});
                store.addRequest({key: 'store.consistent.1', ttl: 20});
                store.addRequest({key: 'store.consistent.1', ttl: 50});
                store.addRequest({key: 'store.consistent.1', ttl: 1000000}, function () {}, done);
                setTimeout(() => {
                    store.getRequestCount('store.consistent.1', function (count) {
                        count.should.equal(2);
                        done();
                    }, done);
                }, 100);
            });
        });
    });
});