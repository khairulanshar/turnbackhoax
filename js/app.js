// Ionic Starter App
var $autolinker = new Autolinker({newWindow: true, className: "myLink"});
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
$AngularApp = angular.module('starter', ['ionic', 'ngRoute', 'easypiechart',  'starter.services'])
        .constant("serverapi", {"url": "https://turnbackhoax.appspot.com"})
        .run(['$ionicPlatform', '$ionicPopup', '$rootScope', '$route','$window','$timeout','$http',function ($ionicPlatform, $ionicPopup, $rootScope, $route,$window,$timeout,$http) {
            var lastRoute;
            //$(window).off("resize");
            $rootScope.winsize={}
            $rootScope.winsize.Height = $window.outerHeight;
            $rootScope.winsize.Width = $window.outerWidth;
            $(window).resize(function(e){
                if ($rootScope.winsize.Width!=e.target.outerWidth || $rootScope.winsize.Height!=e.target.outerHeight){
                  $route.reload();
                  $rootScope.winsize.Height = e.target.outerHeight;
                  $rootScope.winsize.Width = e.target.outerWidth;
                }
            });

            $rootScope.$on("$routeChangeStart", function (event, next, current) {
                if (current && next && next.params) {
                    lastRoute = current;
                    next.$$route.controller = next.params.name;
                }
            });
            $rootScope.$on('$locationChangeSuccess', function (event, next, current) {
                if (current && next && next.indexOf('#/home/') >= 0 && current.indexOf('#/home/') >= 0) {
                    $route.current = lastRoute;
                }
                event.preventDefault();
            });
        }])
        .config(['$ionicConfigProvider', '$routeProvider', '$controllerProvider',function ($ionicConfigProvider, $routeProvider, $controllerProvider) {
            $ionicConfigProvider.views.forwardCache(false);
            $ionicConfigProvider.views.maxCache(0);
            $AngularApp.controller = $controllerProvider.register;
            var getPage = function (urlattr) {
                return 'html/' + urlattr.name + ".html";
            }
            $routeProvider
                    .when('/:name', {
                        templateUrl: getPage
                    })
                    .when('/:name/:arg1', {
                        templateUrl: getPage
                    })
                    .when('/:name/:arg1/:arg2', {
                        templateUrl: getPage
                    })
                    .when('/:name/:arg1/:arg2/:arg3', {
                        templateUrl: getPage
                    })
                    .when('/:name/:arg1/:arg2/:arg3/:arg4', {
                        templateUrl: getPage
                    })
                    .when('/:name/:arg1/:arg2/:arg3/:arg4/:arg5', {
                        templateUrl: getPage
                    })
                    .when('/:name/:arg1/:arg2/:arg3/:arg4/:arg5/:arg6', {
                        templateUrl: getPage
                    })
                    .when('/', {
                        templateUrl: 'html/root.html'
                    })
                    .otherwise({redirectTo: '/home'});

        }])
        .directive('parseUrl',['$compile', function ($compile) {
            return {
                restrict: 'A',
                require: 'ngModel',
                replace: true,
                scope: {
                    props: '=parseUrl',
                    ngModel: '=ngModel'
                },
                link: function compile(scope, element, attrs, controller) {
                    scope.$watch('ngModel', function (value) {
                        if (typeof value !== "undefined" && value !== null && value.length > 0) {
                            value = $autolinker.link(value.replace(/(?:\r\n|\r|\n)/g, '<br/>'));
                            value = value.replace(/(?:href=")/g, 'style="cursor:pointer;" target="_blank" href="');
                            element.html(value);
                            $compile(element)(scope);
                        }
                    });
                }
            };
        }])
        .directive('browseto', ['$ionicGesture', '$ionicPopup','$timeout',function ($ionicGesture, $ionicPopup,$timeout) {
            return {
                restrict: 'A',
                scope: {
                    url: '@browseto'
                },
                link: function ($scope, $element, $attrs) {
                    var handleTap = function (e,tabid,title) {
                        e.preventDefault();
                        $scope.isbrowser = false;
                        $ionicPopup.confirm({
                            title: 'Konfirmasi',
                            template: 'Apakah Anda ingin membuka tab "'+title+'"?',
                            buttons: [{text: 'Batalkan'}, {text: 'Ya', type: 'btn-gold',
                                    onTap: function (e) {
                                        try{
                                          chrome.tabs.update(parseInt(tabid), {selected: true});
                                        }catch(e){}
                                    }
                                }]
                        }).then(function (res) {

                        })
                    };
                    $timeout(function () {
                        document.getElementById("open"+$attrs.tabid).addEventListener('click',function(e){
                          handleTap(e,$attrs.tabid,$attrs.title);
                        })
                    }, 1000);
                }
            }
        }])
