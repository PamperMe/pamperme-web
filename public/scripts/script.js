var displayMenu = false;

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});
$('.btn-sso').click(function(){
    if($('.menu-nav').css("display") != "inline"){
        $('.menu-nav').css({display:"inline"});
    }else{
        $('.menu-nav').css({display:"none"});
    }

});