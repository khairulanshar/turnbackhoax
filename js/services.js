/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module('starter.services', [])
        .factory('TabSlide', ['$location', '$route', '$rootScope', function ($location, $route, $rootScope) {
                var sildeno = 0;
                return {
                    getSildeno: function () {
                        return sildeno;
                    },
                    setSildeno: function (no) {
                        sildeno = no;
                    }
                };
            }])
        /*https://github.com/angular/angular.js/issues/1699#issuecomment-27360873*/
        .service('locationChanger', ['$location', '$route', '$rootScope', function ($location, $route, $rootScope) {
                this.withoutRefresh = function (url, doesReplace) {
                    if (doesReplace) {
                        $location.path(url).replace();
                    } else {
                        $location.path(url || '/');
                    }
                };
            }])
        .service('fbservice', ['$http','$window','serverapi','$ionicLoading', function ($http,$window,serverapi,$ionicLoading) {
          var winHeight = 524,
              winWidth = 674,
              centeredY = $window.screenY + ($window.outerHeight / 2 - winHeight / 2),
              centeredX = $window.screenX + ($window.outerWidth / 2 - winWidth / 2),
              url=serverapi.url+"/login/fb?originalurl="+encodeURIComponent($window.location.href);
              this.login = function (callback, errorcallback) {
                $ionicLoading.show({template: '<ion-spinner></ion-spinner>'});
                    var loginWindow = window.open(url,
                            'Login', 'height=' + winHeight + ',width=' + winWidth
                            + ',toolbar=0,scrollbars=0,status=0,resizable=0,location=0,menuBar=0'
                            + ',left=' + centeredX + ',top=' + centeredY);
                    var interval = setInterval(function () {
                            if (loginWindow.closed) {
                                $ionicLoading.hide();
                                callback();
                                clearInterval(interval);
                            }
                        }, 250);
                    loginWindow.focus();
                };
            }])
        ;
