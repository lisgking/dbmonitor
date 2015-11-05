define('ts/common/DeleteLparTest', [
    'ts/widgets/TSWidget',
    'ts/widgets/TSFormTest',
    'dojo/text!ts/common/DeleteLparTest.html',
	'dojo/css!ts/common/DeleteLpar.css',
	'dojo/nls!ts/common/dataCenter.json'
], function(TSWidget, TSFormTest, html, css, json){
	'use strict';
	
    var i18n = TSWidget.prototype.i18n.createBranch(json);
	function DeleteLparTest(opts){
        //CommonWidget.call(this, {html: html, css: css, json: json});
		TSFormTest.call(this);
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
            
            var submit = this.roles.get('submit');
            
            $(submit).on('click', function() {
            	if(!that.isValid()) {
            		return;
            	}
            	
            	var originData = that.opts.data;
            	
            	var currData = $.extend(originData, that.getFormData4EncryptPassword());
            	
                //currData.password = $.jCryption.encryptKey(currData.password);
            	
                $.post(that.opts.url, currData, function(data){
                    if(data.flag){
                        if(data.flag === '1'){
                            var grid = that.opts.gridWidget;
                            var lparList = that.opts.lparListWidget;
                            // grid.removeData();
                            // Dialog.alert(i18n.getMsg('delSucc'));
                            Dialog.close();
                            originData = [originData];
                            originData.forEach(function(item){
                                item.runningStatus = lparList.runningStatusMapInversion.deleting;
                            });
                            grid.updateData(originData, 'lparPcid');
                            lparList.setActionsStatus(grid, lparList.runningStatusMapInversion.deleting);
                            lparList.setActionsStatusByMaster(grid, originData);                                     
                        }
                    }
                });
            });
            

            var cancel = this.roles.get('cancel');

            $(cancel).on('click', function() {
            	Dialog.close();
            });


            /*
            this.addEventListener("DOMNodeInserted",function(){
                that.createCompleteCallback();
                
            });
            */
            
        },
        loadData: function(data){
            // if(data.platformType){
            //     this.vm.platformType(data.platformType);
            //     this.vm.platformTypeEnable(false);
            // }
        },
        getData: function(keysObj){
        	return {};
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
                    _type: 'password',
                    _name: 'password',
                    _text: i18n.getMsg('hostPassword'),
                    _valid: {
                        required: {
                            message: i18n.getMsg('please enter the host password'),
                            params: true
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
                        //currData.password = $.jCryption.encryptKey(currData.password);
                        $.post(that.opts.url, currData, function(data){
                            if(data.flag){
                                if(data.flag === '1'){
                                    var grid = that.opts.gridWidget;
                                    var lparList = that.opts.lparListWidget;
                                    // grid.removeData();
                                    // Dialog.alert(i18n.getMsg('delSucc'));
                                    Dialog.close();
                                    originData = [originData];
                                    originData.forEach(function(item){
                                        item.runningStatus = lparList.runningStatusMapInversion.deleting;
                                    });
                                    grid.updateData(originData, 'lparPcid');
                                    lparList.setActionsStatus(grid, lparList.runningStatusMapInversion.deleting);
                                    lparList.setActionsStatusByMaster(grid, originData);                                     
                                }
                            }
                        });
                    }
                }
            ]);
            */
        	
        },
        
        /*
        validate: function(){

            if (this.formField.vm.errors().length == 0) {
                //可以提交数据了.
                return true;
            } else {
                this.formField.vm.errors.showAllMessages();
                return false;
            }
        },
        req: function(data){
            var jsonData = {data: data};
            var dataInterface = {
                real: rootPath + 'xcat/XCATPlatformAction.do?method=registePlatform',
                simulate: 'xcat/host/DeleteLparSucc.json'
            };

            $.post(GUtil.getInterface(dataInterface), jsonData, function(data){
                if(data.flag == 1){
                    Dialog.close();
                }else{
                    Dialog.alert('注册失败！');
                }

            }, 'json');
        }
        */
    }

    function obj2Arr(obj){
        var arr = [];
        for(var key in obj){
            arr.push(key);
            arr.push(obj[key]);
        }
        return arr;
    }

    ExtendClass(DeleteLparTest, TSFormTest);
    InstallFunctions(DeleteLparTest.prototype, DONT_ENUM, obj2Arr(methods));
    
    SetProperties(DeleteLparTest.prototype,DONT_ENUM,[
        "i18n",i18n,
        "template",html
    ]);

	return DeleteLparTest;
});