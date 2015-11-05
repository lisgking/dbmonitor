
define('ts/widgets/TSField', 
	[
		"ts/widgets/TSWidget",
		"ts/events/TSEvent",
        "ts/widgets/Bubble", // 气泡
        "dojo/text!./htm/TSField.htm", 
        "dojo/nls!./nls/TSField.json"
    ], 
    function(TSWidget, TSEvent, Bubble, htm, json) {
        "use strict";
            
        var i18n = TSWidget.prototype.i18n.createBranch(json);
		
        function TSField(config) {
            TSWidget.call(this);
            
           	this.el = $('*:eq(2)', $(this.rootElement));	// 第三个子元素
            this.labelEl = $('label:first', $(this.rootElement));
            this.separatorEl = $('label.separator', $(this.rootElement));
            
            config = config || {};
            config.listeners = config.listeners || {};
            
            this.config = this.config || {};
    
            config = $.extend(this.config, config);
            $.extend(this, config);

            this.el.attr('data-role', $(config.renderTo).attr('data-role'));
            
            // 初始化配置
            init.call(this);
            
            // 事件处理
            addEventListener.call(this);
        }
     
        function init() {
            var me = this;
            var el = this.el;
    
            this.originValue = this.value;
            
            if ( typeof this.width == 'number') {
                el.css('width', this.width + 'px');
            }else if ( typeof this.width == 'string') {
            	el.css('width', this.width);
            }
            
            if ( typeof this.height == 'number') {
                el.css('height', this.height + 'px');
            }
            
            if(this.fieldLabel) {
                this.labelEl.html(this.fieldLabel);
                this.labelEl.css('display', 'inline-block');
                
                this.separatorEl.html(this.labelSeparator);
                this.separatorEl.css('display', 'inline-block');
                
	            //el.css('width', '200px');
                
                if($.isNumeric(this.labelWidth)) {
                    this.labelEl.css('width', this.labelWidth + 'px');
                }
            }
            
            if($.inArray(this.labelAlign, ['left', 'center', 'right'])) {
                 this.labelEl.css('text-align', this.labelAlign);
            }
    
            if (this.value) {
                el.val(this.value);
            }
    
            if (!this.readOnly == false) {
                el.attr('readonly', 'readonly');
            } else {
                el.removeAttr('readonly');
            }
            if ( typeof this.name == 'string') {
                el.attr('name', this.name);
            }
    
            if ( typeof this.emptyText == 'string') {
                el.attr('placeholder', this.emptyText);
            }
    
            if (typeof this.style == 'string') {
                el.attr('style', this.style);
            } else if ( typeof this.style == 'object') {
                $.each(this.style, function(cssName, cssValue) {
                    el.css(cssName, cssValue);
                });
            }
            
            if(typeof this.cls == 'string') {
            	el.attr('class', this.cls);
            }
            
            if ( typeof this.renderTo == 'string' || typeof this.renderTo == 'object') {
                this.placeAt(this.renderTo);
            }
            
            if(typeof this.init == 'function') {
            	this.init.call(this);	// 用于子类实现
            }
        }
        
        function addEventListener() {
            var me = this;
            var el = this.el;
            if (typeof me.listeners == 'object') {
                $.each(me.listeners, function(eventName, eventFunction) {
                    el.bind(eventName, function(e) {// 把作用域中的this指向本TSTextField, 并且传递一个事件参数供调用
                        eventFunction.call(me, e, me);
                    });
                });
            }

            if(typeof this.addListener == 'function') {
            	this.addListener.call(this);	// 用于子类实现
            }
        }
    
        ExtendClass(TSField, TSWidget);
    
        SetProperties(TSField.prototype, DONT_ENUM, ["i18n", i18n, "template", htm]);
        InstallFunctions(TSField.prototype, DONT_ENUM, [
                                                        
            'getValue', function() {
                return this.el.val();
            }, 
            'setValue', function(value) {
                this.el.val(value);
                this.el.change();
                this.dispatchEvent(new TSEvent('change'));
            }, 
            'setReadOnly', function(readOnly) {
                if (readOnly) {
                    this.el.attr('readonly', 'readonly');
                } else {
                    this.el.removeAttr('readonly');
                }
            }, 
            'setName', function(name) {
                this.el.attr('name', name);
            }, 
            'getName', function() {
                return this.el.attr('name');
            },
            'getDataRoleName', function() {
            	return this.el.attr('data-role');
            },
            'on', function(eventName, eventFun) {	// 动态添加监听事件
            	var me = this;
            	if(!me.listeners) {
            		me.listeners = {};
            	}
            	
            	if(typeof eventFun == 'function') {
	            	me.listeners[eventName] = eventFun;
            	}
            	
            	this.el.bind(eventName, function(e) {
            		eventFun.call(me, e);
            	});
            },
            'un', function(eventName) {				// 删除监听事件
            	this.el.unbind(eventName);
            },
            'isValid', function() {
            	
            }, 
            'setStyle', function (style) {
                var me = this;
                if (typeof style == 'string') {
                    me.el.attr('style', style);
                } else if (typeof style == 'object') {
                    $.each(style, function (cssName, cssValue) {
                        me.el.css(cssName, cssValue);
                    });
                }
            },
            'isDirty', function() {
                return this.getValue() != this.originValue;
            }, 
            'nextSibling', function() {     // 获取当前元素的下一个兄弟组件
                var me = this;
                if(!this.form) {
                    return;
                }
                var index = 0;
                $.each(this.form.items, function(i, item) {
                    if(item == me) {
                        index = i;
                        return;
                    }
                });
                if(index > this.form.items.length - 1) {
                    return;
                }
                return this.form.items[index + 1];
                
            },
            'previousSibling', function() { // 获取当前元素的上一个兄弟组件
                var me = this;
                if(!this.form) {
                    return;
                }
                if(this.form.items[0] == this) {    // 如果当前节点是第一个,则返回空
                    return;
                }
                var index = 0;
                $.each(this.form.items, function(i, item) {
                    if(item == me) {
                        index = i;
                        return;
                    }
                });
                if(index > this.form.items.length - 1) {
                    return;
                }
                return this.form.items[index - 1];
            }]
        );
        return TSField;
    }
);
