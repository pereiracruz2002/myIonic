angular.module('starter.services', [])

.factory('UserService', function() {
  function saveProfile(user){
        localStorage.setItem("chat.current_user", JSON.stringify(user));
      }

      function getProfile(){
        var user = localStorage.getItem("chat.current_user");
        return user && JSON.parse(user);
      }
});