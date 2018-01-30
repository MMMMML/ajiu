$(function () {
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
        wheels: [{
            data: [{
                    id: '1',
                    value: '身份证'
                },
                {
                    id: '2',
                    value: '护照'
                },
                {
                    id: '3',
                    value: '回乡证'
                },
                {
                    id: '4',
                    value: '台胞证'
                }
            ]
        }],
        //初始化定位
        callback: function (indexArr, data) {
            certType = data[0].id; //返回选中的json数据
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
        var disabled = false
        $(".verification").click(function () {
            if (disabled) {
                return false;
            }
            if ($(".input2").val() == "" || isNaN($(".input2").val()) || $(".input2").val().length != 11) {
                alert("请填写正确的手机号！");
                return false;
            }
            $.ajax({
                type: "get",
                url: "http://aj.kingwingaviation.com/jax/retailsys/pay/sendMsg",
                datatype: "json",
                contentType: "application/json",
                data: {
                    mobile: $(".input2").val()
                },
                success: function (data) {
                    if (data.status == "OK")
                        alert('验证码已发送，请注意查收')
                        settime();
                },
                error: function (err) {
                    console.log(err);
                }
            })
        });
        var countdown = 60;
        var generate_code = $(".verification");

        function settime() {
            if (countdown == 0) {
                generate_code.attr("disabled", false);
                disabled = false
                generate_code.html("获取验证码");
                countdown = 60;
                return false;
            } else {
                $(".generate_code").attr("disabled", true);
                disabled = true
                generate_code.html("重新发送(" + countdown + ")");
                countdown--;
            }
            setTimeout(function () {
                settime();
            }, 1000);
        }


        $(".button").click(function () {
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
            } 
         else if ($.trim($(".input4").val()).length == 0) {
            // str += '身份证号码没有输入\n';
            message += "验证码不能为空哦！";
            // alert("证件号码不能为空哦！");
            $(".input4").focus();
        }
            if (message !== "") {
                alert(message);
                return false;
            }



            var name = $(".input1").val();
            var phone = $(".input2").val();
            var identity = $(".input3").val();
            var mobile = $(".input4").val();


            //$(".shade").css("display", "block");



            $.ajax({
                type: "post",
                url: "http://aj.kingwingaviation.com/jax/retailsys/pay/jdBind",
                datatype: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    certType: certType,
                    certNo: $(".input3").val(),
                    realname: $(".input1").val(),
                    mobile: $(".input2").val(),
                    vercode: $(".input4").val(),
                    uuid: uuid,
                }),
                success: function (result) {
                    console.log(result);
                    if (result.rcode == "0000") {
                        alert("绑定成功");
                        window.location.href="http://aj.kingwingaviation.com/retailsys/research.html"
                    }
                    if (result.rcode == "0026") {
                        alert("验证码错误");
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
                    if (result.rcode == "0023") {
                        alert("无法绑定，请确认是否已完成领取！");
                    }
                    var result = JSON.parse(result.result);
                    console.log(result);
                }
            });
        });
        $(".shade-btn1").click(function () {
            var getuuid = window.sessionStorage.getItem("uuid");
            window.location.href =
                "http://aj.kingwingaviation.com/retailsys/research.html";
            // console.log(s);
        });
    } else {
        window.location.href =
            "http://aj.kingwingaviation.com/jax/retailsys/pay/code?state=http://aj.kingwingaviation.com/retailsys/jdbinding.html";
    }
    //window.sessionStorage.removeItem('value',JSON.stringify({a:'dd'}))

    /* 传入起始的年,月,日,是否不能选当天(为true不能选今天),可选天数,返回一个数组,包含可选年月日的数据 */


});