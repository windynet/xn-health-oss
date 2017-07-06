$(function() {
    var userId = getUserId();
    var userRefereeType = {
        "operator": "市/区运营商",
        "o2o": "o2o商家",
        "supplier":"供应商",
        "mingsu":"名宿主",
        "f1":"VIP会员",
    }; 
       
    var columns = [{
        field: '',
        title: '',
        checkbox: true
    }, {
        field: 'name',
        title: '店铺名称',
        search: true
    }
    // , {
    //     field: 'level',
    //     title: '店铺类型',
    //     type: 'select',
    //     key: "store_level",
    //     keyCode: '808907',
    //     formatter:Dict.getNameForList("store_level", "808907"),
    // }
    // , {
    //     field: 'category',
    //     title: '大类',
    //     type: 'select',
    //     listCode: '808007',
    //     keyName: 'code',
    //     valueName: 'name',
    //     params: {
    //         type: '2',
    //         parentCode: "0"
    //     },  
    //     search: true
    // }, {
    //     field: 'type',
    //     title: '小类',
    //     type: 'select',
    //     listCode: '808007',
    //     keyName: 'code',
    //     valueName: 'name',
    //     params: {
    //         type: '2',
    //     },
    //     search: true
    // }
    // , {
    //     field: 'legalPersonName',
    //     title: '法人姓名',
    // }
    , {
        field: 'bookMobile',
        title: '联系电话',
    }, {
        field: 'smsMobile',
        title: '短信手机号',
    },{
        field: 'userReferee',
        title: '推荐人',
        type: 'select',
        formatter: function(v, data) {
            var res1 = data.referrer.kind ;
            var res2 = data.referrer.mobile;
            if(res1 && res2){
                return userRefereeType[res1]+ '/' +res2
            }else{
               return "-" 
            }
            
        }        
    }, {
        field: 'status',
        title: '状态',
        type: 'select',
        key: "store_status",
        keyCode: '808907',
        formatter: Dict.getNameForList("store_status", "808907"),
        search: true,
    }, {
        field: 'updateDatetime',
        title: '入驻时间',
        formatter: dateTimeFormat,
    },{
        field: 'uiLocation',
        title: '位置',
        type: 'select',
        key: 'store_location',
        keyCode: '808907',
        formatter: Dict.getNameForList("store_location", "808907"),
    }, {
        field: 'remark',
        title: '备注'
    }];

    buildList({
        columns: columns,
        pageCode: '808215',
        searchParams: {
            companyCode: OSS.companyCode,
            level: "2",
        }
    });

    

    //审核
    $('#examineBtn').click(function() {
        var selRecords = $('#tableList').bootstrapTable('getSelections');
        if (selRecords.length <= 0) {
            toastr.info("请选择记录");
            return;
        }

        // if (selRecords[0].status != 0) {
        //     toastr.info("当前店铺状态不能审核!");
        //     return;
        // }

        var selRecords = $('#tableList').bootstrapTable('getSelections');
        if (selRecords.length <= 0) {
            toastr.info("请选择记录");
            return;
        }

        if (selRecords.length == 1 ) {
        var dw = dialog({
                content: '<form class="pop-form" id="popForm" novalidate="novalidate">' +
                    '<ul class="form-info" id="formContainer"><li style="text-align:center;font-size: 15px;">备注</li></ul>' +
                    '</form>'
            });            
            dw.showModal();
            buildDetail({
                fields: [{
                    field: 'remark',
                    title: '备注',
                    maxlength: 250
                }],
                container: $('#formContainer'),
                buttons: [{
                    title: '通过',
                    handler: function() {

                        var data = $('#popForm').serializeObject();
                        data.approveResult = '1';
                        data.storeCodeList = [selRecords[0].code];
                        data.approver = getUserName();
                        // data.code = '0';
                        data.remark = $("#remark").val();
                        reqApi({
                            code: '808202',
                            json: data
                        }).done(function(data) {
                            toastr.info("操作成功");

                            $('#tableList').bootstrapTable('refresh', { url: $('#tableList').bootstrapTable('getOptions').url });
                            setTimeout(function() {
                                dw.close().remove();
                            }, 500)
                        });

                    }
                }, {
                    title: '不通过',
                    handler: function() {
                        var data = [];
                        data.approveResult = '0';
                        data.storeCodeList = [selRecords[0].code];
                        data.approver = getUserName();
                        // data.divRate = '0';
                        data.remark = $("#remark").val();
                        reqApi({
                            code: '808202',
                            json: data
                        }).done(function(data) {
                            toastr.info("操作成功");
                            $('#tableList').bootstrapTable('refresh', { url: $('#tableList').bootstrapTable('getOptions').url });
                            setTimeout(function() {
                                dw.close().remove();
                            }, 500)
                        });
                    }
                }, {
                    title: '取消',
                    handler: function() {
                        dw.close().remove();
                    }
                }]
            });

            dw.__center();
        } else {

            toastr.info("该状态不能审核!");
            return;

        }
    });

    //上架
    $('#up2Btn').click(function() {
        var selRecords = $('#tableList').bootstrapTable('getSelections');
        if (selRecords.length <= 0) {
            toastr.info("请选择记录");
            return;
        }

        if (selRecords[0].status == 2 || selRecords[0].statu == 3) {
            toastr.info("已上架!");
            return;
        }

        if (selRecords[0].status != 1 && selRecords[0].status != 4) {
            toastr.info("当前店铺状态不能上架!");
            return;
        }

        window.location.href = "store_up2.html?Code=" + selRecords[0].code;
    });

    //下架
    $('#downBtn').click(function() {
        var selRecords = $('#tableList').bootstrapTable('getSelections');
        if (selRecords.length <= 0) {
            toastr.info("请选择记录");
            return;
        }
        if (selRecords[0].status != 2 && selRecords[0].status != 3) {
            toastr.info("还未上架");
            return;
        }
        confirm("确认下架？").then(function() {
            reqApi({
                code: '808205',
                json: { "code": selRecords[0].code }
            }).then(function() {
                toastr.info("操作成功");
                $('#tableList').bootstrapTable('refresh', { url: $('#tableList').bootstrapTable('getOptions').url });
            });
        }, function() {});

    });

    $('#detail2Btn').click(function() {
        var selRecords = $('#tableList').bootstrapTable('getSelections');
        if (selRecords.length <= 0) {
            toastr.info("请选择记录");
            return;
        }

        window.location.href = "store_detail.html?Code=" + selRecords[0].code+"&v=1";
    });

    $('#editBtn').off("click").click(function() {
        var selRecords = $('#tableList').bootstrapTable('getSelections');
        if (selRecords.length <= 0) {
            toastr.info("请选择记录");
            return;
        }

        window.location.href = "store_addedit.html?Code=" + selRecords[0].code+"&v=1";
    });

    // $("#editBtn").remove();
     $('#revenueBtn').click(function() {
        var selRecords = $('#tableList').bootstrapTable('getSelections');
        if (selRecords.length <= 0) {
            toastr.info("请选择记录");
            return;
        }
        
        if (selRecords.length>1) {
            toastr.info("不能多选");
            return;
        }
        
        window.location.href = "revenue.html?Code=" + selRecords[0].code+"&userId="+selRecords[0].owner;

    });
});