if(!localStorage.getItem("first_time")){
  window.open(chrome.runtime.getURL("/option_page.html"));
  localStorage.setItem("first_time", false);
} 
chrome.storage.local.get("lang_selected", function(e) {
  let lang_selected="";
  if (e.lang_selected) {
    lang_selected = e.lang_selected;
  } else{
    lang_selected = "vi";
  }
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.content) {
      let result = JSON.parse(get_result_from_API(request.content, "en", lang_selected)).data.translations[0].translatedText;
      if (!result) {
        result = "error, please reload extension";
      }
      sendResponse({ "result": result });
    }
  })
})
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if(request.reload){
    console.log('reload: true');
    window.location.reload();
  }
})
function get_result_from_API(str, from, to) {
  let url = "https://translation.googleapis.com/language/translate/v2?key=AIzaSyBS3kL-NT547cm3dyi6ooj2XYtarN7w5tc";
  url += "&source=" + from;
  url += "&target=" + to;
  url += "&q=" + encodeURIComponent(str);
  return $.ajax({
    url: url,
    type: "get",
    async: false
    // success: function(data, status) {
    //   if (status == "success") {
    //     let target = data.data.translations[0].translatedText;
    //     return target;
    //   }
    // }
  }).responseText;
}

function get_speak() {
  $('.speak').click(function() {
    let from = $(this).attr('data-src');
    let str = $(this).attr('speak-for');
    let url = "https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=" + from + "&q=" + encodeURIComponent(String(str));
    let au = $('<audio>', {
      'src': url
    })
    au[0].play();
  });
};