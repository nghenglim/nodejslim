'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'ui.keypress',
  "ngRoute"
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/config/', {
      templateUrl: 'partials/partial1',
      controller: 'MyCtrl1'
    }).
    when('/chatroom/', {
      templateUrl: 'partials/partial2',
      controller: 'MyCtrl2'
    }).
    when('/mongochat/', {
      templateUrl: 'partials/partial3',
      controller: 'MyCtrl3'
    }).
    otherwise({
      redirectTo: '/config/'
    });

  $locationProvider.html5Mode(true);
});
