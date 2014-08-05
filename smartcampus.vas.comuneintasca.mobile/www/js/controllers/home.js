angular.module('ilcomuneintasca.controllers.home', [])

.controller('HomeCtrl', function ($scope, $rootScope, $location, $filter, $ionicPopup, Config, DatiDB, Files) {
  $rootScope.inHome = true;
  $scope.openApp = function (appname,appdata) {
    if (ionic.Platform.isWebView() && device.platform == 'Android' && appdata.android) {
      cordova.plugins.startapp.start({
        android: appdata.android
      }, function () {
        //console.log('android app "'+appdata.android+'" success!');
      }, function () {
        console.log('app "'+appdata.android+'" failed!');
        window.open('https://play.google.com/store/apps/details?id='+appdata.android, '_system');
      });
    } else if (ionic.Platform.isWebView() && device.platform == 'iOS ' && appdata.ios) {
      window.open('itms-apps://itunes.apple.com/app/id'+appdata.ios, '_system');
    } else {
      var alertPopup = $ionicPopup.alert({
        title: $filter('translate')(appname),
        template: $filter('translate')(Config.keys()['coming_soon'])
      });
      alertPopup.then(function (res) {
        //console.log('app "'+JSON.stringify(appdata)+'" done');
      });
    }
  };
  $scope.gotoButton = function (btn) {
    if (btn.hasOwnProperty('app')) {
      $scope.openApp(btn.name,btn.app);
    } else if (btn.hasOwnProperty('ref')) {
      if (btn.ref=='itineraries' || btn.ref=='favorites') {
        $rootScope.goto(btn.ref);
      } else {
        $rootScope.goto('menu/'+btn.ref+'/');
      }
    }
  }
/*
  $scope.goToItem = function (link) {
    console.log("goToItem('"+link+"')");
    if (link.charAt(0)=='/') {
      $location.path(link.substring(1));
    } else {
      $location.path($location.path+'/'+link);
    }
  }
*/
 
  $scope.highlights = null;
  var defaultHighlight = {
    id: null,
    name:{ 'it':'Trento', 'en':'Trento', 'de':'Trento' },
    image: 'img/hp-box/trento.png',
    ref: 'info'
  };
  DatiDB.sync().then(function (data) {
/*
    var homeObjects = JSON.parse(localStorage.homeObjects);
    DatiDB.getAny(homeObjects).then(function (data) {
      var highlights = [defaultHighlight];
      for (var i = 0; i < data.length; i++) highlights.push(data[i]);
      $scope.highlights = highlights;
    });
*/
    Config.highlights().then(function(items) {
      if (items && items.length) {
        $scope.highlights = [];
        for (hli=0; hli<items.length; hli++) {
          var item=items[hli];
console.log('item id: '+item.objectIds.join(','));
          var type=(item.query&&item.query.type?item.query.type:item.type)
console.log('item type: '+type);
          DatiDB.get(type,item.objectIds.join(',')).then(function(data){
console.log('data.id: '+data.id);
            $scope.highlights.push(data);
          })
  /*
          if (item.hasOwnProperty("ref")) {
            item.path="/menu/"+item.ref;
          } else if (item.hasOwnProperty("objectIds")) {
            var classification=(item.query&&item.query.classification?item.query.classification:null);
            Config.menuGroupSubgroupByTypeAndClassification(type,classification).then(function(sg){
              if (sg) item['abslink'] = '#/app/page/'+sg._parent.id+'/'+sg.id+'/' + item.objectIds.join(',');
              console.log('item.abslink: '+item['abslink']);
            });
          }
  */
        }
      }
    },function(menu) {
      $scope.highlights = [ defaultHighlight ];
    });

    Config.navigationItems().then(function(items) {
      if (items) {
        var rows=[], row=-1;
        for (ii=0; ii<items.length; ii++) {
          if ((ii%2)==0) {
            row++;
            rows[row]=[];
          }
          rows[row].push(items[ii]);
        }
        $scope.buttonsRows=rows;
      }
    },function(menu) {
      $scope.buttonRows=null;
    });

    Files.cleanup().then(function (data) {
      //console.log('files cleaned!');
    });
  });

  var navbarElement = angular.element(document.getElementById('navbar'));
  navbarElement.addClass('bar-comuni-home');
  $scope.$on('$destroy', function () {
    navbarElement.removeClass('bar-comuni-home');
  });
})
