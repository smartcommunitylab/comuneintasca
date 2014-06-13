angular.module('ilcomuneintasca.controllers.common', [])

.controller('MenuCtrl', function ($scope, $ionicModal) {
  $scope.shownGroup = null;

  $scope.showGroup = function (groupId) {
    if (groupId != $scope.shownGroup) {
      $scope.shownGroup = groupId;
    } else {
      $scope.shownGroup = null;
    }
  };

  $scope.isGroupShown = function (groupId) {
    return $scope.shownGroup == groupId;
  };

  $ionicModal.fromTemplateUrl('templates/credits.html', {
    scope: $scope,
    animation: 'slide-in-up'
  })
    .then(function (modal) {
      $scope.credits = modal;
    });
  $scope.showCredits = function () {
    console.log($scope);
    $scope.credits.show();
  };
  $scope.$on('$destroy', function () {
    $scope.credits.remove();
  });
})

.controller('FavouritesListCtrl', function ($scope, DatiDB) {
  $scope.gotdata = DatiDB.getFavorites().then(function (data) {
    $scope.favourites = data;
  });
})

.controller('CategoriesListCtrl', function ($scope, $stateParams, Config) {
  if ($stateParams.cateId == 'info') {
    $scope.title = 'sidemenu_div_Conoscere';
    $scope.categories = [
      {
        key: 'sidemenu_Info',
        link: 'contents/text.3001,text.3004'
      }, {
        key: 'sidemenu_Storia',
        link: 'content/text.3002'
      }, {
        key: 'sidemenu_Concilio',
        link: 'content/text.3003'
      }, {
        key: 'sidemenu_Eventi-Principali',
        link: 'mainevents'
      }, {
        key: 'sidemenu_Bondone',
        link: 'contentscate/bondone'
      }
    ];

  } else if ($stateParams.cateId == 'events') {
    $scope.basecate = $stateParams.cateId;
    $scope.title = 'sidemenu_div_Vivere';
    $scope.categories2 = Config.eventTypesList();
  } else if ($stateParams.cateId == 'places') {
    $scope.basecate = $stateParams.cateId;
    $scope.title = 'sidemenu_div_Scoprire';
    $scope.categories2 = Config.poiTypesList();

  } else if ($stateParams.cateId == 'hospitality') {
    $scope.title = 'sidemenu_div_Mangiare-dormire';
    $scope.categories = [
      {
        key: 'sidemenu_Hotel',
        link: 'hotels'
      }, {
        key: 'sidemenu_Ristoranti',
        link: 'restaurants'
      }
    ];
  } else if ($stateParams.cateId == 'useful') {
    $scope.title = 'sidemenu_div_Info-utili';
    $scope.categories = [
      {
        key: 'sidemenu_Servizi',
        link: 'services'
      }, {
        key: 'sidemenu_Uffici-comunali',
        link: 'contacts'
      }
    ];
  }
})

.controller('ContentCtrl', function ($scope, $state, $stateParams, DatiDB) {
  if ($stateParams.contentId) {
    contentId = $stateParams.contentId;
  } else {
    contentId = $state.current.data.contentId
  }
  $scope.gotdata = DatiDB.get('content', contentId).then(function (data) {
    $scope.content = data;
  });
})

.controller('ContentsListCtrl', function ($scope, $state, $stateParams, DatiDB, Config) {
  if ($stateParams.contentsCate) {
    $scope.gotdata = DatiDB.cate('content', $stateParams.contentsCate).then(function (data) {
      $scope.contents = data;
      $scope.title = Config.textTypesList()[$stateParams.contentsCate];
    });
  } else if ($stateParams.contentsIds) {
    $scope.gotdata = DatiDB.get('content', $stateParams.contentsIds).then(function (data) {
      $scope.contents = data;
      if (data && data.length > 0) {
        $scope.title = Config.textTypesList()[data[0].classification];
      }
    });
  } else if ($state.current.data.contentsCate) {
    $scope.gotdata = DatiDB.cate('content', $state.current.data.contentsCate).then(function (data) {
      $scope.title = Config.textTypesList()[$state.current.data.contentsCate];
      $scope.contents = data;
    });
  } else {
    $scope.gotdata = DatiDB.get('content', $state.current.data.contentsIds).then(function (data) {
      $scope.contents = data;
    });
  }
})
