Engage OAuth Preparation
------------------------

In order to interact with the Engage API, you must first define an OAuth Application in your Engage organization and grant access to an Engage user.

1. Log into Engage UI as a user with org admin rights
2. Go to Settings > Organization Settings > Application Account Access
3. Create a new OAuth Application
  1. Click the "Add Application" button
  2. Fill out the pop-up form with a new application name
  3. Optionally fill out a description
  4. Click "Add"
  5. Record the resulting Client ID and Client Secret values
4. Grant access to the application
  1. Click the "Add Account Access" button
  2. In the Application dropdown, select the application name added in step 3.2
  3. In the User Account dropdown, select a user (preferably with org admin rights) that your application should access Engage as
  4. Optionally fill out a description for future reference
  5. Click "Add"

You should receive an email at the notification address configured in the profile of the user selected in step 4.3. This email will contain the OAuth Refresh Token for your user. Record this value as well.

The preceding directions are also detailed with screenshots in the Engage XML API Developer's Guide.

Data Jobs and Engage SFTP
-------------------------

Certain Engage API method calls involving data jobs require uploading or downloading from an Engage SFTP account. For SFTP accounts with key-based access established, the Engage object can be configured with an additional parameter specifying the path to the private key file. The library expects a standard ASCII private key, looking something like:

```
-----BEGIN RSA PRIVATE KEY-----
MIIJJwIBAAKCAgEAywuuaBHWrfyaQoqCJ+l6SkOoaFVFcoXLs35YaWeEWda24zPI
S0dlbQ8MStzB5kg6Edcp0mvu6UrhR97laeGEj8fDoOhqcIlYlJlk78dbtyHZerfU
...
zrjeLbIGMAy8wAPexk6JNyRR23W8rG3xMCudlEdXSFURuBwC831qEQWcJQ==
-----END RSA PRIVATE KEY-----
```

The authorized_keys file stored in the Engage SFTP account needs to be in the SECSH Public Key File Format, with the additional caveat that the server doesn't handle keys with long comment lines. Your file should look something like this:

```
---- BEGIN SSH2 PUBLIC KEY ----
Comment: "4096-bit RSA, node app key"
AAAAB3NzaC1yc2EAAAABIwAAAgEAywuuaBHWrfyaQoqCJ+l6SkOoaFVFcoXLs35YaWeEWd
a24zPIS0dlbQ8MStzB5kg6Edcp0mvu6UrhR97laeGEj8fDoOhqcIlYlJlk78dbtyHZerfU
...
A9pNlJyIgec=
---- END SSH2 PUBLIC KEY ----
```

The following is a description of how to establish a good Engage SFTP keypair in a Unix-like environment:

1. Create a temporary directory and change directory into it
2. Generate new keypair without passphrase:

    ```
    $ ssh-keygen -b 4096 -t rsa -N \'\' -f sftp.key
    ```

3. Convert public key to SECSH format and shorten the comment line:

    ```
    $ ssh-keygen -ef sftp.key.pub | sed -e 's/converted from .*"$/node app key"/' > authorized_keys
    ```

4. Manually log into your Engage SFTP account with password and upload the authorized_keys file into the .ssh directory:

    ```
    $ sftp -oUser=foo@bar.com transfer1.silverpop.com
    Connecting to transfer1.silverpop.com...
    Property of Silverpop Systems. Unauthorized use prohibited.
    foo@bar.com@transfer1.silverpop.com's password: [enter password]
    sftp> cd .ssh
    sftp> put authorized_keys
    Uploading authorized_keys to /.ssh/authorized_keys
    ...
    sftp> quit
    ```

5. Verify key-based access. If configured correctly, the server should present you with an "sftp>" prompt without requiring a password:

    ```
    $ sftp -oUser=foo@bar.com -oIdentityFile=sftp.key transfer1.silverpop.com
    Connecting to transfer1.silverpop.com...
    Property of Silverpop Systems. Unauthorized use prohibited.
    sftp> quit
    ```

6. Copy sftp.key to your project, exit and delete the temporary directory

Note that if you are using source control for your project, you may want to omit the sftp.key file from being checked in (e.g., add it to .gitignore when using git).

The user that you establish SFTP access for must be the same user that was granted the OAuth refresh token (in step 4.3 of Engage Preparation, above).

