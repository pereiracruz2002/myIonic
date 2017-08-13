var App =angular.module('starter.controllers', ['ionic','firebase'])
.controller('LoginCtrl', function ($scope, $stateParams,$firebase,$state,$ionicPopup) {
    $scope.signIn = function (user) {
      firebase.auth().signInWithEmailAndPassword(user.email,user.password).then(function(result) {
        console.log(result)
      $state.go('tab.dash'); //4
      },function(error) {
           var alertPopup = $ionicPopup.alert({
                  title: 'Erro no Login',
                  template: error
            });
          }
      );
    }
})
.controller('RegisterCtrl',function($scope,$stateParams,$state,$firebase){

})
.controller('StudentCtrl', function ($scope, $stateParams,$firebase,$state,$ionicPopup) {
    // firebase.auth().onAuthStateChanged(function(user){
    //   console.log(user)
    //   if(user){
    //     $state.go("search.account");
    //   }else{
    //     $scope.tab=1;
    //     $scope.isSet = function(tabNum){
    //       return $scope.tab ===tabNum;
    //     }
    //   }   
    // });
    $scope.myModel= {'tab': 1};
    // var datePickerObj = {
    //   inputDate: new Date(),
    //   titleLabel: 'Select a Date',
    //   setLabel: 'Set',
    //   todayLabel: 'Today',
    //   closeLabel: 'Close',
    //   mondayFirst: false,
    //   weeksList: ["S", "M", "T", "W", "T", "F", "S"],
    //   monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
    //   templateType: 'popup',
    //   from: new Date(2012, 8, 1),
    //   to: new Date(2018, 8, 1),
    //   showTodayButton: true,
    //   dateFormat: 'dd MMMM yyyy',
    //   closeOnSelect: false,
    //   disableWeekdays: []
    // };
    // $scope.openDatePicker = function(){
    //   ionicDatePicker.openDatePicker(ipObj1);
    // };
    
    $scope.cadastro = function(user){

      firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then(function(result) {
        result.updateProfile({
          displayName: user.nome,
          photoURL: "http://lorempixel.com/400/200/sports/"
        }).then(function() {
        var treinos = firebase.database().ref('treinos/');
        var newTrainners = treinos.push();
        newTrainners.set({
          nome:'Musculaçao'
        });
        var usuarios = firebase.database().ref('users/');
        var newUsers = usuarios.push();
        newUsers.set({
            nome : user.nome,
            sobrenome:user.sobrenome,
            sexo:user.sexo,
            email:user.email,
            nascimento:user.nascimento,
            estado:user.estado,
            cidade:user.cidade,
            photoURL: "http://lorempixel.com/400/200/sports/",
            tipo:user.tipo
          });
        });

        if(user.tipo =="aluno"){
          $state.go("setup-profile-professional");
        }else{
          $state.go("search.account");
        }
     


        }, function(error) {
          var alertPopup = $ionicPopup.alert({
                  title: 'Erro no cadastro',
                  template: error
          });
        });
     };
})
.controller('DashCtrl', function($scope, $stateParams,$firebase,$ionicLoading) {

  $ionicLoading.show({
          template: 'Carregando...'
      }).then(function(){
          $scope.chats = [];
    });




    var ref = firebase.database().ref("/users/").orderByChild('tipo').equalTo('profissional').once("value",function(valor){
      $ionicLoading.hide().then(function(){
        var key = Object.keys(valor.val());
        console.log(key)
           // $scope.chats= {id:key};
            $scope.chats= valor.val();
             console.log($scope.chats)
      });
    });


   
})

.controller('ChatsCtrl', function($scope, Chats) {

  $scope.chats = Chats.all();
    $scope.remove = function(chat) {
      Chats.remove(chat);
    };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('SetupCtrl',function($scope,$stateParams,$firebase,$ionicLoading){
  $ionicLoading.show({
          template: 'Carregando...'
      }).then(function(){
          $scope.treinos = [];
    });


    var ref = firebase.database().ref("/treinos").once("value",function(valor){
      $ionicLoading.hide().then(function(){
            $scope.treinos= valor.val();
      });
    });
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
