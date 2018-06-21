var OdysseusLimiter = require('../index');
var express = require('express');
var request = require('supertest');

describe('limit', function(){
    var app;
    beforeEach(function(){
        app = express();
    });
    describe('defaults', function(){
        it('key should be general', (done) => {
            app.use(OdysseusLimiter.limit({
                amount: 2,
                ttl: 100
            }));
            app.get('/', function(req, res, next){
                res.status(200).json({status: 'ok'});
            });
            request(app)
                .get('/?key=general')
                .expect(200, function () {
                    request(app)
                        .get('/?key=general1')
                        .expect(200, function () {
                            request(app)
                                .get('/?key=general2')
                                .expect(429, done);
                        });
                });
        });
    });
});