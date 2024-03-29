angular.module('ilcomuneintasca.directives', [])

.directive('langRadio', function ($q, $filter, $timeout, Config, Files) {
  return {
    restrict: 'A',
    replace: false,
    link: function (scope, element, attrs) {
      if (scope.lang == element.attr('rel')) element.attr('checked', 'checked');
    }
  }
})

.directive('comuniImg', function ($q, $filter, $timeout, Config, Files) {
  var processTag = function (scope, element, attrs) {
    $(element).find('.loadingmsg').remove();

    content = scope.son || scope.obj || scope.itinerario || {
      image: ''
    };
    //console.log('content.id: ' + (content ? content.id : 'NULL'));
    if (content) {
      //console.log('content.image: ' + content.image);
      var imageUrl=$filter('translate')(content.image);
      if (imageUrl && imageUrl != '' && imageUrl != 'false') {
        Files.get(imageUrl).then(function (fileUrl) {
          element.css({
            'background-image': 'url(' + fileUrl + ')'
          });
        }, function () {
          element.addClass('unavailable');
        });
      } else {
        console.log('no image for content');
        element.addClass('missing');
      }
    } else {
      console.log('missing content');
      element.addClass('missing');
    }
      
    if (attrs.sonscount && content.sonscount && Number(content.sonscount)>0) {
//      element.append('<div class="dida">' + $filter('translate_plur')('complex_events', sonscount) + '</div>');
      element.append('<div class="dida"><span>' + content.sonscount + '</span><i class="icon ion-ios7-flag-outline"></i>&nbsp;</div>');
    } else if (attrs.dida) {
//      element.append('<div class="dida"><i class="icon ion-ios7-flag-outline"></i>&nbsp;</div>');
      element.append('<div class="dida">'+attrs.dida+'</div>');
    }
  };
  return {
    restrict: 'E',
    replace: true,
    //scope:{ sonscount:'@', gotdata:'=', gotsonsdata:'=', obj:'=', son:'=' },
    template: function (tElem, tAttrs) {
      return '<div class="img-loading"><span class="loadingmsg">' + $filter('translate')(Config.keys()['loading_short']) + '</span></div>';
    },
    link: function (scope, element, attrs) {
      scope.$watch(attrs.gotdata, function (value) {
        value.then(function () {
          processTag(scope, element, attrs);
        }, function () {
          $(element).find('.loadingmsg').remove();
          element.addClass('error');
        });
      });
    }
  };
})

.directive('compile', function ($compile) {
  // directive factory creates a link function
  return function (scope, element, attrs) {
    scope.$watch(
      function (scope) {
        // watch the 'compile' expression for changes
        return scope.$eval(attrs.compile);
      },
      function (value) {
        // when the 'compile' expression changes
        // assign it into the current DOM
        element.html(value);

        // compile the new DOM and link it to the current
        // scope.
        // NOTE: we only compile .childNodes so that
        // we don't get into infinite loop compiling ourselves
        $compile(element.contents())(scope);
      }
    );
  };
})

.directive('a', [
  function () {
    return {
      restrict: 'E',
      link: function (scope, element, attrs, ctrl) {
        element.on('click', function (event) {
          // process only non-angular links / links starting with hash	
          if (element[0].href && !element[0].attributes['ng-href'] && element[0].attributes['href'].value.indexOf('#') != 0) {
            event.preventDefault();

            var url = element[0].attributes['href'].value.replace(/“/gi, '').replace(/”/gi, '').replace(/"/gi, '').replace(/‘/gi, '').replace(/’/gi, '').replace(/'/gi, '');
            console.log('url: <' + url + '>');
            //var protocol = element[0].protocol;
            //console.log('protocol: '+protocol);
            //if (protocol && url.indexOf(protocol) == 0) {

            // do not open broken/relative links
            if (url.indexOf('http://') == 00 || url.indexOf('https://') == 0 || url.indexOf('mailto:') == 0 || url.indexOf('tel:') == 0 || url.indexOf('sms:') == 0) {
              window.open(url, '_system');
            } else {
              console.log("blocking broken link: " + url);
            }
          }
        });
      }
    };
}]);
