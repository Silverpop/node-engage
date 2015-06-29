
var validator = require(__dirname + '/../validator');

module.exports = {

    options: {

        listId: {
            required: true,
            assert: validator.coercePositiveInteger
        },

        oldEmail: {
            required: false,
            assert: validator.assertString
        },

        recipientId: {
            required: false,
            assert: validator.coercePositiveInteger
        },

        encodedRecipientId: {
            required: false,
            assert: validator.assertString
        },

        visitorKey: {
            required: false,
            assert: validator.assertString
        },

        syncFields: {
            required: false,
            assert: validator.assertScalarHash
        },

        sendAutoReply: {
            required: false,
            assert: validator.assertBoolean,
            default: false
        },

        allowHtml: {
            required: false,
            assert: validator.assertBoolean,
            default: true
        },

        columns: {
            required: false,
            assert: validator.assertScalarHash
        },

        snoozeSettings: {
            required: false,
            assert: {
                snoozed: {
                    required: true,
                    assert: validator.assertBoolean
                },
                resumeSendDate: {
                    required: false,
                    assert: validator.assertString
                },
                daysToSnooze: {
                    required: false,
                    assert: validator.assertPositiveInteger
                }
            }
        }

    },

    generator: function(options) {

        var subnode, key;

        var params = {
            "LIST_ID": options.listId,
            "SEND_AUTOREPLY": options.sendAutoReply,
            "ALLOW_HTML": options.allowHtml
        };

        if (typeof options.oldEmail !== 'undefined') {
            params["OLD_EMAIL"] = options.oldEmail;
        }

        if (typeof options.recipientId !== 'undefined') {
            params["RECIPIENT_ID"] = options.recipientId;
        }

        if (typeof options.encodedRecipientId !== 'undefined') {
            params["ENCODED_RECIPIENT_ID"] = options.encodedRecipientId;
        }

        if (typeof options.visitorKey !== 'undefined') {
            params["VISITOR_KEY"] = options.visitorKey;
        }

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

        if (typeof options.snoozeSettings !== 'undefined') {

            subnode = {
                "SNOOZED": options.snoozeSettings.snoozed
            };

            if (typeof options.snoozeSettings.resumeSendDate !== 'undefined') {
                subnode["RESUME_SEND_DATE"] = options.snoozeSettings.resumeSendDate;
            }

            if (typeof options.snoozeSettings.daysToSnooze !== 'undefined') {
                subnode["DAYS_TO_SNOOZE"] = options.snoozeSettings.daysToSnooze;
            }

            params["SNOOZE_SETTINGS"] = subnode;
        }

        return params;
    },

    result: {
        "RecipientId": {
            rename: 'recipientId',
            require: true,
            assert: validator.coerceIntegerOrString
        },
        "ORGANIZATION_ID": {
            rename: 'organizationId',
            require: true,
            assert: validator.coerceString
        }
    }
};

