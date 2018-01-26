var Engage = require(__dirname + '/../engage-constants');
var validator = require(__dirname + '/../validator');

module.exports = {

    options: {
        queryId: {
            required: true,
            assert: validator.assertInteger
        },
        email: {
            required: false,
            assert: validator.assertString
        }
    },

    generator: function (options) {
        var params = {
            "QUERY_ID": options.queryId
        };

        if (typeof options.email !== 'undefined') {
            params["EMAIL"] = options.email;
        }

        return params;
    },

    result: {
        "JOB_ID": {
            rename: 'jobId',
            required: true,
            assert: validator.coerceInteger
        }
    }

};

