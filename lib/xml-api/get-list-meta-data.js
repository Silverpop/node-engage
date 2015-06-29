
var validator = require(__dirname + '/../validator');

module.exports = {

    options: {
        listId: {
            loneArg: true,
            required: true,
            assert: validator.coercePositiveInteger
        }
    },

    generator: function(options) {
        return {"LIST_ID": options.listId};
    },

    result: {
        "ID": {
            rename: 'id',
            require: true,
            assert: validator.coerceInteger
        },
        "NAME": {
            rename: 'name',
            require: true,
            assert: validator.coerceString
        },
        "TYPE": {
            rename: 'type',
            require: true,
            assert: validator.coerceInteger
        },
        "SIZE": {
            rename: 'size',
            require: true,
            assert: validator.coerceInteger
        },
        "NUM_OPT_OUTS": {
            rename: 'numOptOuts',
            require: true,
            assert: validator.coerceInteger
        },
        "NUM_UNDELIVERABLE": {
            rename: 'numUndeliverable',
            require: true,
            assert: validator.coerceInteger
        },
        "LAST_MODIFIED": {
            rename: 'lastModified',
            require: true,
            assert: validator.coerceString
        },
        "LAST_CONFIGURED": {
            rename: 'lastConfigured',
            require: true,
            assert: validator.coerceString
        },
        "CREATED": {
            rename: 'created',
            require: true,
            assert: validator.coerceString
        },
        "VISIBILITY": {
            rename: 'visibility',
            require: true,
            assert: validator.coerceInteger
        },
        "USER_ID": {
            rename: 'userId',
            require: true,
            assert: validator.coerceString
        },
        "ORGANIZATION_ID": {
            rename: 'organizationId',
            require: true,
            assert: validator.coerceString
        },
        "OPT_IN_FORM_DEFINED": {
            rename: 'optInFormDefined',
            require: true,
            assert: validator.coerceBoolean
        },
        "OPT_OUT_FORM_DEFINED": {
            rename: 'optOutFormDefined',
            require: true,
            assert: validator.coerceBoolean
        },
        "PROFILE_FORM_DEFINED": {
            rename: 'profileFormDefined',
            require: true,
            assert: validator.coerceBoolean
        },
        "OPT_IN_AUTOREPLY_DEFINED": {
            rename: 'optInAutoreplyDefined',
            require: true,
            assert: validator.coerceBoolean
        },
        "PROFILE_AUTOREPLY_DEFINED": {
            rename: 'profileAutoreplyDefined',
            require: true,
            assert: validator.coerceBoolean
        },
        "COLUMNS": {  //TODO: break down columns further
            rename: 'columns',
            require: true
        },
        "KEY_COLUMNS": {  //TODO: break down columns further
            rename: 'keyColumns',
            require: true
        }
    }
};

