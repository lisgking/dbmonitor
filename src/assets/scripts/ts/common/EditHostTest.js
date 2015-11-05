define('ts/common/EditHostTest', [
    'ts/widgets/TSWidget',
    'ts/widgets/TSFormTest',
    'dojo/text!ts/common/EditHostTest.html',
	'dojo/css!ts/common/EditHost.css',
	'dojo/nls!ts/common/dataCenter.json'
], function(TSWidget, TSFormTest, html, css, json){
	'use strict';

    var i18n = TSWidget.prototype.i18n.createBranch(json);
   
	function EditHostTest(opts){
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
            
            this.get(0).setValue(this.opts.data.nameAlias);
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

        	/*
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
            */
        },
        validate: function(){
        	alert('ok')
        	return this.isValid();

            /*if (this.vm.errors().length == 0) {
                //可以提交数据了.
                return true;
            } else {
                this.vm.errors.showAllMessages();
                return false;
            }*/
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

    ExtendClass(EditHostTest, TSFormTest);
    InstallFunctions(EditHostTest.prototype, DONT_ENUM, obj2Arr(methods));
    
    SetProperties(EditHostTest.prototype,DONT_ENUM,[
        "i18n",i18n,
        "template",html
    ]);

	return EditHostTest;
});