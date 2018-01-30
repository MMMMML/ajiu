$(function(){

/*
 *   @自定义内容
 *   var dataForWeixin = {
 *       title: '标题',
 *       desc: '描述',
 *       imgUrl: 'http://xxx.com/xx.jpg',
 *       link: 'http://xxx.com/xx.html',
 *       dataUrl:'/wxhandlernurse/jssdk.ashx'
 *   };
*/
var dataShare = {
    title: '出行有双侠，沿途更潇洒！',
    desc: '限时福利，即刻领取！',
    imgUrl: 'http://aj.kingwingaviation.com/retailsys/img/share_free.jpg',
    link: 'http://aj.kingwingaviation.com/retailsys/homepage.html',   
    dataUrl: "http://aj.kingwingaviation.com/jax/retailsys/pay/getJSApiTicket",
};
setWeiXinShare(dataShare);

function setWeiXinShare(dataShare) {
    var jsurl =  encodeURIComponent(location.href.split('#')[0]);

    $.ajax({
        type: 'get',
        data: {url:jsurl,share:1},
        url: dataShare.dataUrl,
        success: function (data) {
            
            var result = JSON.parse(data.result);
            // console.log(result);
            var appId = result.appId;
            var timeStamp = result.timeStamp;
            var nonceStr = result.nonceStr;
            var signature = result.signature;
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: appId, // 必填，公众号的唯一标识
                timestamp: timeStamp, // 必填，生成签名的时间戳
                nonceStr:nonceStr, // 必填，生成签名的随机串
                signature: signature,// 必填，签名，见附录1
                jsApiList: ['hideOptionMenu', 'onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });

            wx.ready(function () {
                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
           
                //隐藏操作菜单
                //wx.hideOptionMenu();

                //分享到朋友圈
                wx.onMenuShareTimeline({
                    title: dataShare.title, // 分享标题
                    link: dataShare.link, // 分享链接
                    imgUrl: dataShare.imgUrl, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });

                //分享给朋友
                wx.onMenuShareAppMessage({
                    title: dataShare.title, // 分享标题
                    desc: dataShare.desc, // 分享描述
                    link: dataShare.link, // 分享链接
                    imgUrl: dataShare.imgUrl, // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
            });

            wx.error(function (res) {
                //alert(res.errMsg);  //打印错误消息。及把 debug:false,设置为debug:ture就可以直接在网页上看到弹出的错误提示
            });
        }
    });
}
})