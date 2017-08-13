angular.module('starter.services', ['firebase'])

.service('AuthService', function($firebase,$q) {
  this.userIsLoggedIn = function(){
    var deferred = $q.defer(),
        authService = this,
        isLoggedIn = (authService.getUser()!=null);

    deferred.resolve(isLoggedIn);

    return deferred.promise;
  }

  this.getUser = function(){
    return firebase.getAuth();
  }

  this.doLogin = function(){
    
  }
});
