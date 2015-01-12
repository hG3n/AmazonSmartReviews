// This Script will remove the current Review <div>
chrome.browserAction.onClicked.addListener(function(tab) {
  
  url = tab.url;
  amazon = url.substring(11,17);
  product = url.substring(24,31);

  if(amazon == "amazon")
    chrome.tabs.executeScript( {file: "reviews.js" });
  else
    alert("This is just for Amazon");

});
