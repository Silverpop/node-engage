
var validator = require(__dirname + '/../validator');

module.exports = {

    options: {

        tableId: {
            required: true,
            assert: validator.coercePositiveInteger
        },

        rows: {
            required: false,
            assert: validator.coerceArray
        },

    },

    generator: function(options) {

        var rows, row, cols, key;

        var params = {
            "TABLE_ID": options.tableId,
            "ROWS" : {'ROW': []}
        };
        if (typeof options.rows !== 'undefined') {
            rows = [];
            for (var i = 0; i < options.rows.length; i++) {
              row = options.rows[i];
              cols = [];
              for (key in row) {
                  cols.push({
                    '@': {
                      name: key
                    },
                    '#': row[key]
                  });
              }
              params['ROWS']['ROW'].push({'COLUMN':cols});
            }
        }

        return params;
    },

    result: {
      "FAILURES": {
          rename: 'failures',
          require: false,
          multi: true,
          assert: {
            "FAILURE": {
              rename: 'failure',
              require: false
            }
          }
      },
    }
};
