angular.module('starter.controllers', ['ionic','ionic-material','firebase'])
App.controller('LoginCtrl', function ($scope, $stateParams,$firebase,$state,$ionicPopup,$q,UserService) {
    

    $scope.signIn = function (user) {
      var usuario = "";
      firebase.auth().signInWithEmailAndPassword(user.email,user.password).then(function(result) {
        var usuario = { 'uid':result.uid,'photoURL':result.photoURL}
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

.controller('PerfilCtrl',function($scope,$timeout,$stateParams,$state,$ionicLoading,$firebase,$firebaseAuth,UserService){

  var profissionalId = $stateParams.profissionalId;
  var treinos = [];
  var refTreino  = firebase.database().ref("/treino_profissionais");
  var perfil = JSON.parse(UserService.getProfile());
  var authData = perfil.uid;
  var profissional_aluno = $stateParams.profissionalId+"_"+authData;

  $scope.profissionalId = $stateParams.profissionalId;



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
          //console.log($scope.chatId)

        });
        //$scope.chatId =$scope.chatId {'treinos':treinos};
         
      });
    });
})
.controller('StudentCtrl', function ($scope, $stateParams,$firebase, $firebaseArray,$state,$ionicPopup,$q,$cordovaCamera,$ionicPlatform,UserService,$ionicModal) {

    $scope.myModel= {'tab': 1};
    $scope.images = [];
 
     

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

        $scope.choosePicture = function() {
          
          var ref = firebase.database();
          var userReference = ref.ref("fotos/");
          var syncArray = $firebaseArray(userReference.child("images"));

          $cordovaCamera.getPicture(options).then(function(imageData) {
            var picture = "data:image/jpeg;base64," + imageData;
              syncArray.$add({image: picture}).then(function() {
                  alert("Image has been uploaded");
            });
          }, function(error) {
              console.error(error);
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



    function sendEmailVerification() {
 
      firebase.auth().currentUser.sendEmailVerification().then(function() {

        alert('Email Verification Sent!');

      });
  
    }

    $scope.cadastro = function(user){
      var dados = user.estado;
      if(typeof dados === 'object'){
        var cidade = dados.address_components[1].short_name;
        var estado = dados.address_components[2].short_name;
      }

      var estado_cidade = cidade+"_"+estado;

      console.log(estado_cidade);


      var ref = firebase.database();

      firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then(function(result) {
        var id = result.uid;
        var usuario = { 'uid':result.uid,'photoURL':result.photoURL}
        UserService.saveProfile(usuario);
        result.updateProfile({
          displayName: user.nome,
          photoURL: "avatar.png"
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
                estado:estado,
                estado_cidade:estado_cidade
                
              }).then(function(retorno){
                if(user.tipo =="aluno"){
                  $state.go('tab.dash');
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

  $ionicModal.fromTemplateUrl('templates/termo.html',{
    scope:$scope,
    animation:'slide-in-up',
  }).then(function(m){
    $scope.modal =m;
    
  });

  $scope.abreModal = function(){
    
      $scope.modal.show();
  }

  $scope.fechaModal =function(){
    $scope.modal.hide();
  }
})
.controller('DashCtrl', function($scope, $stateParams,$firebase,$firebaseAuth,$ionicLoading,$q,ionicMaterialMotion) {

  var reset = function() {
        var inClass = document.querySelectorAll('.in');
        for (var i = 0; i < inClass.length; i++) {
            inClass[i].classList.remove('in');
            inClass[i].removeAttribute('style');
        }
        var done = document.querySelectorAll('.done');
        for (var i = 0; i < done.length; i++) {
            done[i].classList.remove('done');
            done[i].removeAttribute('style');
        }
        var ionList = document.getElementsByTagName('ion-list');
        for (var i = 0; i < ionList.length; i++) {
            var toRemove = ionList[i].className;
            if (/animate-/.test(toRemove)) {
                ionList[i].className = ionList[i].className.replace(/(?:^|\s)animate-\S*(?:$|\s)/, '');
            }
        }
    };

    $scope.ripple = function() {
        reset();
        document.getElementsByTagName('ion-list')[0].className += ' animate-ripple';
        setTimeout(function() {
            ionicMaterialMotion.ripple();
        }, 500);
    };

    $scope.fadeSlideInRight = function() {
        reset();
        document.getElementsByTagName('ion-list')[0].className += ' animate-fade-slide-in-right';
        setTimeout(function() {
            ionicMaterialMotion.fadeSlideInRight();
        }, 500);
    };

    $scope.fadeSlideIn = function() {
        reset();
        document.getElementsByTagName('ion-list')[0].className += ' animate-fade-slide-in';
        setTimeout(function() {
            ionicMaterialMotion.fadeSlideIn();
        }, 500);
    };

    $scope.blinds = function() {
        reset();
        document.getElementsByTagName('ion-list')[0].className += ' animate-blinds';
        setTimeout(function() {
            ionicMaterialMotion.blinds(); // ionic.material.motion.blinds(); //ionicMaterialMotion
        }, 500);
    };

    var map;
    var markers = [];
    $scope.$watch('myModel.tab', function () {
        console.log($scope.myModel.tab)
        if ($scope.myModel.tab == 2) {
            buildMap();
        }
    })

    function buildMap() {
        document.getElementById('map').style.height = (window.innerHeight - 145) + 'px';

        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 11,
            center:{ lat:-23.7482748,lng:-46.6887343}
            //center: {lat: $rootScope.geo.coords.latitude, lng: $rootScope.geo.coords.longitude}
        });

        console.log(map)

        angular.forEach($scope.eventos, function (evento, key) {
            if (evento.latitude && evento.longitude) {
                setTimeout(function () {
                    markers[key] = new google.maps.Marker({
                        position: {lat: parseFloat(-23.7482748), lng: parseFloat(-46.6887343)},
                        map: map,
                        animation: google.maps.Animation.DROP,
                        title: evento.event_name
                    })
                    markers[key].addListener('click', function () {
                        new google.maps.InfoWindow({
                            content:
                                    '<div class="content">' +
                                    '<div class="bodyContent">' +
                                    '<a href="">' + evento.event_name + '</a>' +
                                    '</div>' +
                                    '</div>'

                        }).open(map, markers[key]);
                    })
                }, (key * 200));
            }
        })
        setTimeout(function () {
            google.maps.event.trigger(map, 'resize');
        }, 100);
    }




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
              $scope.blinds(); 
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
        $scope.blinds();    
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

.controller('ChatDetailCtrl', function($scope,$firebase,$firebaseAuth,$ionicScrollDelegate, $stateParams,$ionicLoading,ionicMaterialMotion,UserService) {
  // console.log($stateParams.chatId)
  // console.log(firebase.auth())


  var reset = function() {
        var inClass = document.querySelectorAll('.in');
        for (var i = 0; i < inClass.length; i++) {
            inClass[i].classList.remove('in');
            inClass[i].removeAttribute('style');
        }
        var done = document.querySelectorAll('.done');
        for (var i = 0; i < done.length; i++) {
            done[i].classList.remove('done');
            done[i].removeAttribute('style');
        }
        var ionList = document.getElementsByTagName('ion-list');
        for (var i = 0; i < ionList.length; i++) {
            var toRemove = ionList[i].className;
            if (/animate-/.test(toRemove)) {
                ionList[i].className = ionList[i].className.replace(/(?:^|\s)animate-\S*(?:$|\s)/, '');
            }
        }
    };

    $scope.ripple = function() {
        reset();
        document.getElementsByTagName('ion-list')[0].className += ' animate-ripple';
        setTimeout(function() {
            ionicMaterialMotion.ripple();
        }, 500);
    };

    $scope.fadeSlideInRight = function() {
        reset();
        document.getElementsByTagName('ion-list')[0].className += ' animate-fade-slide-in-right';
        setTimeout(function() {
            ionicMaterialMotion.fadeSlideInRight();
        }, 500);
    };

    $scope.fadeSlideIn = function() {
        reset();
        document.getElementsByTagName('ion-list')[0].className += ' animate-fade-slide-in';
        setTimeout(function() {
            ionicMaterialMotion.fadeSlideIn();
        }, 500);
    };

    $scope.blinds = function() {
        reset();
        document.getElementsByTagName('ion-list')[0].className += ' animate-blinds';
        setTimeout(function() {
            ionicMaterialMotion.blinds(); // ionic.material.motion.blinds(); //ionicMaterialMotion
        }, 500);
    };

  $scope.platform = ionic.Platform.platform();
  $scope.heightImg = '90';
  $scope.newMessages = [];
  var hasConversa = 0;

  //$scope.chat = Chats.get($stateParams.chatId);
  $ionicLoading.show({
          template: 'Carregando...'
      }).then(function(){
          $scope.conversas = [];
    });
    var ref =firebase.database();
    
    var perfil = JSON.parse(UserService.getProfile());
  
    var authData = perfil.uid;
    var imgPerfil = perfil.photoURL;
    var chatRef = ref.ref("/chat/");
    var conversaRef = ref.ref("/conversas");    
    var profissional_aluno = $stateParams.chatId+"_"+authData;
    var profissional = $stateParams.chatId;
    


    chatRef.orderByChild('profissional_aluno').equalTo(profissional_aluno).once("value",function(valor){
      $ionicLoading.hide().then(function(){
          var key = Object.keys(valor.val())[0];
          conversaRef.orderByChild('id').equalTo(key).once("value",function(snapshot){
            //console.log(snapshot.val())
            if(key == null){
              $scope.conversas = '';
            }else{
              $scope.conversas= snapshot.val();
            }
            
            $scope.blinds();
          });
            //console.log($scope.conversas[1])
      });
    });

    console($scope.conversas.size)
    $scope.sendMessage = function(){

      if($scope.conversas==null){
        var primeira = chatRef.push();
        primeira.set({
          aluno:authData,
          profissional:profissional,
          profissional_aluno:profissional_aluno
        })
      }
      var messge = conversaRef.push();
            messge.set({
              id:profissional,
              nome:"Usain",
              photoURL:imgPerfil,
              texto: $scope.data.message
            }).then(function(retorno){
              $scope.newMessages.push({
                id:profissional,
                nome:"Usain",
                photoURL:imgPerfil,
                texto: $scope.data.message

              });
              $scope.blinds();
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

.controller('ChatsCtrl', function ($scope,$firebase,$firebaseAuth,$ionicScrollDelegate, $stateParams,$ionicLoading,ionicMaterialMotion,UserService) {
  
  var reset = function() {
        var inClass = document.querySelectorAll('.in');
        for (var i = 0; i < inClass.length; i++) {
            inClass[i].classList.remove('in');
            inClass[i].removeAttribute('style');
        }
        var done = document.querySelectorAll('.done');
        for (var i = 0; i < done.length; i++) {
            done[i].classList.remove('done');
            done[i].removeAttribute('style');
        }
        var ionList = document.getElementsByTagName('ion-list');
        for (var i = 0; i < ionList.length; i++) {
            var toRemove = ionList[i].className;
            if (/animate-/.test(toRemove)) {
                ionList[i].className = ionList[i].className.replace(/(?:^|\s)animate-\S*(?:$|\s)/, '');
            }
        }
    };

    $scope.ripple = function() {
        reset();
        document.getElementsByTagName('ion-list')[0].className += ' animate-ripple';
        setTimeout(function() {
            ionicMaterialMotion.ripple();
        }, 500);
    };

    $scope.fadeSlideInRight = function() {
        reset();
        document.getElementsByTagName('ion-list')[0].className += ' animate-fade-slide-in-right';
        setTimeout(function() {
            ionicMaterialMotion.fadeSlideInRight();
        }, 500);
    };

    $scope.fadeSlideIn = function() {
        reset();
        document.getElementsByTagName('ion-list')[0].className += ' animate-fade-slide-in';
        setTimeout(function() {
            ionicMaterialMotion.fadeSlideIn();
        }, 500);
    };

    $scope.blinds = function() {
        reset();
        document.getElementsByTagName('ion-list')[0].className += ' animate-blinds';
        setTimeout(function() {
            ionicMaterialMotion.blinds(); // ionic.material.motion.blinds(); //ionicMaterialMotion
        }, 500);
    };

    

  $ionicLoading.show({
          template: 'Carregando...'
      }).then(function(){
          $scope.conversas = [];
  });
    var ref =firebase.database();
    
    //var auth = $firebaseAuth();
    //var authData = auth.$getAuth().uid;
    //var authData = "ubkRweSJGwT59CUIm3gqNkZnehi1";
    // auth.$onAuthStateChanged(function(firebaseUser) {

    //    authData = firebaseUser.uid;
    //    console.log(authData);
    // });

  var perfil = JSON.parse(UserService.getProfile());
  var authData = perfil.uid;

    var chatRef = ref.ref("/chat/");

    var profissionaisRef = ref.ref("/profissionais");
    
    var aluno = authData;

    


    chatRef.orderByChild('aluno').equalTo(aluno).once("value",function(valor){
      $ionicLoading.hide().then(function(){
          var key = Object.keys(valor.val())[0];

          profissionaisRef.orderByChild('id').equalTo(key).once("value",function(snapshot){
            $scope.conversas= snapshot.val();
            $scope.blinds();
          });
            console.log($scope.conversas)
      });
    });
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
