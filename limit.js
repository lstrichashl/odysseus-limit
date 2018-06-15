var TooManyRequestsError = require('./errors/TooManyRequestsError');

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
    var newkey;
    if(!key){
        newkey = constParam("general")
    }
    else{
        if(key === "ip"){
            newkey = function(req){
                return req.connection.remoteAddress;
            }
        }
        else if(typeof key === 'string'){
            newkey = constParam(key);
        }
    }

    return newkey;
}

function setField(field){
    var newField;
    if(!field){
        throw new error("should specify amount");
    }
    else if(typeof field === 'number'){
        newField = constParam(field);
    }
    if(!newField){
        newField = field;
    }
    return newField;
}

function initParams(options){
    return
        Object.assign(
            {
                key: setKey(options.key),
                amount: setField(options.amount),
                ttl: setField(options.ttl)
            },
            options);
}

module.exports = function(amount, ttl, options){
    var params = {};
    if(typeof amount == "object"){
        params = initParams(amount);
    }
    else{
        options.amount = amount;
        options.ttl = ttl;
        params = initParams(options);
    }
    return middleware.bind(params);
};