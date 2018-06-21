var TooManyRequestsError = require('./errors/TooManyRequestsError');
var LocalStore = require('./store/LocalStore');

function constParam(constant){
    return function(req){
        return constant;
    }
}

function setField(field){
    var newField;
    if(!field){
        throw "field must be specified";
    }
    else if(typeof field === 'number'){
        newField = constParam(field);
    }
    if(!newField){
        newField = field;
    }
    return newField;
}

module.exports = function(options){
    
    var key = options.key || constParam("general");
    var amount = setField(options.amount);
    var ttl = setField(options.ttl);
    var store = options.store || new LocalStore();

    return function middleware(req, res, next){
        var mykey = key(req);
        var myamount = amount(req);
        var myttl = ttl(req);
    
        store.getRequestCount(mykey,
            function(requestCount){
                if(myamount > requestCount){
                    store.addRequest({key: mykey, ttl: myttl},
                        function(){
                            next();
                        }, next);
                }
                else {
                    var error = new TooManyRequestsError(key);
                    store.emit('TooManyRequests', key, amount, requestCount);
                    res.status(429).json(error);
                }
            }, next)
    };
};