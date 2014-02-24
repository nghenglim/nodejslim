'use strict';

/* Filters */

angular.module('myApp.filters', []).
  filter('interpolate', function (version) {
    return function (text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  })
  .filter('newlines', function() {
    return function(text) {
      return text.split(/\n/g);
    };
  });