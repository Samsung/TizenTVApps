/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

require.config({
  baseUrl: './js',

  deps: ['main'],

  paths: {
    'domReady': '../lib/requirejs-domready/domReady',
    'jquery': '../lib/jquery/jquery'
  }
});

(function () {
  // this is here as the r.js optimiser uses the first require.config
  // call in the file to configure its build (i.e. to minify and concat
  // all the JS files used by the app via require); the argument passed
  // to that first call must be valid JSON, and the below config is not
  var urlArgs = (document.location.href.match(/nocache/) ?
                 'bust=' + (new Date()).getTime() :
                 '');

  require.config({urlArgs: urlArgs});
})();
