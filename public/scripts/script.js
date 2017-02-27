$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});
$(window).resize(function(){
    if($(window).width()<=768){
        $('.menu-nav').css({display:"none"});
    }else{
        $('.menu-nav').css({display:"block"});
    }
});
$('.btn-sso').click(function(){
    if($('.menu-nav').css("display") != "inline"){
        $('.menu-nav').css({display:"inline"});
    }else{
        $('.menu-nav').css({display:"none"});
    }
});