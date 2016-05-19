
var validator = require(__dirname + '/../validator');

module.exports = {

    options: {

        listId: {
            required: true,
            assert: validator.coercePositiveInteger
        },

        sendAutoReply: {
            required: false,
            assert: validator.assertBoolean,
            default: false
        },

        autoHtml: {
            required: false,
            assert: validator.assertBoolean,
            default: true
        },

        columns: {
            required: false,
            assert: validator.assertScalarHash
        },

    },

    generator: function(options) {

        var subnode, key;

        var params = {
            "LIST_ID": options.listId,
            "SEND_AUTOREPLY": options.sendAutoReply,
            "AUTO_HTML": options.autoHtml
        };

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

    result: {
        "RecipientId": {
            rename: 'recipientId',
            require: true,
            assert: validator.coerceIntegerOrString
        },
    }
};
