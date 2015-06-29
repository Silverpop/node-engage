
var EngageSftp = function(engage, hostname, privateKeyPath) {

    var my = {};

    var fs = require('fs');
    var path = require('path');
    var Client = require('ssh2').Client;

    var _engage = engage;
    var _hostname = hostname;
    var _privateKey = fs.readFileSync(privateKeyPath);

    function _sftpConnect(cb) {

        _engage.getUserName(function(err, username) {

            var connection;

            if (err) {
                process.nextTick(function() { cb(err); });
                return;
            }

            connection = new Client();

            connection.on('ready', function() {
                connection.sftp(function(err, sftp) {
                    if (err) {
                        process.nextTick(function() { cb('Failed to connect to Engage SFTP: ' + err); });
                    } else {
                        process.nextTick(function() { cb(null, connection, sftp); });
                    }
                });
            }).on('error', function(err) {
                process.nextTick(function() { cb('SFTP error: ' + JSON.stringify(err)); });
            }).connect({
                host: _hostname,
                username: username,
                privateKey: _privateKey
            });
        });
    }

    my.downloadFile = function(filename, destPath, cb) {
        _sftpConnect(function(err, connection, sftp) {

            if (err) {
                process.nextTick(function() { cb('Failed to download file: ' + err); });
                return;
            }

            filename = path.basename(filename);

            try {
                if (fs.lstatSync(destPath).isDirectory()) {
                    if (!destPath.match(/\/$/)) {
                        destPath += '/';
                    }
                    destPath = destPath + filename;
                }
            } catch (e) {
                /* path doesn't exist */
            }

            sftp.fastGet('/download/' + filename, destPath, function(err) {

                connection.end();

                if (err) {
                    process.nextTick(function() { cb('Failed to download file: ' + err); });
                    return;
                }

                process.nextTick(function() { cb(null); });
            });
        });
    };

    return my;
};

module.exports = EngageSftp;

