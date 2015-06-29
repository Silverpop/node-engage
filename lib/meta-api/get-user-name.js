
module.exports = (function() {

    var validator = require(__dirname + '/../validator');
    var _userName = null;
    var _fetching = false;

    function _getUserName(engage, cb) {

        cb = validator.validateCallback(cb);

        if (_userName !== null) {
            process.nextTick(function() { cb(null, _userName); });
        } else if (_fetching === true) {
            setTimeout(_getUserName, 500, engage, cb);
        } else {
            _fetching = true;
            engage.loadUserProfile(function (err, profile) {
                _fetching = false;
                if (err) {
                    process.nextTick(function() { cb('Failed to load user profile: ' + err); });
                } else {
                    _userName = profile.userName;
                    process.nextTick(function() { cb(null, _userName); });
                }
            });
        }
    };

    return _getUserName;

})();

