define('ts/common/ResAssignInfoTest', [
    'ts/widgets/TSWidget',
    'ts/widgets/TSFormTest',
    'ts/widgets/TSTextField',
    'dojo/text!ts/common/ResAssignInfoTest.html',
    'dojo/nls!ts/common/dataCenter.json'
], function(TSWidget, TSFormTest, TSTextField, html, json){
    'use strict';

    var i18n = TSWidget.prototype.i18n.createBranch(json);
    function ResAssignInfoTest(opts){
    	TSFormTest.call(this);
        i18n = this.i18n;
        this.opts = opts;
        
        init.call(this);
    }
    
    function init() {
    	
    	 var me = this;
    	 var data = this.opts.data;
    	 
         $.post(me.opts.url, data, function(d){
        	 loadData.call(me, d);
         }, 'json');
         
         var confirm = this.roles.get('confirm');

         $(confirm).on('click', function() {
         	Dialog.close();
         });
    }
    

    function loadData(data) {
    	 var content = this.roles.get('content');
    	 data.forEach(function(item){
    		 var html = [
	    		'<div class="form-group">',
	    		   	  '<label class="col-sm-3 control-label">',
	    		   	  		item.text,
	    		   	  '</label>',
		   	          '<div class="col-sm-8">',
		   	          		'<p class="form-control-static" data-role="text">',
		   	          			item.val,
		   	          		'</p>',
	    		   	  '</div>',
	    		 '</div>'
	    	 ].join('');
    		 $(content).append(html)
    	});
    }
    
/*
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
            var formFieldArr = [];
            var formField = new CommonFormField();
            this.formField = formField;
            this.formField.placeAt(this.container, 'append');

            data.forEach(function(item){
                formFieldArr.push({
                    _type: 'text',
                    _name: 'text',
                    _text: item.text,
                    _val: item.val
                });
            });

            formFieldArr.push({
                    _isSubmitGroup: true,
                    _type: 'button',
                    _name: 'cancel',
                    _text: i18n.getMsg('cancel'),
                    _clsName: 'hidden'
                },{
                    _isSubmitGroup: true,
                    _type: 'button',
                    _name: 'save',
                    _text: i18n.getMsg('confirm'),
                    _clickCB: function(){
                        Dialog.close();
                    }
                });

            formField.loadData(formFieldArr);
        },
        getData: function(keysObj){
            return JSON.parse(ko.toJSON(this.vm, keysObj));
        },
        createCompleteCallback: function(){
            var that = this;
            var originData = this.opts.data;
            
            ko.applyBindings(this.vm, this.container[0]);

            this.req(originData);
            
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
            var that = this;
            $.post(that.opts.url, data, function(data){
                that.loadData(data);
            }, 'json');
        }
    }*/

    ExtendClass(ResAssignInfoTest, TSFormTest);
    //InstallFunctions(ResAssignInfoTest.prototype, DONT_ENUM, GUtil.obj2Arr(methods));
    
    SetProperties(ResAssignInfoTest.prototype,DONT_ENUM,[
	      "i18n",i18n,
	      "template",html
	]);

    return ResAssignInfoTest;
});