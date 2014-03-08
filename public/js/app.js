define([
  'angular',
  'filters',
  'services',
  'directives',
  'controllers',
  './modules/keypress/keypress',
  'angularRoute',
  ], function (angular, filters, services, directives, controllers) {
    'use strict';

  // Declare app level module which depends on filters, and services

    return angular.module('myApp', [
      'myApp.controllers',
      'myApp.filters',
      'myApp.services',
      'myApp.directives',
      'ui.keypress',
      "ngRoute"
    ]);
});