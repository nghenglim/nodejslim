define(['angular','services'], function (angular) {
  'use strict';

/* Controllers */

return angular.module('myApp.controllers', ['myApp.services']).
  controller('AppCtrl', ['$scope', '$http', 'socket', function ($scope, $http, socket) {
    $scope.user={name:''};
    $scope.chatroom={msgs:[],users:[]};
    $scope.mongochat={msgs:[],users:[]};
    $scope.chatroom.msgs.push("Please wait while we are connecting to the server ...");
    socket.on('nickname changed', function (data) {
      $scope.chatroom.msgs.push(data.msg);
    });
    socket.on('receive:msg', function (data) {
      $scope.chatroom.msgs.push(data.msg);
    });
    socket.on('init:mongochat', function (data) {
      $scope.mongochat.msgs.push.apply($scope.mongochat.msgs,data.msgs);

    });
    socket.on('receive:mongomsg', function (data) {
      $scope.mongochat.msgs.push(data);
    });
    socket.on('socket config', function (data) {
      $scope.socket={id: data.id};
      $scope.chatroom.msgs.push("You have connected to the server ...");
    });
    socket.on('count connection', function (data) {
      $scope.connector = data.count;
    });

    $http({
      method: 'GET',
      url: '/api/name'
    }).
    success(function (data, status, headers, config) {
      $scope.user.name = data.name;
    }).
    error(function (data, status, headers, config) {
      $scope.user.name = 'Error!'
    });
  }]).
  controller('MyCtrl1', function ($scope,socket) {
    $scope.update = function () {
      socket.emit("update:config",{config: $scope.user});
      alert("You have updated the config");
    };
  }).
  controller('MyCtrl2', function ($scope,socket) {
    $scope.send = function ($event) {
      socket.emit("send:msg",{msg: $scope.msg});
      $scope.msg='';
      $event.preventDefault();
    }
  }).
  controller('MyCtrl3', function ($scope,socket) {
    if($scope.mongochat.msgs[0]==null){
      socket.emit("init:mongochat");
      $scope.mongochat.msgs.push({msg:"Please wait while we are connecting to the server to fetch the data..."});
    }
    $scope.send = function ($event) {
      socket.emit("send:mongomsg",{msg: $scope.msg});
      $scope.msg='';
      $event.preventDefault();
    }
  });
});