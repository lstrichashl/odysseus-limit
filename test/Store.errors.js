var OdysseusLimiter = require('../index');
var chai = require('chai');

var util = require('util');
function TestStore(){}
util.inherits(TestStore, OdysseusLimiter.Store);

describe('store', () => {
    describe('errors', () => {
        it('store should be override', (done)=>{
            var store;
            try{
                store = new OdysseusLimiter.Store();
            }
            catch(error){
                error.message.should.equal("override this class");
                done();
            }
        });
        it('getRequestCount should be override', (done)=>{
            var store = new TestStore();
            store.getRequestCount('test', ()=>{}, (error) => {
                error.message.should.equal("override this function");
                done();
            });
        });
        it('addRequest should be override', (done)=>{
            var store = new TestStore();
            store.addRequest('test', ()=>{}, (error) => {
                error.message.should.equal("override this function");
                done();
            });
        });
    });
});