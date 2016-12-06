  var currenturl=window.location.href;
  currenturl=currenturl.replace("/index.html","/popup.html");
  function openapps(){
    var winHeight = 650,winWidth = 400;
    setTimeout(function(){
          chrome.windows.create({
              "url": currenturl,
              "type": "popup",
              "focused": true,
              "width": winWidth,
              "height": winHeight
            }, function (popup) {
            });
            self.close();
    }, 500);
  }
  var found=false;
  chrome.windows.getAll({populate:true},function(windows){
    windows.forEach(function(window){
      if (window.type==='popup'){
        window.tabs.forEach(function(tab){
           if (tab.url.indexOf(currenturl)>=0){
             setTimeout(function(){
                   chrome.windows.update(window.id, {focused: true,drawAttention:true},function(){});
             }, 500);

             found=true;
           }
        });
      }
    });
    if (!found)
    openapps();
  });
