Supported Methods
=================

XML API Methods
---------------

Each of the XML API method calls corresponds directly to an XML API method as documented in the XML API Developer's Guide.

### addContactToContactList

parameter     | required? | type             | description
------------- | --------- | ---------------- | -----------
contactId     | no        | positive integer | Engage recipient id to add to contact list
contactListId | yes       | positive integer | Engage contact list id to have contact added to
columns       | no        | scalar hash      | Key column values identifying recipient to add to contact list

Either **contactId** or **columns** must be included.

Example: **contactId** approach, add recipient id 1234567 to contact list id 54321:

```js
engage.addContactToContactList({contactId: 1234567, contactListId: 54321}, function(err) {
    if (err) {
        console.log('Failed to add recipient to contact list');
    }
});
```

Example: **columns** approach, add the recipient with "Customer Num" 12345 and "Order Num" 678 to contact list id 54321:

```
engage.addContactToContactList({columns: {"Customer Num": 12345, "Order Num": 678}, contactListId: 54321}, function(err) {
    if (err) {
        console.log('Failed to add recipient to contact list');
    }
});
```

### addContactToProgram

parameter | required? | type             | description
--------- | --------- | ---------------- | -----------
contactId | yes       | positive integer | Engage recipient id to add to program
programId | yes       | positive integer | Engage program id to add recipient to

Example: add recipient id 1234567 to program id 54321:

```js
engage.addContactToProgram({contactId: 1234567, programId: 54321}, function(err) {
    if (err) {
        console.log('Failed to add recipient to program');
    }
});
```

### exportList

parameter     | required? | type                     | description
------------- | --------- | ------------------------ | -----------
listId        | yes       | positive integer         | Engage database id to export
exportType    | no        | **Engage.EXPORT_TYPE**   | Which recipients to export (default: **Engage.EXPORT_TYPE.ALL**)
exportFormat  | no        | **Engage.EXPORT_FORMAT** | Export file format (default: **Engage.EXPORT_FORMAT.CSV**)
dateStart     | no        | date string              | Recipient last modified date range start
dateEnd       | no        | date string              | Recipient last modified date range end
exportColumns | no        | string array             | Specific columns to export

Returns an object containing jobId and filePath for an Engage database export data job. The jobId can be polled with getJobStatus until complete. The filePath refers to a location in the corresponding Engage SFTP account.

Export list id 12345 in tab-delimited format:

```js
engage.exportList({listId: 12345, exportFormat: Engage.EXPORT_FORMAT.TAB}, function(err, job) {
    if (err) {
        console.log('Failed to export database');
    } else {
        console.log('Now we should wait for jobId ' + job.jobId + ' to export file ' + job.filePath);
        ...
    }
});
```

### getJobStatus

parameter | required? | type             | description
--------- | --------- | ---------------- | -----------
jobId     | yes       | positive integer | Engage data job id to get status of

Returns an object containing jobId, jobStatus, jobDescription, and optionally result parameters for a completed Engage data job. The jobStatus is an **Engage.JOB_STATUS** enum value indicating the state of the job, such as completed or running.

Get job status for data job id 12345:

```js
engage.getJobStatus(12345, function(err, job) {
    if (err) {
        console.log('Failed to get job status');
    } else if (job.jobStatus === Engage.JOB_STATUS.WAITING || job.jobStatus === Engage.JOB_STATUS.RUNNING) {
        console.log('Data job has not completed yet');
    } ...
});
```

### getListMetaData

[undocumented]

### getLists

[undocumented]

### selectRecipientData

[undocumented]

### updateRecipient

[undocumented]


Meta-Methods
------------

The meta-methods are special library methods built on top of XML API methods for abstraction and convenience. Some of them are also used internally by the library.

### exportListForEach

Takes same options as exportList, plus:

parameter       | required? | type     | description
--------------- | --------- | -------- | -----------
forEachCallback | no        | callback | Function to call for each recipient

Requires SFTP key to be configured in Engage object. Performs an exportList call, waits for the data job to complete, downloads the exported file, and calls the forEachCallback for each recipient record exported. (If no forEachCallback is specified, the default action is to output a JSON string version of each recipient.) After all records are iterated, the standard callback is called with no argument.

Example: create lookup hash of recipient ids to email addresses for opted-in recipients from list id 12345:

```js
var emailByRecipientId = {};

var exportOptions = {
    listId: 12345,
    exportType: Engage.EXPORT_TYPE.OPT_IN,
    exportColumns: ["Email", "RECIPIENT_ID"],
    forEachCallback: function(rec) {
        emailByRecipientId[rec.RECIPIENT_ID] = rec.Email;
    }
};

engage.exportListForEach(exportOptions, function(err) {
    if (err) {
        console.log('Failed to export list: ' + err);
    } else {
        console.log('All done');
        ... (do something with emailByRecipientId) ...
    }
});
```

### waitForJob

parameter      | required? | type             | description
-------------- | --------- | ---------------- | -----------
jobId          | yes       | positive integer | Engage data job id to wait for
maxWaitMinutes | no        | positive integer | Max number of minutes to wait (default: 480)

Uses getJobStatus to continually poll the status of a data job until it is complete, at which point callback will be called with the job passed just as if getJobStatus had been called on a complete job. If maxWaitMinutes minutes elapse before a complete status is returned, or if a failed or cancelled job status is returned, the function will pass an error to the callback.

Example: wait for data job id 12345:

```js
engage.waitForJob(12345, function(err, job) {
    if (err) {
        console.log('Job failed: ' + err);
    } else {
        console.log('Data job completed');
    }
});
```

