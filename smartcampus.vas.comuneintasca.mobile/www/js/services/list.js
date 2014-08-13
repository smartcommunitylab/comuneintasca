angular.module('ilcomuneintasca.services.list', [])

.factory('ListToolbox', function ($rootScope, $q, $ionicPopup, $ionicModal, $filter, MapHelper, $location, Config, $timeout, $ionicScrollDelegate) {
  var openSortPopup = function ($scope, options, presel, callback) {
    var title = $filter('translate')(Config.keys()['OrderBy']);
    var template = '<div class="list">';
    for (var i = 0; i < options.length; i++) {
      var s = $filter('translate')(Config.keys()[options[i]]);
      template += '<a class="item item-icon-right" ng-click="orderingPopup.close(\'' + options[i] + '\')">' + s + '<i class="icon ' + (options[i] == presel ? 'ion-ios7-checkmark' : 'ion-ios7-circle-outline') + '"></i></a>';
    }
    
    var orderingPopup = $ionicPopup.show({
      template: template,
      title: title,
      scope: $scope,
      buttons: [{
        text: $filter('translate')(Config.keys()['Cancel'])
        }]
    });
    $scope.orderingPopup = orderingPopup;
    $scope.$on('$destroy', function () {
      $scope.orderingPopup.remove();
    });
    orderingPopup.then(function (res) {
      //console.log('sort popup res: ' + res);
      callback(res);
    });
  }

  var openFilterPopup = function ($scope, options, presel, callback) {
    var title = $filter('translate')(Config.keys()['Filter']);
    var template = '<div class="modal modal-filter"><ion-header-bar><h1 class="title">' + title + '</h1></ion-header-bar><ion-content><div class="list">';
    var body = '<a class="item item-icon-right" ng-click="closeModal(\'__all\')">' + $filter('translate')(Config.keys()['All']) + '<i class="icon ' + (presel == null ? 'ion-ios7-checkmark' : 'ion-ios7-circle-outline') + '"></i></a>';
    for (var key in options) {
      var s = $filter('translate')(options[key]);
      s = '<a class="item item-icon-right" ng-click="closeModal(\'' + key + '\')">' + s + '<i class="icon ' + (key == presel ? 'ion-ios7-checkmark' : 'ion-ios7-circle-outline') + '"></i></a>';
      body += s;
    }
    template += body + '</div></ion-content><ion-footer-bar class="bar-modal"><button class="col button button-default button-block button-modal" ng-click="closeModal()">' + $filter('translate')(Config.keys()['Cancel']) + '</button></ion-footer-bar></div>';

    $scope.filtermodal = $ionicModal.fromTemplate(template, {
      scope: $scope,
      animation: 'slide-in-up'
    });
    $scope.filtermodal.show();
    $scope.$on('$destroy', function () {
      $scope.filtermodal.remove();
    });
    $scope.closeModal = function (val) {
      $scope.filtermodal.hide();
      if ('__all' == val) callback(null);
      else if (val) callback(val);
    }
    /*
      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        template: template,
        title: title,
        scope: $scope,
        buttons: [{
          text: $filter('translate')(Config.keys()['Cancel'])
        }]
      });
      $scope.show = myPopup;
      myPopup.then(function (res) {
        console.log('sort popup res: ' + res);
        callback(res);
      });  
*/
  }

  var state = {
    ordering: null,
    filter: null,
    data: null
  };

  return {
    // expect conf with load, orderingTypes, defaultOrdering, getData, title, filterOptions, defaultFilter, doFilter
    prepare: function ($scope, conf) {
      var d = $q.defer();
      $scope.gotdata = d.promise;
      if ($scope.$navDirection == 'back') {
        d.resolve(state.data);
        conf.load(state.data);
      } else {
        state.order = null;
        state.filter = null;
        state.data = null;
        conf.load(null);
      }
/*
      $scope.goToItem = function (path) {
        //state.data = conf.getData();
        //state.order = $scope.ordering.order;
        //state.filter = $scope.filter;
        $location.path($location.path()+path);
      }
*/
      if (conf.orderingTypes) {
        $scope.hasSort = true;
        $scope.orderingTypes = conf.orderingTypes;
        $scope.ordering = $scope.$navDirection != 'back' ? {
          order: conf.defaultOrdering,
          searchText: null
        } : {
          order: state.order||conf.defaultOrdering,
          searchText: null
        };
        //console.log('$scope.ordering: '+JSON.stringify($scope.ordering));

        $scope.showSortPopup = function () {
          var odef=($scope.ordering&&$scope.ordering.order?$scope.ordering.order:null);
          openSortPopup($scope, $scope.orderingTypes, odef, function (res) {
            if (res && $scope.ordering.order != res) {
              state.order = $scope.ordering.order = res;
            }
          });
        };
      }

      if (conf.hasMap) {
        $scope.hasMap = true;
        $scope.showMap = function () {
          state.data = conf.getData();
          state.order = ( ($scope.ordering&&$scope.ordering.order) ? $scope.ordering.order : null );
          state.filter = $scope.filter;
          MapHelper.prepare(conf.getTitle(), conf.getData());
        };
      }
      if (conf.doFilter) {
        $scope.hasFilter = true;
        $scope.filterOptions = conf.filterOptions;
        $scope.filter = $scope.$navDirection != 'back' ? conf.defaultFilter : state.filter;
        $scope.showFilterPopup = function () {
          if (!!$ionicScrollDelegate.$getByHandle('listScroll')) {
            $ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);
          }  
          openFilterPopup($scope, $scope.filterOptions, $scope.filter, function (res) {
            $scope.filter = res;
            state.filter = res;
            conf.doFilter(res);
          });
        };
      }
      if (conf.hasSearch) {
        $scope.hasSearch = true;
        $scope.searching = false;
        $scope.showSearch = function (e) {
          $scope.searching = true;
          var footer = e.target.parentNode.parentNode.parentNode;
          if (!!$ionicScrollDelegate.$getByHandle('listScroll')) {
            $ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);
          }  
          //console.log(footer);
          $timeout(function () {
            var fields = angular.element(footer).find('input');
            //console.log(fields.length);
            if (fields.length > 0) {
              field = fields[0];
              //console.log(field);
              field.focus();
            }
          }, 200);
        };
        $scope.cancelSearch = function () {
          $scope.searching = false;
          $scope.ordering.searchText = null;
        };
      }
    }
  }
})
