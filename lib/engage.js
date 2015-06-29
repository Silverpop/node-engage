
var EngageConstants = require(__dirname + '/engage-constants');

var Engage = function(options) {

    var my = {};

    var validator = require(__dirname + '/validator');
    var EngageAuth = require(__dirname + '/engage-auth');
    var EngageXmlApi = require(__dirname + '/engage-xml-api');
    var EngageMetaApi = require(__dirname + '/engage-meta-api');
    var EngageSftp = require(__dirname + '/engage-sftp');

    var _debugLevel = 0;
    var _options = null;
    var _engageAuth = null;
    var _engageXmlApi = null;
    var _engageMetaApi = null;
    var _engageSftp = null;

    function _setOptions(options) {

        if (typeof options !== 'object') {
            throw new TypeError('Engage options object is required');
        }

        my.setDebugLevel(options.debugLevel);

        _options = validator.validateObject({
            pod: {required: true, assert: validator.assertEngagePod},
            oAuthClientId: {required: true, assert: validator.assertOAuthId},
            oAuthClientSecret: {required: true, assert: validator.assertOAuthId},
            oAuthRefreshToken: {required: true, assert: validator.assertOAuthId},
            sftpPrivateKeyPath: {required: true, assert: validator.assertReadableFile, default: null}
        }, options);

    }

    function _getApiHostname() {
        return 'api' + _options.pod + '.silverpop.com';
    }

    function _getSftpHostname() {
        return 'transfer' + _options.pod + '.silverpop.com';
    }

    my.setDebugLevel = function(debugLevel) {
        if (!validator.isInteger(debugLevel)) {
            _debugLevel = 0;
        } else {
            _debugLevel = debugLevel;
        }
    };

    my.getDebugLevel = function() {
        return _debugLevel;
    };

    // validate the contructor options
    _setOptions(options);

    // add the constants for instance access
    EngageConstants.augment(my);

    // establish the OAuth request engine
    _engageAuth = EngageAuth(
        my,
        _getApiHostname(),
        _options.oAuthClientId,
        _options.oAuthClientSecret,
        _options.oAuthRefreshToken
    );

    // establish the XML API methods and add them to instance
    _engageXmlApi = EngageXmlApi(my, _engageAuth);
    _engageXmlApi.augment(my);

    // establish the Meta API methods and add them to instance
    _engageMetaApi = EngageMetaApi();
    _engageMetaApi.augment(my);

    // establish SFTP connection if key provided
    if (_options.sftpPrivateKeyPath !== null) {
        _engageSftp = EngageSftp(my, _getSftpHostname(), _options.sftpPrivateKeyPath);
    }

    my.listDir = function(cb) {
        if (_engageSftp === null) {
            process.nextTick(function() { cb('No Engage SFTP configured'); });
            return;
        }

        _engageSftp.listDir(cb);
    };

    my.downloadFile = function(filename, destPath, cb) {
        if (_engageSftp === null) {
            process.nextTick(function() { cb('No Engage SFTP configured'); });
            return;
        }

        _engageSftp.downloadFile(filename, destPath, cb);
    };

    return my;
};

// add the constants for class access
EngageConstants.augment(Engage);

module.exports = Engage;

