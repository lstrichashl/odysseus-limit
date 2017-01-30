function middleware(req, res, next){
    var that = this,
        key = that.key(req),
        amount = that.amount(req),
        interval = that.interval(req);

    that.store.checkRequestCount(key,
        function(requestCount){
            if(amount > requestCount){
                that.store.addRequest({amount: amount, interval: interval},
                    next, next)
            }
            else {
                var error = new TooManyRequestsError(key);
                that.emit('TooManyRequests', key, amount, requestCount);
                res.status(4290).json(error);
            }
        }, next)
}

module.exports = function(options){
    if(!options.key){
        options.key = function(req){
            return req.connection.remoteAddress;
        }
    }
    if(!options.amount){
        options.amount = function(req){
            return 2;
        }
    }
    if(!options.interval){
        options.interval = function(req){
            return 5;
        }
    }
    return middleware.bind(options);
};