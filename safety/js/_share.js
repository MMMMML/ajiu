
function doAsyn(callback) {
    if (typeof TcsJSBridge == "object" && typeof TcsJSBridge.invoke == "function") {
        // log("ready for: " + callback);
        callback();
    } else {
        if (document.addEventListener) {
            // log("not ready, addEventListener for: " + callback);
            document.addEventListener("TcsJSBridgeReady", callback, false);
        } else if (document.attachEvent) {
            // log("not ready, attachEvent for: " + callback);
            document.attachEvent("TcsJSBridgeReady", callback);
            document.attachEvent("onTcsJSBridgeReady", callback);
        }
    }
}

/**
* url锛歋tring绫诲瀷锛屽繀閫夛紝闇€瑕佹墦寮€鐨剈rl
* aFinishSelf锛氬竷灏旂被鍨嬶紝閫夊～锛岄粯璁や负false锛屾槸鍚﹀叧闂綋鍓嶇殑椤甸潰
* 鍥炶皟鍑芥暟杩斿洖鍐呭:
* res.err_msg锛氳皟鐢ㄧ粨鏋滐紝String绫诲瀷锛�"ok"琛ㄧず璋冪敤鎴愬姛
* res.ret: 鎵ц缁撴灉锛宨nt绫诲瀷锛�0琛ㄧず鎴愬姛
*/
function gotoWXWebView(aUrl, aFinishSelf) {
    doAsyn(function () {
        TcsJSBridge.invoke("gotoWXWebView", {
            url: aUrl,
            finishSelf: aFinishSelf
        }, function (res) {
            if (res.err_msg == "ok" && res.ret == 0) {
                // alert('璺宠浆鎴愬姛')
            } else {
                log("err_msg: " + res.err_msg + " res.ret: " + res.ret);
            }
        });
    });
}


