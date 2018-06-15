var util = require('util');

function LocalStore(){
    this.queues = {};
}

util.inherits(LocalStore, require('./Store'));

LocalStore.prototype.getRequestCount = function(key, onSucceed, onFailed){
    onSucceed(this.queues[key].length);
}

LocalStore.prototype.addRequest = function(request, onSucceed, onFailed){
    var thisQueue = this.queues;
    this.queues[request.key] = this.queues[request.key] || [];
    this.queues[request.key].push(request.key);
    setTimeout(() => {
        thisQueue[request.key].pop();
    }, request.ttl);
    onSucceed('ok');
}

module.exports = LocalStore;