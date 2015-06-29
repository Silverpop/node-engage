
var Engage = require(__dirname + '/../engage-constants');

module.exports = (function() {

    var fs = require('fs');
    var csv = require('csv');
    var tmp = require('tmp');
    var validator = require(__dirname + '/../validator');

    function _processFile(exportFile, forEachCb, cb) {

        var input, parser;

        try {
            input = fs.createReadStream(exportFile);
            parser = csv.parse({columns: true});

            parser.on('readable', function() {
                var row;
                while (row = parser.read()) {
                    forEachCb(row);
                }
            });
            parser.on('error', function() {
                process.nextTick(function() { cb('Failed to read exported list data'); });
            });
            parser.on('end', function() {
                fs.unlinkSync(exportFile);
                process.nextTick(function() { cb(null); });
            });

            input.pipe(parser);
        } catch (e) {
            process.nextTick(function() { cb('Failed to read exported list data: ' + e.message); });
        }
    }

    function _downloadFile(engage, filePath, forEachCb, cb) {

        var tmpDir = tmp.dirSync({mode: 0700});
        var exportFile = tmpDir.name + '/export.csv';

        engage.downloadFile(filePath, exportFile, function(err) {
            if (err) {
                process.nextTick(function() { cb('Failed to download exported list: ' + err); });
            } else {
                _processFile(exportFile, forEachCb, cb);
            }
        });
    }

    function _waitForJob(engage, jobId, filePath, forEachCb, cb) {
        engage.waitForJob(jobId, function(err, job) {
            if (err) {
                process.nextTick(function() { cb('Failed to export list: ' + err); });
            } else {
                _downloadFile(engage, filePath, forEachCb, cb);
            }
        });
    }

    function _exportListForEach(engage, options, cb) {

        var args = validator.normalizeArgs(options, cb);
        var myOptions = validator.validateObject({
            forEachCallback: {
                required: false,
                assert: validator.assertCallback,
                default: function(rec) { console.log(JSON.stringify(rec)); }
            }
        }, args.options);
        var cb = validator.validateCallback(args.cb);

        args.options.exportFormat = Engage.EXPORT_FORMAT.CSV;

        engage.exportList(args.options, function(err, res) {

            if (err) {
                process.nextTick(function() { cb('Failed to export list: ' + err); });
            } else {
                _waitForJob(
                    engage,
                    res.jobId,
                    require('path').basename(res.filePath),
                    myOptions.forEachCallback,
                    cb
                );
            }
        });
    };

    return _exportListForEach;

})();

