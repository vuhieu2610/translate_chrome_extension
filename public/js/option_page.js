var storage = chrome.storage.local;
$(document).ready(function() {
  var lang_option = {
    "AF": "Afrikaans",
    "SQ": "Albanian",
    "AR": "Arabic",
    "HY": "Armenian",
    "EU": "Basque",
    "BN": "Bengali",
    "BG": "Bulgarian",
    "CA": "Catalan",
    "KM": "Cambodian",
    "ZH": "Chinese (Mandarin)",
    "HR": "Croation",
    "CS": "Czech",
    "DA": "Danish",
    "NL": "Dutch",
    "ET": "Estonian",
    "FI": "Finnish",
    "FR": "French",
    "KA": "Georgian",
    "DE": "German",
    "EL": "Greek",
    "GU": "Gujarati",
    "HE": "Hebrew",
    "HI": "Hindi",
    "HU": "Hungarian",
    "IS": "Icelandic",
    "ID": "Indonesian",
    "GA": "Irish",
    "IT": "Italian",
    "JA": "Japanese",
    "JW": "Javanese",
    "KO": "Korean",
    "LA": "Latin",
    "LV": "Latvian",
    "LT": "Lithuanian",
    "MK": "Macedonian",
    "MS": "Malay",
    "ML": "Malayalam",
    "MT": "Maltese",
    "MI": "Maori",
    "MR": "Marathi",
    "MN": "Mongolian",
    "NE": "Nepali",
    "NO": "Norwegian",
    "FA": "Persian",
    "PL": "Polish",
    "PT": "Portuguese",
    "PA": "Punjabi",
    "QU": "Quechua",
    "RO": "Romanian",
    "RU": "Russian",
    "SM": "Samoan",
    "SR": "Serbian",
    "SK": "Slovak",
    "SL": "Slovenian",
    "ES": "Spanish",
    "SW": "Swahili",
    "SV": "Swedish ",
    "TA": "Tamil",
    "TT": "Tatar",
    "TE": "Telugu",
    "TH": "Thai",
    "BO": "Tibetan",
    "TO": "Tonga",
    "TR": "Turkish",
    "UK": "Ukranian",
    "UR": "Urdu",
    "UZ": "Uzbek",
    "VI": "Vietnamese",
    "CY": "Welsh",
    "XH": "Xhosa"
  }
  Object.keys(lang_option).forEach(key => {
    let option = $('<option>', {
      "value": key.toLowerCase()
    })
    option.text(lang_option[key]);
    $("#select").append(option);
  })


  storage.get("lang_selected", function(e) {
    $("#select option").removeAttr("selected");
    if (e.lang_selected) {
      console.log(e.lang_selected);
      $("option[value=" + e.lang_selected + "]").attr("selected", "selected");
    } else {
      storage.set({ "lang_selected": "vi" }, function() {});
      $("option[value=vi]").attr("selected", "selected");
    }
  })
  $(".save").click(function() {
    storage.set({ "lang_selected": $("#select")[0].value }, function() {
      chrome.runtime.sendMessage({ "reload": true });
      let alert = $("<div>", {
        "class": "alert alert-success",
        "role": "alert"
      });
      alert.css({
        "padding": "0",
        "display": "flex",
        "justify-content": "center",
        "align-items": "center",
        "height": "0",
        "overflow": "hidden",
        "transition": "height 0.2s",
        "border": "none",
        "margin": "0"
      })
      alert.html("<strong>The option has been saved</strong>");
      alert.insertBefore($(".form"));
      setTimeout(function() {
        alert.css({
          "height": "50px"
        })
      }, 100)
      setTimeout(function() {
        $(".alert").css({
          "height": "0"
        })
        setTimeout(function() {
          $(".alert").remove();
        }, 500)
      }, 3000)
    });
  })
})