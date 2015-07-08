# meteor-jwt-login
This enables logging in to Meteor's user account system with a JSON web token.
The JWT payload is tied too an e-mail address, which allows you to send a login
link that verifies a user's email address before the actual user document is 
created.

Installation
============
`meteor add fongandrew:jwt-login`

Settings
========
This package will check your `settings.json` for config options.

    "JWTLogin": {
      "secret": "some-secret-string",
      "tokenOptions": { ... },  // See below
      "verifyOptions": { ... }  // See below
    }

This package uses https://github.com/auth0/node-jsonwebtoken for the actual
JWT encoding / decoding. The `tokenOptions` in `settings.json` should
correspond to the options provided to `jwt.sign` while the `verifyOptions`
should correspond to the options provided to `jwt.verify`.