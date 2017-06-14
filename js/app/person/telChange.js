$(function() {



    $("#subBtn").click(function() {
        var sms = $("#smsCaptcha").val();
        if (sms == '') {
            toastr.info('验证码不能为空')
        } else {
            var data = $('#jsForm').serializeObject();
            data['userId'] = getUserId();
            reqApi({
                code: 805047,
                json: data
            }).done(function() {
                toastr.info('修改成功，请用新手机号登录！');
                setTimeout(function() {
                    window.location.href = "../signin.html?kind=f2"
                }, 1500);
            });
        }

    });
    $("#smsBtn").click(function() {
        var mobile = $("#newMobile").val();
        if (mobile == '') {
            toastr.info('手机号不能为空')
        } else {
            var data = {};
            data['mobile'] = $('#newMobile').val();
            data['kind'] = 'f2';
            data["bizType"] = "805047";
            reqApi({
                code: 805904,
                json: data
            }).done(function() {
                toastr.info('发送成功！')
            });
        }

    });
});