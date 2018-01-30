$(function () {
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

    $('.button').click(function () {
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
            message += "姓名不能为空哦！";
            $(".input1").focus();
          } else if (isChinaName($.trim($(".input1").val())) == false) {
            message += "请填写正确的姓名！";
            $(".input1").focus();
          } else if ($.trim($(".input2").val()).length == 0) {
            message += "手机号不能为空哦！";
            $(".input2").focus();
          } else if (isPhoneNo($.trim($(".input2").val()) == false)) {
            message += "请填写正确的手机号码！";
            $(".input2").focus();
          } else if ($.trim($(".input3").val()).length == 0) {
            message += "证件号码不能为空哦！";
            $(".input3").focus();
          }  else if (isdate($.trim($("#showDate").html())) == false) {
            message += "请选择开始日期";
          } else if (!$(".checkbox").is(":checked")) {
            message += "请确认打勾";
          }
          if (message !== "") {
            alert(message);
            return false;
          }

        var date = $("#showDate").html();
        date = date
            .replace("年", "-")
            .replace("月", "-")
            .replace("日", "");
        while (date.indexOf(" ") !== -1) {
            date = date.replace(" ", "");
        }
        $.ajax({
            type: "post",
            url: "http://aj.kingwingaviation.com/jax/retailsys/pay/getFreeRightsForJD",
            datatype: "json",
            contentType: "application/json",
            data: JSON.stringify({
                certType: certType,
                certNo: $(".input3").val(),
                realname: $(".input1").val(),
                mobile: $(".input2").val(),
                rightBeginTime: date
            }),
            success: function (data) {
                console.log(data);
                if (data.status == "OK") {
                    $(".shade").css("display", "block");
                }
                if (data.rcode == "0009") {
                    alert("权益开始时间必须不早于明天");
                }
                if (data.rcode == "0015") {
                    alert("一个证件号只能领取一次福利");
                }
                if (data.rcode == "0006") {
                    alert("请填写正确的证件号码！");
                }
                if (data.rcode == "0019") {
                    alert("您已在空降联盟领取/购买过权益！");
                }
                if (data.rcode == "0005") {
                    alert("请填写正确的手机号码！");
                }
                if (data.rcode == "0013") {
                    alert("活动已结束，更多惊喜请持续关注空降联盟！");
                }
                if (data.rcode == "0022") {
                    alert("请选择正确的权益起始日期");
                }
                if (data.rcode == "0027") {
                    alert("天呐，福利被抢光了，下次记得早点来哦~");
                }
                if (data.rcode == "0007") {
                    alert("权益开始时间为空");
                }
                if (data.rcode == "0008") {
                    alert("权益结束时间为空");
                }
                if (data.rcode == "0013") {
                    alert("活动已结束，更多惊喜请持续关注空降联盟！");
                }
            }
        });
    })



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
            monthData: [{
                id: month + "",
                value: month + "月",
                dateData: [{
                    id: date + "",
                    value: date + "日"
                }]
            }]
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
                        dateData: [{
                            id: date + "",
                            value: date + "日"
                        }]
                    });
                }
            } else {
                arr.push({
                    id: year + "",
                    value: year + "年",
                    monthData: [{
                        id: month + "",
                        value: month + "月",
                        dateData: [{
                            id: date + "",
                            value: date + "日"
                        }]
                    }]
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

    var fromData = getDateData(nowYear, nowMonth, nowDate, true, 60);
    var toData = false;


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


    var fromYearData = function (callback) {
        callback(formatYear(fromData));
    };
    var fromMonthData = function (year, callback) {
        var arr = formatMonth(year, fromData);
        callback(formatMonth(year, fromData));
    };
    var fromDateData = function (year, month, callback) {
        callback(formatDate(year, month, fromData));
    };
    var toYearData = function (callback) {
        callback(formatYear(toData));
    };
    var toMonthData = function (year, callback) {
        callback(formatMonth(year, toData));
    };
    var toDateData = function (year, month, callback) {
        callback(formatDate(year, month, toData));
    };
    fromDateDom.bind("click", function () {
        var oneLevelId = fromDateDom.attr("data-year");
        var twoLevelId = fromDateDom.attr("data-month");
        var threeLevelId = fromDateDom.attr("data-date");
        var iosSelect = new IosSelect(
            3, [fromYearData, fromMonthData, fromDateData], {
                title: "选择日期",
                itemHeight: 35,
                oneLevelId: oneLevelId,
                twoLevelId: twoLevelId,
                threeLevelId: threeLevelId,
                showLoading: true,
                callback: function (selectOneObj, selectTwoObj, selectThreeObj) {
                    fromDateDom.attr("data-year", selectOneObj.id);
                    fromDateDom.attr("data-month", selectTwoObj.id);
                    fromDateDom.attr("data-date", selectThreeObj.id);
                    toData = getDateData(
                        selectOneObj.id,
                        selectTwoObj.id,
                        selectThreeObj.id,
                        true,
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
    toDateDom.bind("click", function () {
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
            callback: function (selectOneObj, selectTwoObj, selectThreeObj) {
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
})