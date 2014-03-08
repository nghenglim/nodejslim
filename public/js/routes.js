define(['angular', 'app'], function(angular, app) {
	'use strict';

	return app.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {
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
	}]);

});