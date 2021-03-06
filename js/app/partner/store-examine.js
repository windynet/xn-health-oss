$(function() {
	
	var code = getQueryString('code');
	var view = true;

    // var typeData = {}
    // reqApi({
    //     code:'808007'
    // }).done(function(d) {
                    
    //     d.forEach(function(v,i){
    //         typeData[v.code] = v.name;
    //     })
    // });
    var remarkField = {
        title: '备注',
        field: 'remark',
        maxlength: 250,
        readonly: false
    };

    var examineList = [remarkField]   
    var buttons = [{
                    title: '通过',
                    handler: function() {

                        var data = $('#popForm').serializeObject();
                        data.approveResult = '1';
                        data.storeCodeList = [code];
                        data.approver = getUserName();
                        data.remark = $("#remark").val();
                        reqApi({
                            code: '808202',
                            json: data
                        }).done(function(data) {
                            sucDetail();
                        });

                    }
                }, {
                    title: '不通过',
                    handler: function() {
                        var data = [];
                        data.approveResult = '0';
                        data.storeCodeList = [code];
                        data.approver = getUserName();
                        // data.divRate = '0';
                        data.remark = $("#remark").val();
                        reqApi({
                            code: '808202',
                            json: data
                        }).done(function(data) {
                            sucDetail();
                        });
                    }
                }, {
                    title: '返回',
                    handler: function() {
                        goBack();
                    }
                }];	
	var fields = [{
        field: 'mobile',
        title: '登录名(手机号)',
        required: true,
    },{
        field: 'legalPersonName',
        title: '法人姓名',
        required: true,
    }
   ,{
        field: 'level',
        title: '商家类型',
        type: 'select',
        required: true,
        keyName: "dkey",
        listCode: '808907',
        valueName: 'dvalue',
        params:{
             parentKey: "store_level"
        },
        // formatter:Dict.getNameForList("store_level", "808907"),
        afterSet:function(v,data){
            if (data.level =="2") {
                 $("#category").parent(".clearfix").hide();
                 $("#type").parent(".clearfix").hide();
                 $("#rate1").parent(".clearfix").hide();
            }else if(data.level =="1"){
                $("#category").parent(".clearfix").show();
                 $("#type").parent(".clearfix").show();
                 $("#rate1").parent(".clearfix").show();
            }else if(data.level =="3"){
                $("#category").parent(".clearfix").hide();
                $("#type").parent(".clearfix").hide();                
                $("#rate1").parent(".clearfix").show();
            }
        }

    },{
        field: 'category',
        title: '大类',
        type: 'select',
        listCode: '808007',
        params: {
            type:"2",
            // status: '2',
            parentCode: 0
        },
        keyName: 'code',
        valueName: 'name',
        required: true,
        onChange:function(v,data){
            reqApi({
                code: '808007',
                json: {
                    type:"2",
                    // status: '2',
                    parentCode: v
                },
                sync: true
            }).done(function(d) {
                var data1 = {};
                if(d.length && v){
                    
                    d.forEach(function(v,i){
                        data1[v.code] = v.name;
                    })
                }
                $("#type").renderDropdown2(data1);

            });
        },
        afterset: function(v){
            console.log("ss");
        }
    }, {
        field: 'type',
        title: '小类',
        type: 'select',
        listCode: '808007',
        required: true,
        params: {
            type:2,
            // status: '0',
            parentCode: $("#category").val()
        },
        keyName: 'code',
        valueName: 'name',
        formatter: function(v,data){
            return data.type;
        }
    }
    , {
        title: '折扣',
        field: 'rate1',
        required: true,
    }
    , {
        field: 'name',
        title: '商品名称',
        required: true,
		readonly: view
    }, {
        title: '地址',
        field: "province1",
        type:'select',
        key:"product_location",
        keyCode:'808907',
        required: true,
        type: 'citySelect',
    }, {
        title: '详细地址',
        field: 'address',
        required: true,
        maxlength: 255,
    }, {
        field: 'slogan',
        title: '广告语',
        required: true,
		readonly: view
    }, {
        field: 'advPic',
        title: '广告图',
        type : 'img',
		required: true,
		readonly: view
    }, {
        field: 'pic',
        title: '展示图',
        type : 'img',
		required: true,
		readonly: view
    }, {
        field: 'description',
        title: '图文描述',
        type: 'textarea',
        required: true,
		readonly: view
    }, {
//      field: 'price1',
//      title: '人民币价',
//      amount: true,
//      formatter: moneyFormat,
//      required: true,
//  }, {
//      field: 'price2',
//      title: '购物币价',
//      amount: true,
//      formatter: moneyFormat,
//      required: true,
//  }, {
//      field: 'price3',
//      title: '钱包币价',
//      amount: true,
//      formatter: moneyFormat,
//      required: true,
//  }, {
        field: 'uiOrder',
        title: '次序',
        required: true,
        number: true,
        sortable: true,
    },{
        field: 'uiLocation',
        title: '位置',
        type: 'select',
        key: 'store_location',
        keyCode: '808907',
        formatter: Dict.getNameForList("store_location", "808907"),
    }];

	fields = fields.concat(examineList)
    
	buildDetail({
		fields: fields,
		code: code,
		view: view,
        buttons: buttons,
		detailCode: '808216',
	});
	
});