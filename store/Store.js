var util = require('util');

function Store(){
    throw new Error('override this class')
}

util.inherits(Store, require('events').EventEmitter);

Store.prototype.getRequestCount = function(key, onSucceed, onFailed){
    onFailed({message: "override this function"});
};

Store.prototype.addRequest = function(request, onSucceed, onFailed){
    onFailed({message: "override this function"});
};

module.exports = Store;