/*======================================
-----Preloader------
======================================*/
$(window).on("load",function(){
  $('#status').fadeOut();
  $('#preloader').delay(350).fadeOut("slow");

});

/*======================================
-----Navigation------
======================================*/
$(function(){
  showHideNav();
  $(window).scroll(function(){
    showHideNav();
  });
  function showHideNav(){
    if( $(window).scrollTop() > 50 ){
      // $("nav").addClass("white-nav-top");
      // $(".navbar-brand img").attr("src", "./img/logo-dark.png");
      $("#back-to-top").fadeIn();

    } else {
      // $("nav").removeClass("white-nav-top");
      // $(".navbar-brand img").attr("src","./img/logo.png");
      $("#back-to-top").fadeOut();
    }
  }
});
$(function(){
  $("a.smooth-scroll").click(function(event){
    event.preventDefault();
    var section_id = $(this).attr("href");
    $("html, body").animate({
      scrollTop: $(section_id).offset().top - 64},
      1250);

  });
});
$(function(){
  $("#mobile-nav-open-btn").click(function(){
    $("#mobile-nav").css("height", " 100%");
  });
  $("#mobile-nav-close-btn , #mobile-nav a").click(function(){
    $("#mobile-nav").css("height", " 0%");

    });
});

var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
function myFunction() {
  var txt;
  var r = confirm("Press a button!");
  if (r == true) {
    txt = "You pressed OK!";
  } else {
    txt = "You pressed Cancel!";
  }
  // document.getElementById("demo").innerHTML = txt;
}
function eventHandler(id){
  console.log(id);
}
