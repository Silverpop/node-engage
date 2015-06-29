
var validator = require(__dirname + '/../validator');

module.exports = {

    options: {

        programId: {
            required: true,
            assert: validator.coercePositiveInteger
        },

        contactId: {
            required: true,
            assert: validator.coercePositiveInteger
        }

    },

    generator: function(options) {
        return {
            "PROGRAM_ID": options.programId,
            "CONTACT_ID": options.contactId
        };
    },

    result: {}

};

