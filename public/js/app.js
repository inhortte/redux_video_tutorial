'use strict';

/**
 * @ngdoc overview
 * @name ticketproApp
 * @description
 * # ticketproApp
 *
 * Main module of the application.
 */

// Only for the demo. That is, the final result, using ElasticSearch, is to come, so DIE!
var categoryMapping =
  { "CNET"                                                                        : ["Technology"],
    "Dr. Ben Rakušan Dentist / Zubní Lékař"                                       : ["Dental", "Health"],
    "Jazz Dock"                                                                   : ["Jazz"],
    "Your Daily Far Side Comics"                                                  : ["Comics", "Humor"],
    "Arthur Miller"                                                               : ["Literature"],
    "Chuck Palahniuk"                                                             : ["Literature"],
    "New Scientist"                                                               : ["Science"],
    "Charles Bukowski"                                                            : ["Literature"],
    "Divadlo Archa"                                                               : ["Drama", "Theater"],
    "Co, kdy v Praze?"                                                            : ["Film"],
    "Kino Světozor"                                                               : ["Film"],
    "Bohemia Jazz Fest"                                                           : ["Jazz"],
    "Bajkazyl"                                                                    : ["Jazz"],
    "Blue Light Bar"                                                              : ["Jazz"],
    "Academy of Sciences of the Czech Republic"                                   : ["Science"],
    "Corvintető (official)"                                                       : ["Concerts"],
    "Lucerna Music Bar"                                                           : ["Concerts"],
    "Čili Bar"                                                                    : ["Concerts"],
    "Klubovna 2.patro"                                                            : ["Concerts"],
    "Hanabi Hibachi House"                                                        : ["Concerts"],
    "The Chemistry Gallery"                                                       : ["Contemporary Art"],
    "Státní Opera Praha / Prague State Opera"                                     : ["Opera"],
    "Ludwig Múzeum"                                                               : ["Contemporary Art"],
    "Sun Yoga Beograd"                                                            : ["Fitness"],
    "Takovej barevnej vocas letící komety"                                        : ["Film", "Czech Film"],
    "October Equus"                                                               : ["Rock Music", "RIO"],
    "Taoism"                                                                      : ["Spirituality"],
//    "When I was younger I would record my favorite songs off the radio onto tape" : ["Music", "Nostalgia"],
    "Fresneda de la Sierra Tirón, Spain"                                          : ["Spain", "Castille y León"],
    "Logroño - La Rioja, España"                                                  : ["Spain", "La Rioja"],
    "The Mind Unleashed"                                                          : ["Science"],
    "Dominique Pinon"                                                             : ["Actors", "French Actors"],
    "neubauten.org"                                                               : ["Rock Music", "Industrial Music"],
    "25th Hour"                                                                   : ["Film"],
    "Terry Gilliam"                                                               : ["Film"],
    "Can (band)"                                                                  : ["Rock Music", "Krautrock"],
    "Karl Marx"                                                                   : ["Philosophy"],
    "Monty Python"                                                                : ["Comedy"],
    "Brazil (1985 film)"                                                          : ["Film"],
    "John Cleese"                                                                 : ["Actors"],
    "Backyard Naturalist"                                                         : ["Zoology", "Science"],
    "Eat the Invaders"                                                            : ["Science"],
    "Bill Bruford"                                                                : ["Rock Music", "Drummers", "Progressive Rock", "Jazz"],
    "GitHub"                                                                      : ["Computer Science", "Programming"],
    "Guapo"                                                                       : ["Rock Music", "RIO"],
    "Sibelius"                                                                    : ["Classical Music"],
    "Kayo Dot"                                                                    : ["Rock Music", "RIO"]
  };


var app = angular.module('ticketproApp', [
  'ngRoute',
]);

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/leper.html',
      controller: 'MainCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);

