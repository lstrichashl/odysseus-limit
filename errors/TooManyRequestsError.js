var TooManyRequestsError = function(key, error){
    Error.call(this, message);
    Error.captureStackTrace(this, this.constructor);
    this.name = 'TooManyRequests';
    this.message = "Too many requests in this time frame";
    if(error) this.inner = error;
};

TooManyRequestsError.prototype = Object.create(Error.prototype);
TooManyRequestsError.prototype.constructor = TooManyRequestsError;

module.exports = TooManyRequestsError;