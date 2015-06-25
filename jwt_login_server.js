/* global JWTLogin: true */
JWTLogin = {};

(function() {
  'use strict';

  var jwt = Npm.require('jsonwebtoken');

  // Can override this later to change secret
  JWTLogin.secret = ( Meteor.settings.JWTLogin && 
                      Meteor.settings.JWTLogin.secret );

  // Get token to verify e-mail address
  JWTLogin.getToken = function(email) {
    check(this.secret, String);
    return jwt.sign({ email: email }, this.secret);
  };

  // Verify a token
  JWTLogin.verifyToken = function(token) {
    check(this.secret, String);
    return jwt.verify(token, this.secret);
  };

  // Register a login handler
  Accounts.registerLoginHandler("jwt_login", function(options) {
    if (! _.isString(options.jwt)) {
      return undefined; // Don't handle
    }

    // Payload should be of form {email: email}
    var email = JWTLogin.verifyToken(options.jwt).email;
    if (! _.isString(email)) {
      return {error: new Meteor.Error(400, "invalid-token")};
    }

    // Find the actual user object
    var user = Meteor.users.findOne({
      'emails.address': email
    });

    // Existing user => verify user if necessary
    if (user) {
      var emailObj = _.findWhere(user.emails, {address: email});
      if (! emailObj.verified) {
        Meteor.users.update({
          _id: user._id,
          'emails.address': email
        }, {
          $set: {
            'emails.$.verified': true
          }
        });
      }

      // Return login result for this user
      return {
        userId: user._id
      };
    } 
    
    // Else no user. Throw error so client knows to init user creation
    return {
      error: new Meteor.Error(404, 'user-not-found')
    };
  });

  // Override insertUserDoc to mark e-mails as verified on creation when
  // the 'jwt' option is set
  var oldInsertUserDoc = Accounts.insertUserDoc;
  Accounts.insertUserDoc = function(options, user) {
    if (_.isString(options.jwt)) {
      var email;
      try {
        email = JWTLogin.verifyToken(options.jwt).email;
      } catch (err) {
        // Invalid token -> ignore
      }
      if (email) {
        var emailObj = _.findWhere(user.emails, {address: email});
        if (emailObj) {
          emailObj.verified = true;
        }  
      }
    }
    return oldInsertUserDoc.apply(Accounts, arguments);
  };

})();