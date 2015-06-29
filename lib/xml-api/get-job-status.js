
var Engage = require(__dirname + '/../engage-constants');
var validator = require(__dirname + '/../validator');

module.exports = {

    options: {
        jobId: {
            loneArg: true,
            required: true,
            assert: validator.coercePositiveInteger
        }
    },

    generator: function(options) {
        return {"JOB_ID": options.jobId};
    },

    result: {
        "JOB_ID": {
            rename: "jobId",
            required: true,
            assert: validator.coercePositiveInteger
        },
        "JOB_STATUS": {
            rename: "jobStatus",
            required: true,
            assert: function(val, name) {
                val = validator.coerceString(val, name);
                switch (val) {
                    case 'COMPLETE':
                        return Engage.JOB_STATUS.COMPLETE;
                    case 'WAITING':
                        return Engage.JOB_STATUS.WAITING;
                    case 'RUNNING':
                        return Engage.JOB_STATUS.RUNNING;
                    case 'ERROR':
                        return Engage.JOB_STATUS.FAILED;
                    case 'CANCELED':
                    case 'CANCELLED':
                    case 'CANCEL_PENDING':
                        return Engage.JOB_STATUS.CANCELLED;
                    default:
                        throw new TypeError("Unrecognized JOB_STATUS value '" + val + "' in response from GetJobStatus");
                }
            }
        },
        "JOB_DESCRIPTION": {
            rename: "jobDescription",
            required: true,
            assert: validator.coerceString
        },
        "PARAMETERS": {
            rename: "parameters",
            required: false,
            assert: function(val, name) {

                var paramArray, i, param;
                var params = {};
                var subVal = validator.validateObject({
                    "PARAMETER": {
                        required: true,
                        multi: true,
                        assert: {
                            "NAME": {required: true, assert: validator.assertString},
                            "VALUE": {required: true, assert: validator.assertString}
                        },
                        default: []
                    }
                }, val);

                paramArray = subVal.PARAMETER;

                for (i in paramArray) {
                    param = paramArray[i];
                    params[param.NAME.toLowerCase().replace(/_([a-z])/gi, function(s, c) { return c.toUpperCase(); })] = param.VALUE;
                }

                return params;
            }
        }
    }
};

