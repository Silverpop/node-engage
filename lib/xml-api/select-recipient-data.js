
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

        returnContactLists: {
            required: false,
            assert: validator.assertBoolean,
            default: false
        },

        columns: {
            required: false,
            assert: validator.assertScalarHash
        }
    },

    generator: function(options) {

        var columns, field;

        var params = {
            "LIST_ID": options.listId
        };

        if (typeof options.email !== 'undefined') {
            params["EMAIL"] = options.email;
        }

        if (typeof options.recipientId !== 'undefined') {
            params["RECIPIENT_ID"] = options.recipientId;
        }

        if (typeof options.visitorKey !== 'undefined') {
            params["VISITOR_KEY"] = options.visitorKey;
        }

        if (typeof options.returnContactLists !== 'undefined') {
            params["RETURN_CONTACT_LISTS"] = options.returnContactLists;
        }

        if (typeof options.encodedRecipientId !== 'undefined') {
            params["ENCODED_RECIPIENT_ID"] = options.encodedRecipientId;
        }

        if (typeof options.columns !== 'undefined') {
            columns = [];
            for (field in options.columns) {
                columns.push({
                    NAME: field,
                    VALUE: options.columns[field]
                });
            }
            params["COLUMN"] = columns;
        }

        return params;
    },

    result: {
        "EMAIL": {
            rename: 'email',
            require: true,
            assert: validator.coerceString
        },
        "RecipientId": {
            rename: 'recipientId',
            require: true,
            assert: validator.coerceIntegerOrString
        },
        "EmailType": {
            rename: 'emailType',
            require: true,
            assert: validator.coerceInteger
        },
        "LastModified": {
            rename: 'lastModified',
            require: true,
            assert: validator.coerceString
        },
        "CreatedFrom": {
            rename: 'createdFrom',
            require: true,
            assert: validator.coerceInteger
        },
        "OptedIn": {
            rename: 'optedIn',
            require: true,
            assert: validator.coerceString
        },
        "OptedOut": {
            rename: 'optedOut',
            require: true,
            assert: validator.coerceString
        },
        "ResumeSendDate": {
            rename: 'resumeSendDate',
            require: true,
            assert: validator.coerceString
        },
        "ORGANIZATION_ID": {
            rename: 'organizationId',
            require: true,
            assert: validator.coerceString
        },
        "CRMLeadSource": {
            rename: 'crmLeadSource',
            require: true,
            assert: validator.coerceString
        },
        "COLUMNS": {
            rename: 'columns',
            require: true,
            assert: function(val, name) {

                var columnArray, i, column;
                var columns = {};
                var subVal = validator.validateObject({
                    "COLUMN": {
                        required: false,
                        multi: true,
                        assert: {
                            "NAME": {required: true, assert: validator.assertString},
                            "VALUE": {required: true, assert: validator.assertString}
                        },
                        default: []
                    }
                }, val);

                columnArray = subVal.COLUMN;

                for (i in columnArray) {
                    column = columnArray[i];
                    columns[column.NAME] = column.VALUE;
                }

                return columns;
            }
        },
        "CONTACT_LISTS": {
            rename: 'contactListIds',
            require: false,
            assert: function(val, name) {

                var contactListIds = [];

                var subVal = validator.validateObject({
                    "CONTACT_LIST_ID": {
                        required: false,
                        multi: true,
                        assert: validator.coerceInteger,
                        default: []
                    }
                }, val);

                return subVal.CONTACT_LIST_ID;
            },
            default: []
        }
    }
};

