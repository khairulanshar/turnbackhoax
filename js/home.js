angular.module('starter').controller('home', ['$rootScope', '$http','$scope', '$timeout', '$routeParams', '$location', 'TabSlide', '$ionicScrollDelegate','$ionicSlideBoxDelegate', 'locationChanger','$ionicLoading','serverapi',function ($rootScope, $http,$scope, $timeout, $routeParams, $location, TabSlide, $ionicScrollDelegate,$ionicSlideBoxDelegate, locationChanger,$ionicLoading,serverapi) {
    $scope.app.hidehomeicon = true;
    $scope.homeapp={};
    $scope.homeapp.showtab=0;
    $scope.homeapp.tabselected="selected";
    $scope.homeapp.tabs=[];
    $scope.homeapp.pesans=[];
    $scope.homeapp.gambars=[]
    $scope.homeapp.selectedtab=[];
    $scope.homeapp.alesan="";
    $scope.homeapp.issubmitted=false;
    $scope.homeapp.createnew=false;
    $scope.homeapp.createnewgambar=false;
    $scope.homeapp.fileChooser
    $scope.openfile=function(event){
      event.originalEvent.preventDefault();
      $scope.homeapp.filegambar={};
      $scope.homeapp.filegambar.photos=[];
      $scope.homeapp.fileChooser.click();
    }
    $scope.chagetab=function (data){
      $scope.$apply(function () {
          if ($scope.homeapp.tabselected==="selected"){
            $scope.getSelectedTab(true);
          }
      });
    };
    chrome.tabs.onActivated.addListener($scope.chagetab);
    $scope.$on('$destroy',function(){
        chrome.tabs.onActivated.removeListener($scope.chagetab);
    })
    $scope.getSelectedTab=function(inp){
      if (typeof inp==='undefined'){
        inp=false;
      }
        chrome.tabs.query({ active: true, lastFocusedWindow: inp }, function (tabs) {
          if(tabs[0].status!=="loading"){
            $scope.homeapp.tabs=[];
            $scope.homeapp.selectedtab=[];
            if ($scope.app.validateurl(tabs[0])){
                tab=tabs[0];
              }else{
                  var log = [];
                  tab=tabs[0];
                  var prevtab=tab;
                  angular.forEach($scope.app.tabs, function(tab_, key) {
                    if (tab_.index<=tab.index){
                        prevtab=tab_;
                    }
                  }, log);
                  tab=prevtab;
              }
              $scope.$apply(function () {
                  $scope.homeapp.selectedtab.push(tab);
                  $scope.homeapp.tabs=$scope.homeapp.selectedtab;
                  $ionicScrollDelegate.$getByHandle('web').scrollTop();
              });
            }
        });
    }
    $scope.laporkanpesan=function(){
      $ionicScrollDelegate.$getByHandle('pesan').scrollTop();
      $scope.homeapp.createnew=true;
    }
    $scope.laporkangambar=function(){
      $ionicScrollDelegate.$getByHandle('gambar').scrollTop();
      $scope.homeapp.createnewgambar=true;
    }
    $scope.setTab=function(event,inp){
        $scope.app.setPosition(event, angular.element(event.currentTarget));
        $scope.homeapp.tabselected=inp;
        if (inp==='all'){
          $scope.homeapp.tabs=$scope.app.tabs;
        }else{
          $scope.getSelectedTab();
        }
    };
    var ionicSlideBoxDelegate = $ionicSlideBoxDelegate.$getByHandle("homeslide");

    $scope.init = function () {
        $ionicLoading.show({template: '<ion-spinner></ion-spinner>'});
        $scope.getSelectedTab();
        if (typeof $routeParams["arg1"] == "undefined") {
            if (TabSlide.getSildeno() !== 0) {
                locationChanger.withoutRefresh($routeParams["name"] + "/" + TabSlide.getSildeno(), true);
            } else {
                $routeParams["arg1"] = 0;
                locationChanger.withoutRefresh($routeParams["name"] + "/0", true);
            }
        }
        if ($routeParams["arg1"] !== TabSlide.getSildeno()) {
            $timeout(function () {
                ionicSlideBoxDelegate.slide($routeParams["arg1"]);
                TabSlide.setSildeno($routeParams["arg1"]);
            }, 100);
        }
        $timeout(function () {
            $scope.createFileElement();
        }, 1000);

        var submitdata={};
        submitdata.category='stream';
        submitdata.value='pesan';
        submitdata.limit='100';
        submitdata.offset='0';
        $scope.homeapp.pesans=[];
        var callbackpesan=function(data){
          try {
              $scope.homeapp.pesans=data.stream;
            } catch (error) {}
            $ionicLoading.hide();
        }
        var errcallbackpesan = function () {
          $ionicLoading.hide();
        }
        $scope.app.postData('/stream/getall',submitdata,callbackpesan,errcallbackpesan);
        var submitdatagambar={};
        submitdatagambar.category='stream';
        submitdatagambar.value='gambar';
        submitdatagambar.limit='100';
        submitdatagambar.offset='0';
        $scope.homeapp.gambars=[];
        var callbackgambar=function(data){
          try {
              $scope.homeapp.gambars=data.stream;
            } catch (error) {}
            $ionicLoading.hide();
        }
        var errcallbackgambar = function () {
          $ionicLoading.hide();
        }
        $scope.app.postData('/stream/getall',submitdatagambar,callbackgambar,errcallbackgambar);
    };
    $scope.homeapp.filegambar={};
    $scope.createFileElement=function(){
      document.getElementById("forfile").innerHTML="";
      $scope.homeapp.fileChooser = document.createElement("input");
      $scope.homeapp.fileChooser.style="visibility:hidden;"
      $scope.homeapp.fileChooser.type = 'file';
      $scope.homeapp.fileChooser.addEventListener('change', function (evt) {
        for (var i = 0, f; f = evt.target.files[i]; i++) {
          if (!f.type.match('image.*')) {
              continue;
          }
          $scope.$apply(function (scope) {
            $ionicLoading.show({template: '<ion-spinner></ion-spinner>'});
            $scope.homeapp.filegambar.filename=f.name;
            $scope.homeapp.filegambar.photos.push(f);
            var reader = new FileReader();
            reader.onload = (function (theFile) {
                return function (e) {
                    $scope.$apply(function (scope) {
                       $scope.homeapp.filegambar.photosrc = e.target.result;
                       $ionicLoading.hide();
                    });
                };
            })(f);
            reader.readAsDataURL(f);
          })
        }
      });
      document.getElementById("forfile").appendChild($scope.homeapp.fileChooser);
    }
    $scope.onSlideChange_ = function (i) {
        $scope.homeapp.showtab=i;
        locationChanger.withoutRefresh($routeParams["name"] + "/" + i, true);
        TabSlide.setSildeno(i);
    };
  ionic.Platform.ready($scope.init);
  $scope.pesan={url:'',content:'',komentar:'',category:'stream',value:'pesan'};
  $scope.creatStreamPesan=function(){
    if ($scope.pesan.url===''){
      alert("Tuliskan judul laporan");
      return;
    }
    if ($scope.pesan.content===''){
      alert("Tuliskan isi pesan");
      return;
    }
    if ($scope.pesan.komentar==='' || $scope.pesan.komentar.length<15 || $scope.pesan.komentar.split(" ")<3){
      alert("Tuliskan komentar anda paling sedikit 15 karakter dan 3 kata");
      return;
    }
    $scope.homeapp.issubmitted=true;
    var callback=function(data){
      try {
            $scope.homeapp.pesans.unshift(data.stream);
            $scope.pesan={url:'',content:'',komentar:'',category:'stream',value:'pesan'};
            $scope.homeapp.createnew=false;
            $scope.homeapp.issubmitted=false;
            $scope.checkMyResponse(tab);
        } catch (error) {}
        $ionicLoading.hide();
    }
    var errcallback = function () {
      $scope.pesan={url:'',content:'',komentar:'',category:'stream',value:'pesan'};
      $ionicLoading.hide();
    }
    var submitdata={};
    submitdata.stream=$scope.pesan;
    submitdata.category=$scope.pesan.category;
    submitdata.value=$scope.pesan.value;
    submitdata.content=$scope.pesan.content;
    submitdata.user_response='hoax';
    submitdata.komentar=$scope.pesan.komentar;
    $scope.app.postData('/stream/createpesan',submitdata,callback,errcallback);
  }
  $scope.gambar={url:'',content:'',komentar:'',category:'stream',value:'gambar'};
  $scope.creatStreamGambar=function(){
    if ($scope.gambar.url===''){
      alert("Tuliskan judul laporan");
      return;
    }
    if ($scope.homeapp.filegambar.photos.length===0){
      alert("Tuliskan isi pesan");
      return;
    }
    if ($scope.gambar.komentar==='' || $scope.gambar.komentar.length<15 || $scope.gambar.komentar.split(" ")<=3){
      alert("Tuliskan komentar anda paling sedikit 15 karakter dan 3 kata");
      return;
    }
    $scope.homeapp.issubmitted=true;
    $ionicLoading.show({template: '<ion-spinner></ion-spinner>'});
    $scope.app.getData('/stream/getUrlFile/',function(upload) {
          $ionicLoading.hide();
          $ionicLoading.show({template: '<ion-spinner></ion-spinner>'});
          var data = new FormData();
          var files = $scope.homeapp.filegambar.photos;
          var pI = 0;
          for (var i = 0, f; f = files[i]; i++) {
              if (!f.type.match('image.*')) {
                  continue;
              }
              data.append("pN" + i, f.name);
              data.append("pT" + i, f.type);
              data.append("pS" + i, f.size);
              data.append("pF" + i, f);
              pI = i + 1;
          }
          data.append("pI", pI);
          $http.post(upload.uploadurl, data, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(data, status, headers, config) {
                 $ionicLoading.hide();
                 $ionicLoading.show({template: '<ion-spinner></ion-spinner>'});
                 try{
                   var callback=function(data){
                     try {
                           $scope.homeapp.gambars.unshift(data.stream);
                           $scope.gambar={url:'',content:'',komentar:'',category:'stream',value:'gambar'};
                           $scope.homeapp.createnewgambar=false;
                           $scope.homeapp.issubmitted=false;
                           $scope.checkMyResponse(tab);
                           chrome.tabs.create({active:true,url:"https://www.google.com/searchbyimage?image_url="+data.stream.content.content}, function (){})
                       } catch (error) {}
                       $ionicLoading.hide();
                   }
                   var errcallback = function () {
                     $scope.gambar={url:'',content:'',komentar:'',category:'stream',value:'gambar'};
                     $ionicLoading.hide();
                   }
                   var submitdata={};
                   submitdata.stream=$scope.gambar;
                   submitdata.category=$scope.gambar.category;
                   submitdata.value=$scope.gambar.value;
                   submitdata.content=serverapi.url+data.retval[0][3];
                   submitdata.user_response='hoax';
                   submitdata.komentar=$scope.gambar.komentar;
                   $scope.app.postData('/stream/creategambar',submitdata,callback,errcallback);
                 }catch(e){}
            })
            .error(function(data, status, headers, config) {
              $ionicLoading.hide();
            });
    },function() {
      $ionicLoading.hide();
    });
  }
  $scope.submitPesan=function(tab,user_response,category,value){
    var submitdata={};
    submitdata.stream=tab;
    submitdata.category=category;
    submitdata.value=value;
    submitdata.content=tab.content.content;
    submitdata.user_response=user_response;
    submitdata.komentar=tab.komentar;
    $scope.homeapp.issubmitted=true;
    var callback=function(data){
      try {
        $scope.homeapp.issubmitted=false;
        tab.komentar='';
        tab =angular.extend(tab, data.stream);
        $scope.checkMyResponse(tab);
        } catch (error) {}
        $ionicLoading.hide();
    }
    var errcallback = function () {
      $ionicLoading.hide();
    }
    $scope.app.postData('/stream/post',submitdata,callback,errcallback);
  }
  $scope.submitGambar=function(tab,user_response,category,value){
    var submitdata={};
    submitdata.stream=tab;
    submitdata.category=category;
    submitdata.value=value;
    submitdata.content=tab.content.content;
    submitdata.user_response=user_response;
    submitdata.komentar=tab.komentar;
    $scope.homeapp.issubmitted=true;
    var callback=function(data){
      try {
        $scope.homeapp.issubmitted=false;
        tab.komentar='';
        tab =angular.extend(tab, data.stream);
        $scope.checkMyResponse(tab);
        } catch (error) {}
        $ionicLoading.hide();
    }
    var errcallback = function () {
      $ionicLoading.hide();
    }
    $scope.app.postData('/stream/post',submitdata,callback,errcallback);
  }

   $scope.submitStream=function(tab,user_response,category,value){
      if (tab.status!=='complete'){
        return;
      }
      if (tab.komentar==='' || tab.komentar.length<15 || tab.komentar.split(" ")<=3){
        alert("Tuliskan komentar anda paling sedikit 15 karakter dan 3 huruf");
        return;
      }
      $scope.homeapp.issubmitted=true;
      $ionicLoading.show({
        template: 'Sedang diproses...<br><ion-spinner icon="dots"></ion-spinner><br><br>Pastikan Anda<br>tidak menutup popup ini<br>sampai proses selesai'
      }).then(function(){
        chrome.tabs.executeScript(tab.id, {file: "js/content.js"}, function() {
          chrome.tabs.sendMessage(
            tab.id,
            {from: 'popup', subject: 'submit'},
            function(response){
              $scope.$apply(function () {
                var submitdata={};
                submitdata.stream=tab;
                submitdata.category=category;
                submitdata.value=value;
                submitdata.content=response.data;
                submitdata.user_response=user_response;
                submitdata.komentar=tab.komentar;
                var callback=function(data){
                  try {
                        $scope.homeapp.issubmitted=false;
                        tab.komentar='';
                        tab =angular.extend(tab, data.stream);
                        $scope.checkMyResponse(tab);
                    } catch (error) {}
                    $ionicLoading.hide();
                }
                var errcallback = function () {
                  $ionicLoading.hide();
                }
                $scope.app.postData('/stream/post',submitdata,callback,errcallback);
              });
            });
        });
      });

   }
   $scope.bukaTab=function(tab){
     chrome.tabs.update(tab.id, {selected: true});
   }
    $scope.props = {
            'target': '_blank',
            'class': 'myLink'
    };
    $scope.checkMyResponse=function(tab){
      tab.showbox=false;
      if (typeof tab.uuid==="undefined"){
        tab.showbox=true;
      }else{
        var callback=function(data){
            try {
              if (typeof data.showbox!=="undefined"){
                tab.showbox=data.showbox;
              }
            } catch (error) {}
            $ionicLoading.hide();
        }
        var errcallback = function () {
          $ionicLoading.hide();
        }
        $scope.app.getData("/stream/checkvotestream/"+tab.uuid,callback,errcallback);
      }
    }
    $scope.tabInit=function(tab,category,value){
      try{
      if ($scope.app.validateurl(tab)){
          tab.komentar="";
          chrome.tabs.executeScript(tab.id, {file: "js/content.js"}, function() {
            try{
            chrome.tabs.sendMessage(
              tab.id,
              {from: 'popup', subject: 'DOMInfo'},
              function(response){
                if (typeof response==='undefined' || response===null){
                  return;
                }
                var a = $(response.data);
                $scope.$apply(function () {
                  for(var i = 0; i < a.length; i++) {
                      if (typeof $(a[i]).prop("tagName") != 'undefined' && $(a[i]).prop("tagName").toLowerCase() == 'meta'){
                        if (a[i].name!='undefined'){
                          tab[(a[i].name).toLowerCase()]=a[i].content;
                        }
                        if ($(a[i])[0].getAttribute( "property" )!='undefined' && $(a[i])[0].getAttribute( "property" )!=null){
                           tab[$(a[i])[0].getAttribute( "property" )]=a[i].content;
                        }
                      }
                      if (typeof $(a[i]).prop("tagName") != 'undefined' && $(a[i]).prop("tagName").toLowerCase() == 'img'){
                        tab["img"]=a[i].src;
                      }
                  }
                  var submitdata={};
                  submitdata.stream=tab;
                  submitdata.category=category;
                  submitdata.value=value;
                  var callback=function(data){
                    try {
                        tab =angular.extend(tab, data.stream);
                        $scope.checkMyResponse(tab);
                      } catch (error) {}
                  }
                  var errcallback = function () {
                    $ionicLoading.hide();
                  }
                  $scope.app.postData('/stream/get',submitdata,callback,errcallback);
                });
              });
              }catch(e){}
          });
        }
      }catch(e){}
    }
}]);
