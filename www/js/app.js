// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic','firebase','ionic-material','ionic-datepicker', 'ion-autocomplete','starter.controllers','starter.services','ngCordova'])


.run(function($ionicPlatform,$state,$rootScope,$firebaseAuth,$ionicLoading, $location) {

  $ionicPlatform.registerBackButtonAction(function () {
        if ($state.current.name == "app.profile" || $state.current.name == "login") {
          // do something for this state
           navigator.app.exitApp();
        } else {
          navigator.app.backHistory();
        }
    }, 100);

  $ionicPlatform.ready(function() {
  //   var config = {
  //   apiKey: "AIzaSyBipZxEb3GmFY2eHKmYcv0cYS1MF2U4BW8",
  //   authDomain: "flabs-37c75.firebaseapp.com",
  //   databaseURL: "https://flabs-37c75.firebaseio.com",
  //   projectId: "flabs-37c75",
  //   storageBucket: "flabs-37c75.appspot.com",
  //   messagingSenderId: "1001290918744"
  // };
  // firebase.initializeApp(config);

  var config = {
    apiKey: "AIzaSyBX49lvY0NdOfvK8gB-2U9wmYqi6NxFL1Y",
    authDomain: "learnfirebase-b42c0.firebaseapp.com",
    databaseURL: "https://learnfirebase-b42c0.firebaseio.com",
    projectId: "learnfirebase-b42c0",
    storageBucket: "",
    messagingSenderId: "129383281024"
  };
  firebase.initializeApp(config);

  
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // $firebaseAuth.$onAuth(function (authData) {
    //   if (authData) {
    //     console.log("Logged in as:", authData.uid);
    //     var ref = firebase.database();
    //     ref.child("alunos").child(authData.uid).once('value', function (snapshot) {
    //       var user = snapshot.val();
    //       $rootScope.currentUser = user;
    //       //UserService.saveProfile(user);
    //       //UserService.trackPresence()
    //     });
    //   } else {
    //     $ionicLoading.hide();
    //     $location.path('/get-in');
    //   }
    // });



  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

  //$ionicConfigProvider.views.maxCache(0);
  //$ionicConfigProvider.navBar.alignTitle('center');

  $stateProvider

    .state('home', {
      url: '/home',
      templateUrl: 'templates/index.html'
    })

    .state('loader', {
      url: '/loader',
      templateUrl: 'templates/loader.html'
    })

    .state('intro', {
      url: '/intro',

      templateUrl: 'templates/intro.html'
    })

    .state('get-in', {
      url: '/get-in',
      controller: 'LoginCtrl',
      templateUrl: 'templates/get-in.html'
    })
    .state('student', {
      url: '/student',
      controller: 'StudentCtrl',
      templateUrl: 'templates/register-student.html'
    })

   

    // .state('register',{
    //   url:'/register',
    //   abstract:true,
    //   templateUrl:'templates/register.html',
    //   controller:'RegisterCtrl'
    // })

    .state('setup-profile-professional', {
      url: '/setup-profile-professional',
      controller: 'SetupCtrl',
      templateUrl: 'templates/setup-profile-professional.html'
    })

    // .state('search', {
    //   url: '/search',
    //   abstract: true,
    //   templateUrl: 'templates/search.html'
    // })

    .state('search', {
      url: '/search',
      controller: 'SearchCtrl',
      templateUrl: 'templates/search.html'
    })

    .state('search.account', {
      url: '/account',
      views: {
        'search-account': {
          templateUrl: 'templates/search-account.html',
          controller: 'AccountCtrl'
        }
      }
    })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })


  .state('minha_conta', {
      url: '/minha_conta/:profissionalId',
      
      controller: 'PerfilCtrl',
      templateUrl: 'templates/minha_conta.html'
    })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      controller: 'ChatDetailCtrl',
      params:{
            'chatId': ''
        },
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  // .state('tab.detalhe_evento_public', {
  //       url: '/detalhe_evento_public/:event_id',
  //       params:{
  //           'event_id': ''
  //       },

  //       views: {
  //           'events_public': {
  //                templateUrl: 'views/event_public_detail.html',
  //                controller: 'EventDetailPublic'
        
  //           },
  //       }
       
  //   })

  .state('tab.account', {
    url: '/account-user',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/intro');

});
