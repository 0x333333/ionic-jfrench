angular.module('ionicApp.controllers', ['ionic', 'ngTouch', 'ionic.contrib.ui.cards'])

.filter('reverse', function () {
  return function(items) {
    if (items) {
      return items.slice().reverse();
    } else {
      return items;
    }
  };
})

.controller('MainCtrl', function ($scope, $ionicSideMenuDelegate, DictService) {

  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.toggleRight = function() {
    $ionicSideMenuDelegate.toggleRight();
  };
})

.controller('SearchCtrl', function ($scope, DictService) {

  $scope.searchKey = '';

  $scope.clearSearch = function () {
    $scope.searchKey = '';
    findAllWords();
  };

  $scope.search = function () {
    DictService.findByWord($scope.searchKey).then(function (words) {
      $scope.words = words;
    });
  };

  $scope.addHistory = function (word) {
    // console.log(word);s
    var allHistory = DictService.allHistory();
    console.log(allHistory);
    var index = getIndex(word, allHistory);
    if (index !== -1) {
      allHistory.splice(index, 1);
    }
    allHistory.push(word);
    DictService.saveHistory(allHistory);
  };

  $scope.quit = function () {
    ionic.Platform.exitApp();
  };

  var findAllWords = function() {
    DictService.findAll().then(function (words) {
      $scope.words = words;
    });
  };

  findAllWords();

})

.controller('FavoritCtrl', function ($scope, DictService, $ionicPopup) {
  
  $scope.searchKey = '';

  $scope.back = function() {
    window.history.back();
  };

  $scope.clearSearch = function () {
    $scope.searchKey = '';
    findAllWords();
  };

  $scope.search = function () {
    DictService.findByWord($scope.searchKey, DictService.allFavorits()).then(function (words) {
      $scope.words = words;
    });
  };

  $scope.emptyFavorit = function() {
    window.localStorage['jfrench_favorit'] = angular.toJson([]);
    $scope.words = null;
    $ionicPopup.alert({
      title: 'JFrench',
      content: '收藏夹记录成功清空！'
    }).then(function(res) {
      console.log('favorits deleted!');
    });
  };

  var findAllWords = function() {
    $scope.words = DictService.allFavorits();
  };

  findAllWords();
  
})

.controller('HistoryCtrl', function ($scope, DictService, $ionicPopup) {
  
  $scope.searchKey = '';

  $scope.clearSearch = function () {
    $scope.searchKey = '';
    findAllWords();
  };

  $scope.search = function () {
    DictService.findByWord($scope.searchKey, DictService.allHistory()).then(function (words) {
      $scope.words = words;
    });
  };

  $scope.back = function() {
    window.history.back();
  };

  $scope.emptyHistory = function() {
    window.localStorage['jfrench_history'] = angular.toJson([]);
    $scope.words = null;
    $ionicPopup.alert({
      title: 'JFrench',
      content: '历史记录成功清空！'
    }).then(function(res) {
      console.log('History deleted!');
    });
  };

  var findAllWords = function() {
    $scope.words = DictService.allHistory();
  };

  findAllWords();
  
})

.controller('DetailCtrl', function ($scope, $stateParams, DictService, $ionicPopup) {
  
  DictService.findById($stateParams.wordId).then(function(word) {
    $scope.word = word;
  });

  $scope.back = function() {
    window.history.back();
  };

  $scope.getStars = function(word) {
    var num = 0,
        allFavorits = DictService.allFavorits(),
        index = getIndex(word, allFavorits);

    if (index !== -1) {
      num = allFavorits[index].stars;
    }
    return num;
  };

  $scope.getArray = function(number) {
    console.log(number);
    return new Array(number);
  };

  $scope.favor = function (word) {
    var allFavorits = DictService.allFavorits();
    console.log(allFavorits);
    var index = getIndex(word, allFavorits);
    if (index !== -1) {
      $ionicPopup.alert({
        title: 'JFrench',
        content: '该词条已收藏！'
      }).then(function(res) {
        console.log();
      });
    } else {
      $ionicPopup.prompt({
        title: '加入收藏夹',
        subTitle: '给单词从打个星(1~5)'
      }).then(function(res) {
        if(res) {
          word.stars = res;
          console.log('word: ', word);
          allFavorits.push(word);
          DictService.saveFavorit(allFavorits);
        } else {
          console.log();
        }
      });
    }
  };
})

.controller('GameCtrl', function($scope, $ionicSwipeCardDelegate) {
  var cardTypes = [
    { title: 'Swipe down to clear the card', image: 'img/pic.png' },
    { title: 'Where is this?', image: 'img/pic.png' },
    { title: 'What kind of grass is this?', image: 'img/pic2.png' },
    { title: 'What beach is this?', image: 'img/pic3.png' },
    { title: 'What kind of clouds are these?', image: 'img/pic4.png' }
  ];

  $scope.cards = Array.prototype.slice.call(cardTypes, 0, 0);

  $scope.cardSwiped = function(index) {
    $scope.addCard();
  };

  $scope.cardDestroyed = function(index) {
    $scope.cards.splice(index, 1);
  };

  $scope.addCard = function() {
    var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    newCard.id = Math.random();
    $scope.cards.push(angular.extend({}, newCard));
  };
})

.controller('CardCtrl', function($scope, $ionicSwipeCardDelegate) {
  $scope.goAway = function() {
    var card = $ionicSwipeCardDelegate.getSwipebleCard($scope);
    card.swipe();
  };
});


var getIndex = function(word, words) {
  var index = -1;
  for (var i = 0; i < words.length; i++) {
    if (words[i]._id === word._id) {
      index = i;
      break;
    }
  }
  return index;
};

