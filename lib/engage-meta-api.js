
var EngageMetaApi = function() {

    var my = {};

    var fs = require('fs');

    var _metaMethods = {};

    function _buildMetaApiMethods() {

        var metaApiPath = __dirname + '/meta-api/';

        fs.readdirSync(metaApiPath).filter(function(file) { return file.match(/\.js$/); }).forEach(function(file) {

            var module, methodName;

            if (!file.match(/^[a-z]+(-[a-z]+)*\.js$/)) {
                throw new TypeError("Meta API method module '" + file + "' has invalid name");
            }

            module = require(metaApiPath + file);

            if (typeof module !== 'function') {
                throw new TypeError("Meta API method module '" + file + "' has invalid structure");
            }

            methodName = file.replace(/\.js$/, '').replace(/-([a-z])/gi, function(s, c) { return c.toUpperCase(); });

            _metaMethods[methodName] = module;

        });
    }

    my.augment = function(engage) {
        var methodName;
        for (methodName in _metaMethods) {
            if (engage.getDebugLevel() >= 2) {
                console.log('adding Meta API method ' + methodName);
            }
            engage[methodName] = _metaMethods[methodName].bind(null, engage);
        }
    };

    _buildMetaApiMethods();

    return my;
};

module.exports = EngageMetaApi;

