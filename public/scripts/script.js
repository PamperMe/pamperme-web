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
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBP1B8MFHnGkg5VRoezvj3ozEg_yEDPZ84",
    authDomain: "pamperme-15d4e.firebaseapp.com",
    databaseURL: "https://pamperme-15d4e.firebaseio.com",
    storageBucket: "pamperme-15d4e.appspot.com",
    messagingSenderId: "881083284025"
};
firebase.initializeApp(config);




    function login() {
        var provider = new firebase.auth.FacebookAuthProvider();

        firebase.auth().signInWithPopup(provider).then(function(result) {
            console.log(result);
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            console.log(user);
            // ...
            window.location.replace("/facebook/" + token);

        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
    }