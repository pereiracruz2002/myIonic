angular.module('starter.controllers', ['ionic','firebase'])
App.controller('LoginCtrl', function ($scope, $stateParams,$firebase,$state,$ionicPopup,$q,UserService) {
    

    $scope.signIn = function (user) {
      var usuario = "";
      firebase.auth().signInWithEmailAndPassword(user.email,user.password).then(function(result) {
        console.log(result)
        var usuario = { 'uid':result.uid}
        UserService.saveProfile(usuario);
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

.controller('PerfilCtrl',function($scope,$stateParams,$state,$ionicLoading,$firebase,$firebaseAuth){
  var profissionalId = $stateParams.profissionalId;
  var treinos = [];
  var refTreino  = firebase.database().ref("/treino_profissionais");

    //var auth = $firebaseAuth();
    //var authData = auth.$getAuth().uid;
    var authData = "ubkRweSJGwT59CUIm3gqNkZnehi1";



   
    
    var profissional_aluno = $stateParams.profissionalId+"_"+authData;



  var ref = firebase.database().ref("/profissionais/").orderByChild('id').equalTo(profissionalId).once("value",function(valor){
      $ionicLoading.hide().then(function(){
        var key = Object.keys(valor.val());
        $scope.chats= valor.val(); 
        $scope.chat = $scope.chats[key]
        // refTreino  = firebase.database().ref("/treino_profissionais").orderByChild('profissionalId').equalTo(1).once("value",function(snapshot){
        //   treinos = snapshot.val();
        // });
        refChat  = firebase.database().ref("/chat").orderByChild('profissional_aluno').equalTo(profissional_aluno).once("value",function(snapshot){
          $scope.chatId = snapshot.val();
          console.log($scope.chatId)
        });
        //$scope.chatId =$scope.chatId {'treinos':treinos};
         
      });
    });
})
.controller('StudentCtrl', function ($scope, $stateParams,$firebase,$state,$ionicPopup,$q,$cordovaCamera,$ionicPlatform) {
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


    $ionicPlatform.ready(function(){
        if(typeof(Camera) != 'undefined'){
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                correctOrientation:true
            };
        }

        $scope.choosePicture = function(){
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.formData.picture = "data:image/jpeg;base64," + imageData;
                //$scope.formData.new_picture = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // error
            });
        }
    })

    var geocoder = new google.maps.Geocoder();
    $scope.getAddressSuggestions = function(queryString){
        var defer = $q.defer();
        geocoder.geocode(
          {
              address: queryString,
              componentRestrictions: {country: 'BR'}
          },
          function (results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                
                defer.resolve(results); 
              }
              else { defer.reject(results); }
          }
          );
        return defer.promise;
    }

    // $scope.$watch('user.estado', function(){
      
    //   var dados = $scope.user.estado;
    //     if(typeof dados === 'object'){
    //       var cidade = dados.address_components[1].short_name;
    //       var estado = dados.address_components[2].short_name;
    //       $scope.user.estado = cidade+','+estado;
    //     }
    // });

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

    // var geocoder = new google.maps.Geocoder();
    // $scope.getAddressSuggestions = function(queryString){
    //     var defer = $q.defer();
    //     geocoder.geocode(
    //             {
    //                 address: queryString,
    //                 componentRestrictions: {country: 'BR'}
    //             },
    //             function (results, status) {
    //                 if (status == google.maps.GeocoderStatus.OK) { defer.resolve(results); }
    //                 else { defer.reject(results); }
    //             }
    //             );
    //     return defer.promise;
    // }

    
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
.controller('DashCtrl', function($scope, $stateParams,$firebase,$firebaseAuth,$ionicLoading,$q) {

  $scope.myModel= {'tab': 1};
  $scope.titulo = 'Profissionais';

  $scope.formData = {
        city: "",
    };


    $scope.$watch('formData.city', function(){

        var dados = $scope.formData.city;
        if(typeof dados === 'object'){
          //console.log(dados.address_components);
          var bairro = dados.address_components[0].short_name;
          var cidade = dados.address_components[1].short_name;
          var estado = dados.address_components[2].short_name;
          $scope.titulo = 'Eventos Públicos em '+cidade+' - '+estado;
          var estado_cidade = cidade+"_"+bairro;
          $ionicLoading.show();
          var ref = firebase.database().ref("/profissionais/").orderByChild('cidade_bairro').equalTo(estado_cidade).once("value",function(valor){
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

.controller('ChatDetailCtrl', function($scope,$firebase,$firebaseAuth,$ionicScrollDelegate, $stateParams,$ionicLoading) {
  // console.log($stateParams.chatId)
  // console.log(firebase.auth())

  $scope.platform = ionic.Platform.platform();
  $scope.heightImg = '90';

  //$scope.chat = Chats.get($stateParams.chatId);
  $ionicLoading.show({
          template: 'Carregando...'
      }).then(function(){
          $scope.conversas = [];
    });
    var ref =firebase.database();
    
    var auth = $firebaseAuth();
    //var authData = auth.$getAuth().uid;
    var authData = "ubkRweSJGwT59CUIm3gqNkZnehi1";
    // auth.$onAuthStateChanged(function(firebaseUser) {

    //    authData = firebaseUser.uid;
    //    console.log(authData);
    // });

    var chatRef = ref.ref("/chat/");
    var conversaRef = ref.ref("/conversas");    
    var profissional_aluno = $stateParams.chatId+"_"+authData;
    $scope.conversas = '';

    console.log(profissional_aluno)



    chatRef.orderByChild('profissional_aluno').equalTo(profissional_aluno).once("value",function(valor){
      $ionicLoading.hide().then(function(){
          
          var key = Object.keys(valor.val())[0];
          conversaRef.orderByChild('id').equalTo(key).once("value",function(snapshot){
            console.log(snapshot.val())
            $scope.conversas= snapshot.val();
          });
            console.log($scope.conversas)
      });
    });


    $scope.sendMessage = function(){
      var messge = conversaRef.push();
            messge.set({
              id:"1",
              nome:"Usain",
              photoURL:"http://media1.santabanta.com/full1/Sports/Usain%20Bolt/usain-bolt-3v.jpg",
              texto: $scope.data.message
            }).then(function(retorno){
              console.log(retorno)
              $scope.conversas.push({
                id:"1",
                nome:"Usain",
                photoURL:"http://media1.santabanta.com/full1/Sports/Usain%20Bolt/usain-bolt-3v.jpg",
                texto: $scope.data.message

              });

              $ionicScrollDelegate.scrollBottom(true);
            })

      //$ionicScrollDelegate.scrollBottom(true);
    }

    $scope.inputUp = function() {
    //if (isIOS) $scope.data.keyboardHeight = 216;
    $timeout(function() {
      $ionicScrollDelegate.scrollBottom(true);
    }, 300);

  };

    

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

.controller('ChatsCtrl', function ($scope,$firebase,$firebaseAuth,$ionicScrollDelegate, $stateParams,$ionicLoading) {
  console.log('chatCtrl')
  $ionicLoading.show({
          template: 'Carregando...'
      }).then(function(){
          $scope.conversas = [];
  });
    var ref =firebase.database();
    
    var auth = $firebaseAuth();
    //var authData = auth.$getAuth().uid;
    var authData = "ubkRweSJGwT59CUIm3gqNkZnehi1";
    // auth.$onAuthStateChanged(function(firebaseUser) {

    //    authData = firebaseUser.uid;
    //    console.log(authData);
    // });

    var chatRef = ref.ref("/chat/");

    var profissionaisRef = ref.ref("/profissionais");
    
    var aluno = authData;

    


    chatRef.orderByChild('aluno').equalTo(aluno).once("value",function(valor){
      $ionicLoading.hide().then(function(){
          
          var key = Object.keys(valor.val())[0];
          console.log(valor)

          profissionaisRef.orderByChild('id').equalTo(key).once("value",function(snapshot){
            console.log(snapshot.val())
            $scope.conversas= snapshot.val();
          });
            console.log($scope.conversas)
      });
    });
  
 // };
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
