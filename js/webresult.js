angular.module('starter').controller('webresult', ['$scope','$location','$window','$ionicLoading','$routeParams','$sce','$ionicScrollDelegate',function ($scope,$location,$window,$ionicLoading,$routeParams,$sce,$ionicScrollDelegate) {
    $scope.app.hidehomeicon = true;
    $scope.app.hidebackicon = true;
    $scope.result={};
    $scope.result.domains=[];
    $scope.result.streams=[];
    $scope.cariData=false;
    $scope.issubmitted=false;
    $scope.openStream=function(tab){
       $location.path("/webresult/"+tab.domain);
    }
    $scope.streamInit=function(tab){
       var a=tab.content.content.substr(tab.content.content.indexOf('<head>'));
       a=a.substr(0,a.indexOf("</head>")+7);
       a= $(a);
       for(var i = 0; i < a.length; i++) {
            if (typeof $(a[i]).prop("tagName") != 'undefined' && $(a[i]).prop("tagName").toLowerCase() == 'meta'){
             if (a[i].name!='undefined'){
               tab[(a[i].name).toLowerCase()]=a[i].content;
             }
             if ($(a[i])[0].getAttribute( "property" )!='undefined' && $(a[i])[0].getAttribute( "property" )!=null){
                tab[$(a[i])[0].getAttribute( "property" )]=a[i].content;
             }
           }
           if (typeof $(a[i]).prop("tagName") != 'undefined' && $(a[i]).prop("tagName").toLowerCase() == 'link'){
             if (a[i].rel==="icon"){
               tab["favIconUrl"]=a[i].href;
             }
           }
           if (typeof $(a[i]).prop("tagName") != 'undefined' && $(a[i]).prop("tagName").toLowerCase() == 'img'){
             tab["img"]=a[i].src;
           }
           if (typeof $(a[i]).prop("tagName") != 'undefined' && $(a[i]).prop("tagName").toLowerCase() == 'title'){
             tab["title"]=$(a[i])[0].innerHTML;
           }
       }
    }
    $scope.getDomains=function(){
      var submitdata={};
      submitdata.orderby='-lastupdated';
      submitdata.limit='200';
      submitdata.offset='0';
      $scope.result.domains=[];
      $scope.result.streams=[];
      var callbackpesan=function(data){
        try {
            $scope.result.domains=data.domain;
          } catch (error) {}
          $ionicLoading.hide();
      }
      var errcallbackpesan = function () {
        $ionicLoading.hide();
      }
      $scope.app.postData('/stream/getDomains',submitdata,callbackpesan,errcallbackpesan);
    }
    $scope.getStreams =function(category,value,filter,filterby,limit,offset,orderby){
      $ionicLoading.show({template: '<ion-spinner></ion-spinner>'});
      var submitdata={};
      submitdata.category=category;
      submitdata.value=value;
      submitdata.orderby=orderby;
      submitdata.limit=limit;
      submitdata.offset=offset;
      submitdata.filter=filter;
      submitdata.filterby=filterby;
      $scope.result.domains=[];
      $scope.result.streams=[];
      var callbackpesan=function(data){
        try {
            $scope.result.streams=data.stream;
            $scope.app.hidebackicon = false;
          } catch (error) {}
          $ionicLoading.hide();
      }
      var errcallbackpesan = function () {
        $ionicLoading.hide();
      }
      $scope.app.postData('/stream/getStreamDomain',submitdata,callbackpesan,errcallbackpesan);
    }
    $scope.setCari=function(){
      $ionicScrollDelegate.$getByHandle('web').scrollTop();
      $scope.filterdata.cariData=true;
    }
    $scope.batalCari=function(){
      $scope.filterdata.cariData=false;
      $scope.init();
    }
    $scope.filterdata={};
    $scope.filterdata.issubmitted=false;
    $scope.filterdata.cariData=false;
    $scope.filterdata.filter="";
    $scope.filterdata.orderby='-lastupdated';
    $scope.filterStreams =function(category,value,limit,offset,orderby){
      if ($scope.filterdata.filter==='' || $scope.filterdata.filter.length<10 || $scope.filterdata.filter.split(" ")<=3){
        alert("Tuliskan kriteria pencarian paling sedikit 10 karakter dan 3 kata");
        return;
      }
      $scope.result.domains=[];
      $scope.result.streams=[];
      $scope.filterdata.issubmitted=true;
      $ionicLoading.show({template: '<ion-spinner></ion-spinner>'});
      var submitdata={};
      submitdata.orderby=$scope.filterdata.orderby;
      submitdata.category=category;
      submitdata.value=value;
      submitdata.limit=limit;
      submitdata.offset=offset;
      submitdata.filter=$scope.filterdata.filter;
      $scope.result.domains=[];
      $scope.result.streams=[];
      var callbackpesan=function(data){
        try {
              $scope.result.streams=data.stream;
          } catch (error) {}
          $ionicLoading.hide();
          $scope.filterdata.issubmitted=false;
      }
      var errcallbackpesan = function () {
        $ionicLoading.hide();
        $scope.filterdata.issubmitted=false;
      }
      $scope.app.postData('/stream/filterStrem',submitdata,callbackpesan,errcallbackpesan);
    }
    $scope.init=function(){
      if (typeof $routeParams["arg1"] == "undefined") {
        $scope.getDomains();
      }else{
        $scope.getStreams('stream','web',$routeParams["arg1"],'domain',200,0,'-lastupdated');
      }
    }
    ionic.Platform.ready($scope.init);


}]);
