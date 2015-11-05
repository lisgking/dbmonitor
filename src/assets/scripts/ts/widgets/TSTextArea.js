

define("ts/widgets/TSTextArea",
	[
        "ts/widgets/TSWidget", 
        "ts/widgets/TSField", 
        "ts/events/TSEvent", 
        "ts/widgets/Bubble", // 气泡
        "ts/util/GenericUtil",
        "dojo/text!./htm/TSTextArea.htm", 
        "dojo/css!./css/TSTextArea.css", 
        "dojo/nls!./nls/TSField.json"], 
    function(TSWidget, TSField, TSEvent, Bubble, GUtil, htm, css, json) {
        "use strict";
            
        var i18n = TSWidget.prototype.i18n.createBranch(json);
		
        function TSTextArea(config) {
        	
            var defaultConfig = {   // 默认配置
                readOnly : false,
                width : "100%",
                height : 100,
                validateText : i18n.getMessage('validateText'),//'输入不合法',
                validateFunText : i18n.getMessage('validateFunText'),//'自定义输入不合法',
                emptyText : i18n.getMessage('emptyText'),//'请输入',
                emptyMsg :  i18n.getMessage('emptyMsg'),//'不能为空',
                allowBlank : true,
                labelSeparator : ':',
                labelWidth: 60,
                labelAlign: 'left',
            };
            
            config = $.extend(defaultConfig, config);
            
            config.listeners = config.listeners || {};
    
            $.extend(this, config);
            
        	TSField.call(this, config);	// 调用父类构造方法

            if(config.rows != undefined) {
        		this.el.attr('rows', config.rows);
        	}
            if(config.maxlength != undefined) {
            	this.el.attr('maxlength', config.maxlength);
            }
        }
     
        function init() {
        	//console.log(this.el)
        }
        
        function addListener() {
            var me = this;
            var el = this.el;
            
            el.on({
            	input: function() {
                	validateAll.call(me);
            	},
            	focus: function() {
            		validateAll.call(me);
            	},
            	blur: function() {
            		Bubble.hide();
            	}
            });
            
            function validateAll() {
            	var me = this;
            	Bubble.bind(me.el);
            	if(!me.isValid()) {
            		me.setStyle({
            			'border': '1px red solid'
            		});
            		
                	$('ul', Bubble.getEl()).html(i18n.getMessage('emptyMsg'));
            		Bubble.show();
            	} else {
            		me.setStyle({
            			'border': '1px #ccc solid'
            		});
            		Bubble.hide();
            	}
            }
        }
    
        ExtendClass(TSTextArea, TSField);
    
        SetProperties(TSTextArea.prototype, DONT_ENUM, ["i18n", i18n, "template", htm]);
        InstallFunctions(TSTextArea.prototype, DONT_ENUM, GUtil.obj2Arr({
    		'init' : init,
    		'addListener' : addListener,
    		'isValid': function() {				// override
    			if(this.allowBlank != true && (this.getValue() == '' || this.getValue() == null)) {
    				return false;
    			} else {
    				return true;
    			}
            }
    	}));
        return TSTextArea;
    }
);
