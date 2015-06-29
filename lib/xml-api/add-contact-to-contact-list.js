
var validator = require(__dirname + '/../validator');

module.exports = {

    options: {

        contactListId: {
            required: true,
            assert: validator.coercePositiveInteger
        },

        contactId: {
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
            "CONTACT_LIST_ID": options.contactListId
        };

        if (typeof options.contactId !== 'undefined') {
            params["CONTACT_ID"] = options.contactId;
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

