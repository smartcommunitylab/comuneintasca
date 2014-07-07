angular.module('ilcomuneintasca.services.conf', [])

.factory('Config', function ($q, $http, $window) {
  var fetched = $q.defer();
  $http.get('data/config.json').success(function(data, status, headers, config){
    for (gi=0; gi<data.navigationItems.length; gi++) {
      var item=data.navigationItems[gi];
      angular.forEach(item.name, function (txt, loc) {
        item.name[loc]=txt.replace("  ","<br/>");
      });
      if (item.hasOwnProperty("app")) {
        item.extraClasses="variant";
      } else if (item.hasOwnProperty("ref")) {
        item.path="/menu/"+item.ref;
      }
    }
    for (gi=0; gi<data.menu.length; gi++) {
      var group=data.menu[gi];
      for (ii=0; ii<group.items.length; ii++) {
        var item=group.items[ii];
        if (item.objectIds) {
          if (item.objectIds.length>1) {
            item.path="/app/contents/"+item.objectIds.join(',');
          } else {
            item.path="/app/content/"+item.objectIds[0];
          }
        } else if (item.query && item.query.classification) {
          item.path="/app/"+item.query.type+"/"+item.query.classification;
        } else if (item.query) {
          item.path="/app/"+item.query.type;
        } else {
          item.path="/menu/"+group.id+"/"+ii;
          console.log('unkown menu item: '+item.path);
        }
      }
    }
    fetched.resolve(data);
  }).error(function(data, status, headers, config){
    console.log('error getting config json!');
    fetched.reject();
  });

  var keys = {
    'Stars': {
      it: 'Stelle',
      en: 'Stars',
      de: 'Star'
    },
    'Date': {
      it: 'Data',
      en: 'Date',
      de: 'Datum'
    },
    'DateFrom': {
      it: 'Data di inizio',
      en: 'Start date',
      de: 'Startdatum'
    },
    'DateTo': {
      it: 'Data di fine',
      en: 'End date',
      de: 'Endatum'
    },
    'Distance': {
      it: 'Distanza',
      en: 'Distance',
      de: 'Distanz'
    },
    'OrderBy': {
      it: 'Ordinare per',
      en: 'Order by',
      de: 'Bestellung'
    },
    'Filter': {
      it: 'Filtra',
      en: 'Filter',
      de: 'Filter'
    },
    'Cancel': {
      it: 'Chiudi',
      en: 'Cancel',
      de: 'Annullieren'
    },
    'All': {
      it: 'Tutti',
      en: 'All',
      de: 'Alles'
    },
    'A-Z': {
      it: 'A-Z',
      en: 'A-Z',
      de: 'A-Z'
    },
    'Z-A': {
      it: 'Z-A',
      en: 'Z-A',
      de: 'Z-A'
    },
    'Details': {
      it: 'Dettagli',
      en: 'Details',
      de: 'Details'
    },
    'Close': {
      it: 'Chiudi',
      en: 'Close',
      de: 'Schließen'
    },
    'loading': {
      it: 'caricamento in corso...',
      en: 'loading...',
      de: 'loading...'
    },
    'syncing': {
      it: 'aggiornamento in corso...',
      en: 'syncing...',
      de: 'syncing...'
    },
    'cleaning': {
      it: 'pulizia in corso...',
      en: 'cleaning...',
      de: 'cleaning...'
    },
    'coming_soon': {
      it: 'In preparazione...',
      en: 'Coming soon...',
      de: 'Kommt bald...'
    },
    'app_title': {
      it: 'TRENTO<br/>IL COMUNE IN TASCA',
      en: 'TRENTO<br/>THE CITY IN YOUR POCKET',
      de: 'TRENTO<br/>DIE STADT IN DER TASCHE'
    },
    'sidemenu_Home': {
      it: 'Home',
      en: 'Home',
      de: 'Home'
    },
    'sidemenu_Favourites': {
      it: 'Preferiti',
      en: 'Favorites',
      de: 'Lieblingsseiten'
    },
    'list_no-favorites': {
      it: 'Nessun preferito salvato',
      en: 'No favorites saved, yet',
      de: 'Keine Lieblingsseiten gespeichert'
    },
    'credits_title': {
      it: 'Credits',
      en: 'Credits',
      de: 'Credits'
    },
    'credits_app': {
      it: 'Il Comune in Tasca',
      en: 'The City in your Pocket',
      de: 'Die Stadt in der Tasche'
    },
    'credits_appfamily': {
      it: 'L\'app dei Comuni Trentini',
      en: 'The Trentino Municipalities app',
      de: 'App der Gemeinden im Trentino'
    },
    'credits_project': {
      it: 'Un progetto di:',
      en: 'A project by:',
      de: 'Ein projekt:'
    },
    'credits_sponsored': {
      it: 'Con la collaborazione di:',
      en: 'In collaboration with:',
      de: 'In Zusammenarbeit mit der:'
    },
    'credits_info': {
      it: 'Per informazioni:',
      en: 'Further information:',
      de: 'Informationen:'
    }
  };

  var hotelTypes = {
    'hotel': {
      de: 'Hotel',
      it: 'Hotel',
      en: 'Hotel'
    },
    'hostel': {
      de: 'Jugendherberge',
      it: 'Ostello',
      en: 'Youth Hostel'
    },
    'agri': {
      de: 'Agritourismusbetrieb',
      it: 'Agritur',
      en: 'Farmhouse Inn'
    },
    'bnb': {
      de: 'Bed and Breakfast',
      it: 'Bed and Breakfast',
      en: 'Bed and Breakfast'
    },
    'camp': {
      de: 'Campingplatz',
      it: 'Campeggio',
      en: 'Camp-site'
    },
    'rooms': {
      de: 'Zimmervermietung',
      it: 'Affittacamere',
      en: 'Landlord'
    },
    'apts': {
      de: 'Ferienwohnungen',
      it: 'Appartamenti per vacanze',
      en: 'Holiday apartments'
    },
  };

  var restaurantTypes = {
    'osteria': {
      de: '',
      it: 'Osteria',
      en: ''
    },
    'pizzeria': {
      de: '',
      it: 'Pizzeria',
      en: ''
    },
    'trattoria': {
      de: 'Gastwirtschaft',
      it: 'Trattoria',
      en: ''
    },
    'typical': {
      de: 'Bed and Breakfast',
      it: 'Osteria tipica',
      en: 'Typical Osteria'
    },
    'restaurant': {
      de: 'Restaurant',
      it: 'Ristorante',
      en: 'Restaurant'
    },
    'pub': {
      de: 'Bierstube',
      it: 'Birreria',
      en: 'Pub'
    },
    'fastfood': {
      de: '',
      it: 'Fast food',
      en: ''
    },
    'bar': {
      de: '',
      it: 'Bar',
      en: ''
    },
    'winebar': {
      de: '',
      it: 'Wine Bar',
      en: ''
    },
    'agritur': {
      de: 'Agritourismusbetrieb',
      it: 'Agritur',
      en: 'Agritur (farmhouse inn)'
    },
    'selfservice': {
      de: '',
      it: 'Self-service',
      en: ''
    },
    'chinese': {
      de: 'Chinesische Spezialitäten',
      it: 'Specialità cinese',
      en: 'Chinese specialities'
    },
    'thai': {
      de: 'Thailändische und chinesische Spezialitäten',
      it: 'Specialità thailandese e cinese',
      en: 'Thai and Chinese specialities'
    },
    'brazil': {
      de: 'Brasilianisches Restaurant',
      it: 'Ristorante brasiliano',
      en: 'Brazilian Restaurant'
    },
    'mexico': {
      de: 'Mexikanische Küche',
      it: 'Cucina messicana',
      en: 'Mexican food'
    },
    'japan': {
      de: 'Japanische Spezialitäten ',
      it: 'Specialità giapponesi',
      en: 'Japanese specialities'
    },
    'japanchina': {
      de: 'Japanische und chinesische Spezialitäten',
      it: 'Specialità giapponese e cinese',
      en: 'Japanese and Chinese specialities'
    },
    'orient': {
      de: 'Orientalische Spezialitäten',
      it: 'Specialità orientali',
      en: 'Oriental specialities'
    }
  };

  var textTypes = {
    'città': {
      de: 'Info',
      it: 'Informazioni',
      en: 'Info'
    },
    'bondone': {
      de: 'Monte Bondone',
      it: 'Monte Bondone',
      en: 'Mount Bondone'
    },
    'Servizi': {
      de: 'Dienstleistungen',
      it: 'Servizi',
      en: 'Services'
    },
    'Contatti': {
      de: 'Kontakten',
      it: 'Contatti',
      en: 'Contacts'
    }
  }

  var contentTypes = {
    'content': 'eu.trentorise.smartcampus.comuneintasca.model.ContentObject',
    'poi': 'eu.trentorise.smartcampus.comuneintasca.model.POIObject',
    'event': 'eu.trentorise.smartcampus.comuneintasca.model.EventObject',
    'restaurant': 'eu.trentorise.smartcampus.comuneintasca.model.RestaurantObject',
    'hotel': 'eu.trentorise.smartcampus.comuneintasca.model.HotelObject',
    'itinerary': 'eu.trentorise.smartcampus.comuneintasca.model.ItineraryObject',
    'mainevent': 'eu.trentorise.smartcampus.comuneintasca.model.MainEventObject',
    'home': 'eu.trentorise.smartcampus.comuneintasca.model.HomeObject'
  };

  var eventFilterTypes = {
    'today': {
      it: 'Oggi',
      en: 'Today',
      de: 'Heute'
    },
    'week': {
      it: 'Prossimi 7 giorni',
      en: 'Next 7 days',
      de: 'Nächsten 7 Tage'
    },
    'month': {
      it: 'Prossimi 30 giorni',
      en: 'Next 30 days',
      de: 'Nächsten 30 Tage'
    }
  };

  return {
    getLang: function () {
      var browserLanguage = '';
      // works for earlier version of Android (2.3.x)
      var androidLang;
      if ($window.navigator && $window.navigator.userAgent && (androidLang = $window.navigator.userAgent.match(/android.*\W(\w\w)-(\w\w)\W/i))) {
        browserLanguage = androidLang[1];
      } else {
        // works for iOS, Android 4.x and other devices
        browserLanguage = $window.navigator.userLanguage || $window.navigator.language;
      }
      var lang = browserLanguage.substring(0, 2);
      if (lang != 'it' && lang != 'en' && lang != 'de') lang = 'en';
      return lang;
    },
    fetch: function () {
      return fetched.promise;
    },
    navigationItems: function () {
      return this.fetch().then(function(data) {
        return data.navigationItems;
      });
    },
    navigationItemsGroup: function (label) {
      return this.navigationItems().then(function(items) {
        for (gi=0; gi<items.length; gi++) {
          if (items[gi].id==label) return items[gi];
        }
        return null;
      });
    },
    menu: function () {
      return this.fetch().then(function(data) {
        return data.menu;
      });
    },
    menuGroup: function (label) {
      return this.menu().then(function(menu) {
        for (gi=0; gi<menu.length; gi++) {
          if (menu[gi].id==label) return menu[gi];
        }
        return null;
      });
    },
    menuGroupSubgroup: function (label1, label2) {
      return this.menuGroup(label1).then(function(group) {
        if (group) {
          for (sgi=0; sgi<group.items.length; sgi++) {
            if (group.items[sgi].id==label2) return group.items[sgi];
          }
        }
        return null;
      });
    },
    menuGroupSubgroupByLocaleName: function (label1, lcl, label2) {
      return this.menuGroup(label1).then(function(group) {
        if (group) {
          for (sgi=0; sgi<group.items.length; sgi++) {
            if (group.items[sgi].name[lcl]==label2) return group.items[sgi];
          }
        }
        return null;
      });
    },
    keys: function () {
      return keys;
    },
    doProfiling: function () {
      return false;
    },
    savedImagesDirName: function () {
      return 'TrentoInTasca';
    },
    schemaVersion: function () {
      return 74;
    },
    syncTimeoutSeconds: function () {
      //return 60 * 60; /* 60 times 60 seconds = EVERY HOUR */
      return 60 * 60 * 8; /* 60 times 60 seconds = 1 HOUR --> x8 = THREE TIMES A DAY */
      //return 60 * 60 * 24; /* 60 times 60 seconds = 1 HOUR --> x24 = ONCE A DAY */
      //return 60 * 60 * 24 * 10; /* 60 times 60 seconds = 1 HOUR --> x24 = 1 DAY x10 */
    },
    syncingOverlayTimeoutMillis: function () {
      return 40 * 1000; /* 40 seconds before automatically hiding syncing overlay */
    },
    loadingOverlayTimeoutMillis: function () {
      return 10 * 1000; /* 10 seconds before automatically hiding loading overlay */
    },
    fileDatadirMaxSizeMB: function () {
      return 100;
    },
    fileCleanupTimeoutSeconds: function () {
      return 60 * 60 * 12; /* 60 times 60 seconds = 1 HOUR --> x12 = TWICE A DAY */
    },
    fileCleanupOverlayTimeoutMillis: function () {
      return 20 * 1000; /* 10 seconds before automatically hiding cleaning overlay */
    },
    contentTypesList: function () {
      return contentTypes;
    },
    eventFilterTypeList: function () {
      return eventFilterTypes;
    },
    contentKeyFromDbType: function (dbtype) {
      for (var contentType in contentTypes) {
        if (contentTypes.hasOwnProperty(contentType)) {
          if (contentTypes[contentType] == dbtype) return contentType;
        }
      }
      return '';
    },
    textTypesList: function () {
      return textTypes;
    },
    hotelTypesList: function () {
      return hotelTypes;
    },
    hotelCateFromType: function (type) {
      return hotelTypes[type];
    },
    hotelCateFromDbClassification: function (dbclassification) {
      for (var hotelType in hotelTypes) {
        if (hotelTypes.hasOwnProperty(hotelType)) {
          if (hotelTypes[hotelType].it == dbclassification) return hotelTypes[hotelType];
        }
      }
      return {
        de: 'UNKNOWN',
        it: 'UNKNOWN',
        en: 'UNKNOWN'
      };
    },
    restaurantTypesList: function () {
      return restaurantTypes;
    },
    restaurantCateFromType: function (type) {
      return restaurantTypes[type];
    },
    restaurantCateFromDbClassification: function (dbclassification) {
      for (var restaurantType in restaurantTypes) {
        if (restaurantTypes.hasOwnProperty(restaurantType)) {
          if (restaurantTypes[restaurantType].it == dbclassification) return restaurantTypes[restaurantType];
        }
      }
      return {
        de: 'UNKNOWN',
        it: 'UNKNOWN',
        en: 'UNKNOWN'
      };
    }
  }
})

.factory('Profiling', function (Config) {
  var startTimes = {};
  return {
    start: function (label) {
      if (Config.doProfiling()) {
        startTimes[label] = (new Date).getTime();
      }
    },

    _do: function (label, details) {
      if (Config.doProfiling()) {
        var startTime = startTimes[label] || -1;
        if (startTime != -1) console.log('PROFILE: ' + label + (details ? '(' + details + ')' : '') + '=' + ((new Date).getTime() - startTime));
      }
    }
  };
})
