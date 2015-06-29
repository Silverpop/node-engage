
var EngageConstants = {

    augment: function(Engage) {

        Engage.VISIBILITY = {
            PRIVATE: 0,
            SHARED: 1
        };

        Engage.LIST_TYPE = {
            DATABASE: 0,
            QUERY: 1,
            DATABASE_CONTACT_QUERY: 2,
            TEST: 5,
            SEED: 6,
            SUPPRESSION: 13,
            RELATIONAL_TABLE: 15,
            CONTACT: 18
        };

        Engage.EXPORT_TYPE = {
            ALL: 'ALL',
            OPT_IN: 'OPT_IN',
            OPT_OUT: 'OPT_OUT',
            UNDELIVERABLE: 'UNDELIVERABLE'
        };

        Engage.EXPORT_FORMAT = {
            CSV: 'CSV',
            TAB: 'TAB',
            PIPE: 'PIPE'
        };

        Engage.JOB_STATUS = {
            COMPLETE: 0,
            WAITING: 1,
            RUNNING: 2,
            FAILED: 3,
            CANCELLED: 4
        };
    }
};

EngageConstants.augment(EngageConstants);

module.exports = EngageConstants;

