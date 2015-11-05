define('ts/common/EditHost', [
    'ts/widgets/CommonWidget',
    'ts/widgets/CommonFormField',
    'dojo/text!ts/common/EditHost.html',
	'dojo/css!ts/common/EditHost.css',
	'dojo/nls!ts/common/dataCenter.json'
], function(CommonWidget, CommonFormField, html, css, json){
	'use strict';

    var i18n = null;
	function EditHost(opts){
        CommonWidget.call(this, {html: html, css: css, json: json});
        i18n = this.i18n;
        this.opts = null;
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
            var that = this;
            var originData = this.opts.data;
            
            ko.applyBindings(this.vm, this.container[0]);

            var formField = new CommonFormField();
            this.formField = formField;
            this.formField.placeAt(this.container, 'append');

            formField.loadData([{
                    _type: 'input',
                    _name: 'nameAlias',
                    _val: originData.nameAlias,
                    _text: i18n.getMsg('hostName'),
                    _valid: {
                        required: {
                            message: i18n.getMsg('please enter the host name'),
                            params: true
                        },
                        pattern: {
                            message: i18n.getMsg('please type in the name of the host the correct format'),
                            params: '^[\\w-]{3,}$'
                        },
                        validation: {
                            async: true,
                            validator: function (val, params, callback) {
                                $.post( that.opts.checkNameUrl, {name: val}, function(data){
                                    var isExsit = false;
                                    var msg = i18n.getMsg('congratulations you can use this name');
                                    if(data.flag === true){
                                        isExsit = true;
                                        msg = data.msg || i18n.getMsg('this name is already used');
                                    }
                                    callback({ isValid: !isExsit, message: msg});
                                });
                            },
                            message: i18n.getMsg('congratulations you can use this name')
                        }
                    }
                }, {
                    _isSubmitGroup: true,
                    _type: 'button',
                    _name: 'save',
                    _text: i18n.getMsg('submit'),
                    _clickCB: function(){
                        if(!this.validate()){
                            return ;
                        }
                        var currData = formField.getData(originData);
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
                    }
                }
            ]);
        },
        validate: function(){

            if (this.vm.errors().length == 0) {
                //可以提交数据了.
                return true;
            } else {
                this.vm.errors.showAllMessages();
                return false;
            }
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
    }

    function obj2Arr(obj){
        var arr = [];
        for(var key in obj){
            arr.push(key);
            arr.push(obj[key]);
        }
        return arr;
    }

    ExtendClass(EditHost, CommonWidget);
    InstallFunctions(EditHost.prototype, DONT_ENUM, obj2Arr(methods));

	return EditHost;
});