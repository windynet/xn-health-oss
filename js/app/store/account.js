$(function() {
    var view = 1;
    var accountNumberCNY;
    var accountNumberJF;
    reqApi({
        code: '802503',
        json: {
            userId: getUserId()
        }
    }).then(function(data) {
        $("#amount-CNY").text("￥" + data[0].amount / 1000);
        accountNumberCNY = data[0].accountNumber;
        // $("#amount-JF").text("￥" + data[1].amount / 1000);
        // accountNumberJF = data[1].accountNumber;
    });


    $("#CNYaccoutBtn").click(
        function() {
            window.location.href = 'account_detail.html?accountNumber=' + accountNumberCNY;
        }
    );


    $("#accouBtn").click(
        function() {
            window.location.href = 'account_quxian.html?accountNumber=' + accountNumberCNY;
        }
    );

    // $("#JFaccoutBtn").click(
    //     function() {
    //         window.location.href = 'account_detail.html?accountNumber=' + accountNumberJF;
    //     }
    // );
    // $("#accoutPingBtn").click(
    //     function() {
    //         window.location.href = 'account_detail.html?ping=1&accountNumberPing=' + accountNumberPing;
    //     }
    // );
    // $("#accouBtn").click(
    //     function() {
    //         window.location.href = 'account_quxian.html?accountNumber=' + accountNumberPing;
    //     }
    // );
});