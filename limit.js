var TooManyRequestsError = require('./errors/TooManyRequestsError');
var LocalStore = require('./store/LocalStore');

function middleware(req, res, next){
    var that = this,
        key = that.key(req),
        amount = that.amount(req),
        ttl = that.ttl(req);

    that.store.getRequestCount(key,
        function(requestCount){
            if(amount > requestCount){
                that.store.addRequest({key: key, ttl: ttl},
                    function(){
                        next();
                    }, next);
            }
            else {
                var error = new TooManyRequestsError(key);
                that.store.emit('TooManyRequests', key, amount, requestCount);
                res.status(429).json(error);
            }
        }, next)
}

function constParam(constant){
    return function(req){
        return constant;
    }
}

function setKey(key){
    if(!key){
        key = constParam("general")
    }
    else{
        if(key === "ip"){
            key = function(req){
                return req.connection.remoteAddress;
            }
        }
        else if(typeof key === 'string'){
            key = constParam(key);
        }
    }

    return key;
}

function setField(field){
    var newField;
    if(!field){
        throw "amount must be specified";
    }
    else if(typeof field === 'number'){
        newField = constParam(field);
    }
    if(!newField){
        newField = field;
    }
    return newField;
}

function setStore(store){
    if(!store){
        return new LocalStore();
    }
    return store;
}

function initParams(options){
    var p = {
        key: setKey(options.key),
        amount: setField(options.amount),
        ttl: setField(options.ttl),
        store: setStore(options.store)
    };
    Object.assign(options, p);
    return options;
}

module.exports = function(options){
    params = initParams(options);
    return middleware.bind(params);
};