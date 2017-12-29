//mainsize

//loading
$(function () {

    var count = 0;
    var images = [
        'bg_1.jpg',
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
        's1.mp4',
        'bg_3.jpg',
        's2.mp4',
        'bg4.jpg',
        
    ];
    $.ajaxSetup({
        cache: true
    });
    var _length = images.length;
    var local_url = document.location.href; 
            //获取要取得的get参数位置
    var par = "go"
    var get = local_url.indexOf(par +"=");
    
    //截取字符串
    var get_par = local_url.slice(par.length + get + 1);    
    //判断截取后的字符串是否还有其他get参数
    var nextPar = get_par.indexOf("&");
    if(nextPar != -1){
        get_par = get_par.slice(0, nextPar);
    }
    console.log(get_par)
    if(get_par!=1){
        images.forEach(function (file) {
        var _ = new Image();
        _.src = "./img/" + file;
        $(_).bind("load error", function () {
            count++;
            var percent = parseInt(100 * count / _length);
            // console.log(percent)
            $("#number").text( percent + '%');
            if (count === _length) {
                
                // $(".start").removeClass('hide').addClass('show');
               
                flag = 0;

               

                return;
            }

        });
    });             
    }else{
       // $("#load").hide();
        // $("#load ").html($(".textarea").val());

    }

    
});