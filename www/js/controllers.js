var App =angular.module('starter.controllers', ['ionic','firebase'])
.controller('LoginCtrl', function ($scope, $stateParams,$firebase,$state,$ionicPopup,$q) {
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

.controller('SearchCtrl',function($scope,$stateParams,$state,$q){
  $scope.titulo = 'Busca';

  $scope.formData = {
        city: "",
    };

    $scope.$watch('formData.city', function(){
        console.log('aqui')
        var dados = $scope.formData.city;
        if(typeof dados === 'object'){
          var cidade = dados.address_components[1].short_name;
          var estado = dados.address_components[2].short_name;
          $scope.titulo = 'Eventos Públicos em '+cidade+' - '+estado;
          $ionicLoading.show();

          var ref = firebase.database().ref("/profissionais/").orderByChild('cidade').equalTo(cidade).once("value",function(valor){
            $ionicLoading.hide().then(function(){
              var key = Object.keys(valor.val());
              console.log(key)
              // $scope.chats= {id:key};
              $scope.chats= valor.val();
              console.log($scope.chats)
            });
          });

          //EventsService.getEventsPublic(cidade, estado).then(function(result){
          //   $scope.eventos = result.data;
          //   $ionicLoading.hide();
          // });
        }
    });

  var geocoder = new google.maps.Geocoder();
    $scope.getAddressSuggestions = function(queryString){
        console.log('aqui')
        var defer = $q.defer();
        geocoder.geocode(
                {
                    address: queryString,
                    componentRestrictions: {country: 'BR'}
                },
                function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) { defer.resolve(results); }
                    else { defer.reject(results); }
                }
                );
        return defer.promise;
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

    function sendEmailVerification() {
      // [START sendemailverification]
      firebase.auth().currentUser.sendEmailVerification().then(function() {
        // Email Verification sent!
        // [START_EXCLUDE]
        alert('Email Verification Sent!');
        // [END_EXCLUDE]
      });
      // [END sendemailverification]
    }

    
    $scope.cadastro = function(user){

      var ref = firebase.database();

      firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then(function(result) {
         var id = result.uid;
         console.log(result.uid)
        result.updateProfile({
          displayName: user.nome,
          photoURL: "http://lorempixel.com/400/200/sports/"
        }).then(function() {
          firebase.auth().currentUser.sendEmailVerification().then(function() {
           
            if(user.tipo =='aluno')
              var usuarios = ref.ref('alunos/');
            else
               var usuarios = ref.ref('profissionais/');
            
            var newUsers = usuarios.push();
            newUsers.set({
                id:id,
                nome : user.nome,
                sobrenome:user.sobrenome,
                sexo:user.sexo,
                email:user.email,
                nascimento:user.nascimento,
                estado:user.estado,
                cidade:user.cidade
                
              }).then(function(retorno){
                if(user.tipo =="aluno"){
                  $state.go("search.account");
                }else{
                  $state.go("setup-profile-professional");
                }
              },function(error){
                  var alertPopup = $ionicPopup.alert({
                    title: 'Erro no cadastro',
                    template: error
                });
              });
          });
        }, function(error) {
          var alertPopup = $ionicPopup.alert({
                  title: 'Erro no cadastro',
                  template: error
          });
        });
      },function(error) {
        var alertPopup = $ionicPopup.alert({
                  title: 'Erro no cadastro',
                  template: error
        });
      });
    };
})
.controller('DashCtrl', function($scope, $stateParams,$firebase,$ionicLoading,$q) {

  $scope.myModel= {'tab': 1};
  $scope.titulo = 'Profissionais';

  $scope.formData = {
        city: "",
    };

    $scope.$watch('formData.city', function(){
        console.log('aqui')
        var dados = $scope.formData.city;
        if(typeof dados === 'object'){
          console.log(dados.address_components);
          var cidade = dados.address_components[1].short_name;
          var estado = dados.address_components[2].short_name;
          $scope.titulo = 'Eventos Públicos em '+cidade+' - '+estado;
          var estado_cidade = estado+"_"+cidade;
          $ionicLoading.show();
          console.log(cidade)
          var ref = firebase.database().ref("/profissionais/").orderByChild('estado_cidade').equalTo(estado_cidade).once("value",function(valor){
            console.log(estado_cidade)
            $ionicLoading.hide().then(function(){
              var key = Object.keys(valor.val());
              console.log(key)
              // $scope.chats= {id:key};
              $scope.chats= valor.val();
              console.log($scope.chats)
            });
          });

          //EventsService.getEventsPublic(cidade, estado).then(function(result){
          //   $scope.eventos = result.data;
          //   $ionicLoading.hide();
          // });
        }
    });

  $ionicLoading.show({
          template: 'Carregando...'
      }).then(function(){
          $scope.chats = [];
    });




    var ref = firebase.database().ref("/profissionais/").orderByChild('estado').equalTo('SP').once("value",function(valor){
      $ionicLoading.hide().then(function(){
        var key = Object.keys(valor.val());
        $scope.chats= valor.val();
        console.log($scope.chats)     
      });
    });

    var geocoder = new google.maps.Geocoder();
    $scope.getAddressSuggestions = function(queryString){
        var defer = $q.defer();
        geocoder.geocode(
                {
                    address: queryString,
                    componentRestrictions: {country: 'BR'}
                },
                function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) { defer.resolve(results); }
                    else { defer.reject(results); }
                }
                );
        return defer.promise;
    }


   
})

.controller('ChatDetailCtrl', function($scope,$firebase, $stateParams,$ionicLoading) {
  console.log($stateParams.chatId)

  //$scope.chat = Chats.get($stateParams.chatId);
  $ionicLoading.show({
          template: 'Carregando...'
      }).then(function(){
          $scope.conversas = [];
    });
    var ref =firebase.database();
    //var authData = firebase.auth();
    var authData = firebase.auth().currentUser();
    var chatRef = ref.ref("/chat");
    var conversaRef = ref.ref("/conversas");
    var profissional_aluno = $stateParams.chatId+"_"+authData;

    console.log(authData);

    chatRef.orderByChild('profissional_aluno').equalTo(profissional_aluno).once("value",function(valor){
      $ionicLoading.hide().then(function(){
            $scope.conversas= valor.val();
      });
    });

    console.log($scope.conversas)

  // $scope.chats = Chats.all();
  //   $scope.remove = function(chat) {
  //     Chats.remove(chat);
  //   };
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

.controller('ChatsCtrl', function ($scope, Chats, $state) {
  console.log('aqui')
   $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
    //console.log("Chat Controller initialized");

    // $scope.IM = {
    //     textMessage: ""
    // };

    // Chats.selectRoom($state.params.roomId);

    // var roomName = Chats.getSelectedRoomName();

    // // Fetching Chat Records only if a Room is Selected
    // if (roomName) {
    //     $scope.roomName = " - " + roomName;
    //     $scope.chats = Chats.all();
    // }

    // $scope.sendMessage = function (msg) {
    //     console.log(msg);
    //     Chats.send($scope.displayName, msg);
    //     $scope.IM.textMessage = "";
    // }

    // $scope.remove = function (chat) {
    //     Chats.remove(chat);
    // }
})

.controller('RoomsCtrl', function ($scope, Rooms, Chats, $state) {
    $scope.rooms = Rooms.all();

    $scope.openChatRoom = function (roomId) {
        $state.go('tab.chat', {
            roomId: roomId
        });
    }
})



.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