app.controller('MainCtrl', ['$scope', '$http', '$rootScope', 'vdna', function($scope, $http, $rootScope, vdna) {
  // This will not make the final cut. It is to simulate all categories available to a user.
  // Elastic Search will replace this functionality.
  $http.get('/data/events.json').success(function(data) {
    data.forEach(function(event) {
      event.vdnaclass.split(/,/).forEach(function(cl) {
        vdna.addCategory(cl.trim().toLowerCase());
      });
    });
  });
  // ---------------------------------------

  var fetchEvents = function() {
    var power = $rootScope.power === undefined || $rootScope.power;
    var byMyLikes = !(arguments.length > 0 && arguments[0] === "false");
    $http.get('/data/events.json').success(function(data) {
      var vdnaActive = Object.keys(vdna.categories).reduce(function(memo, cl) {
        if(vdna.categories[cl]) {
          memo.push(cl);
        }
        return memo;
      }, []);
      $scope.events = !power ? data :
        data.filter(function(event) {
          var res = event.vdnaclass.split(/,/).map(function(cl) {
            return cl.trim();
          }).reduce(function(memo, cl) {
            if(vdnaActive.indexOf(cl) != -1) {
              memo.push(cl);
            }
            return memo;
          }, []);
          return res.length > 0;
        }).sort(function(a, b) {
          if(byMyLikes) {
            return(b.weight - a.weight);
          } else {
            return 0;
          }
        });
    });
  };
  fetchEvents();
  $rootScope.$on('vdna.update', function() {
    fetchEvents();
  });
  $rootScope.$on('vdna.reorder', function(event, reorder) {
    fetchEvents(reorder);
  });
}]);

app.controller('VdnaCtrl', ['$scope', '$rootScope', 'vdna', function($scope, $rootScope, vdna) {
  // ------------
  // vdna menu
  // ------------

  // Test categories - I should shave my left buttock and then delete this (leaving the declaration).
  var vdnaclasses = [
    "Jazz Dock",
    "Státní Opera Praha / Prague State Opera",
    "neubauten.org"
  ];

  // Zifter Encendido / Apagado - ng-model in vdnamenu.html
  $scope.power = true;
  $scope.hitThatSwitch = function() {
    $rootScope.power = $scope.power;
    $rootScope.$broadcast('vdna.update');
  };

  var scopeVars = function() {
    $scope.vdnaCategories = arrayifyCategories(vdna.activeCategories());
    $scope.vdnaAvailableCategories = arrayifyCategories(vdna.availableCategories());
  };
  var fetchVdnaMenu = function() {
    $scope.$apply(function() {
      scopeVars();
    });
  };
  var arrayifyCategories = function(cats) {
    return Object.keys(cats).map(function(key) {
      return [key, cats[key]];
    });
  };

  // ---------- This needs to be elsewhere.
  // facebook plugin
  // -----------

  $.getScript('//connect.facebook.net/en_UK/all.js', function(){
    FB.init({
      appId      : '575682199200822',
      xfbml      : true,
      cookie     : true,
      status     : true,
      version    : 'v2.3'
    });
    FB.login(function(res) {
      // console.log(res);
      FB.api('/me/likes', {
        access_token: res.authResponse.accessToken
      }, function(res) {
        vdnaclasses = res.data.slice(0,25).map(function(cl) {
          return cl.name;
        });
        vdna.setCategories(vdnaclasses);
      });
    }, {scope: 'user_likes'});
  });

  // vdna.setCategories(vdnaclasses); // for testing the preset categories.
  $rootScope.$on('vdnamenu.update', function() {
    fetchVdnaMenu(vdnaclasses);
  });

  $scope.toggleCategory = function(cl) {
    console.log('We have clicked on a ' + cl);
    vdna.toggleCategory(cl);
    scopeVars();
  };
  $scope.toggleAvailableCategory = function(cl) {
    console.log('We have clicked on a ' + cl);
    vdna.toggleAvailableCategory(cl);
    scopeVars();
  };
  $scope.removeCategory = function(cl) {
    vdna.removeCategory(cl);
    scopeVars();
  };
  $scope.toggleWeighted = function() {
    $rootScope.$broadcast('vdna.reorder', $scope.weighted);
  };
}]);

