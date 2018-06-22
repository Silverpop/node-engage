var validator = require(__dirname + '/../validator');

module.exports = {

    options: {

        listId: {
            required: true,
            assert: validator.coercePositiveInteger
        },

        email: {
            required: true,
            assert: validator.assertString
        }
    },

    generator: function(options) {
        var subnode, key;

        var params = {
            "LIST_ID": options.listId,
            "EMAIL": options.email
        };

         return params;
     },

    result: {
      "SUCCESS": {
          rename: 'success',
          require: true,
          assert: validator.coerceBoolean
      },
      "ORGANIZATION_ID": {
          rename: 'organizationId',
          require: true,
          assert: validator.coerceString
      }
  }
};
