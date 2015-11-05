

define("ts/widgets/TSCheckField",
	[
        "ts/widgets/TSWidget", 
        "ts/widgets/TSField", 
        "ts/widgets/TSFormTest", 
        "ts/events/TSEvent", 
        "ts/util/GenericUtil",
        "dojo/text!./htm/TSCheckField.htm"], 
    function(TSWidget, TSField, TSFormTest, TSEvent, GUtil, htm, css) {
        "use strict";
            
        var i18n = TSWidget.prototype.i18n.createBranch({});
        function TSComboBox(config) {
        	
        	TSWidget.call(this, config);	// 调用父类构造方法
        	
        	this.body = this.roles.get('body');
        	this.checker = this.roles.get('checker');
        	
        	addEventListeners.call(this);
        }
     
        function init() {
        }
        
        function setBody(compnent) {
        	var that = this;
        	if(!compnent instanceof TSField) {
        		//throw new TypeError("field应为TSField子类");
        	}
        	
        	if(compnent instanceof TSField) {
        		compnent.el.css('border-radius','0px 4px 4px 0px');
        	} else if(compnent instanceof TSFormTest) {
        		compnent.addEventListener('addremoveclick', function(e) {
        			var field = e.field;
        			field.el.css('border-radius','0px 4px 4px 0px');;
        		});
        		compnent.items.forEach(function(item, i) {
    				item.el.css('border-radius','0px 4px 4px 0px');
    			});
        	}
        	
        	compnent.placeAt(this.body);
        	
        	this.body = compnent;
        }
        
        function getBody() {
        	return this.body;
        }
        
        function addEventListeners() {
        	var that = this;
        	
        	var checker = this.checker;
        	
        	$(checker).prop('checked', true);
        	
        	this.addEventListener('check', function() {
        		if(that.body instanceof TSField) {
	        		if($(checker).prop('checked')) {
	        			that.body.setReadOnly(false);
	        			that.body.setStyle({
	        				'background-color': '#fff'
	        			});
	        		} else {
	        			that.body.setReadOnly(true);
	        			that.body.setStyle({
	        				'background-color': '#eee',
	        				'border': '1px #ccc solid'
	        			});
	        			that.body.el.removeAttr('placeholder');
	        		}
        		} else if(that.body instanceof TSFormTest) {
        			that.body.items.forEach(function(item, i) {
        				if($(checker).prop('checked')) {
        					item.setReadOnly(false);
        					item.setStyle({
    	        				'background-color': '#fff'
    	        			});
    	        		} else {
    	        			item.setReadOnly(true);
    	        			item.setStyle({
    	        				'background-color': '#eee',
    	        				'border': '1px #ccc solid'
    	        			});
    	        			item.el.removeAttr('placeholder');
    	        		}
        			});
        		}
        	});
        
        	$(checker).on('click', function() {
        		that.dispatchEvent(new TSEvent('check'));
        	});
        }
    
        ExtendClass(TSComboBox, TSField);
    
        SetProperties(TSComboBox.prototype, DONT_ENUM, ["i18n", i18n, "template", htm]);
        InstallFunctions(TSComboBox.prototype, DONT_ENUM, GUtil.obj2Arr({
    		setBody: setBody,
    		getBody: getBody,
    		setChecked: function(checked) {
    			$(this.checker).prop('checked', checked);
    			this.dispatchEvent(new TSEvent('check'));
    		},
    		getChecked: function() {
    			return $(this.checker).prop('checked');
    		}
    	}));
        return TSComboBox;
    }
);
