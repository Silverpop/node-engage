
var validator = require(__dirname + '/../validator');

module.exports = {

    options: {},

    generator: function(options) { return {} },

    result: {
        "USER_ID": {
            rename: 'userId',
            required: true,
            assert: validator.coerceString
        },
        "USER_NAME": {
            rename: 'userName',
            required: true,
            assert: validator.coerceString
        },
        "ORGANIZATION_ID": {
            rename: 'organizationId',
            required: true,
            assert: validator.coerceString
        },
        "ORGANIZATION_ID2": {
            rename: 'organizationId2',
            required: true,
            assert: validator.coerceInteger
        },
        "ORGANIZATION_NAME": {
            rename: 'organizationName',
            required: true,
            assert: validator.coerceString
        },
        "FIRST_NAME": {
            rename: 'firstName',
            required: true,
            assert: validator.coerceString
        },
        "LAST_NAME": {
            rename: 'lastName',
            required: true,
            assert: validator.coerceString
        },
        "LANGUAGE": {
            rename: 'language',
            required: true,
            assert: validator.coerceString
        },
        "TIME_ZONE": {
            rename: 'timeZone',
            required: true,
            assert: validator.coerceInteger
        },
        "TIME_ZONE_NAME": {
            rename: 'timeZoneName',
            required: true,
            assert: validator.coerceString
        },
        "FROM_NAME": {
            rename: 'fromName',
            required: true,
            assert: validator.coerceString
        },
        "FROM_ADDRESS": {
            rename: 'fromAddress',
            required: true,
            assert: validator.coerceString
        },
        "REPLYTO_ADDRESS": {
            rename: 'replyToAddress',
            required: true,
            assert: validator.coerceString
        },
        "CRM_LIST_ID": {
            rename: 'crmListId',
            required: true,
            assert: validator.coerceInteger
        },
        "ORG_ADMIN_RIGHT": {
            rename: 'orgAdminRight',
            required: true,
            assert: validator.coerceBoolean
        },
        "PUBLISH_TO_SHARED_RIGHT": {
            rename: 'publishToSharedRight',
            required: true,
            assert: validator.coerceBoolean
        },
        "PHONE": {
            rename: 'phone',
            required: true,
            assert: validator.coerceString
        },
        "SYS_ADMIN_RIGHT": {
            rename: 'sysAdminRight',
            required: true,
            assert: validator.coerceBoolean
        },
        "ALLOW_PERS_HEADERS": {
            rename: 'allowPersHeaders',
            required: true,
            assert: validator.coerceBoolean
        },
        "ALLOW_CONTENT_UPLOAD": {
            rename: 'allowContentUpload',
            required: true,
            assert: validator.coerceBoolean
        }
    }
};

