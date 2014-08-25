angular.module('ionicApp', ['ionic', 'ionicApp.controllers', 'ionicApp.services'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('eventmenu', {
      url: "/event",
      abstract: true,
      templateUrl: "templates/event-menu.html"
    })

    .state('game', {
      url: '/game',
      templateUrl: 'game.html',
      controller: 'GameCtrl'
    })

    .state('eventmenu.home', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "templates/home.html",
          controller: "SearchCtrl"
        }
      }
    })

    .state('eventmenu.favorit', {
      url: "/favorit",
      views: {
        'menuContent' :{
          templateUrl: "templates/favorit.html",
          controller: "FavoritCtrl"
        }
      }
    })

    .state('eventmenu.history', {
      url: "/history",
      views: {
        'menuContent' :{
          templateUrl: "templates/history.html",
          controller: "HistoryCtrl"
        }
      }
    })

    .state('eventmenu.detail', {
      url: "/detail/:wordId",
      views: {
        'menuContent' :{
          templateUrl: "templates/detail.html",
          controller: "DetailCtrl"
        }
      }
    });
  
  $urlRouterProvider.otherwise("/event/home");
});