Package.describe({
  name: 'fongandrew:jwt-login',
  version: '0.1.1',
  summary: 'Log into Meteor\'s user account system with a JSON web token',
  git: 'https://github.com/fongandrew/meteor-jwt-login.git'
});

Npm.depends({jsonwebtoken: "5.0.2"});

Package.onUse(function(api) {
  'use strict';
  api.versionsFrom('METEOR@1.1.0.2');
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