// no, I'm going to go with { categoryName: active }. Simplicity!
app.service('vdna', ['$rootScope', function($rootScope) {
  var vdna = {
    categories: {},
    allCategories: {},
    setCategories: function(cls) {
      vdna.categories = cls.reduce(function(memo, cl) {
        if(categoryMapping[cl] !== undefined) {
          categoryMapping[cl].forEach(function(cat) {
            memo[cat.toLowerCase()] = true;
          });
        } else {
          memo['misc'] = true;
        }
        return memo;
      }, {});
      vdna.filterCategories();

      /* For reasons stated before 'filterCategories' below, the following code is no longer needed.
      var catKeys = Object.keys(vdna.categories);
      catKeys.forEach(function(cl) {
        vdna.allCategories[cl] = true;
      });
      */
    },
    addCategory: function(cl) {
      vdna.allCategories[cl] = true;
    },
    // ---------------------------
    // After all of the categories from the events JSON are added (using addCategory above),
    // filterCategories is invoked, removing from vdna.categories every category that is not
    // in vdna.allCategories, leaving only those that pertain to the events shown on the page.
    // ---------------------------
    filterCategories: function() {
      var catKeys = Object.keys(vdna.categories);
      vdna.categories = catKeys.reduce(function(memo, cl) {
        if(vdna.allCategories[cl] !== undefined && vdna.allCategories[cl]) {
          memo[cl] = true;
        }
        return memo;
      }, {});
      console.log('vdna.categories: ' + JSON.stringify(vdna.categories));
      $rootScope.$broadcast('vdnamenu.update');
      $rootScope.$broadcast('vdna.update');
    },
    toggleCategory: function(cl) {
      vdna.categories[cl] = !vdna.categories[cl];
      $rootScope.$broadcast('vdna.update');
    },
    toggleAvailableCategory: function(cl) {
      if(vdna.categories[cl] !== undefined) {
        vdna.toggleCategory(cl);
      } else {
        vdna.categories[cl] = true;
        delete vdna.availableCategories[cl];
      }
      $rootScope.$broadcast('vdna.update');
    },
    removeCategory: function(cl) {
      delete vdna.categories[cl];
    },
    activeCategories: function() {
      var catKeys = Object.keys(vdna.categories);
      return catKeys.reduce(function(memo, catKey) {
        if(vdna.categories[catKey]) {
          memo[catKey] = true;
        }
        return memo;
      }, {});
    },
    availableCategories: function() { // ie, inactive or not in vdna.categories
      var allCatKeys = Object.keys(vdna.allCategories);
      return allCatKeys.reduce(function(memo, catKey) {
        if(vdna.categories[catKey] === undefined || !vdna.categories[catKey]) {
          memo[catKey] = true;
        }
        return memo;
      }, {});
    }
  };
  return vdna;
}]);

app.directive('vdnaClassCheckbox', function() {
  return {
    restrict: 'E',
    scope: {
      vdnaclass: "=name"
    },
    template: 'THURK?<input type="checkbox" ng-click="stump(vdnaclass)" />{{ vdnaclass.name }}'
  };
});

// ----------------------------------------------------------------------
// codigos antiguos.
// ----------------------------------------------------------------------
    /*
    $http.get('/data/vdnaclasses.json').success(function(data) {
      $scope.vdnaclasses = data.reduce(function(memo, cl) {
        memo[cl] = false;
        return memo;
      }, {});
      vdna.setClasses($scope.vdnaclasses);
      $scope.vdnacontrolstyles = "position: fixed; top: 0; left: 0; border: 1px solid black; margin: 5px; padding: 5px; text-align: left;";
    });
     */

/*
  var structureVdnaClasses = function(cls) {
    return cls.reduce(function(memo, cl) {
      var truncName = (cl.length > vdnaTruncLen ? cl.substr(0, vdnaTruncLen) + '...' : cl);
      memo.push({
        name: cl,
        truncName: truncName,
        active: true
      });
      return memo;
    }, []);
  };
*/

// vdnaCategories structura.
// [ { category: categoryName,
//     // name: vdnaClassName,  (name and truncName are not needed any longer because of category mapping)
//     // truncName: vdnaTruncatedName,
//     active: bool }, ... ]
/*
    cls: [],
    clsMap: {},
    setClasses: function(cls) {
      vdna.cls = cls;
      $rootScope.$broadcast('vdnamenu.update');
      vdna.clsMap = cls.reduce(function(memo, cl, index) {
        memo[cl.name] = index;
        return memo;
      }, {});
//      console.log('vdna.cls: ' + JSON.stringify(vdna.cls));
      console.log('vdna.clsMap: ' + JSON.stringify(vdna.clsMap));
    },
    toggleClass: function(cl) {
      vdna.cls[cl] = !vdna.cls[cl];
      vdna.cls[vdna.clsMap[cl]]['active'] = !vdna.cls[vdna.clsMap[cl]]['active'];
      console.log('vdna.cls: ' + JSON.stringify(vdna.cls));
      $rootScope.$broadcast('vdna.update');
    }
*/
