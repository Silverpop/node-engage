
module.exports = (function() {

    var validator = require(__dirname + '/../validator');
    var Engage = require(__dirname + '/../engage-constants');

    function _pollJob(engage, jobId, maxWaitMinutes, deadline, cb, delay) {

        var now, nextDelay;

        engage.getJobStatus(jobId, function(err, job) {
            if (err) {
                cb('Failed to wait for Engage data job: ' + err);
            } else {
                switch (job.jobStatus) {

                    case Engage.JOB_STATUS.COMPLETE:
                        cb(null, job);
                        break;

                    case Engage.JOB_STATUS.WAITING:
                    case Engage.JOB_STATUS.RUNNING:

                        now = Date.now();

                        if (now >= deadline) {
                            cb('Engage data job is taking over ' + maxWaitMinutes + ' minutes to complete');
                        } else {

                            nextDelay = delay * 2;

                            if (nextDelay > 300000) {
                                nextDelay = 300000;
                            }

                            if (now + delay >= deadline) {
                                delay = deadline - now;
                            }

                            setTimeout(_pollJob, delay, engage, jobId, maxWaitMinutes, deadline, cb, nextDelay);
                        }

                        break;

                    case Engage.JOB_STATUS.FAILED:
                        //TODO: pull error details?
                        cb('Engage data job failed');
                        break;

                    case Engage.JOB_STATUS.CANCELLED:
                        cb('Engage data job was cancelled');
                        break;

                    default:
                        cb('Unrecognized data job status');
                }
            }
        });
    }

    function _waitForJob(engage, options, cb) {

        var args = validator.normalizeArgs(options, cb);

        options = validator.validateObject({
            jobId: {
                loneArg: true,
                required: true,
                assert: validator.assertPositiveInteger
            },
            maxWaitMinutes: {
                required: false,
                assert: validator.assertPositiveInteger,
                default: 480
            }
        }, args.options);
        cb = validator.validateCallback(args.cb);

        _pollJob(
            engage,
            options.jobId,
            options.maxWaitMinutes,
            Date.now() + options.maxWaitMinutes * 60000,
            cb,
            15000
        );
    };

    return _waitForJob;

})();

