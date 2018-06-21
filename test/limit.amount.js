var express = require('express');
var request = require('supertest');
var redis = require('redis-mock');
var OdysseusLimiter = require('../index');
var assert = require('assert');

describe('limit', function(){
    var store, app;
    var options;
    before(function(){
        store = new OdysseusLimiter.LocalStore();
    });
    beforeEach(function(){
        app = express();
        options = {
            store: store,
            key: function (req) {
                return req.query.key;
            },
            amount: function(req){
                return 0;
            },
            ttl: function (req) {
                return 1000000;
            }
        };
    });
    describe('.amount', function(){
        describe('change requests amount', function(){
            it('should block after 0 requests', function(done){
                app.use(OdysseusLimiter.limit(options));
                app.get('/', function(req, res, next){
                    res.status(200).json({status: 'ok'});
                });
                request(app)
                    .get('/?key=limit.amount.blockAfter0')
                    .expect(429, done);

            });
            it('should block after 1 requests', function(done){
                var calls = 0;
                options.amount = function (req) {
                        return 1;
                    };
                app.use(OdysseusLimiter.limit(options));
                app.get('/', function(req, res, next){
                    res.status(200).json({status: 'ok'});
                });
                request(app)
                    .get('/?key=limit.amount.blockafter1')
                    .expect(200, function () {
                        request(app)
                            .get('/?key=limit.amount.blockafter1')
                            .expect(429, done);
                    });
            });
        });
        describe('defaults', function(){
            it('amount must be specified', function(done){
                options.amount = undefined;
                try{
                    OdysseusLimiter.limit(options);
                }
                catch(e){
                    if(e == "field must be specified"){
                        done();
                    }
                }
            });
        });
    });
});

function loader(app, key, calls, limit, done) {
    if(calls < limit){
        request(app)
            .get('/?key=' + key)
            .expect(200, function (error) {
                if(error) throw error;
                loader(app, key, calls + 1, limit);
            });
    }
    else{
        request(app)
            .get('/?key=' + key)
            .expect(429, done);
    }
}