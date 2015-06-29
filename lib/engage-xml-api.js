
var EngageXmlApi = function(engage, engageAuth) {

    var my = {};

    var validator = require(__dirname + '/validator');
    var fs = require('fs');
    var xml2js = require('xml2js');
    var js2xmlparser = require('js2xmlparser');

    var _engage = engage;
    var _engageAuth = engageAuth;
    var _apiMethods = {};

    function _buildXmlApiMethods() {

        var xmlApiPath = __dirname + '/xml-api/';

        fs.readdirSync(xmlApiPath).filter(function(file) { return file.match(/\.js$/); }).forEach(function(file) {

            var module, methodName;

            if (!file.match(/^[a-z]+(-[a-z]+)*\.js$/)) {
                throw new TypeError("XML API method module '" + file + "' has invalid name");
            }

            module = require(xmlApiPath + file);

            if (typeof module !== 'object' || typeof module.options !== 'object' || typeof module.generator !== 'function' || typeof module.result !== 'object') {
                throw new TypeError("XML API method module '" + file + "' has invalid structure");
            }

            methodName = file.replace(/\.js$/, '').replace(/-([a-z])/gi, function(s, c) { return c.toUpperCase(); });

            _buildXmlApiMethod(methodName, module.options, module.generator, module.result);

        });
    }

    function _buildXmlApiMethod(methodName, optionsTemplate, generator, resultTemplate) {

        var properMethodName = methodName.charAt(0).toUpperCase() + methodName.slice(1);

        if (_engage.getDebugLevel() >= 4) {
            console.log('building XML API method ' + methodName);
        }

        _apiMethods[methodName] = function(options, cb) {

            var requestParams;
            var args = validator.normalizeArgs(options, cb);

            options = validator.validateObject(optionsTemplate, args.options);
            cb = validator.validateCallback(args.cb);

            requestParams = generator(options);

            _makeXmlApiRequest(properMethodName, requestParams, function(err, res) {
                var result;
                if (err) {
                    process.nextTick(function() { cb(err); });
                } else {
                    try {
                        result = validator.validateObject(resultTemplate, res);
                        process.nextTick(function() { cb(null, result); });
                    } catch (e) {
                        process.nextTick(function() { cb('Unrecognized response from Engage: ' + e.message); });
                    }
                }
            });
        };
    }

    function _makeXmlApiRequest(methodName, requestParams, cb) {

        var request, postData;

        request = {Body: {}};
        request.Body[methodName] = requestParams;

        postData = js2xmlparser("Envelope", request, {useCDATA: true});

        _engageAuth.makeRequest('/XMLAPI', 'POST', 'text/xml; charset=UTF-8', postData, function(err, responseData) {

            var parser;

            if (err) {
                process.nextTick(function() { cb('Failed to make Engage XML API request: ' + err); });
            } else {
                parser = new xml2js.Parser({explicitArray: false});
                parser.parseString(responseData, function(err, response) {
                    if (err) {
                        process.nextTick(function() { cb('Failed to parse Engage XML API response: ' + err); });
                    } else {
                       _checkXmlApiResponse(response, cb);
                    }
                });
            }
        });
    }

    function _checkXmlApiResponse(response, cb) {

        var success = null;
        var badResponse = null;

        if (typeof response !== 'object') {
            badResponse = 'Engage XML API response is not an object';
        } else if (typeof response.Envelope !== 'object') {
            badResponse = 'Engage XML API response has no Envelope';
        } else if (typeof response.Envelope.Body !== 'object') {
            badResponse = 'Engage XML API response Envelope has no Body';
        } else if (typeof response.Envelope.Body.RESULT !== 'object') {
            badResponse = 'Engage XML API response Body has no RESULT';
        } else if (typeof response.Envelope.Body.RESULT.SUCCESS !== 'string') {
            badResponse = 'Engage XML API response RESULT has no SUCCESS value';
        }

        if (badResponse !== null) {
            process.nextTick(function() { cb(badResponse, response); });
        } else {
            success = response.Envelope.Body.RESULT.SUCCESS.toUpperCase();
            if (success !== 'TRUE' && success !== 'SUCCESS') {
                _handleXmlApiResponseFailure(response.Envelope.Body, cb);
            } else {
                delete(response.Envelope.Body.RESULT.SUCCESS);
                process.nextTick(function() { cb(null, response.Envelope.Body.RESULT); });
            }
        }
    }

    function _handleXmlApiResponseFailure(response, cb) {

        var error;

        if (typeof response.Fault !== 'object') {
            error = 'Unrecognized Engage XML API response';
        } else {
            if (typeof response.Fault.FaultString === 'string') {
                error = 'Engage XML API error: ' + response.Fault.FaultString;
            } else {
                error = 'Unspecified Engage XML API error';
            }

            if (typeof response.Fault.FaultCode === 'number') {
                error += ' (code: ' + response.Fault.FaultCode + ')';
            }
        }

        process.nextTick(function() { cb(error, response); });
    }

    my.augment = function(engage) {
        var apiMethod;
        for (apiMethod in _apiMethods) {
            if (_engage.getDebugLevel() >= 2) {
                console.log('adding XML API method ' + apiMethod);
            }
            engage[apiMethod] = _apiMethods[apiMethod];
        }
    };

    _buildXmlApiMethods();

    return my;
};

module.exports = EngageXmlApi;

