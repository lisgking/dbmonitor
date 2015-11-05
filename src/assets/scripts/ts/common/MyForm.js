define('ts/common/MyForm', [
    'ts/widgets/TSWidget',
    'ts/widgets/TSFormTest',
    'dojo/text!ts/common/MyForm.html',
	'dojo/css!ts/common/DeleteLpar.css',
	'dojo/nls!ts/common/dataCenter.json'
], function(TSWidget, TSFormTest, html, css, json){
	'use strict';
	
    var i18n = TSWidget.prototype.i18n.createBranch(json);
	function MyForm(opts){
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
            	
            	//alert('click');
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

    ExtendClass(MyForm, TSFormTest);
    InstallFunctions(MyForm.prototype, DONT_ENUM, obj2Arr(methods));
    
    SetProperties(MyForm.prototype,DONT_ENUM,[
        "i18n",i18n,
        "template",html
    ]);

	return MyForm;
});