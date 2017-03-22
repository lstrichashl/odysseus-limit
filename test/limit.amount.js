var express = require('express');
var  request = require('supertest');
var redis = require('redis-mock');
var OdysseusLimiter = require('../index');

describe('limit', function(){
    var store, app;
    var options, redis_client;
    before(function(){
        redis_client = redis.createClient();
        store = new OdysseusLimiter.RedisStore({
            client: redis_client
        });
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
        redis_client.flushall(function (err, res) {
            if(err) throw err;
        })
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
                    .get('/?key=limit.amount.blockafter13')
                    .expect(200, function () {
                        request(app)
                            .get('/?key=limit.amount.blockafter13')
                            .expect(429, done);
                    });
            });
        });
    });
});