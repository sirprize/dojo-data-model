var profile = (function () {

    var miniExcludes = {
            "dojo-data-model/package": 1
        },
        amdExcludes = {},
        isTestRe = /\/tests\//
    ;

    return {
        resourceTags: {
            test: function (filename, mid) {
                return isTestRe.test(filename);
            },

            miniExclude: function (filename, mid) {
                return isTestRe.test(filename) || mid in miniExcludes;
            },

            amd: function (filename, mid) {
                return /\.js$/.test(filename) && !(mid in amdExcludes);
            },

            copyOnly: function (filename, mid) {
                return false;
            }
        }
    };
})();