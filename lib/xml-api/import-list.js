var Engage = require( __dirname + '/../engage-constants' );
var validator = require( __dirname + '/../validator' );

module.exports = {
  options: {
    mapFile: {
        required: true,
        assert: validator.assertString,
    },
    sourceFile: {
        required: true,
        assert: validator.assertString,
    },
    email: {
        required: false,
        assert: validator.assertString,
    },
    fileEncoding: {
        required: false,
        assert: validator.assertString,
    },
  },
  generator: function( options ) {
    return {
        "MAP_FILE": options.mapFile,
        "SOURCE_FILE": options.sourceFile,
        "EMAIL": options.email,
        "FILE_ENCODING": options.fielEncoding,
    };
  },
  result: {
    "JOB_ID": {
        rename: "jobId",
        required: true,
        assert: validator.coercePositiveInteger
    },
  },
};
