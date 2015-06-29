
var Engage = require(__dirname + '/../engage-constants');
var validator = require(__dirname + '/../validator');

module.exports = {

    options: {
        visibility: {
            required: false,
            assert: validator.assertInteger,
            default: Engage.VISIBILITY.SHARED
        },
        listType: {
            required: false,
            assert: validator.assertInteger,
            default: Engage.LIST_TYPE.DATABASE
        },
        includeAllLists: {
            required: false,
            assert: validator.assertBoolean,
            default: true
        }
    },

    generator: function(options) {
        return {
            "VISIBILITY": options.visibility,
            "LIST_TYPE": options.listType,
            "INCLUDE_ALL_LISTS": options.includeAllLists
        };
    },

    result: {
        "LIST": {
            rename: 'list',
            required: true,
            multi: true,
            assert: {
                "ID": {
                    rename: 'id',
                    required: true,
                    assert: validator.coerceInteger
                },
                "NAME": {
                    rename: 'name',
                    required: true,
                    assert: validator.coerceString
                },
                "TYPE": {
                    rename: 'type',
                    required: true,
                    assert: validator.coerceInteger
                },
                "SIZE": {
                    rename: 'size',
                    required: true,
                    assert: validator.coerceInteger
                },
                "NUM_OPT_OUTS": {
                    rename: 'numOptOuts',
                    required: true,
                    assert: validator.coerceInteger
                },
                "NUM_UNDELIVERABLE": {
                    rename: 'numUndeliverable',
                    required: true,
                    assert: validator.coerceInteger
                },
                "LAST_MODIFIED": {
                    rename: 'lastModified',
                    required: true,
                    assert: validator.coerceString
                },
                "VISIBILITY": {
                    rename: 'visibility',
                    required: true,
                    assert: validator.coerceInteger
                },
                "PARENT_NAME": {
                    rename: 'parentName',
                    required: true,
                    assert: validator.coerceString
                },
                "USER_ID": {
                    rename: 'userId',
                    required: true,
                    assert: validator.coerceString
                },
                "PARENT_FOLDER_ID": {
                    rename: 'parentFolderId',
                    required: true,
                    assert: validator.coerceInteger
                },
                "IS_FOLDER": {
                    rename: 'isFolder',
                    required: true,
                    assert: validator.coerceBoolean
                },
                "FLAGGED_FOR_BACKUP": {
                    rename: 'flaggedForBackup',
                    required: true,
                    assert: validator.coerceBoolean
                },
                "SUPPRESSION_LIST_ID": {
                    rename: 'suppressionListId',
                    required: true,
                    assert: validator.coerceInteger
                }
            }
        }
    }
};

