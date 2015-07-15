Library Usage
=============

Constructing the Engage Object
------------------------------

At a bare minimum to use this library, you need an Engage pod number, OAuth Client Id, OAuth Client Secret, and OAuth Refresh Token. (Please see the file [preparation.md](docs/preparation.md) for instructions on establishing these credentials.) You can create an Engage object like this:

```js
var Engage = require('engage-api');
var engage = Engage({
    pod: 1,
    oAuthClientId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    oAuthClientSecret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    oAuthRefreshToken: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
});
```

If you will be working with any Engage data jobs, you probably also want to specify an Engage SFTP private key file path. (Again, see [preparation.md](docs/preparation.md) for more details.) With the SFTP key, the constructor looks something like this:

```js
var engage = Engage({
    pod: 1,
    oAuthClientId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    oAuthClientSecret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    oAuthRefreshToken: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    sftpPrivateKeyPath: __dirname + '/sftp.key'
});
```

Calling Engage API Methods
--------------------------

Once you have an Engage object, you can call an Engage API method, passing an options object and a callback function:

```js
engage.getListMetaData({listId: 12345}, function(err, list) {
    if (err) {
        console.log('Failed to get list metadata: ' + err);
    } else {
        console.log(JSON.stringify(list));
    }
});
```

The options object contains all of the parameters for use with the Engage API method call. The callback function signature may vary based on which API method is being called, but the first argument is always an error value which will be null if the method call is successful or an error string if not.

For an API method which accepts a single, required parameter, the value may be passed directly without an options object wrapping it. For example, the GetListMetaData XML API method demonstrated above only accepts a List Id as its parameter, making the following example equivalent:

```js
engage.getListMetaData(12345, function(err, list) {
    if (err) {
        console.log('Failed to get list metadata: ' + err);
    } else {
        console.log(JSON.stringify(list));
    }
});
```

For methods with no required parameters, the options object can be omitted entirely:

```js
engage.loadUserProfile(function(err, profile) {
    if (err) {
        console.log('Failed to load profile: ' + err);
    } else {
        console.log(JSON.stringify(profile));
    }
});
```

The callback can also be omitted, but that is not generally advisable. You should always be checking for failure responses, even if you don't need any data to be returned by your API method call.

Please see the file [methods.md](docs/methods.md) for a list of all methods currently supported and their potential parameters.

