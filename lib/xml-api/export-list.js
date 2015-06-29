
var Engage = require(__dirname + '/../engage-constants');
var validator = require(__dirname + '/../validator');

module.exports = {

    options: {

        listId: {
            loneArg: true,
            required: true,
            assert: validator.coercePositiveInteger
        },

        exportType: {
            required: false,
            assert: validator.assertString,
            default: Engage.EXPORT_TYPE.ALL
        },

        exportFormat: {
            required: false,
            assert: validator.assertString,
            default: Engage.EXPORT_FORMAT.CSV
        },

        dateStart: {
            required: false,
            assert: validator.assertString
        },

        dateEnd: {
            required: false,
            assert: validator.assertString
        },

        exportColumns: {
            required: false,
            assert: validator.assertScalarArray
        }
    },

    generator: function(options) {

        var params = {
            "LIST_ID": options.listId,
            "EXPORT_TYPE": options.exportType,
            "EXPORT_FORMAT": options.exportFormat
        };

        if (typeof options.dateStart !== 'undefined') {
            params["DATE_START"] = options.dateStart;
        }

        if (typeof options.dateEnd !== 'undefined') {
            params["DATE_END"] = options.dateEnd;
        }

        if (typeof options.exportColumns !== 'undefined') {
            params["EXPORT_COLUMNS"] = {"COLUMN": options.exportColumns};
        }

        return params;
    },

    result: {
        "JOB_ID": {
            rename: "jobId",
            required: true,
            assert: validator.coercePositiveInteger
        },
        "FILE_PATH": {
            rename: "filePath",
            required: true,
            assert: validator.assertString
        }
    }
};

