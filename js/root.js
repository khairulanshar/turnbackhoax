angular.module('starter').controller('RootController',['$scope', '$sce','$location', '$ionicModal', '$timeout', 'locationChanger', 'serverapi', '$ionicLoading', '$ionicPopup', '$http', '$window', '$ionicPlatform','fbservice', function ($scope, $sce,$location, $ionicModal, $timeout, locationChanger, serverapi, $ionicLoading, $ionicPopup, $http, $window, $ionicPlatform,fbservice) {
    $scope.app = {validateurl:{},title: "TURN BACK", islogin: false, user: {},user_detail: {}, hidehomeicon: true, datanik: {}, niksaya: "", ionicdevice: {},url:'',tabs:[]};
    $scope.app.hidebackicon = true;
    $scope.app.url=serverapi.url+"/login/fb?originalurl="+encodeURIComponent($window.location.href);
    var path = "/home/0";
    if ($location.$$path !== "/" && $location.$$path !== "") {
        path = $location.$$path;
    }
    $scope.goBack=function () {
        window.history.back();
    };

    $location.path("/");
    $scope.app.validateurl=function(tab){
      if (tab.status==='complete' && tab.url.indexOf('chrome-extension://')<0 && tab.url.indexOf('chrome://')<0
         && tab.url.indexOf('/login/fb')<0 && tab.url.indexOf('/login/callback')<0
         && tab.url.indexOf('https://developers.facebook.com/apps/1713593205625623/fb-login/')<0
         && tab.url!=='' ){
           return true;
         }else{
           return false;
         }
    }
    $scope.getAlltabs=function(){
      $scope.app.tabs=[];
      chrome.tabs.query({}, function(tabs) {
        $scope.$apply(function () {
          var log = [];
          angular.forEach(tabs, function(tab, key) {
            if ($scope.app.validateurl(tab)){
              $scope.app.tabs.push(tab);
            }
          }, log);

        });
      });
    };
    chrome.tabs.onActivated.addListener($scope.getAlltabs);
    $scope.$on('$destroy',function(){
        chrome.tabs.onActivated.removeListener($scope.getAlltabs);
    })
    $scope.init = function () {
        try {
            if (typeof window.device !== "undefined") {
                $scope.app.ionicdevice = device;
            }
            $scope.LoginApi("cekauth");
        } catch (e) {
        }
        $scope.getAlltabs();
    };

    $ionicPlatform.ready(function () {
      $scope.init();
    });
    $scope.shouldforward=false;
    $scope.forwardCache=function(){
      $timeout(function () {
          if ($scope.shouldforward){
            $location.path(path);
          }
      }, 100);
    }

    $ionicModal.fromTemplateUrl('html/menu.html', {
        scope: $scope,
        animation: 'slide-in-left-80'
    }).then(function (modal) {
        $scope.menu = modal;
    });
    $scope.closeMenu = function (event, url) {
        $scope.app.setPosition(event);
        $timeout(function () {
            $scope.menu.hide();
            $location.path(url);
        }, 400);
    };
    // Open the login modal
    $scope.openMenu = function (event) {
        $scope.app.setPosition(event);
        $scope.menu.show();
    };
    $scope.app.setPosition = function (event) {
        var currentElement = angular.element(event.currentTarget);
        var ink = angular.element(currentElement[0].querySelector(".ink"));
        if (!angular.isDefined(ink) || ink.length == 0) {
            ink = angular.element("<span class='ink'></span>");
            currentElement.prepend(ink);
        }else{
            ink.removeClass("animate");
        }
        x = event.offsetX - ink[0].offsetWidth / 2;
        y = event.offsetY - ink[0].offsetHeight / 2;

        ink.css("top", y + 'px');
        ink.css("left", x + 'px');
        ink.addClass("animate");
        $timeout(function () {
            ink.detach();
        }, 400);
    };
    $scope.app.getData = function (url, callback,errorcallback) {
        $ionicLoading.show({template: '<ion-spinner></ion-spinner>'});
        $http.get(serverapi.url + url).
                success(function (data, status, headers, config) {
                    callback(data);
                }).
                error(function (data, status, headers, config) {
                  errorcallback(data);
                });
    };
    $scope.app.postData = function (url, data,callback,errorcallback) {
        $http.post(serverapi.url + url,data).
            success(function (data, status, headers, config) {
                    callback(data);
                }).
            error(function (data, status, headers, config) {
                  errorcallback(data);
        });
    };

    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    };

    $scope.LoginApi = function (action) {
      var callback=function(data){
        try {
              if (typeof data.user.id !== "undefined" && data.user.id.length > 0) {
                  $scope.app.islogin = true;
                  $scope.app.user = data.user;
              }
              if (typeof data.client_email.id !== "undefined" && data.client_email.id.length > 0) {
                  $scope.app.user_detail = data.client_email;
              }
          } catch (error) {}
          $scope.shouldforward=true;
          $location.path(path);
          $ionicLoading.hide();
      }
      var errcallback = function () {$scope.shouldforward=true;$location.path(path);$ionicLoading.hide();}
      $scope.app.getData("/login/"+action, callback,errcallback);
    };

    $scope.logout = function () {
        $scope.app.islogin = false;
        $scope.app.user = {};
        $scope.app.user_detail={};
        var callback = function () {$ionicLoading.hide();}
        $scope.app.getData("/login/exit", callback,callback);
    };

    $scope.getMap = function (data) {
        var retval = "";
        try {
            var latlon = data.position.results[0].geometry.location.lat + "," + data.position.results[0].geometry.location.lng;
            var w = ($window.innerWidth > 0) ? $window.innerWidth : screen.width;
            retval = "https://maps.googleapis.com/maps/api/staticmap?center=" + latlon + "&zoom=13&size=" + w + "x400&maptype=roadmap&markers=color:blue%7Clabel:P%7C" + latlon;
        } catch (e) {
        }
        return retval;
    };
    $scope.fbLogin = function () {
          var successcallback = function () {
               $scope.LoginApi("cekauth");
          }
        var errorcallback = function () {
          $ionicLoading.hide();
        }

        fbservice.login(successcallback, errorcallback);
    };
    $scope.vote={};
    $scope.vote.modal =null;

    $ionicModal.fromTemplateUrl('html/votedetail.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.vote.modal = modal;
    });
    $scope.vote.data=[];
    $scope.vote.title="";
    $scope.vote.tab={};
    $scope.vote.openModal = function(tab,vote,type) {
      if (typeof tab[vote]!=="undefined" && tab[vote]>0){
        $scope.vote.data=[];
        $scope.vote.tab={};
        var subtitle="Hoax";
        if (vote==="nohoaxcount"){
          subtitle="Bukan Hoax";
        }
        $scope.vote.title=tab[vote]+" Vote "+subtitle;
        var callback=function(data){
            try {
              $scope.vote.data=data.stream;
              $scope.vote.tab=tab;
              $scope.vote.modal.show();
            } catch (error) {}
            $ionicLoading.hide();
        }
        var errcallback = function () {
          $ionicLoading.hide();
        }
        $scope.app.getData("/stream/getvote"+type+"/"+tab.uuid+"/"+vote.replace("count","") +"/100/0",callback,errcallback);
      }
    };
    $scope.vote.closeModal = function() {
      $scope.vote.data=[];
      $scope.vote.tab={};
      $scope.vote.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.vote.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });



}]);
