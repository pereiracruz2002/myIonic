angular.module('starter.controllers',[])
	.controller('LoginCtrl', function ($scope) {
		$scope.signIn = function (user) {
			console.log('Criar user')
		}
	})