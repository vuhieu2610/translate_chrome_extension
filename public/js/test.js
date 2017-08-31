$(document).ready(function() {
  var sexyImage = [];
  $.ajax({
    url: 'https://translate-extension.herokuapp.com/geta',
    type: "POST",
    data: "hello"
  }).done(function(data) {
    console.log('post done');
    sexyImage = data;
    data.forEach(key => {
      let img = $('<img>', {
        "src": key
      })
      $('#slider ul').append($('<li>').append(img))
    })
  })
  $modal = $('.modal-frame');
  $overlay = $('.modal-overlay');
  $modal.bind('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
    if ($modal.hasClass('state-leave')) {
      $modal.removeClass('state-leave');
    }
  });
  $('.close').on('click', function() {
    $overlay.removeClass('state-show');
    $modal.removeClass('state-appear').addClass('state-leave');
  });
  var collect = {};
  chrome.storage.local.get("collect", function(e) {
    if (e.collect) {
      collect = JSON.parse(e.collect);
      let length = Object.keys(collect).length;
      if (Object.keys(collect).length >= 20) {
        let count = 1;
        Object.keys(collect).forEach((value, key) => {
          if (key <= 30) {
            let qs = $("<div>", {
              "class": "qs_block"
            });
            qs.html(`<p class="qs">` + count + `. What does <i>` + value + `</i> mean: </p> <input type="text" class="` + value + ` as">`);
            qs.insertBefore($(".submit"));
            count++;
          }
        })
      }
    }
    if (!e.collect || Object.keys(collect).length < 20) {
      let length = 0;
      if (e.collect) {
        length = Object.keys(collect).length;
      }
      confirm("The amount of vocabulary is not enough to do the test \nYou must learn 20 or more words \nYou have learned " + length + " words ");
      window.close();
    }
  })
  $(".submit_the_test").click(function() {
    check_true_or_false();
  })
  $(".give_up").click(function() {
    if (confirm("Are you sure?") === true) {
      window.close();
    }
  })

  function check_true_or_false() {
    let count = 0;
    let total = Object.keys(collect).length;

    Object.keys(collect).forEach(key => {
      if (collect[key].toLowerCase() != $("." + key)[0].value.toLowerCase()) {
        $("." + key).css({
          "border-bottom": "1px solid red"
        })
      } else {
        count++
        $("." + key).css({
          "border-bottom": "1px solid #4CAF50"
        })
        delete collect[key];
        chrome.runtime.sendMessage({ "reload": true });
      }
    })
    if ((count / total) * 100 >= 85) {
      chrome.storage.local.set({ "collect": JSON.stringify(collect) }, function() {});
      $(".modal_header").text("congratulations");
      $(".modal_body").text("You have completed your test " + count + ` / ` + total);
      $overlay.addClass('state-show');
      $modal.removeClass('state-leave').addClass('state-appear');
    } else {
      if (confirm("You must execute more than or equal 85% the test\nClick ok to do again, cancle to check the test") === true) {
      window.location.reload();
    }
    }
  }

  var slideCount = $('#slider ul li').length;
  var slideWidth = $('#slider ul li').width();
  var slideHeight = $('#slider ul li').height();
  var sliderUlWidth = slideCount * slideWidth;

  $('#slider').css({ width: slideWidth, height: slideHeight });

  $('#slider ul').css({ width: sliderUlWidth, marginLeft: -slideWidth });

  $('#slider ul li:last-child').prependTo('#slider ul');

  function moveLeft() {
    $('#slider ul').animate({
      left: +slideWidth
    }, 200, function() {
      $('#slider ul li:last-child').prependTo('#slider ul');
      $('#slider ul').css('left', '');
    });
  };

  function moveRight() {
    $('#slider ul').animate({
      left: -slideWidth
    }, 200, function() {
      $('#slider ul li:first-child').appendTo('#slider ul');
      $('#slider ul').css('left', '');
    });
  };

  $('a.control_prev').click(function() {
    moveLeft();
  });

  $('a.control_next').click(function() {
    moveRight();
  });
})