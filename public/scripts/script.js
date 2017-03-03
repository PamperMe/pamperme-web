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
        $('.menu-nav-container').css({"margin-top":"50px"});
        $('.menu-nav').css({display:"inline"});
    }else{
        $('.menu-nav').css({display:"none"});
        $('.menu-nav-container').css({"margin-top":"0"});
    }
});
$('.btn-fl-bbsitter').click(function(){
    $('.btn-fl-client').removeClass('active');
    $('.btn-fl-bbsitter').addClass('active');
    $('.fl-bbsitter').css({display:"inline"});
    $('.fl-client').css({display:"none"});

});
$('.btn-fl-client').click(function(){
    $('.btn-fl-bbsitter').removeClass('active');
    $('.btn-fl-client').addClass('active');
    $('.fl-bbsitter').css({display:"none"});
    $('.fl-client').css({display:"inline"});
});


// $('tr[data-href]').on("click", function() {
//     document.location = $(this).data('href');
//     // TODO colocar popup para aceitar/rejeitar marcação
//     alert("Colocar popup aqui");
// });


$('#photo_change').click(function () {
    $('#uploadForm').toggle();

});


$('#photo_uploaded').click(function () {
    $('#uploadForm').hide();

});