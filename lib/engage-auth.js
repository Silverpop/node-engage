
var EngageAuth = function(engage, hostname, clientId, clientSecret, refreshToken) {

    var my = {};

    var validator = require(__dirname + '/validator');
    var querystring = require('querystring');
    var https = require('https');

    var _engage = engage;
    var _hostname = hostname;
    var _clientId = clientId;
    var _clientSecret = clientSecret;
    var _refreshToken = refreshToken;
    var _refreshing = false;
    var _accessToken = null;
    var _expirationTime = 0;

    function _getApiUrl(path) {

        if (typeof path === 'undefined') {
            path = '';
        }

        if (path.substring(0, 1) !== '/') {
            path = '/' + path;
        }

        return 'https://' + _hostname + path;

    };

    function _getOAuthAccessToken(cb) {

        if (_refreshing === true) {
            if (_engage.getDebugLevel() >= 2) {
                console.log('Already refreshing access token, retrying in a moment');
            }
            setTimeout(_getOAuthAccessToken, 500, cb);
        } else if (_expirationTime < Date.now()) {
            if (_engage.getDebugLevel() >= 2) {
                console.log('Refreshing access token');
            }
            _refreshOAuthAccessToken(cb);
        } else {
            if (_engage.getDebugLevel() >= 2) {
                console.log('Using cached access token');
            }
            process.nextTick(function() { cb(null, _oAuthAccessToken); });
        }
    };

    function _refreshOAuthAccessToken(cb) {

        var postData = querystring.stringify({
            grant_type: 'refresh_token',
            client_id: _clientId,
            client_secret: _clientSecret,
            refresh_token: _refreshToken
        });

        var options = {
            hostname: _hostname,
            path: '/oauth/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
        };

        var req = https.request(options, function(res) {

            var buffer = '';

            if (_engage.getDebugLevel() >= 2) {
                console.log("STATUS: '" + res.statusCode + "'");
                console.log("HEADERS: '" + JSON.stringify(res.headers) + "'");
            }

            res.setEncoding('utf8');

            res.on('data', function(chunk) {
                if (_engage.getDebugLevel() >= 3) {
                    console.log("DATA CHUNK: '" + chunk + "'");
                }
                buffer += chunk;
            });

            res.on('end', function() {

                var parsed = null;
                var parseError = null;
                var error = null;

                _oAuthAccessToken = null;
                _expirationTime = 0;
                _refreshing = false;

                if (_engage.getDebugLevel() >= 2) {
                    console.log("RAW RESPONSE: '" + buffer + "'");
                }

                try {
                    parsed = JSON.parse(buffer);

                    if (_engage.getDebugLevel() >= 1) {
                        console.log('PARSED RESPONSE:');
                        console.log(parsed);
                    }
                } catch (e) {
                    parseError = e.message;
                }

                if (res.statusCode !== 200) {
                    error = 'HTTP status ' + res.statusCode + ': ';

                    if (parsed !== null && typeof parsed.error !== 'undefined') {
                        if (parsed.error === 'invalid_client') {
                            error += 'Invalid client';
                        } else if (parsed.error === 'invalid_token') {
                            error += 'Invalid token';
                        } else {
                            error += parsed.error;
                        }

                        if (typeof parsed.error_description !== 'undefined') {
                            error += ': ' + parsed.error_description;
                        }
                    } else {
                        error += "'" + buffer + "'";
                    }
                } else if (parsed === null) {
                    error = 'Failed to parse response JSON';
                    if (parseError !== null) {
                        error += ': ' + parseError;
                    }
                } else if (typeof parsed.access_token === 'undefined') {
                    error = 'Response did not contain access token';
                } else if (typeof parsed.expires_in === 'undefined') {
                    error = 'Response did not contain token expiration';
                } else if (!validator.isInteger(parsed.expires_in)) {
                    error = 'Response contained an invalid token expiration';
                } else {
                    if (_engage.getDebugLevel() >= 1) {
                        console.log('Received access token ' + parsed.access_token + ' expiring in ' + parsed.expires_in);
                    }
                    _oAuthAccessToken = parsed.access_token;
                    _expirationTime = Date.now() + 900 * parsed.expires_in;
                    if (_engage.getDebugLevel() >= 2) {
                        console.log('Received @: ' + Date.now());
                        console.log('Expiration: ' + _expirationTime);
                    }
                }

                process.nextTick(function() { cb(error, _oAuthAccessToken); });
            });
        });

        req.on('error', function(err) {
            if (_engage.getDebugLevel() >= 1) {
                console.log('REQUEST ERROR: ' + err.message);
            }
            _oAuthAccessToken = null;
            _expirationTime = 0;
            _refreshing = false;
            process.nextTick(function() { cb(err); });
        });

        if (_engage.getDebugLevel() >= 1) {
            console.log('RAW REQUEST: ');
            console.log(postData);
        }

        _refreshing = true;

        req.write(postData);
        req.end();

    };

    my.makeRequest = function(path, method, type, postData, cb) {

        _getOAuthAccessToken(function(err, token) {

            var headers = null;
            var options = null;
            var req = null;

            if (err !== null) {
                process.nextTick(function() { cb(err); });
                return;
            }

            headers = {
                'Authorization': 'Bearer ' + token,
                'Content-Type': type
            };

            if (postData !== null) {
                headers['Content-Length'] = postData.length;
            }

            options = {
                hostname: _hostname,
                path: path,
                method: method,
                headers: headers
            };

            req = https.request(options, function(res) {

                var buffer = '';

                if (_engage.getDebugLevel() >= 2) {
                    console.log("STATUS: '" + res.statusCode + "'");
                    console.log("HEADERS: '" + JSON.stringify(res.headers) + "'");
                }

                res.setEncoding('utf8');

                res.on('data', function(chunk) {
                    if (_engage.getDebugLevel() >= 3) {
                        console.log("DATA CHUNK: '" + chunk + "'");
                    }
                    buffer += chunk;
                });

                res.on('end', function() {

                    if (_engage.getDebugLevel() >= 2) {
                        console.log("RAW RESPONSE: '" + buffer + "'");
                    }

                    if (res.statusCode < 200 || res.statusCode > 299) {
                        process.nextTick(function() { cb('HTTP status ' + res.statusCode + ":\n'" + buffer + "'"); });
                        return;
                    }

                    process.nextTick(function() { cb(null, buffer); });

                });
            });

            req.on('error', function(err) {
                if (_engage.getDebugLevel() >= 1) {
                    console.log('REQUEST ERROR: ' + err.message);
                }
                process.nextTick(function() { cb(err); });
            });

            if (postData !== null) {

                if (_engage.getDebugLevel() >= 1) {
                    console.log('RAW REQUEST: ');
                    console.log(postData);
                }

                req.write(postData);

            }

            req.end();

        });
    };

    return my;
};

module.exports = EngageAuth;

