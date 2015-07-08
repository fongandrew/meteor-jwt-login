Package.describe({
  name: 'fongandrew:jwt-login',
  version: '0.1.1',
  summary: 'Login with a JSON Web Token. The JWT payload tied to an e-mail ' + 
           'address, which allows you to send a login link that verifies a ' +
           'user\'s email address before the actual user document is created.',
  git: 'https://github.com/fongandrew/meteor-jwt-login.git'
});

Package.onUse(function(api) {
  'use strict';
  api.versionsFrom('METEOR@1.1.0.2');
  Npm.depends({jsonwebtoken: "5.0.2"});
  api.use('accounts-password');
  api.use('underscore');
  api.use('random');
  api.use('check');
  api.addFiles('jwt_login_client.js', ['client']);
  api.addFiles('jwt_login_server.js', ['server']);
  api.export('JWTLogin', ['server', 'client']);
});

Package.onTest(function(api) {
  'use strict';
  
  api.use('tinytest');
  api.use('fongandrew:jwt-login');
  api.use('random');
  api.use('accounts-password');
  api.addFiles('jwt_login_tests.js', ['client', 'server']);
});
