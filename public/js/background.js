if (!localStorage.getItem("first_time")) {
  window.open(chrome.runtime.getURL("/option_page.html"));
  localStorage.setItem("first_time", false);
}
var collect = {};
chrome.storage.local.get("collect", function(e) {
  if (e.collect) {
    collect = JSON.parse(e.collect);
  }
})
chrome.storage.local.get("lang_selected", function(e) {
  let lang_selected = "";
  if (e.lang_selected) {
    lang_selected = e.lang_selected;
  } else {
    lang_selected = "vi";
  }
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.content) {
      let result = JSON.parse(get_result_from_API(request.content, "en", lang_selected)).data.translations[0].translatedText;
      sendResponse({ "result": result });
      if (request.content != result) {
        set_collect(request.content, result);
      }
    } else if (request.reload) {
      console.log('reload: true');
      window.location.reload();
    } else if (request.collect) {
      if (Object.keys(request.collect)[0].toLowerCase() != Object.values(request.collect)[0].toLowerCase()) {
        set_collect(Object.keys(request.collect)[0], Object.values(request.collect)[0]);
      }
    }
  })
})

function get_result_from_API(str, from, to) {
  let url = "https://translation.googleapis.com/language/translate/v2?key='Your-API-Key'";
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

function set_collect(qs, as) {
  qs = qs.toLowerCase();
  as = as.toLowerCase();
    if (qs.split(" ").length === 1) {
      collect[qs] = as;
      chrome.storage.local.set({ "collect": JSON.stringify(collect) });
    } else if (qs.split(" ").length === 2 && qs.split(" ")[1] == "") {
      collect[qs.split(" ")[0]] = as;
      chrome.storage.local.set({ "collect": JSON.stringify(collect) });
    }
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
