var Engage = require(__dirname + '/../engage-constants');
var validator = require(__dirname + '/../validator');

module.exports = {

    options: {

        listId: {
            required: true,
            assert: validator.coercePositiveInteger
        },

        email: {
            required: false,
            assert: validator.assertString
        },

        mailingId: {
            required: false,
            assert: validator.coercePositiveInteger
        },

        recipientId: {
            required: false,
            assert: validator.coercePositiveInteger
        },

        jobId: {
            required: false,
            assert: validator.coercePositiveInteger
        },

	    columns: {
            required: false,
            assert: validator.assertScalarHash
        }

    },

    generator: function(options) {
        var subnode, key;

        var params = {
            "LIST_ID": options.listId
		};

        if (typeof options.email !== 'undefined') {
            params["EMAIL"] = options.email;
        }

        if (typeof options.mailingId !== 'undefined') {
            params["MAILING_ID"] = options.mailingId;
        }

        if (typeof options.recipientId !== 'undefined') {
            params["RECIPIENT_ID"] = options.recipientId;
        }

        if (typeof options.jobId !== 'undefined') {
            params["JOB_ID"] = options.jobId;
        }

        if (typeof options.columns !== 'undefined') {
            subnode = [];
            for (key in options.columns) {
                subnode.push({
                    NAME: key,
                    VALUE: options.columns[key]
                });
            }
            params["COLUMN"] = subnode;
        }
        return params;
     },

    result: {}
};
