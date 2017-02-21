$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});
$('.menu').click(function(){
    $('.menu-nav').children().each(function () {
        $('.menu').reoveClass('menu-active');
    });


});