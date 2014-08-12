/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

define(['jquery'], function ($) {
  // done: a function called with no arguments when the pages.html
  // file is loaded and in the DOM
  return function (done) {
    $.ajax({
      url: './pages.html',
      success: function (html) {
        $('body').append(html);
        setTimeout(done, 0);
      }
    });
  };
});
