//mainsize

//loading
$(function () {
    var percent = 0;
    var count = 0;
    var images = [
        '_bg_1.gif',
        'start.png',
        'tag.png',
        'bkg_2.jpg',
        '0.png',
        '1.png',
        '2.png',
        '3.png',
        '4.png',
        '5.png',
        '6.png',
        '7.png',
        '8.png',
        '9.png',
        '1.mp3',
        '2.mp3',
        'code.png',
        'lock.jpeg',
        'symbol.png',
        'text3.png',
        'btn.png',
        'btn_on.png',
        'bg4.jpg',
        'bg_3.jpg',
        'text2.png',
        'plan.png',
        'again.png',
        'start.png',
        'text.png',
        '1.wav',
        '1.wav',
        's0.mp4',
        's2.mp4',


    ];
    $.ajaxSetup({
        cache: true
    });
    var _length = images.length;
    var local_url = document.location.href;
            //获取要取得的get参数位置
    var par = "go"
    var get = local_url.indexOf(par +"=");
    var count_f = 0;
    //截取字符串
    var get_par = local_url.slice(par.length + get + 1);
    //判断截取后的字符串是否还有其他get参数
    var nextPar = get_par.indexOf("&");
    if(nextPar != -1){
        get_par = get_par.slice(0, nextPar);
    }

    // console.log(get_par)
    if(get_par!=1){
        images.forEach(function (file) {
        var _ = new Image();
        _.src = "./img/" + file;
        $(_).bind("load error", function () {
            count++;
            percent = parseInt(100 * (count) / _length-20);



            $("#number").text( percent + '%');
            if (count === _length) {

               count_f =1





                return;
            }

        });
    });
    }else{
       // $("#load").hide();
        // $("#load ").html($(".textarea").val());

    }

    var vidio_1 = 0;
    var vidio_2 = 0;




        // if(vidio_1==0){

        // var vidioElem = document.getElementById('mvideo');

        // vidioElem.oncanplay=function(){
        //     vidio_1 = 10;

        //     $("#number").text( 90 + '%');


        // }
        // // alert(1)
        // // }
        // // if(vidio_2==0){
        // var vidioElem2 = document.getElementById('mvideo2');
        // vidioElem2.oncanplay=function(){
        //     vidio_2 = 10;


        // }



        myPlayer.ready(function(){
            vidio_1 = 10;
            // alert(1)

            $("#number").text( 90 + '%');


        })
        myPlayer2.ready(function(){
            vidio_2 = 10;

            $("#number").text( 90 + '%');


        })



         var timer1 = window.setInterval(function () {

            if(count_f == 1&&vidio_1==10&&vidio_2==10){

                flag = 0;

                 $("#number").text( 100 + '%');
                 clearInterval(timer1);
            }
        }, 800);





});
