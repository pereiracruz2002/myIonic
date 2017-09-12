angular.module('starter.services', [])
App.service('UserService', function() {
    this.getProfile= function(){
      var user = localStorage.getItem("chat.current_user");
        return user;
    }
    this.saveProfile= function(user){
      localStorage.setItem("chat.current_user", user);
    }
});