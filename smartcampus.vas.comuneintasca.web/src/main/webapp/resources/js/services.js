angular.module('DataService', [])
.factory('DataService',[
        '$q','$http', '$rootScope',
  function($q, $http, $rootScope)
  {
    var logout = function() {
      var data = $q.defer();
      $http.post('logout',{}).success(function() {
        data.resolve();
      }, function() {
        data.resolve();
      });
      return data.promise;
    };
    
    return {
       getProfile : function() {
          var deferred = $q.defer();
          $http.get('console/data').success(function(data) {
            deferred.resolve(data);
          }).error(function(e) {
            deferred.reject(e);
          });
          return deferred.promise;
       },
       publishApp: function() {
	      var deferred = $q.defer();
	      $http.put('console/publish',{}).success(function(data) {
	        deferred.resolve(data);
	      }).error(function(e) {
	        deferred.reject(e);
	      });
	      return deferred.promise;
        },
		publishType: function(type) {
		    var deferred = $q.defer();
		    $http.put('console/publish/'+type,{}).success(function(data) {
		      deferred.resolve(data);
		    }).error(function(e) {
		      deferred.reject(e);
		    });
		    return deferred.promise;
		},
		logout : logout
    };
  }
]);
