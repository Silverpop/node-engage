
module.exports = (function() {

    var validator = require(__dirname + '/../validator');
    var _organizationName = null;
    var _fetching = false;

    function _getOrganizationName(engage, cb) {

        cb = validator.validateCallback(cb);

        if (_organizationName !== null) {
            process.nextTick(function() { cb(null, _organizationName); });
        } else if (_fetching === true) {
            setTimeout(_getOrganizationName, 500, engage, cb);
        } else {
            _fetching = true;
            engage.loadUserProfile(function (err, profile) {
                _fetching = false;
                if (err) {
                    process.nextTick(function() { cb(err); });
                } else {
                    _organizationName = profile.organizationName;
                    process.nextTick(function() { cb(null, _organizationName); });
                }
            });
        }
    };

    return _getOrganizationName;

})();

