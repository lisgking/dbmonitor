define('ts/common/EditLparTest', [
    'ts/widgets/TSWidget',
    'ts/widgets/TSFormTest',
    'dojo/text!ts/common/EditLparTest.html',
    'dojo/css!ts/common/EditLpar.css',
    'dojo/nls!ts/common/dataCenter.json'
], function(TSWidget, TSFormTest, html, css, json){
    'use strict';

    var i18n = TSWidget.prototype.i18n.createBranch(json);
   
    function EditLparTest(opts){
        //CommonWidget.call(this, {html: html, css: css, json: json});
        TSFormTest.call(this, {html: html, css: css, json: json});
        
        i18n = this.i18n;
        this.opts = opts;
        this.container = null;
        this.initialize.apply(this, arguments);
    }

    var methods = {
        initialize: function(opts){
            var that = this,
                $container = this.container = $(this.rootElement),
                $listItems = null;

            this.opts = $.extend({}, opts);

            this.addEventListener("DOMNodeInserted",function(){
                that.createCompleteCallback();
            });
            

            this.get(0).on('validate', function(f, textField) {

                $.post(that.opts.checkNameUrl, {
                    name : textField.getValue()
                }, function (data) {
                    if (data.flag === true) {
                        f(false);
                    } else {
                        f(true);
                    }
                });
            });
            
            this.get(0).setValue(this.opts.data.nameAlias);
            
            var submit = this.roles.get('submit');
            
            $(submit).on('click', function() {
                if(!that.isValid()) {
                    return;
                }
                
                var originData = that.opts.data;
                
                var currData = $.extend(originData, that.getFormData());
                
                $.post(that.opts.url, currData, function(data){
                    if(data.flag){
                        if(that.opts.reqCB){
                            that.opts.reqCB.call(that, currData);
                        }
                        if(that.opts.gridWidget){
                            that.opts.gridWidget.reload();
                            // that.opts.gridWidget.updateData(currData, 'hostPcid');
                        }
                        if(that.opts.commonBaseInfoWidget){
                            
                        }
                        tree.refresh();

                        Dialog.close();
                    }
                });
            });
            

            var cancel = this.roles.get('cancel');

            $(cancel).on('click', function() {
                Dialog.close();
            });
        },
        loadData: function(data){
            // if(data.platformType){
            //     this.vm.platformType(data.platformType);
            //     this.vm.platformTypeEnable(false);
            // }
        },
        getData: function(keysObj){
            return JSON.parse(ko.toJSON(this.vm, keysObj));
        },
        createCompleteCallback: function(){

            
        },
        validate: function(){
            alert('ok');
            return this.isValid();

           
        },
        req: function(data){
            var jsonData = {data: data};
            var dataInterface = {
                real: rootPath + 'xcat/XCATPlatformAction.do?method=registePlatform',
                simulate: 'xcat/host/EditHostSucc.json'
            };

            $.post(GUtil.getInterface(dataInterface), jsonData, function(data){
                if(data.flag == 1){
                    Dialog.close();
                }else{
                    Dialog.alert('注册失败！');
                }

            }, 'json');
        }
    };

    function obj2Arr(obj){
        var arr = [];
        for(var key in obj){
            arr.push(key);
            arr.push(obj[key]);
        }
        return arr;
    }

    ExtendClass(EditLparTest, TSFormTest);
    InstallFunctions(EditLparTest.prototype, DONT_ENUM, obj2Arr(methods));
    
    SetProperties(EditLparTest.prototype,DONT_ENUM,[
        "i18n",i18n,
        "template",html
    ]);

    return EditLparTest;
});
