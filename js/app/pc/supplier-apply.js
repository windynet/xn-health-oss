$(function() {
    var code = getQueryString('code');
    var typeData = {};
    var level1;
    reqApi({
        code:'808007',
        json: {
          companyCode: OSS.companyCode, 
          systemCode: OSS.companyCode  
        }
    }).done(function(d) {
                    
        d.forEach(function(v,i){
            typeData[v.code] = v.name; 
            
        })
    });


    var fields = [{
        field: 'mobile',
        title: '登录名/手机号',
        required: true,
    },{
        field: 'legalPersonName',
        title: '法人姓名',
        required: true,
    },{
        title: '折扣',
        field: 'rate1',
        required: true,
    },{
        field: 'name',
        title: '店铺名称',
        required: true,
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
        title: '经度',
        field: 'longitude',
        west: true,
        hidden: true
    }, {
        title: "纬度",
        field: 'latitude',
        north: true,
        hidden: true
    },{
        field: 'userReferee',
        title: '推荐人类型',
        type: 'select',
        data: {
            "0": "市/区运营商",
            "1":"VIP会员",
            // "1": "o2o商家",
            // "2":"供应商",
            // "3":"名宿主",
            // "4":"VIP会员",
        },
        onChange:function(v,data){
            if(v == "0" ){
                kind = "operator";
                level1 = ""; 
            }else if (v == "1") {
                // kind = "o2o";
                kind = "f1";
                level1 = "1";                
            }
            // else if (v == "2") {
            //     kind = "supplier";
            // }else if (v == "3") {
            //     kind = "mingsu";
            // }else if (v == "4") {
            //     kind = "f1";
            //     level1 = "1";
            // }

        reqApi({
                code: '805060',
                json: {
                    kind:kind,
                    start:"1",
                    limit:"10",
                    level:level1?level1:"",
                    status:"0"                    
                },
                sync: true
            }).done(function(d) {
                var data1 = {};

                if(d.list.length ){
                    d.list.forEach(function(d,i){
                        data1[d.userId] = d.loginName;

                    })
                }
                $("#tj_mobile").renderDropdown2(data1);

            });            
        }        

    },{
        field: 'tj_mobile',
        title: '推荐人手机号',
        type: 'select',
        // listCode: '805060',
        // params:{
        //     start:"1",
        //     limit:"10",
        //     userId: userId,          
        // },
        // keyName: 'userId',
        // valueName: 'loginName',        

    },{
        field: 'slogan',
        title: '广告语',
        required: true,
    },  {
        title: '店铺缩略图',
        field: 'advPic',
        type: 'img',
        required: true,
        single: true
    },{
        title: '商家图片',
        field: 'pic',
        type: 'img',
        required: true,
    },{
        field: 'description',
        title: '商家描述',
        type:'textarea',
        required: true,
    }
    ];

    var options = {
        fields: fields,
        code:{
          code:code,
        } ,
        detailCode: '808216',
        addCode: '808209',
        editCode: '808203',
        beforeSubmit: function(data) {
            data.type = "2";

            return data;
        }
    }
    buildDetail(options);
        $('#subBtn').show().css({"background-color":"#19BF96","margin-left": "280px","margin-top": "50px"})
        $('#backBtn').show().css({"background-color":"#19BF96","margin-left": "100px","margin-top": "50px"})
        $('#backBtn').click(function() {
              goBack();
        });
        
        $('#subBtn').off("click").click(function() {
            if ($('#jsForm').valid()) {
                var data = $('#jsForm').serializeObject();
                $('#jsForm').find('.btn-file [type=file]').parent().next().each(function(i, el) {
                    var values = [];
                    var imgs = $(el).find('.img-ctn');
                    imgs.each(function(index, img) {
                        values.push($(img).attr('data-src') || $(img).find('img').attr('src'));
                    });
                    data[el.id] = values.join('||');
                });
                if ($('#jsForm').find('#province')[0]) {
                    var province = $('#province').val();
                    var city = $('#city').val();
                    var area = $('#area').val();
                    if (!city) {
                        toastr.info("请补全地址");
                        return                       
                    }else if (!area) { 
                        if ($('#area').is(":visible")) {
                                // 直辖市
                                toastr.info("请补全地址");
                                return                                                                 
                            }else{
                                data['city'] = province;
                                data['area'] = city;                                                             
                            }                    
                    }
                }
                for (var i = 0, len = fields.length; i < len; i++) {
                    var item = fields[i];
                    if (item.equal && (!$('#' + item.field).is(':hidden') || !$('#' + item.field + 'Img').is(':hidden'))) {
                        data[item.equal] = $('#' + item.field).val() || $('#' + item.field).attr('src');
                    } else if (item.emptyValue && !data[item.field]) {
                        data[item.field] = item.emptyValue;
                    } else if (item.readonly && item.pass) {
                        data[item.field] = $('#' + item.field).attr('data-value') || $('#' + item.field).html();
                    }
                    if (item.type == 'select' && item.passValue) {
                        data[item.field] = $('#' + item.field).find('option:selected').html();
                    }
                    if (item.type == "checkbox") {
                        data[item.field] = $.isArray(data[item.field]) ? data[item.field].join(",") : data[item.field];
                    }
                }
                data['id'] = data['code'];

                var addr = data.province + data.city + data.area + data.detail;
                var myGeo = new BMap.Geocoder();
                myGeo.getPoint(addr, function(point) {
                    if (point) {
                        // data.type = "2";
                        data.updater = "自助申请"
                        // data.rate1 = "0";
                        data.rate2 = "0";
                        data.rate3 = "0";
                        data.longitude = point.lng;
                        data.latitude = point.lat;
                        data.category = " ";
                        data.type = "FL2017061017265753557143";//供应商
                        data.level = "3";
                        data.bookMobile = $("#mobile").val();
                        data.smsMobile = $("#mobile").val();
                        if($("#tj_mobile").text()){
                            data.userReferee = $("#tj_mobile").val()
                        }else{
                            data.userReferee = "";
                        }                         
                        reqApi({
                            code: code ? options.editCode : options.addCode,
                            json: data
                        }).done(function(data) {
                            sucDetail();
                        });
                    } else {
                        alert("无法解析当前地址的经纬度!");
                    }
                });

            }
        });


});