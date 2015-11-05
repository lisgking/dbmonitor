
/**
	TSForm组件
	
	config
		String url	提交的地址
		String type 提交的方式
		Boolean readOnly 是否只读
		Array items 表单元素
		Boolean standardSubmit :是否标准提交 
	public property
		Array items	 子表单元素的集合
		Object listeners	监听事件
			使用方法
			listeners: {
				beforeSubmit: function() {
					alert('beforeSubmit');
				},
				afterSubmit: function() {
					alert('afterSubmit');
				}
			}
	
	method
		void setStyle(String) 设置样式
		void submit()	提交表单
		void isValid()	表单是否验证通过
		Boolean isDirty() 表单是否已修改
		Object getFormData() 返回表单中各表单域name及值的obejct对象
		void setReadOnly(Boolean)	设置表单是否可修改
		void load(Object) 给表单填充数据
		
	
	event
		beforeSubmit	提交前事件
		afterSubmit		提交后事件
		beforeLoad		加载前事件
		afterLoad		加载后事件
		
		validate		自定义验证
		
*/

define("ts/widgets/TSFormTest", [
        "ts/widgets/TSWidget",
        "ts/widgets/TSTextField",
        "ts/widgets/TSComboBox",
        "ts/widgets/TSTextArea",
        "ts/events/TSEvent",
        "ts/util/Cryption!",
        "dojo/css!./css/TSFormTest.css",
        "dojo/text!./htm/TSFormTest.htm",
        "jquery"
    ], function (TSWidget, TSTextField, TSComboBox, TSTextArea, TSEvent, Cryption, css, htm, $) {
		"use strict";

		//var i18n = TSWidget.prototype.i18n.createBranch(json);
		var i18n = TSWidget.prototype.i18n.createBranch({});
		function TSFormTest(opts) {
			TSWidget.call(this);

			if(this.rootElement.tagName == 'FORM') {
				this.el = $(this.rootElement);
			} else {
				this.el = $('form', $(this.rootElement));
			}
			
			init.call(this, opts);
			// 初始化配置
			addEventListener.call(this);
			// 事件处理
		}

		function init(config) {
			
			var me = this;
			var el = this.el;

			var defaultConfig = {// 默认配置
				readOnly : false, // 是否只读
				type : 'text', //
				standardSubmit : false
			};

			config = $.extend(defaultConfig, config);
			$.extend(this, config);
			if ( typeof config.renderTo == 'string' || typeof config.renderTo == 'object') {
				this.placeAt(config.renderTo, 'afterbegin');
			}

			if (!config.readOnly == false) {
				el.attr('readonly', 'readonly');
			} else {
				el.removeAttr('readonly');
			}

			if ( typeof config.style == 'string') {
				el.attr('style', config.style);
			} else if ( typeof config.style == 'object') {
				$.each(config.style, function(cssName, cssValue) {
					el.css(cssName, cssValue);
				});
			}
			
			this.items = [];	// 用于存放表单元素

			if ($.isArray(config.items)) {	//  如果配置了items,刚使用items来填充表单,否则使用子类的html模块来填充
				this.items = config.items;
				renderItems.call(this);
			} else {
				renderItemsHtml.call(this);
			}
		}
		
		function renderItemsHtml() {
	
			var me = this;

			var fieldItems = $(':text,:password,input[type="number"],select,textarea', this.el);
			$.each(fieldItems, function(i, fieldEl) {
				
				var allowBlank = $(fieldEl).attr('allowBlank') || ($(fieldEl).attr('required') != 'required');

				var regex = $(fieldEl).attr('pattern');
				if(typeof regex == 'string') {
					regex = eval('/' + regex + '/');
				}
				
				var field;
				if(fieldEl instanceof HTMLInputElement) {
					field = new TSTextField({
						name : $(fieldEl).attr('name'),
						type: $(fieldEl).attr('type') || 'text',
						value : $(fieldEl).val(),
						vtype: $(fieldEl).attr('vtype'),
						cls: $(fieldEl).attr('class'),
						width: $(fieldEl).attr('width'),
						height: $(fieldEl).attr('height'),
						
						min: $(fieldEl).attr('min'),
						max: $(fieldEl).attr('max'),
						step: $(fieldEl).attr('step'),
						
						readOnly: $(fieldEl).attr('readOnly') || $(fieldEl).attr('readonly'),
						regex: regex,
						validateText: $(fieldEl).attr('validateText'),
						validateFunText: $(fieldEl).attr('validateFunText'),
						emptyMsg: $(fieldEl).attr('emptyMsg'),
						allowBlank: allowBlank,
						renderTo: $(fieldEl)
					});
					
					// 在子元素上建立一个form的引用以供调用
					field.form = me;
					me.items.push(field);
				} else if(fieldEl instanceof HTMLSelectElement) {

					field = new TSComboBox({
						name : $(fieldEl).attr('name'),
						value : $(fieldEl).val(),
						cls: $(fieldEl).attr('class'),
						width: $(fieldEl).attr('width'),
						height: $(fieldEl).attr('height'),
						readOnly: $(fieldEl).attr('readOnly') || $(fieldEl).attr('readonly'),
						validateText: $(fieldEl).attr('validateText'),
						emptyMsg: $(fieldEl).attr('emptyMsg'),
						allowBlank: allowBlank,
						
						displayField: $(fieldEl).attr('displayField'),
						valueField: $(fieldEl).attr('valueField'),
						
						renderTo: $(fieldEl)
					});
					
					// 在子元素上建立一个form的引用以供调用
					field.form = me;
					me.items.push(field);
				} else if(fieldEl instanceof HTMLTextAreaElement) {
					field = new TSTextArea({
						name : $(fieldEl).attr('name'),
						value : $(fieldEl).val(),
						cls: $(fieldEl).attr('class'),
						width: $(fieldEl).attr('width'),
						height: $(fieldEl).attr('height'),
						readOnly: $(fieldEl).attr('readOnly') || $(fieldEl).attr('readonly'),
						validateText: $(fieldEl).attr('validateText'),
						allowBlank: allowBlank,

						maxlength: $(fieldEl).attr('maxlength'),
						rows: $(fieldEl).attr('rows'),
						renderTo: $(fieldEl)
					});
					
					// 在子元素上建立一个form的引用以供调用
					field.form = me;
					me.items.push(field);
				}
			});
		}

		function renderItems() {
			var me = this;
			var divElement = $('<div></div>');
			var ulElement = $('<ul></ul>');

			this.el.append(divElement);
			divElement.append(ulElement);
			$.each(this.items, function(i, item) {
				var liElement = $('<li></li>');//.css('text-align', 'left');
				ulElement.append(liElement);
				item.placeAt(liElement, 'afterBegin');

				item.form = me;
				// 在子元素上建立一个form的引用以供调用
			});
		}

		function addEventListener() {
			var me = this;
			var el = this.el;

			if ( typeof me.listeners == 'object') {
				$.each(me.listeners, function(eventName, eventFunction) {
					el.bind(eventName, function(e) {// 把作用域中的this指向本组件, 并且传递一个事件参数供调用
						eventFunction.call(me, e);
					});
				});
			}
		}

		// 当前验证状态
		function validateAll() {
			
			var firstInvalidateIndex = -1;	// 记录第一个不合法的下标，用来显示气泡
			
			var result = true;
			if ($.isArray(this.items)) {
				$.each(this.items, function(i, item) {
					if ( typeof item.isValid == 'function' && !item.isValid.call(item)) {
						result = false;
						if(firstInvalidateIndex == -1) {
							firstInvalidateIndex = i;
						}
						item.el.css('border', '1px red solid');
					} else {
						item.el.css('border', '1px #ccc solid');
					}
				});
			}
			
			if(firstInvalidateIndex > -1) {
				var firstInvalidateEl = this.get(firstInvalidateIndex).el;
				setTimeout(function() {
					firstInvalidateEl.focus();	// 两次才触发focus，原因未知
					firstInvalidateEl.focus();
				});
			}
			
			return result;
		}

		function isDirty() {// 表单是否已修改
			var result = false;
			if ($.isArray(this.items)) {
				$.each(this.items, function(i, item) {
					if ( typeof item.isDirty == 'function' && item.isDirty.call(item)) {
						result = true;
						return;
					}
				});
			}
			return result;
		}

		function getFormData() {// 返回表单中各表单域name及值的obejct对象
			var formData = {};
			
			if ($.isArray(this.items)) {
				$.each(this.items, function(i, item) {
					formData[item.getName()] = item.getValue();
				});
			}
			
			/*var formElement = $(':text,:password,select,textarea', this.el);
			$.each(formElement, function(i, item) {
				formData[$(item).attr('data-role') || $(item).attr('name')] = $(item).val();
			});*/
			
			return formData;
		}
		
		function getFormData4EncryptPassword() {// 返回表单中各表单域name及值的obejct对象(与getFormData不同的是,密码类型的数据为加密的)
			var formData = {};
			/*var formElement = $(':text,:password,select,textarea', this.el);
			$.each(formElement, function(i, item) {
				if(item.type == 'password') {
					try {
						formData[$(item).attr('data-role') || $(item).attr('name')] = Cryption.encryptKey($(item).val());
					} catch(e) {
						console.log(e.message);
					}
				} else {
					formData[$(item).attr('data-role') || $(item).attr('name')] = $(item).val();
				}
			});*/
			
			if ($.isArray(this.items)) {
				$.each(this.items, function(i, item) {
					if(item.type == 'password') {
						formData[item.getName()] = Cryption.encryptKey(item.getValue());
					} else {
						formData[item.getName()] = item.getValue();
					}
				});
			}
			
			return formData;
		}

		function setReadOnly(readOnly) {//
			if ($.isArray(this.items)) {
				$.each(this.items, function(i, item) {
					if ( typeof item.setReadOnly == 'function') {
						item.setReadOnly.call(item, readOnly);
					}
				});
			}
		}

		function load(formData) {// 动态填充表单数据
			if ($.isArray(this.items)) {
				$.each(this.items, function(i, item) {
					if ( typeof item.getValue == 'function') {
						item.setValue.call(item, formData[item.getName()]);
					}
				});
			}
		}
		
		function add(field) {
			this.items.push(field);
		}

		function format() {
			var s = arguments[0];
			for (var i = 0; i < arguments.length - 1; i++) {
				s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i + 1]);
			}
			return s;
		}

		ExtendClass(TSFormTest, TSWidget);

	    SetProperties(TSFormTest.prototype, DONT_ENUM, [		// 设置成员变量
	    	"i18n", i18n, 
	    	"template", htm
	    ]);
	    
    	InstallFunctions(TSFormTest.prototype, DONT_ENUM, [
            "init", init,
            'submit', function (callBack) { // 提交表单
                var me = this;

                if (!this.isValid()) {
                    return;
                }

                if (this.listeners && typeof this.listeners.beforeSubmit == 'function' && !this.listeners.beforeSubmit.call(this)) {
                	me.dispatchEvent(new TSEvent('beforeSubmit'));
                    return;
                }
                if (!this.standardSubmit) { // 默认ajax提交
                    if (typeof callBack != 'function') {
                        callBack = function () {
                            if (this.listeners && typeof this.listeners.afterSubmit == 'function') { // 执行afterSubmit
                                this.listeners.afterSubmit.call(this);
                                me.dispatchEvent(new TSEvent('afterSubmit'));
                            }
                        };
                    }
                    $.ajax({
                        url : me.url,
                        data : me.getFormData4EncryptPassword(),
                        type : me.type || 'post',
                        //dataType:'text',
                        success : function () {
                            callBack.apply(me, arguments);
                        },
                        error : function () {
                            callBack.apply(me, arguments);
                        }
                    });
                } else {
                    this.el.submit();
                }
            },
            'isValid', function () {
                return validateAll.call(this);
            },
            'get', function(name) {	// 根据data-role或name获取对应的TSTextField对象
            	if(!this.items) {
            		return;
            	}
            	if(this.items.length < 1) {
            		return;
            	}
            	
            	var returnItem = null;
            	
            	if(typeof name == 'number') {
            		returnItem = this.items[name];
            	} else {
            		$.each(this.items, function(i, item) {
	            		if(item.getDataRoleName() == name || item.getName() == name) {
	            			returnItem = item;
	            			return;
	            		}
	            	});
            	}
            	
            	return returnItem;
            },
            "serializeObject", function () {
                return this.serializeArray().reduce(function (obj, param) {
                    if (!obj.hasOwnProperty(param.name)) {
                        obj[param.name] = param.value;
                    }
                    return obj;
                }, {});
            },
            'isDirty', function () {
                return isDirty.call(this);
            },
            'getFormData', function () { // 获取表单数据
                return getFormData.call(this);
            },
            'getFormData4EncryptPassword', function() {
            	return getFormData4EncryptPassword.call(this);
            },
            'setReadOnly', function (readOnly) {
                return setReadOnly.call(this, readOnly);
            },
            'load', function (formData) {   // 动态填充表单数据
                load.call(this, formData);
                this.dispatchEvent(new TSEvent('load'));
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
            'add', function(field) {
            	add.call(this, field);
            },
            'remove', function(field) {
            	this.items = this.items.filter(function(f) {	// 删除对应的field
					return f != field;
				});
            }
        ]);

		SetNativeFlag(TSFormTest);
		return TSFormTest;
	}
);
