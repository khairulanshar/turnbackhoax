angular.module('starter').controller('user', ['$scope','$location','$window',function ($scope,$location,$window) {
    $scope.app.hidehomeicon = false;
    $scope.app.hidebackicon = true;
    $scope.initUser=function(){
      if (!$scope.app.islogin){
        $location.path("/home");
      }
    };
    $scope.props = {
            'target': '_blank',
            'class': 'myLink'
    };
    $scope.initValue=function(value){
        value.urlimg=$scope.getMap(value);
    }
    $scope.getMap = function (value) {
        var retval = "";
        try {
            var latlon = value.latitude + "," + value.longitude;
            var w = ($window.innerWidth > 0) ? $window.innerWidth : screen.width;
            retval = "https://maps.googleapis.com/maps/api/staticmap?center=" + latlon + "&zoom=13&size=" + w + "x400&maptype=roadmap&markers=color:blue%7Clabel:P%7C" + latlon;
        } catch (e) {
        }
        return retval;
    };
}]);
