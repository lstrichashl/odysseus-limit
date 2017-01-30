var util = require('util');

function Store(){
    throw new Error('override this class')
}

util.inherits(Store, require('events').EventEmitter);

Store.prototype.checkRequestCount = function(key, onSucceed, onFailed){
    onFailed({message: "override this function"});
};

Store.prototype.addRequest = function(request, onSucceed, onFailed){
    onFailed({message: "override this function"});
};