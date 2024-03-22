// menu //
if (jQuery('.xs-menus').length > 0) {
  jQuery('.xs-menus').xs_nav({
    mobileBreakpoint: 992,
  });
}
if (jQuery('.nav-hidden-menu').length > 0) {
  jQuery('.nav-hidden-menu').xs_nav({
    hidden: true
  });
  jQuery(".btn-show").click(function(){ 
    jQuery(".nav-hidden-menu").data("xs_nav").toggleOffcanvas();
  });
}


//banner slider //
$('.banner-slider').slick({
  slidesToShow: 1,
  autoplay: true,
  pauseOnHover: true,
  dots: true,
});

// popular slider //
$('.popular-slider').slick({
  centerMode: true,
  slidesToShow: 6,
  autoplay: false,
  pauseOnHover: true,
  centerPadding: '50px',
  responsive: [
    {
      breakpoint: 768,
      settings: {
        arrows: false,
        centerMode: true,
        slidesToShow: 4
      }
    },
    {
      breakpoint: 991,
      settings: {
        arrows: false,
        centerMode: false,
        slidesToShow: 4
      }
    },
    {
      breakpoint: 767,
      settings: {
        arrows: false,
        centerMode: false,
        slidesToShow: 3
      }
    },
    {
      breakpoint: 480,
      settings: {
        arrows: false,
        centerMode: false,
        slidesToShow: 2
      }
    },
    {
      breakpoint: 300,
      settings: {
        arrows: false,
        centerMode: false,
        slidesToShow: 2
      }
    }
  ]
  
});

// tab slider //
$('.tab-slider').slick({
  centerMode: true,
  slidesToShow: 6,
  autoplay: true,
  pauseOnHover: true,
  centerPadding: '50px',
  responsive: [
    {
      breakpoint: 768,
      settings: {
        arrows: false,
        centerMode: true,
        slidesToShow: 4
      }
    },
    {
      breakpoint: 991,
      settings: {
        arrows: false,
        centerMode: false,
        slidesToShow: 4
      }
    },
    {
      breakpoint: 767,
      settings: {
        arrows: false,
        centerMode: false,
        slidesToShow: 3
      }
    },
    {
      breakpoint: 480,
      settings: {
        arrows: false,
        centerMode: false,
        slidesToShow: 2
      }
    },
    {
      breakpoint: 300,
      settings: {
        arrows: false,
        centerMode: false,
        slidesToShow: 2
      }
    }
  ]
});

// nice select //
$(document).ready(function() {
  $('select.customSelect').niceSelect();
});

//product slider //
$('.prd-slider').slick({
  slidesToShow: 1,
  autoplay: true,
  pauseOnHover: true,
  // dots: true,
  // fade: true,
  speed: 1500
});

// fancy box //
$('[data-fancybox]').fancybox({
  protect: true,
});

// related slider //
$('.relatedPrd-slider').slick({
  centerMode: true,
  slidesToShow: 6,
  autoplay: true,
  pauseOnHover: true,
  centerPadding: '50px',
  responsive: [
    {
      breakpoint: 768,
      settings: {
        arrows: false,
        centerMode: true,
        slidesToShow: 4
      }
    },
    {
      breakpoint: 991,
      settings: {
        arrows: false,
        centerMode: false,
        slidesToShow: 4
      }
    },
    {
      breakpoint: 767,
      settings: {
        arrows: false,
        centerMode: false,
        slidesToShow: 3
      }
    },
    {
      breakpoint: 480,
      settings: {
        arrows: false,
        centerMode: false,
        slidesToShow: 2
      }
    },
    {
      breakpoint: 300,
      settings: {
        arrows: false,
        centerMode: false,
        slidesToShow: 2
      }
    }
  ]
});


// payment method //
$(".payment-detail").hide();
  $(':input[type="radio"]').on('change', function() {
  $(".payment-detail").slideUp();
  $(this).parent('label').next('div').slideToggle(this.checked);
});

// login password //
$(".toggle-password").click(function() {
  $(this).toggleClass("las la-eye-slash las la-eye");
  // var input = $('#password');
    var input = $(this).parent().find(':input');
  if (input.attr("type") == "password") {
    input.attr("type", "text");
  } else {
    input.attr("type", "password");
  }
});
//tooogle //
$('.address__book').click(function() {
  $('.address__block').slideToggle('slow');
});

// multiple select //
$('#multiple').select2({
  theme: "bootstrap"
});
$('#select2').select2({
  theme: "bootstrap",
  placeholder: "Sort By : ",
  allowClear: true
});
$('.select_2').select2({
  theme: "bootstrap",
  placeholder: "Select District ",
  allowClear: true
});
$('.select_3').select2({
  theme: "bootstrap",
  placeholder: "Select Establishment Year ",
  allowClear: true
});
$('.select_4').select2({
  theme: "bootstrap",
  placeholder: "Select Employee Count ",
  allowClear: true
});
$('.select_5').select2({
  theme: "bootstrap",
  placeholder: "Entity Type ",
  allowClear: true
});
$('.select_5').select2({
  theme: "bootstrap",
  placeholder: "Business Type ",
  allowClear: true
});
$('.select_7').select2({
  theme: "bootstrap",
  placeholder: "Industry Sector ",
  allowClear: true
});


// search //
jQuery(function searchbox() {
  if(jQuery('.search-toggle').length){
    jQuery('.search-toggle').on('click', function() {
      jQuery(this).toggleClass('active');
      jQuery(this).next('.search-box').toggleClass('now-visible');
    });
  }
});

//sticky header //
jQuery( document ).ready( function( $ ) {
  $( '#sticky' ).stickable();
});
// go to top add class //
$(window).on('scroll', function(){
  var scrolled = $(window).scrollTop();
  if (scrolled > 600) $('.go-top').addClass('active');
  if (scrolled < 600) $('.go-top').removeClass('active');
});
$('.go-top').on('click', function() {
  $("html, body").animate({ scrollTop: "0" },  500);
});