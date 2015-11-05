define('ts/common/SetupLparTrust', [
    'ts/widgets/CommonWidget',
    'ts/widgets/CommonFormField',
    'dojo/text!ts/common/SetupLparTrust.html',
	'dojo/css!ts/common/SetupLparTrust.css',
	'dojo/nls!ts/common/dataCenter.json'
], function(CommonWidget, CommonFormField, html, css, json){
	'use strict';

    var i18n = null;
	function SetupLparTrust(opts){
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
                    _name: 'username',
                    _val: '',
                    _text: i18n.getMsg('username'),
                    _valid: {
                        required: {
                            message: i18n.getMsg('please enter your user name'),
                            params: true
                        },
                        pattern: {
                            message: i18n.getMsg('please enter the correct user name format'),
                            params: '^[a-z0-9_-]{3,16}$'
                        }
                    }
                },{
                    _type: 'password',
                    _name: 'password',
                    _val: '',
                    _text: i18n.getMsg('lparPassword'),
                    _valid: {
                        required: {
                            message: i18n.getMsg('please enter the lpar password'),
                            params: true
                        },
                        pattern: {
                            message: i18n.getMsg('please input the correct lpar password format'),
                            params: '^[\\w-]{3,}$'
                        }
                    }
                },{
                    _text: i18n.getMsg('netCard'),
                    _type: 'select',
                    _name: 'netCardInfo',
                    _options: [],
                    _selectedOption: 0,
                    _valid:{
                    	validation:{
                    		validator: function (val) {
			                    if (val){
									if(val.val){
										return true;
									}else{
										return false;
									}
			                    }else{
			                        return false;
			                    }
			                },
			                message: i18n.getMsg("noUseNetworkCard")
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
                        var currData = formField.getData();
                        currData.lparInfo = that.opts.data;
                        //currData.password =  $.jCryption.encryptKey(currData.password);
                        $.post(that.opts.url+'?method=setupTrust', currData, function(data){
                            if(data.flag==1){
                                if(that.opts.gridWidget){
                                	that.opts.gridWidget.reload();
                                }
                                Dialog.close();
                                Dialog.alert(i18n.getMsg('successfully configured SSH trust relationship between partitions'));
                            }
                        });
                    }
                }
            ]);

            var netCardField = formField.getField('_name', 'netCardInfo');
            
            $.post(that.opts.url+'?method=getLparNetworkCardList', originData, function(data){
                if(data && Array.isArray(data)){
                    var newOptions = [];
                    data[0].networkCardPOList.forEach(function(item){
                        newOptions.push({text: item.netCard, val: item});
                    });
                    netCardField._options(newOptions); 
                }
            });
            
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
            
        }
    }


    ExtendClass(SetupLparTrust, CommonWidget);
    InstallFunctions(SetupLparTrust.prototype, DONT_ENUM, GUtil.obj2Arr(methods));

	return SetupLparTrust;
});