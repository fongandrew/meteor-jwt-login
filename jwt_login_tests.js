(function() {
  'use strict';

  // Auto-set something for our secret
  if (Meteor.isServer) {
    JWTLogin.secret = Random.secret();
  }
    
  // Meteor methods for testing server code
  if (Meteor.isServer) {
    Meteor.methods({
      // Get a token for a given email
      'jwtlogin/getToken': function(email) {
        return {token: JWTLogin.getToken(email)};
      },

      // Get a token for a new user altogether
      'jwtlogin/getTokenForNewUser': function() {
        var email = 'e' + Random.id(17) + '@example.com';
        var userId = Accounts.createUser({email: email, password: 'pass'});
        return {
          userId: userId,
          email: email,
          token: JWTLogin.getToken(email)
        };
      }
    });
  }
  
  // All tests start with client
  if (Meteor.isClient) {

    Tinytest.addAsync("Should be able to login to existing user with token", 
      function(test, done) {
        Meteor.call('jwtlogin/getTokenForNewUser', function(err, res) {        
          if (err) { throw err; }
          if (res) {
            Accounts.loginWithJWT(res.token, function(err) {
              if (err) { throw err; }

              // No error -> make sure we're logged in
              test.equal(Meteor.userId(), res.userId);

              // Make sure email is set currently
              var user = Meteor.user();
              test.equal(user.emails[0].address, res.email);
              test.equal(user.emails[0].verified, true);
              done();
            });
          }
        });
    });

    Tinytest.addAsync("Login for non-existent user should throw error", 
      function(test, done) {
        var email = 'e' + Random.id(17) + '@example.com';
        Meteor.call('jwtlogin/getToken', email, function(err, res) {        
          if (err) { throw err; }
          if (res) {
            Accounts.loginWithJWT(res.token, function(err) {
              test.isTrue(err);
              test.equal(err.error, 404);
              test.equal(err.reason, 'user-not-found');
              done();
            });
          }
        });
    });

    Tinytest.addAsync("Creating user with jwt option mark email as verified",
      function(test, done) {
        var email = 'e' + Random.id(17) + '@example.com';
        Meteor.call('jwtlogin/getToken', email, function(err, res) {        
          if (err) { throw err; }
          if (res) {
            // NB: The email in the JWT should override the e-mail given
            Accounts.createUser({ email: 'whatever@example.com', 
                                  password: 'pass', 
                                  jwt: res.token }, 
              function(err) {
                if (err) { throw err; }

                // Make sure email is verified
                var user = Meteor.user();
                test.equal(user.emails[0].address, email);
                test.equal(user.emails[0].verified, true);
                done();
            });

          }
        });
      });

    Tinytest.addAsync("Creating user with inalid jwt option should not verify",
      function(test, done) {
        var email = 'e' + Random.id(17) + '@example.com';
        Meteor.call('jwtlogin/getToken', email, function(err, res) {        
          if (err) { throw err; }
          if (res) {
            Accounts.createUser({ email: email, 
                                  password: 'pass', 
                                  jwt: 'gibberish' }, 
              function(err) {
                if (err) { throw err; }

                // Make sure email is not verified
                var user = Meteor.user();
                test.equal(user.emails[0].address, email);
                test.equal(user.emails[0].verified, false);
                done();
            });

          }
        });
      });
  }
  

})();
