var EngageTransactApi = (engage, engageAuth) => {

    var my = {};

    var validator = require(__dirname + '/validator');
    var xml2js = require('xml2js');
    var querystring = require('querystring');
    var builder = require('xmlbuilder');

    var _engage = engage;
    var _engageAuth = engageAuth;

    let optionsTemplate = {
        campaignId: {
            required: true,
            assert: validator.coercePositiveInteger
        },
        transactionId: {
            required: false,
            assert: validator.coercePositiveInteger,
            default: false
        },
        showAllSendDetails: {
            required: false,
            assert: validator.assertBoolean,
            default: false
        },
        sendAsBatch: {
            required: false,
            assert: validator.assertBoolean,
            default: false
        },
        noRetryOnFailure: {
            required: false,
            assert: validator.assertBoolean,
            default: false
        },
        bodyType: {
            required: false,
            assert: validator.assertString,
            default: 'HTML'
        },
        saveColumns: {
            required: false,
            assert: validator.assertScalarHash
        },
        personalization: {
            required: false,
            assert: validator.assertScalarHash
        },
        email: {
            required: true,
            assert: validator.assertNonEmptyString
        }
    };

    let generateXmlBody = (options) => {

        var root = builder.create('XTMAILING', {encoding: 'UTF-8'});
        root.ele('CAMPAIGN_ID', options.campaignId);
        if (options.transactionId) {
            root.ele('TRANSACTION_ID', options.transactionId);
        }
        if (options.showAllSendDetails) {
            root.ele('SHOW_ALL_SEND_DETAILS', options.showAllSendDetails);
        }
        if (options.sendAsBatch) {
            root.ele('SEND_AS_BATCH', options.sendAsBatch);
        }
        if (options.noRetryOnFailure) {
            root.ele('NO_RETRY_ON_FAILURE', options.noRetryOnFailure);
        }

        var recipient = root.ele('RECIPIENT');
        recipient.ele('BODY_TYPE').dat(options.bodyType);
        recipient.ele('EMAIL').dat(options.email);

        // Add personalization fields
        for (var key in options.personalization) {
            if (options.personalization[key]) {
                var personalization = recipient.ele('PERSONALIZATION');
                personalization.ele('TAG_NAME').dat(key);
                personalization.ele('VALUE').dat(options.personalization[key]);
            }
        }

        // Add saveCols
        var saveCols = root.ele('SAVE_COLUMNS');
        for (var i = 0; i < options.saveColumns.length; i++) {
            if (options.saveColumns[i]) {
                saveCols.ele('COLUMN_NAME').dat(options.saveColumns[i]);
            }
        }

        if (_engage.getDebugLevel() >= 2) {
            console.log('Pretty XML body:');
            console.log(root.end({pretty: true}));
        };

        return root.end({
            // Pretty formatting inserts spaces that cause failures.
            // Is has to be disabled
            pretty: false
        });
    };

    var _handleXmlApiResponseFailure = (response, cb) => {

        var error;

        if (typeof response !== 'object') {
            error = 'Unrecognized Engage Transact API response';
        } else {
            if (typeof response.ERROR_STRING === 'string') {
                error = 'Engage Transact API error: ' + response.ERROR_STRING;
            } else {
                error = 'Unspecified Engage Transact API error';
            }
            if (typeof response.ERROR_CODE === 'string') {
                error += ' (code: ' + response.ERROR_CODE + ')';
            }

            if (typeof response.RECIPIENT_DETAIL === 'object' && typeof response.RECIPIENT_DETAIL.ERROR_STRING === 'string') {
                error = 'Engage Transact API error: ' + response.RECIPIENT_DETAIL.ERROR_STRING;
            }

        }

        process.nextTick(() => {
            cb(error);
        });
    };

    var _makeXmlApiRequest = (requestParams, cb) => {

        var request,
            postData;

        postData = querystring.stringify({xml: requestParams});

        var _checkXmlApiResponse = (response, cb) => {

            var errors = null;
            var errorCode = null;
            var badResponse = null;

            if (typeof response !== 'object') {
                badResponse = 'Engage Transact API response is not an object';
            } else if (typeof response.XTMAILING_RESPONSE !== 'object') {
                badResponse = 'Engage Transact API response has an unexpected form';
            }
            if (badResponse !== null) {
                process.nextTick(() => {
                    cb(badResponse);
                });
            } else {
                errors = response.XTMAILING_RESPONSE.NUMBER_ERRORS;
                errorCode = response.XTMAILING_RESPONSE.ERROR_CODE;
                if (errors !== '0' || errorCode !== '0') {
                    _handleXmlApiResponseFailure(response.XTMAILING_RESPONSE, cb);
                } else {
                    process.nextTick(() => {
                        cb(null, response);
                    });
                }
            }
        };

        _engageAuth.makeRequest('/XTMail', 'POST', 'application/x-www-form-urlencoded; charset=UTF-8', postData, (err, responseData) => {

            var parser;

            if (err) {
                process.nextTick(() => {
                    cb('Failed to make Engage Transact API request: ' + err);
                });
            } else {
                parser = new xml2js.Parser({explicitArray: false});
                parser.parseString(responseData, (err, response) => {
                    if (err) {
                        process.nextTick(() => {
                            cb('Failed to parse Engage Transact API response: ' + err);
                        });
                    } else {
                        _checkXmlApiResponse(response, cb);
                    }
                });
            }
        });
    };

    let executeTransact = (options, cb) => {

        var requestParams;
        var args = validator.normalizeArgs(options, cb);
        options = validator.validateObject(optionsTemplate, args.options);
        cb = validator.validateCallback(args.cb);

        requestParams = generateXmlBody(options);

        let result = {};
        _makeXmlApiRequest(requestParams, (err, res) => {
            var result;
            if (err) {
                process.nextTick(() => {
                    cb(err, res);
                });
            } else {
                try {
                    process.nextTick(() => {
                        cb(null, res);
                    });
                } catch (e) {
                    process.nextTick(() => {
                        cb('Unrecognized response from Engage: ' + e.message);
                    });
                }
            }
        });
    };

    my.augment = (engage) => {
        if (_engage.getDebugLevel() >= 2) {
            console.log('Adding Transact API');
        }
        engage.executeTransact = executeTransact;
    };

    return my;
};

module.exports = EngageTransactApi;
