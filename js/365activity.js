$(function() {
  function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }

  var url = location.href;

  var uuid = GetQueryString("uuid");
  console.log(uuid);
  if (uuid === null) {
    window.sessionStorage.setItem("uuid", "");
  } else {
    window.sessionStorage.setItem("uuid", uuid);
  }

  if (window.sessionStorage.getItem("uuid")) {
    $(".button").click(function() {
      function isChinaName(name) {
        var pattern = /^[\u4E00-\u9FA5]{1,6}$/;
        return pattern.test(name);
      }
      function isPhoneNo(phone) {
        var pattern = /^1[34578]\d{9}$/;
        return pattern.test(phone);
      }
      function isCardNo(card) {
        var pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        return pattern.test(card);
      }
      function isdate(date) {
        var pattern = /^2/;
        return pattern.test(date);
      }
      var message = "";
      if ($.trim($(".input1").val()).length == 0) {
        // str += '名称没有输入\n';
        message += "姓名不能为空哦！";
        // alert("姓名不能为空哦！");
        $(".input1").focus();
      } else if (isChinaName($.trim($(".input1").val())) == false) {
        //  str += '名称不合法\n';
        //   alert("请填写正确的姓名！");
        message += "请填写正确的姓名！";
        $(".input1").focus();
      } else if ($.trim($(".input2").val()).length == 0) {
        //   验证手机号
        // str += '手机号没有输入\n';
        // alert("手机号不能为空哦！");
        message += "手机号不能为空哦！";
        $(".input2").focus();
      } else if (isPhoneNo($.trim($(".input2").val()) == false)) {
        //  str += '手机号码不正确\n';
        //   alert("请填写正确的手机号码！");
        message += "请填写正确的手机号码！";
        $(".input2").focus();
      } else if ($.trim($(".input3").val()).length == 0) {
        // str += '身份证号码没有输入\n';
        message += "证件号码不能为空哦！";
        // alert("证件号码不能为空哦！");
        $(".input3").focus();
      } else if (isCardNo($.trim($(".input3").val())) == false) {
        //  str += '身份证号不正确；\n';
        //   alert("请填写正确的证件号码！");
        message += "请填写正确的证件号码！";
        $(".input3").focus();
      
      } else if (!$(".checkbox").is(":checked")) {
        message += "请确认打勾";
        // alert("请确认打勾");
        $(".button").disabled = "disabled";
      }
      if (message !== "") {
        alert(message);
        return false;
      }

      var name = $(".input1").val();
      var phone = $(".input2").val();
      var identity = $(".input3").val();
      // var begindate = $("#showDate").html();
      // var enddate = $("#showDate1").html();

      // begindate = begindate
      //   .replace("年", "-")
      //   .replace("月", "-")
      //   .replace("日", "");
      // while (begindate.indexOf(" ") !== -1) {
      //   begindate = begindate.replace(" ", "");
      // }

      // enddate = enddate
      //   .replace("年", "-")
      //   .replace("月", "-")
      //   .replace("日", "");
      // while (enddate.indexOf(" ") !== -1) {
      //   enddate = enddate.replace(" ", "");
      // }
      
       
            //$(".shade").css("display", "block");

            $.get(
              "http://aj.kingwingaviation.com/jax/retailsys/pay/getJSApiTicket",
              { url: window.location.href },
              function(data) {
                console.log(data);
                var result = JSON.parse(data.result);
                console.log(result);
                var appId = result.appId;
                var timeStamp = result.timeStamp;
                var nonceStr = result.nonceStr;
                var signature = result.signature;
                wx.config({
                  debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                  appId: appId, // 必填，公众号的唯一标识
                  timestamp: timeStamp, // 必填，生成签名的时间戳
                  nonceStr: nonceStr, // 必填，生成签名的随机串
                  signature: signature, // 必填，签名，见附录1
                  jsApiList: ["chooseWXPay"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                wx.ready(function() {
                  // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
              

                  $.ajax({
                    type: "post",
                    url:
                      "http://aj.kingwingaviation.com/jax/retailsys/pay/getYearCardRights",
                    datatype: "json",
                    contentType: "application/json",
                    data: JSON.stringify({
                      certNo: $(".input3").val(),
                      realname: $(".input1").val(),
                      mobile: $(".input2").val(),
                      uuid: uuid
                    }),
                    success: function(result) {
                      console.log(result);
                      if (result.rcode == "0009") {
                        alert("权益开始时间必须不早于明天");
                      }
                      if (result.rcode == "0015") {
                        alert("该用户已领取过该权益");
                      }
                      if (result.rcode == "0001") {
                        alert("Uuid已过期,请重新登录");
                      }
                      if (result.rcode == "0006") {
                        alert("证件号码输入错误");
                      }
                      if (result.rcode == "0005") {
                        alert("手机号输入错误");
                      }
                      if (result.rcode == "0007") {
                        alert("权益开始时间为空");
                      }
                      if (result.rcode == "0008") {
                        alert("权益结束时间为空");
                      }
                      if (result.rcode == "0010") {
                        alert("权益开始时间不能晚于结束时间");
                      }
                      if (result.rcode == "0011") {
                        alert("请注意，短期产品最多购买60天");
                      }
                      if (result.rcode == "0013") {
                        alert("活动已结束，更多惊喜请持续关注空降联盟！");
                      }
                      if (result.rcode == "0014") {
                        alert("你已经领完三次福利了");
                      }
                      if (result.rcode == "0015") {
                        alert("该用户已领取过该权益");
                      }
                      if (result.rcode == "0019") {
                        alert("你已拥有空降权益，无需重复购买");
                      }
                      if (result.rcode == "0021") {
                        alert("生效日需在购买日的90天以内");
                      }
                      if (result.rcode == "0024") {
                        alert("系统繁忙，请稍后再试！");
                      }
                      var result = JSON.parse(result.result);
                      console.log(result);
                      
                     
                      var timestamp = result.timeStamp;
                      var nonceStr = result.nonceStr;
                      //  var signature = result.signature
                      var package = result.package;
                      var paySign = result.paySign;
                      var signType = result.signType;
                      var outTradeNo =result.outTradeNo;
                      wx.chooseWXPay({
                        timestamp: timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                        nonceStr: nonceStr, // 支付签名随机串，不长于 32 位
                        package: package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                        signType: signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                        paySign: paySign, // 支付签名
                        success: function(res) {
                          // 支付成功后的回调函数
                          //alert(res);

                          if (res.errMsg == "chooseWXPay:ok") {
                            //支付成功
                            $(".shade").css("display", "block");
                           
                          } else {
                            $.ajax({
                              type: "post",
                              url:
                                "http://aj.kingwingaviation.com/jax/retailsys/pay/cancelOrder",
                              datatype: "json",
                              contentType: "application/json",
                              data:JSON.stringify({
                                uuid: uuid,
                                outTradeNo:outTradeNo
                              }),
                              success:function(){
                                window.location.href('http://aj.kingwingaviation.com/retailsys/365activity.html')
                              }
                            });
                          }
                          $('.close').click(function(){
                            $(".shade").css("display", "none");
                          })
                          
                        },
                        cancel: function() { 
                            // 用户取消分享后执行的回调函数 
                            $.ajax({
                              type: "post",
                              url:
                                "http://aj.kingwingaviation.com/jax/retailsys/pay/cancelOrder",
                              datatype: "json",
                              contentType: "application/json",
                              data:JSON.stringify({
                                uuid: uuid,
                                outTradeNo:outTradeNo
                              }),
                              success:function(){
                                window.location.href(
                               "http://aj.kingwingaviation.com/retailsys/365activity.html"
                             );
                              }
                            });
                        } 
                      });
                    }
                  });
                });
              }
            );
        
       
     
    });
    $('.shade-btn1').click(function(){
      var getuuid = window.sessionStorage.getItem("uuid");
      window.location.href= 'http://aj.kingwingaviation.com/retailsys/research.html';
    // console.log(s);
    })

    
  } else {
    window.location.href =
      "http://aj.kingwingaviation.com/jax/retailsys/pay/code?state=http://aj.kingwingaviation.com/retailsys/365activity.html";
  }
});