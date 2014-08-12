/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

/* string and various helper functions */
String.prototype.startsWith = function (str) {
    "use strict";
    return this.indexOf(str) === 0;
};

require([
  'pages',
  'domReady!'
], function (pagesLoader) {
  pagesLoader(function () {
    require([
        'app',
        'license',
        'help',
        'animation',
        'sound',
        'pirates',
        'rockets',
        'bowling',
        'scaleBody'
    ], function (App, license_init, help_init) {
        App();
        license_init("license", "home_page");
        help_init("home_help", "help_");
        scaleBody(document.getElementsByTagName("body")[0], 720);
    });
  });
});
