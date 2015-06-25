(function() {
  'use strict';

  // Login with JSON web token
  Accounts.loginWithJWT = function(token, callback) {
    Accounts.callLoginMethod({
      methodArguments: [{
        jwt: token
      }],
      userCallback: callback
    });
  };

})();