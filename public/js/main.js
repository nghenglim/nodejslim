requirejs.config({
	waitSeconds: 200,
	paths: {
		'angular': ['//ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js','lib/angular/angular'],
		'angularRoute': ['//ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular-route.min.js','lib/angular/angular-route'],
		text: '../bower_components/requirejs-text/text'
	},
	shim: {
		'angular' : {'exports' : 'angular'},
		'angularRoute': ['angular']
	},
	priority: [
		"angular"
	]
});

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = "NG_DEFER_BOOTSTRAP!";

require( [
	'angular',
	'app',
	'routes'
], function(angular, app, routes) {
	'use strict';
	var $html = angular.element(document.getElementsByTagName('html')[0]);

	angular.element().ready(function() {
		angular.resumeBootstrap([app['name']]);
	});
});
