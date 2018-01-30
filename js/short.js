$(function() {
  function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }

var certType = ''
  var mobileSelect1 = new MobileSelect({
    trigger: '#trigger1', 
    title: '选择证件类型',  
    wheels: [
                {data:[
                   {id:'1',value:'身份证'},
                   {id:'2',value:'护照'},
                   {id:'3',value:'回乡证'},
                   {id:'4',value:'台胞证'}
                ]}
            ],
    //初始化定位
    callback:function(indexArr, data){
      certType =  data[0].id; //返回选中的json数据
      console.log(certType)
    } 
  });

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
      
      } else if (isdate($.trim($("#showDate").html())) == false) {
        // alert("请选择开始日期");
        message += "请选择开始日期";
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
      var begindate = $("#showDate").html();
      var enddate = $("#showDate1").html();

      begindate = begindate
        .replace("年", "-")
        .replace("月", "-")
        .replace("日", "");
      while (begindate.indexOf(" ") !== -1) {
        begindate = begindate.replace(" ", "");
      }

      enddate = enddate
        .replace("年", "-")
        .replace("月", "-")
        .replace("日", "");
      while (enddate.indexOf(" ") !== -1) {
        enddate = enddate.replace(" ", "");
      }

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
            console.log(123);
            console.log(certType)
            $.ajax({
              type: "post",
              url:
                "http://aj.kingwingaviation.com/jax/retailsys/pay/getTravelRights",
              datatype: "json",
              contentType: "application/json",
              data: JSON.stringify({
                certType: certType,
                certNo: $(".input3").val(),
                realname: $(".input1").val(),
                mobile: $(".input2").val(),
                uuid: uuid,
                rightBeginTime: begindate,
                rightsEndTime: enddate
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
                if (data.rcode == "0022") {
                  alert("福利最后领取时间已结束，请期待下次活动哦");
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
                          window.location.href('http://aj.kingwingaviation.com/retailsys/short.html')
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
                       "http://aj.kingwingaviation.com/retailsys/short.html"
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
    $(".shade-btn1").click(function() {
      var getuuid = window.sessionStorage.getItem("uuid");
      window.location.href =
        "http://aj.kingwingaviation.com/retailsys/research.html";
      // console.log(s);
    });
  } else {
    window.location.href =
      "http://aj.kingwingaviation.com/jax/retailsys/pay/code?state=http://aj.kingwingaviation.com/retailsys/short.html";
  }
  //window.sessionStorage.removeItem('value',JSON.stringify({a:'dd'}))

  /* 传入起始的年,月,日,是否不能选当天(为true不能选今天),可选天数,返回一个数组,包含可选年月日的数据 */
  function getDateData(year, month, date, disabledCurrent, count) {
    year = year - 0;
    month = month - 0;
    date = date - 0;
    count = count - 0;
    var arr = [];
    function dateIncrement() {
      var flag = true;
      if (/^2$/.test(month)) {
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
          if (date == 29) {
            date = 1;
            month = 3;
            flag = false;
          }
        } else if (date == 28) {
          date = 1;
          month = 3;
          flag = false;
        }
      }
      if (/^(1|3|5|7|8|10|12)$/.test(month) && date == 31) {
        if (month == 12) {
          date = 1;
          month = 1;
          year = year + 1;
          flag = false;
        } else {
          date = 1;
          month = month + 1;
          flag = false;
        }
      }
      if (/^(4|6|9|11)$/.test(month) && date == 30) {
        date = 1;
        month = month + 1;
        flag = false;
      }
      if (flag) {
        date = date + 1;
      }
    }
    if (disabledCurrent) {
      dateIncrement();
    }
    arr.push({
      id: year + "",
      value: year + "年",
      monthData: [
        {
          id: month + "",
          value: month + "月",
          dateData: [
            {
              id: date + "",
              value: date + "日"
            }
          ]
        }
      ]
    });
    var tempYear = year;
    var tempMonth = month;
    for (var i = 1; i < count; i++) {
      dateIncrement();
      if (tempYear == year) {
        var mrr = arr[arr.length - 1].monthData;
        if (tempMonth == month) {
          mrr[mrr.length - 1].dateData.push({
            id: date + "",
            value: date + "日"
          });
        } else {
          mrr.push({
            id: month + "",
            value: month + "月",
            dateData: [{ id: date + "", value: date + "日" }]
          });
        }
      } else {
        arr.push({
          id: year + "",
          value: year + "年",
          monthData: [
            {
              id: month + "",
              value: month + "月",
              dateData: [
                {
                  id: date + "",
                  value: date + "日"
                }
              ]
            }
          ]
        });
      }
      tempYear = year;
      tempMonth = month;
    }
    return arr;
  }

  var fromDateDom = $("#showDate");
  var toDateDom = $("#showDate1");
  // 初始化时间
  var now = new Date();
  var nowYear = now.getFullYear();
  var nowMonth = now.getMonth() + 1;
  var nowDate = now.getDate();
  fromDateDom.attr("data-year", nowYear);
  fromDateDom.attr("data-month", nowMonth);
  fromDateDom.attr("data-date", nowDate);

  var fromData = getDateData(nowYear, nowMonth, nowDate, true, 90);
  var toData = false;

  // 数据初始化
  function formatYear(dateData) {
    var arr = dateData.map(value => {
      return {
        id: value.id,
        value: value.value
      };
    });
    return arr;
  }
  function formatMonth(year, dateData) {
    var arr;
    dateData.forEach(value => {
      if (value.id == year) {
        arr = value.monthData.map(val => {
          return {
            id: val.id,
            value: val.value
          };
        });
      }
    });
    return arr;
  }
  function formatDate(year, month, dateData) {
    var arr;
    dateData.forEach(value => {
      if (value.id == year) {
        value.monthData.forEach(item => {
          if (item.id == month) {
            arr = item.dateData.map(val => {
              return {
                id: val.id,
                value: val.value
              };
            });
          }
        });
      }
    });
    return arr;
  }
  var fromYearData = function(callback) {
    callback(formatYear(fromData));
  };
  var fromMonthData = function(year, callback) {
    var arr = formatMonth(year, fromData);
    callback(formatMonth(year, fromData));
  };
  var fromDateData = function(year, month, callback) {
    callback(formatDate(year, month, fromData));
  };
  var toYearData = function(callback) {
    callback(formatYear(toData));
  };
  var toMonthData = function(year, callback) {
    callback(formatMonth(year, toData));
  };
  var toDateData = function(year, month, callback) {
    callback(formatDate(year, month, toData));
  };
  fromDateDom.bind("click", function() {
    var oneLevelId = fromDateDom.attr("data-year");
    var twoLevelId = fromDateDom.attr("data-month");
    var threeLevelId = fromDateDom.attr("data-date");
    var iosSelect = new IosSelect(
      3,
      [fromYearData, fromMonthData, fromDateData],
      {
        title: "日期选择",
        itemHeight: 35,
        oneLevelId: oneLevelId,
        twoLevelId: twoLevelId,
        threeLevelId: threeLevelId,
        showLoading: true,
        callback: function(selectOneObj, selectTwoObj, selectThreeObj) {
          fromDateDom.attr("data-year", selectOneObj.id);
          fromDateDom.attr("data-month", selectTwoObj.id);
          fromDateDom.attr("data-date", selectThreeObj.id);
          toData = getDateData(
            selectOneObj.id,
            selectTwoObj.id,
            selectThreeObj.id,
            false,
            60
          );
          fromDateDom.html(
            selectOneObj.value +
              " " +
              selectTwoObj.value +
              " " +
              selectThreeObj.value
          );
        }
      }
    );
  });
  toDateDom.bind("click", function() {
    if (!toData) {
      /* 如果没有选择开始时间 */
      alert("请先选则开始时间");
      return false;
    }
    var oneLevelId = toDateDom.attr("data-year");
    var twoLevelId = toDateDom.attr("data-month");
    var threeLevelId = toDateDom.attr("data-date");
    var iosSelect = new IosSelect(3, [toYearData, toMonthData, toDateData], {
      title: "选择日期",
      itemHeight: 35,
      oneLevelId: oneLevelId,
      twoLevelId: twoLevelId,
      threeLevelId: threeLevelId,
      showLoading: true,
      callback: function(selectOneObj, selectTwoObj, selectThreeObj) {
        toDateDom.attr("data-year", selectOneObj.id);
        toDateDom.attr("data-month", selectTwoObj.id);
        toDateDom.attr("data-date", selectThreeObj.id);
        toDateDom.html(
          selectOneObj.value +
            " " +
            selectTwoObj.value +
            " " +
            selectThreeObj.value
        );
      }
    });
  });
  var dataShare = {
    title: '假日选空降，出行有保障！',
    desc: '短期权益强势登陆空降联盟！',
    imgUrl: 'http://aj.kingwingaviation.com/retailsys/img/share_day.jpg',
    link: 'http://aj.kingwingaviation.com/retailsys/short-main.html',   
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

});
