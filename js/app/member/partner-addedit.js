$(function() {
    
    var userId = getQueryString('userId');
    var loginName = getQueryString('loginName');
    var view = getQueryString('v');
    var level
    var fields = [
    // {
    //     field: 'kind',
    //     type: 'hidden',
    //     value: '1'
    // },
    {
        title : '登录名',
        field : 'loginName',
        required: true,
        maxlength: 20,
        readonly: view
    },{
        title : '手机号',
        field : 'mobile',
        mobile:true,
        required: true,
        readonly: view
    }, {
        title: '真实姓名',
        field: 'realName',
        chinese: true,
        required: true,
        readonly: view
    }, {
        field: 'province',
        title: '地址',
        readonly: view,
        formatter: function(v, data) {
            if (data.userExt.city == data.userExt.area) {
                var res = data.userExt.province + data.userExt.city
            }else{
                var res = data.userExt.province + data.userExt.city + data.userExt.area;
            }
            return res;
        }
    },{
        field: 'userReferee',
        title: '推荐人',
        readonly: view,
    },{
        field: 'userRefereeName',
        title: '推荐人姓名',
        type: 'select',
        readonly: view
        // listCode: '805060',
        // params:{
        //     start:"1",
        //     limit:"10",
        //     userId: userId,          
        // },
        // keyName: 'userId',
        // valueName: 'loginName',        

    },  {
        title: '证件类型',
        field: 'idKind',
        type: 'select',
        key: 'id_kind',
        keyCode: "807706",
        view: view
    },{
        title: '证件号',
        field: 'idNo',
        idCard: true,
        view: view
    }
    // ,{
    //     title : '分成比例',
    //     field : 'divRate',
    //     number:true,
    //     max: 1,
    //     min: 0,
    //     required: true,
    //     view: view
    // }
    , {
        title: '备注',
        field: 'remark',
        maxlength: 250,
        view: view
    }];
    
    buildDetail({
        fields: fields,
        code:{
            userId: userId
        },
        detailCode: '805056',
        addCode: '805042',
        editCode: '805182',
        beforeSubmit: function(data){
            if(userId){
                data.userId = userId;
            }
            data.userReferee = getUserId();
            data.kind = 'operator';
            
            return data;
        }
    });
    
    var h ="<br/><p class='huilv' style='padding: 5px 0 0 194px;display: block;color:red;'>初始密码为 888888</p>";
    $(h).insertAfter("#loginName");
    
});