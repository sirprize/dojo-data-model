define([], function () {
    "use strict";
    
    return function (source, sourceProp, target, targetProp) {
        var s2t = source.watch(sourceProp, function (p, old, val) {
            target.set(targetProp, val);
        });
        
        var t2s = target.watch(targetProp, function (p, old, val) {
            source.set(sourceProp, val);
        });
        
        return {
            remove: function () {
                s2t.remove();
                t2s.remove();
            }
        }
    };
});