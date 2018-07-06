var Engage = require(__dirname + '/../engage-constants');
var validator = require(__dirname + '/../validator');

module.exports = {

    options: {

        listId: {
            required: true,
            assert: validator.coercePositiveInteger
        },

        createdFrom: {
            required: true,
            assert: validator.coercePositiveInteger
        },

        sendAutoReply: {
            required: false,
            assert: validator.assertBoolean
        },

        updateIfFound: {
            required: false,
            assert: validator.assertBoolean
        },

        allowHtml: {
            required: false,
            assert: validator.assertBoolean,
            default: true
        },

        visitorKey: {
            required: false,
            assert: validator.assertString
        },

        contactLists: {
            required: false,
            assert: validator.assertScalarArray
        },

        syncFields: {
            required: false,
            assert: validator.assertScalarHash
        },

        columns: {
            required: true,
            assert: validator.assertScalarHash
        }

    },

    generator: function(options) {
        var subnode, key;

        var params = {
            "LIST_ID": options.listId,
            "CREATED_FROM": options.createdFrom,
            "EXPORT_FILE_NAME": options.exportFileName,
            "SEND_AUTOREPLY": options.sendAutoReply,
            "UPDATE_IF_FOUND": options.updateIfFound,
            "ALLOW_HTML": options.allowHtml,
            "VISITOR_KEY": options.visitorKey,
            "CONTACT_LISTS": options.contactLists,
        };

        if (typeof options.syncFields !== 'undefined') {
            subnode = [];
            for (key in options.syncFields) {
                subnode.push({
                    NAME: key,
                    VALUE: options.syncFields[key]
                });
            }
            params["SYNC_FIELDS"] = {"SYNC_FIELD": subnode};
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

        if (typeof options.contactLists !== 'undefined') {
            subnode = [];
            for (key in options.contactLists) {
                subnode.push({
                    CONTACT_LIST_ID: options.contactLists[key]
                });
            }
            params["CONTACT_LISTS"] = subnode;
          }
         return params;
     },

    result: {
        "RecipientId": {
            rename: 'recipientId',
            require: true,
            assert: validator.coerceIntegerOrString
        }
    }
};
