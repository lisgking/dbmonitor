

define("ts/widgets/TSComboBox",
	[
        "ts/widgets/TSWidget", 
        "ts/widgets/TSField", 
        "ts/events/TSEvent", 
        "ts/widgets/Bubble", // 气泡
        "ts/util/GenericUtil",
        "dojo/text!./htm/TSComboBox.htm", 
        "dojo/css!./css/TSComboBox.css", 
        "dojo/nls!./nls/TSField.json"], 
    function(TSWidget, TSField, TSEvent, Bubble, GUtil, htm, css, json) {
        "use strict";
            
        var i18n = TSWidget.prototype.i18n.createBranch(json);
		
        function TSComboBox(config) {
        	
            var defaultConfig = {   // 默认配置
                readOnly : false,
                type : 'text',
                width : "100%",
                height : 35,
                validateText : i18n.getMessage('validateText'),//'输入不合法',
                validateFunText : i18n.getMessage('validateFunText'),//'自定义输入不合法',
                emptyText : i18n.getMessage('emptyText'),//'请输入',
                emptyMsg :  i18n.getMessage('emptyMsg'),//'不能为空',
                allowBlank : true,
                labelSeparator : ':',
                labelWidth: 60,
                labelAlign: 'left',
                
                displayField: 'text',
                valueField: 'value'
            };
            
            config = $.extend(defaultConfig, config);
            
            config.listeners = config.listeners || {};
    
            $.extend(this, config);
            
            var innerHTML;
        	if(typeof config.renderTo == 'string') {
	        	innerHTML = document.getElementById(config.renderTo).innerHTML;
        	} else if($(config.renderTo).length > 0){
        		innerHTML = $(config.renderTo)[0].innerHTML;
        	}
        	
        	TSField.call(this, config);	// 调用父类构造方法
        	this.el.append(innerHTML);
        }
     
        function init() {
        	//console.log(this.el)
        }
        
        function addListener() {
            var me = this;
            var el = this.el;
            
            el.on({
            	change: function() {
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
            		
                	$('ul', Bubble.getEl()).html(me.config.emptyMsg);
            		Bubble.show();
            	} else {
            		me.setStyle({
            			'border': '1px #ccc solid'
            		});
            		Bubble.hide();
            	}
            }
        }
    
        ExtendClass(TSComboBox, TSField);
    
        SetProperties(TSComboBox.prototype, DONT_ENUM, ["i18n", i18n, "template", htm]);
        InstallFunctions(TSComboBox.prototype, DONT_ENUM, GUtil.obj2Arr({
    		'init' : init,
    		'addListener' : addListener,
    		'isValid': function() {				// override
    			if(this.allowBlank != true && (this.getValue() === '' || this.getValue() === null)) {
    				return false;
    			} else {
    				return true;
    			}
            },
            'getValue': function() {
            	var index = this.el[0].selectedIndex;
            	if(this.data && index>-1) {
            		if(this.data[index]) {
            			return this.data[index]['value'];
            		} else {
            			return null;
            		}
            	} else {
            		return this.el.val();
            	}
            },
            'load': function(data) {
            	var me = this;
            	me.data = [];
            	if(!$.isArray(data)) {
            		throw new TypeError("必须为数组");
            	}
            	me.el.children().remove();
            	data.forEach(function(o, i) {
            		var option = new Option(o[me.displayField], o[me.valueField]);
            		me.el[0].options.add(option);
            		var obj = {
            			text: o[me.displayField],
            			value: o[me.valueField]
            		};
            		me.data.push(obj);
            	});
            	this.dispatchEvent(new TSEvent('load'));
            },
    		'setReadOnly' : function (readOnly) { 	// override
    			if (readOnly) {
    				this.el.attr('disabled', 'disabled');
    			} else {
    				this.el.removeAttr('disabled');
    			}
    		}
    	}));
        return TSComboBox;
    }
);