var userAgent = navigator.userAgent;
var wifimanager1 = new RegExp("com.tencent.wifimanager").test(userAgent);
var wifimanager2 = new RegExp("MQQWiFiManager").test(userAgent);
if (wifimanager1 || wifimanager2) {
    //alert('userAgent:'+userAgent+'wifimanager1:'+wifimanager1+'wifimanager2:'+wifimanager2);
    var url = location.href;
    //console.log(url);
    gotoWXWebView(url, true);
} else {
    //闈欐€佽祫婧愭枃浠�
    var staticUrl = "http://3gimg.qq.com/mig-web/2017/market/act/guanjiawifi/resource/";
    //var staticUrl = "resource/";

    //绛惧悕鍙傛暟
    var myUrl = location.href.split("#")[0].replace(/&/g, "_replace_");
    var params = encodeURIComponent("{url:" + myUrl + "}");

    //寰俊绛惧悕鐨勫湴鍧€
    var signature = 'http://t.api.jimingkeji.com.cn/wechat/?service=Share.index&wechat_type=jm_test';

    //璧勬簮缁熶竴鐗堟湰鍙�
    var res_ver = "123b";

    var videoPlay = document.getElementById("showVideo");

    //瀹夊崜涓嬭浇閾炬帴
    var androidDownload = "http://sdi.3g.qq.com/v/2017103119524411302";

    //鑻规灉涓嬭浇閾炬帴
    var iosDownload = "https://itunes.apple.com/app/apple-store/id1001153553?pt=69276&ct=106443&mt=8";

    //闃叉瑙嗛鐧藉睆
    var poster = document.getElementById("poster");
    poster.style.visibility = "hidden";

    //姘存淮缁熻閰嶇疆
    var sd_cfg = {
        "begin": ["7", "1"],//杩涚珯鎸夐挳
        "change": ["7", "2"],//鍒囨崲瑙嗛鎸夐挳
        "jump": ["7", "3"],//璺宠繃瑙嗛鎸夐挳
        "again": ["7", "4"],//鍐嶆瑙傜湅鎸夐挳
        "city": ["7", "5"],//鏌ョ湅鍩庡競鎸夐挳
        "download": ["7", "6"],//涓嬭浇鎸夐挳
        "exit": ["7", "7"],//锛堝畨鍗擄級閫€鍑鸿棰戯紝璺宠浆鍒版渶鍚庝竴椤�
        "share": ["3", "2"],//鍒嗕韩鎴愬姛
        "source": ["5"],//浼犳挱鏉ユ簮锛堝垎浜眰绾э級
        "page1": ["8", "1"],//绗竴椤碉紙瀹氫綅锛�
        "page2": ["8", "2"],//绗簩椤碉紙瑙嗛锛�
        "page3": ["8", "3"]//绗笁椤碉紙3涓寜閽級
    }

    // cp jssdk
    function get_CP_Signature() {
        $.ajax({
            type: "POST",
            url: signature,
            dataType: "json",
            data: {},
            async: false,
            success: function (data) {
                var result = data["data"]["content"];
                wxConfig(result);
                // wx.config({
                //     //debug: true,
                //     appId: result['appId'],
                //     timestamp: result['timestamp'],
                //     nonceStr: result['nonceStr'],
                //     signature: result['signature'],
                //     jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "getLocation"]
                // });
                // wx.ready(function () {
                //     videoPlay.play();
                //     setTimeout(function () {
                //         videoPlay.pause()
                //     }, 500)
                // });
            },
            error: function (message) {
                console.log("鑾峰彇绛惧悕澶辫触锛�", message);
            }
        });
    }
    // get_CP_Signature();

    function wxConfig(result) {
        wx.config({
            //debug: true,
            appId: result['appId'],
            timestamp: result['timestamp'],
            nonceStr: result['nonceStr'],
            signature: result['signature'],
            jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "getLocation"]
        });
        wx.ready(function () {
            videoPlay.play();
            setTimeout(function () {
                videoPlay.pause();
            }, 500)
        });
    }

    // tencent jssdk
    function get_jsSDK() {
        var sendUrl = location.href;
        sendUrl = (sendUrl).replace(/[\&]/g, "_replace_");
        $.ajax({
            type: 'post',
            url: 'http://service.mkt.qq.com/interface?interface_name=mktservice_wifi_getsignature',
            dataType: 'json',
            data: { interface_params: JSON.stringify({ url: sendUrl }) },
            success: function (res) {
                if (res.ret_code === 200) {
                    wxConfig({
                        appId: "wx25d2c6ff4ce32397",
                        timestamp: res.data.timestamp,
                        nonceStr: res.data.nonceStr,
                        signature: res.data.signature,
                        jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "getLocation"]
                    });
                } else {
                    console.log("绛惧悕澶辫触");
                }
            },
            error: function (res) { },
        });
    }
    get_jsSDK();
    //闃叉鍔犺浇杩囧揩锛屽鑷存彁鍓嶅嚭鐜板畾浣嶆巿鏉冨脊绐�
    var showEgret = false;
    //绉婚櫎閿佸睆鎻愮ず
    var lock = document.getElementById("lock");
    setTimeout(function () {
        showEgret = true;
        //egret.runEgret({ renderMode: "canvas", audioType: 0 });
        document.body.removeChild(lock);
    }, 3000)
    //闃叉loading鐧藉睆锛堟敞閲婁笂闈㈢殑鐧介弓寮曟搸鍚姩浠ｇ爜锛�
    setTimeout(function () {
        egret.runEgret({ renderMode: "canvas", audioType: 0 });
    }, 2500)

    //绉诲姩瑙嗛
    function change() {
        $('#showVideo').toggleClass("videolayout");
    }

    //鑾峰彇url鍙傛暟鈥斺€斺€斺€斺€斺€斺€斺€攕di_sc
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }

    //浼犳挱鏉ユ簮缁熻
    var grade = (GetQueryString("sdi_sc"));
    if (grade) {
        GV.SDITG([sd_cfg.source[0], grade])
    } else {
        GV.SDITG([sd_cfg.source[0], "0"])//鎵撳紑鍘熷閾炬帴
    }

    var imgShare = 'http://3gimg.qq.com/mig-web/2017/market/act/guanjiawifi/';
    var gameUrlShare = 'http://migmkt.qq.com/g/act/guanjiawifi.html';
    var getSdiFrom = GetQueryString("sdi_from");
    if (getSdiFrom !== null) {
        gameUrlShare = gameUrlShare + "?sdi_from=" + getSdiFrom;
    }
    //姘存淮鍒嗕韩
    _sdi.share.init({
        appid: '',
        img_url: imgShare + "resource/share.jpg",
        link: gameUrlShare,
        desc: '娌iFi鐨勬案杩滃湪楠氬姩锛屾湁WiFi鐨勯兘鏈夋亙鏃犳亹',
        title: '鍏嶈垂濂絎iFi锛屽湴閾侀兘鑳借繛'
    }, function (opt) {
        //鍒嗕韩鍓嶇殑鍥炶皟锛宱pt鏄垎浜殑鍙傛暟
    }, function (res) {
        //GV.SDITG(sd_cfg.share)
        //缁熻鏂瑰紡锛歘sdi.stat({ptype:'3',stype:'x'});
        //鍒嗕韩瀹屾垚鍚庡洖璋冿紝鍙互鐢ㄦ潵鍒ゆ柇鐢ㄦ埛鏄惁鍒嗕韩鎴愬姛浜�
    });

}
/**
* {
* "renderMode":, //寮曟搸娓叉煋妯″紡锛�"canvas" 鎴栬€� "webgl"
* "audioType": "" //浣跨敤鐨勯煶棰戠被鍨嬶紝0:榛樿锛�1:qq audio锛�2:web audio锛�3:audio
* "antialias": //WebGL妯″紡涓嬫槸鍚﹀紑鍚姉閿娇锛宼rue:寮€鍚紝false:鍏抽棴锛岄粯璁や负false
* }
**/
// egret.runEgret({renderMode:"canvas", audioType:0});