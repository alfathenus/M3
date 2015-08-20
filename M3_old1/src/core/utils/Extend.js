var M3Exted = M3Exted || (function  () {
    "use strict";
    return function() {
        var ret = {};
        if(arguments !== null && arguments.length > 0) {
            for(var i = 0; i < arguments.length; i++) {
                var elem;
                if(arguments[i] !== undefined && arguments[i] !== null) {
                    for(elem in arguments[i]) {
                        ret[elem] = arguments[i][elem];
                    }
                }
            }
        }
        return ret;
    };
})();

