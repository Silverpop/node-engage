const Engage = require( __dirname + '/../engage-constants' );
const validator = require( __dirname + '/../validator' );

module.exports = {

  options: {

    dateStart: {
      required: true,
      assert: validator.coerceString,
    },
    dateEnd: {
      required: true,
      assert: validator.coerceString,
    },
    scheduled: {
      required: false,
      assert: validator.coerceBoolean,
    },
    sent: {
      required: false,
      assert: validator.coerceBoolean,
    },
    sending: {
      required: false,
      assert: validator.coerceBoolean,
    },
    includeTags: {
      required: false,
      assert: validator.coerceBoolean,
    },
    excludeZeroSent: {
      required: false,
      assert: validator.coerceBoolean,
    },
    excludeTestMailings: {
      required: false,
      assert: validator.coerceBoolean,
    }
  },
  generator: function( options ) {
    var subnode, key;

    const params = {
      'DATE_START': options.dateStart,
      'DATE_END': options.dateEnd,
      'SCHEDULED': options.scheduled,
      'SENT': options.sent,
      'SENDING': options.sending,
      'INCLUDE_TAGS': options.includeTags,
      'EXCLUDE_ZERO_SENT': options.excludeZeroSent,
      'EXCLUDE_TEST_MAILINGS': options.excludeTestMailings,
    };

    if ( typeof options.dateStart !== 'undefined' ) {
      params[ 'DATE_START' ] = options.dateStart;
    }

    if ( typeof options.dateEnd !== 'undefined' ) {
      params[ 'DATE_END' ] = options.dateEnd;
    }

    if ( typeof options.scheduled !== 'undefined' ) {
      params[ 'SCHEDULED' ] = options.scheduled;
    }

    if ( typeof options.sent !== 'undefined' ) {
      params[ 'SENT' ] = options.sent;
    }

    if ( typeof options.sending !== 'undefined' ) {
      params[ 'SENDING' ] = options.sending;
    }

    if ( typeof options.includeTags !== 'undefined' ) {
      params[ 'INCLUDE_TAGS' ] = options.includeTags;
    }

    if ( typeof options.excludeZeroSent !== 'undefined' ) {
      params[ 'EXCLUDE_ZERO_SENT' ] = options.excludeZeroSent;
    }

    if ( typeof options.excludeTestMailings !== 'undefined' ) {
      params[ 'EXCLUDE_TEST_MAILINGS' ] = options.excludeTestMailings;
    }

    return params;
  },

  result: {
    'Mailing': {
      rename: 'mailing',
      required: true,
      multi: true,
      assert: {
        'MailingId': {
          rename: 'mailingid',
          required: true,
          assert: validator.coerceInteger,
        },
        'Tags': {
          rename: 'tags',
          required: true,
          assert: {
            'Tag': {
              rename: 'tag',
              required: false,
              assert: validator.coerceScalarHash,
            }
          }
        }
      }
    }
  }
};
