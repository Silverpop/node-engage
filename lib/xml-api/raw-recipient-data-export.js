var Engage = require(__dirname + '/../engage-constants');
var validator = require(__dirname + '/../validator');

module.exports = {

    options: {

        listId: {
            required: true,
            assert: validator.coercePositiveInteger
        },

        includeChildren: {
            required: false,
            assert: validator.assertBoolean,
            default: false
        },

        exportFileName: {
            required: false,
            assert: validator.assertString
        },

        email: {
            required: false,
            assert: validator.assertString
        },

        eventDateStart: {
            required: false,
            assert: validator.assertString
        },

        eventDateEnd: {
            required: false,
            assert: validator.assertString
        },

        sendDateStart: {
            required: false,
            assert: validator.assertString
        },

        sendDateEnd: {
            required: false,
            assert: validator.assertString
        },

        moveToFtp: {
            required: false,
            assert: validator.assertBoolean,
            default: false
        },

        allEventTypes: {
            required: false,
            assert: validator.assertBoolean,
            default: false
        },

        opens: {
            required: false,
            assert: validator.assertBoolean,
            default: false
        },

        clicks: {
            required: false,
            assert: validator.assertBoolean,
            default: false
        },

        optIns: {
            required: false,
            assert: validator.assertBoolean,
            default: false
        },

        optOuts: {
            required: false,
            assert: validator.assertBoolean,
            default: false
        }

    },

    generator: function(options) {
        var subnode, key;

        var params = {
            "LIST_ID": options.listId,
            "INCLUDE_CHILDREN": options.includeChildren,
            "EXPORT_FILE_NAME": options.exportFileName,
            "EMAIL": options.email,
            "MOVE_TO_FTP": options.moveToFtp,
            "ALL_EVENT_TYPES": options.allEventTypes,
            "OPENS": options.opens,
            "CLICKS": options.clicks,
            "OPTINS": options.optIns,
            "OPTOUTS": options.optOuts,
            "SEND_DATE_START": options.sendDateStart,
            "SEND_DATE_END": options.sendDateEnd,
            "EVENT_DATE_START": options.eventDateStart,
            "EVENT_DATE_END": options.eventDateEnd,
        };

        if (typeof options.listId !== 'undefined') {
            params["LIST_ID"] = options.listId;
        }

        if (typeof options.includeChildren !== 'undefined') {
            params["INCLUDE_CHILDREN"] = options.includeChildren;
        }

        if (typeof options.exportFileName !== 'undefined') {
            params["EXPORT_FILE_NAME"] = options.exportFileName;
        }

        if (typeof options.email !== 'undefined') {
            params["EMAIL"] = options.email;
        }

        if (typeof options.moveToFtp !== 'undefined') {
            params["MOVE_TO_FTP"] = options.moveToFtp;
        }

        if (typeof options.allEventTypes !== 'undefined') {
            params["ALL_EVENT_TYPES"] = options.allEventTypes;
        }

        if (typeof options.opens !== 'undefined') {
            params["OPENS"] = options.opens;
        }

        if (typeof options.clicks !== 'undefined') {
            params["CLICKS"] = options.clicks;
        }

        if (typeof options.optIns !== 'undefined') {
            params["OPTINS"] = options.optIns;
        }

        if (typeof options.optOuts !== 'undefined') {
            params["OPTOUTS"] = options.optOuts;
        }

        if (typeof options.sendDateStart !== 'undefined') {
            params["SEND_DATE_START"] = options.sendDateStart;
        }

        if (typeof options.sendDateEnd !== 'undefined') {
            params["SEND_DATE_END"] = options.sendDateEnd;
        }

        if (typeof options.eventDateStart !== 'undefined') {
            params["EVENT_DATE_START"] = options.eventDateStart;
        }

        if (typeof options.sendDateStart !== 'undefined') {
            params["EVENT_DATE_END"] = options.eventDateEnd;
        }


         return params;
     },

    result: {
       "MAILING": {
         rename: "mailing",
         required: true,
         assert: function(val, name) {
             var objVal = JSON.parse(JSON.stringify(val));
             var subVal = validator.validateObject({
                  "JOB_ID": {
                   rename: "jobId",
                   required: true,
                   assert: validator.coerceString
                  },
                  "FILE_PATH": {
                    rename:"filePath",
                    required:true,
                    assert: validator.coerceString
                  },
              default: []
             }, objVal);

             return subVal;
         }
       }
    }
};
