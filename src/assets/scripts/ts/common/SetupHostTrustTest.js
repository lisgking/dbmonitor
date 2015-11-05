define('ts/common/SetupHostTrustTest', [
    'ts/widgets/TSWidget',
    'ts/widgets/TSFormTest',
    'dojo/text!ts/common/SetupHostTrustTest.html',
	'dojo/css!ts/common/SetupHostTrust.css',
	'dojo/nls!ts/common/dataCenter.json',
	'jquery',
], function(TSWidget, TSFormTest, html, css, json, $){
	'use strict';
	var i18n = TSWidget.prototype.i18n.createBranch(json);
	function SetupHostTrustTest(opts){
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

          this.addEventListener("DOMNodeInserted",function(){
        	  //that.createCompleteCallback();
          });
         /* this.get('platformName').on('validate', function(f) {
          	var textField = this;
          	$.post('ivm/IVMPlatformAction.do?method=checkPlatformRegistered',{
          			platformName: textField.getValue()
          	}, function(data) {
          		if(data.flag==false||data.flag=='false'){
          			f(true)
          		} else {
          			f(false)
          		}
          	}, 'json')
            })*/
          var submit = this.roles.get('sub');
          $(submit).on('click', function() {
          	if(!that.isValid()) {
          		return;
          	}
          	var originData = that.opts.data;
        	var currData = $.extend(originData, that.getFormData4EncryptPassword());
        	
            $.post(that.opts.url, currData, function(data){
               
                if(data.flag == 1){
                    if(that.opts.gridWidget){
                        //that.opts.gridWidget.updateData(currData, 'hostPcid');
                    	that.opts.gridWidget.reload();
                    }
                    Dialog.alert(i18n.getMsg('successfulConfigHostSSH'));
                } else if(data.flag ==0) {
                	Dialog.alert(data.errorMsg);
                }
                 Dialog.close();
   
            });
          });
          

          var cancel = this.roles.get('cancel');

          $(cancel).on('click', function() {
          	Dialog.close();
          });

        },          
                
        createCompleteCallback: function(){
            ko.applyBindings(this.vm, this.container[0]);
            this.loadData({platformType: 0});
        },
        validate: function(){
            if (this.vm.errors().length == 0) {
                return true;
            } else {
                this.vm.errors.showAllMessages();
                return false;
            }
        },
        loadData: function(data){
            if(data.platformType){
                this.vm.platformType(data.platformType);
                this.vm.platformTypeEnable(false);
            }
        },
        getData: function(){
            return this.getFormData();
        }
      
    }

    ExtendClass(SetupHostTrustTest, TSFormTest);
    InstallFunctions(SetupHostTrustTest.prototype, DONT_ENUM, GUtil.obj2Arr(methods));
    SetProperties(SetupHostTrustTest.prototype,DONT_ENUM,[
          "i18n",i18n,
          "template",html
    ]);
	return SetupHostTrustTest;
});