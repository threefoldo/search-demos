Package.describe({
  name: 'smartmenus',
  version: '0.0.1',
  // Brief, one-line summary of the package.
    summary: 'Advanced jQuery website menu plugin. Mobile first, responsive and accessible list-based website menus that work on all devices. http://www.smartmenus.org',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.2.1');
    api.use('ecmascript');
    api.use('jquery@1.11.4', 'client');
    api.addFiles([
        'jquery.smartmenus.js',
        'addons/bootstrap/jquery.smartmenus.bootstrap.js',
        'addons/bootstrap/jquery.smartmenus.bootstrap.css'
    ], 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('smartmenus');
});
