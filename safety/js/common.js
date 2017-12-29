 $(function(){
    var audio = $('#audio')[0]

    var musicLogo = $(".music-logo");

    var isStart = false;

   $(musicLogo).bind('touchend',function () {
        if ( isStart == false ) {

            $(musicLogo).addClass( "playing" );
            audio.play();
        }

        isStart = true;

    } );
    $(musicLogo).bind('touchend', function () {
        // musicLogo.hasClass( "playing" ) ? audio.pause();musiclogo.removeClass('playing') : audio.play();musiclogo.addClass('playing');
        // musicLogo.toggle( "playing" );
        if($(musicLogo).hasClass( "playing" )){
            audio.pause();
            $(musicLogo).removeClass('playing')
        }else{
             audio.play();
             $(musicLogo).addClass('playing')
        }
    } );
 })   
    
