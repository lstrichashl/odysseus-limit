var TooManyRequestsError = function(key, error){
    this.message = "Too many requests in this time frame";
    Error.call(this, this.message);
    Error.captureStackTrace(this, this.constructor);
    this.name = 'TooManyRequests';
    if(error) this.inner = error;
};

TooManyRequestsError.prototype = Object.create(Error.prototype);
TooManyRequestsError.prototype.constructor = TooManyRequestsError;

module.exports = TooManyRequestsError;