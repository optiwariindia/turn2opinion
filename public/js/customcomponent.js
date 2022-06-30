  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
  
    if (scroll >= 150) {
      $("#quote-bttn").addClass("sticky-active");
    } else {
      $("#quote-bttn").removeClass("sticky-active");
    }
  });
  
  $("#quote-bttn").click(function () {
    $(".popup-request-form").addClass("m-open");
    $("body").addClass("m-open");
  });
  
  $(".popup-request-form .request-form .cross-bttn").click(function () {
    $(this).parent().parent().removeClass("m-open");
    $("body").removeClass("m-open");
  });
  
  $(".main-content .accordian .ans").wrapInner("<div class='acc-inner'></div>");
  
  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
  
    if (scroll >= 100) {
      $(".main-header").addClass("sticky");
    } else {
      $(".main-header").removeClass("sticky");
    }
  });
  
  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
  
    if (scroll >= 150) {
      $(".main-header").addClass("sticky-active");
    } else {
      $(".main-header").removeClass("sticky-active");
    }
  });
  
  $(".main-header .menu-area .mobile-trigger").click(function () {
    $(this).parent().addClass("m-open");
  });
  
  $(".main-header .menu-area nav .close-menu").click(function () {
    $(this).parent().parent().removeClass("m-open");
  });
  
  $(".main-header .menu-area nav ul li a").click(function () {
    $(".main-header .menu-area").removeClass("m-open");
  });
  
  $(".accordian .que").click(function () {
    $(this).parent().children(".ans").slideToggle();
    $(this).parent().toggleClass("ac-open");
    $(this).parent().siblings().removeClass("ac-open");
    $(this).parent().siblings().children(".ans").slideUp();
  });
