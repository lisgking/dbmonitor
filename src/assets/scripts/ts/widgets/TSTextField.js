/**
 TSTextField组件

 config
     type            String text|password
     renderTo        String|Object 渲染的dom
     vtype           String 验证类型  alpha|alphanum|email|url|username|ip
     width           number
     height          number
     allowBlank      Boolean 是否允许为空
     emptyText       String 为空时的文本
     regex           regex  自定义验证的正则表达式
     validateText       String 验证没有通过的的提示文字,包括正则和常用类型
     value           String 当前值
     readOnly        Boolean 是否只读
     name            String name
     style           String 样式
     cls			css class
     listeners       Object 监听事件
     fieldLabel       String 左侧文字
     labelAlign     String 左侧文字对齐方式
     labelWidth     number  左侧文字宽度
     validateFunText 

 public property
     originValue     原始值(isDirty方法用它来和当前值做比较)

 method
     String getValue()
     void setValue(String)
     void setReadOnly(Boolean)
     String getName()
     void setName(String)
     Boolean isValid() 验证状态
     Boolean isDirty 是否已改变
     void placeAt(Object) 渲染到
     void on(String) 添加监听事件
     void un(String) 删除监听事件
     

 event
     click
     blur
     change
     focus
     validate

 */

define([
        "ts/widgets/TSWidget", 
        "ts/widgets/TSField", 
        "ts/widgets/Bubble", // 气泡
        "ts/util/GenericUtil",
        "dojo/text!./htm/TSTextField.htm", 
        "dojo/css!./css/TSTextField.css", 
        "dojo/nls!./nls/TSField.json"], 
    function(TSWidget, TSField, Bubble, GUtil, htm, css, json) {
        "use strict";
            
        var i18n = TSField.prototype.i18n.createBranch(json);
		
        function TSTextField(config) {

            var me = this;
            this.msgBox = $('.bubble');

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
                labelAlign: 'left'
            };
            config = $.extend(defaultConfig, config);
            $.extend(this, config);
            
            TSField.call(this, config);	// 调用父类方法
            
            if(config.type == 'number') {
            	this.vtype = 'number';
            	if(config.step != undefined) {
            		this.el.attr('step', config.step);
            	}
            	if(config.min != undefined) {
            		this.el.attr('min', config.min);
            	}
            	if(config.max != undefined) {
            		this.el.attr('max', config.max);
            	}
            }
            this.el.attr('type', config.type);
            
            validateAll.call(me, function() {
                if (me.isValid()) {
                    me.el.css('border', '1px #ccc solid');
                } else {
                    me.el.css('border', '1px red solid');
                }
            });
            
            this.addEventListener('change', function() {
            	validateAll.call(me, function(v) {
            		me.validateInfo.userFun.passStatus = v;
                    if (me.isValid()) {
                        me.el.css('border', '1px #ccc solid');
                    } else {
                        me.el.css('border', '1px red solid');
                    }
                });
            });
        }
     
        function init() {
        	// 初始化验证信息
            initValidateInfo.call(this);
        }
        
        function initValidateInfo() {
            var me = this;
            me.validateInfo = {};   // 存放验证信息
            if(this.allowBlank == false) {
                me.validateInfo.allowBlank = {
                    passStatus: false,
                    msg: me.emptyMsg
                };
            }
            if(this.regex || this.vtype) {
                me.validateInfo.regex = {
                    passStatus: false,
                    msg: me.validateText
                };
            }
            if (this.listeners && typeof this.listeners.validate == 'function') {
                me.validateInfo.userFun = {
                    passStatus: false,
                    msg: me.validateFunText
                };
            }
        }
        
        function getMsg() {
            var me = this;
            var msg = {};
            $.each(me.validateInfo, function(k, v) {
                var cls = v.passStatus ? 'garrow' : 'oarrow';
                if(v.passStatus !== true) {
                	msg[k] = $('<li><i class="' + cls + '"></i><span>' + v.msg + '</span></li>');
                }
            });
            return msg;
        }
        
        function addListener() {
            var me = this;
            var el = this.el;
            var msgBox = this.msgBox;
            //var msgBoxBorder = this.msgBoxBorder;
            el.bind({
                input : function(e) {
                	if(this.readOnly) {
                		return;
                	}
                    if(e.keyCode == 13) {
                        if(me.nextSibling()) {
                            me.nextSibling().el.focus();
                        } else {
                            me.form.submit();
                            return;
                        }
                    }
                    
                    if($.isEmptyObject(me.validateInfo)) {
                		return;	
                	}
                	
                	clearTimeout(me.timeout);
                           
                    // 初始化验证信息
                    initValidateInfo.call(me);
                    validateAll.call(me, function(v) {
                    	validateCallback.call(me, v);
                    });
                    
                    // 如果存在userFun并且userFun.passStatus为undefined, 则前台调用的validate函数没有设置返回值
                    if(me.validateInfo.userFun && typeof me.validateInfo.userFun.passStatus == 'undefined') {
                       
                    	// 显示验证气泡                    
                    	me.msg = getMsg.call(me);

                    	var bubble = Bubble.getEl();
                    	$('ul', bubble).html('');
                    	$.each(me.msg, function(k, v) {
                    		$('ul', bubble).append(v);
                    	});

                    	$('i', me.msg.userFun).attr('class', 'loading');
                    	Bubble.show();
                    } else {
                        
                         // 验证完执行
                        if (me.isValid()) {
                            el.css('border', '1px #ccc solid');
                        } else {
                            el.css('border', '1px red solid');
                        }
                        
                        // 显示验证气泡                    
                        me.msg = getMsg.call(me);
                       	var bubble = Bubble.getEl();
					   	
					   	$('ul', bubble).html('');
						$.each(me.msg, function(k, v) {
							$('ul', bubble).append(v);
					  	});
                        
                        //msgBox.html(format(me.validateText, me.getValue()));
                        if(me.isValid()) {
	                    	Bubble.hide();
	                    } else {
	                    	Bubble.show();
	                    }
                    }
                },
                focus : function() {
                	
                	if(this.readOnly) {
                		return;
                	}
                	
                	if($.isEmptyObject(me.validateInfo)) {
                		return;	
                	}
	                
                	// 初始化验证信息
                    initValidateInfo.call(me);
                    validateAll.call(me, function(v) {
                    	validateCallback.call(me, v);
                    });

                    // 显示验证气泡    
                    me.msg = getMsg.call(me);
				   	var bubble = Bubble.getEl();
				   	
				   	$('ul', bubble).html('');
					$.each(me.msg, function(k, v) {
					   $('ul', bubble).append(v);
				  	});
					
                	// 如果存在userFun并且userFun.passStatus为undefined, 则前台调用的validate函数没有设置返回值
                    if(me.validateInfo.userFun && typeof me.validateInfo.userFun.passStatus == 'undefined') {
                         var userFunEl = $('i', me.msg.userFun);
                         userFunEl.attr('class', 'loading');
                    } else {
                	
                    	/*
                    	 * 2015年5月13日注释掉
	                    validateAll.call(me, function(v) {
	                        validateCallback.call(me, v);
	                    });
	                    */
	                    
	                     // 验证完执行
	                    if (me.isValid()) {
	                        el.css('border', '1px #ccc solid');
	                    } else {
	                        el.css('border', '1px red solid');
	                    }
                    }
                    
                    Bubble.bind(me.el);
                    if(me.isValid()) {
                    	Bubble.hide();
                    } else {
                    	Bubble.show();
                    }
                },
                blur : function() {
                	Bubble.getEl().fadeOut(0);
                }
            });
            
            if(this.type == 'file') {
            	el.bind('change', function() {
                	
                	if(this.readOnly) {
                		return;
                	}
                	
                	if($.isEmptyObject(me.validateInfo)) {
                		return;	
                	}
	                
                	// 初始化验证信息
                    initValidateInfo.call(me);
                    validateAll.call(me, function(v) {
                    	validateCallback.call(me, v);
                    });

                    // 显示验证气泡    
                    me.msg = getMsg.call(me);
				   	var bubble = Bubble.getEl();
				   	
				   	$('ul', bubble).html('');
					$.each(me.msg, function(k, v) {
					   $('ul', bubble).append(v);
				  	});
                    
                    Bubble.bind(me.el);
                    if(me.isValid()) {
                    	Bubble.hide();
                    } else {
                    	Bubble.show();
                    }
                
            		if (me.isValid()) {
                        el.css('border', '1px #ccc solid');
                    } else {
                        el.css('border', '1px red solid');
                    }
            	});
            }
            
            // 验证回调动作
            function validateCallback(tag) {
                console.log('异步回调 : ' + tag);
                var me = this;
                 
                // 解决在ajax请求返回之前又输入了其他不符合allowBlank或regex，ajax返回true后仍然为对勾的问题
                if(me.validateInfo.allowBlank.passStatus === false || me.validateInfo.regex.passStatus === false) {
                	me.validateInfo.userFun.passStatus = false;
                } else {
                	me.validateInfo.userFun.passStatus = tag;
                }

                me.msg = getMsg.call(me);
                
                var cls = me.validateInfo.userFun.passStatus ? 'garrow' : 'oarrow';
                
                //var userFun = $('i', me.msg.userFun);
                var userFun = $('.bubble>ul>li>i', me.msg.userFun);
                
                console.log(me.msg.userFun)
                userFun.attr('class', cls); 
              
                // 验证完执行
               	if(me.isValid()) {
               		el.css('border', '1px #ccc solid');
               		me.timeout = setTimeout(function() {	// 0.3s后隐藏气泡,避免连续快速输入时气泡频繁闪动
               			Bubble.hide();
                    }, 1500);
                } else {
               		el.css('border', '1px red solid');
                    Bubble.getEl().css('display', 'block');
                    $('ul', msgBox).children().remove();
                    
                    $.each(me.msg, function(k, v) {
                        $('ul', msgBox).append(v);
                    });
               	}
            }
        }
    
        // 当前文本框的验证,验证完后执行callBack回调函数
        function validateAll(callBack) {
            var me = this;
            if(this.allowBlank == false) {
            	if(this.getValue() == '') {
            		me.validateInfo.allowBlank = {
	                    passStatus: false,
	                    msg: me.emptyMsg
	                };
            	} else {
            		me.validateInfo.allowBlank = {
	                    passStatus: true,
	                    msg: me.emptyMsg
	                };
            	}
            }
            
            // vtype和正则归为一类validateInfo.regex
            if (typeof this.regex == 'object' && typeof this.regex.exec == 'function') {
                var result = this.regex.test(this.getValue());
                me.validateInfo.regex = {
                    passStatus: result,
                    msg: me.validateText
                };
                if(!result) {
                    return;
                }
            } else if (typeof this.vtype == 'string') {
                var result = validateByType.call(this, this.vtype, this.getValue());
               
                me.validateText = result.msg;
               
                me.validateInfo.regex = {
                    passStatus: result.status,
                    msg: result.msg
                };
                if(!result.status) {
                   return;
                }
            }
    
            // 通过validate函数定义的验证
            if (this.listeners && typeof this.listeners.validate == 'function') {

                var result = this.listeners.validate.call(this, function(v) {
                    if(typeof callBack == 'function') {
                        callBack.call(me, v);
                    }
                }, me);
                
                //console.log('同步的result = ' + result);
                
                me.validateInfo.userFun = {
                    passStatus: result,
                    msg: me.validateFunText
                };
                //return result;
            }
          
        }
    
        function validateByType(vtype, value) {
            var v = {
                alpha : {
                    regex : /^[a-zA-Z_]+$/,
                    msg : i18n.getMessage('Only for the letters')//'只能为字母'
                },
                alphanum : {
                    regex : /^[a-zA-Z0-9_]+$/,
                    msg : i18n.getMessage('For the combination of letters and Numbers only')//'只能为字母和数字的组合'
                },
                number : {
                	regex : /^[+-]?\d+\.?\d*$/,
                	msg : i18n.getMessage('Only for the Numbers')//'只能为数字'
                },
                email : {
                    regex : /^(\w+)([\-+.][\w]+)*@(\w[\-\w]*\.){1,5}([A-Za-z]){2,6}$/,
                    msg : i18n.getMessage('Must be a valid email')//'必须为一个合法的邮箱'
                },
                url : {
                    regex : /(((^https?)|(^ftp)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i,
                    msg : i18n.getMessage('Must be a valid url')//'必须为一个合法的url'
                },
                ip: {
                    regex: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                    msg: i18n.getMessage('Must be a legitimate IP address')//'必须为合法的IP地址'
                },
                username : {
                    regex : /^[a-zA-Z]+[a-zA-Z0-9_]*$/i,
                    msg : i18n.getMessage('Must be legal name')//'必须为合法的名称'
                }
            };
            if (typeof vtype != 'string' && vtype) {
                throw new TypeError("vtype应为字符串");
            }
            if (!v.hasOwnProperty(vtype)) {
                throw new TypeError("没有该验证类型");
            }
            
            return {
                status: v[vtype].regex.test(value),
                msg: v[vtype].msg
            };
        }
    
        ExtendClass(TSTextField, TSField);
    
        SetProperties(TSTextField.prototype, DONT_ENUM, ["i18n", i18n, "template", htm]);
        InstallFunctions(TSTextField.prototype, DONT_ENUM, GUtil.obj2Arr({
        	'init':init,
        	'addListener': addListener,
        	'isValid': function() {			// override
                var result = true;
                
                if(this.allowBlank != false && this.getValue() == '') {	// 如果允许为空且为空时,验证可以通过
                	return true;
                }
                
                $.each(this.validateInfo, function(i, v) {
                     if(v.passStatus != true) {
                         result = false;
                         return;
                     }
                });
                
                return result;
            }
        }));
        
        return TSTextField;
    }
);
