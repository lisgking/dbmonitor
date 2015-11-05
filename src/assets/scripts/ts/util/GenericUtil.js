require.config({
    shim:{
        "knockout.validation":["knockout"],
        "knockout.mapping":["knockout"]
    }
});
define('ts/util/GenericUtil', [
    'ts/widgets/GenericDialog',
    'jquery',
    'knockout',
    'knockout.validation',
    'knockout.mapping',
    'dojo/css!KoGrid/KoGrid.css'
], function(Dialog, $, ko, kv, km){
    'use strict';

    require(["dojo/nls!ts/util/nls/KnockoutValidation.json"],function(data){
        var rules=ko.validation.rules;
        Object.keys(data).forEach(function(key){
            var rule=rules[key];
            if(rule){
                rule.message=this[key];
            }
        },data);
    });
    function GenericUtil(a){
        this.envType = 'product';//devolopment开发阶段、product上线阶段、test测试阶段
        this.interfaceType = 1;//真实接口1， 模拟接口0，默认为1
        this.isPrintReqData = 0;//是否打印请求数据
        this.isConsole = false;
        this.reqQueue = [];
        this.init();
        this.events = {};
        window.treePool = {};
    }

    GenericUtil.create = function(){
        return new GenericUtil();
    }

    GenericUtil.setGlobleVar = function(){
        window.rootPath = '';
        window.GenericUtil = GenericUtil.create();
        window.GUtil = window.GenericUtil;// 临时方案
        window.Dialog = Dialog;
        window.$ = $;
        window.ko = ko;
        window.ko.mapping = km;
        require(['KoGrid/koGrid-2.1.1.debug'
	              ],function(koGrid){
	     	//console.log(koGrid);
	     });
    }
    
    GenericUtil.prototype = {
        construtor: GenericUtil,
        create: function(){
            return window.GenericUtil || GenericUtil.create();
        },
        init: function(){
            this.AOP = this.AOP();
            this.handleReqData();
            return this;
        },
        getRootPath: function(){
            return window.rootPath || '';
        },
        getEnv: function(){
            return this.envType;
        },
        setEnv: function (envType){
            this.envType = envType;
        },
        useDevolopmentEnv: function (){
            this.setEnv('devolopment');
        },

        useProductEnv: function (){
            this.setEnv('product');
        },
        handleReqData: function(){
            var that = this;
            if(!$ && !$.post) return ;

            /*$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
               console.log(arguments);
            });*/
            var _ajax=$.ajax;
            $.ajax=function(url, opt){
            	opt = opt || {};
            	if (typeof url === "object")
            		opt = url;
            	else
            		opt.url = url;
        		
        		console.log(opt.url);
            	//拦截重复请求
            	if(that.repeatReqIntercept(opt.url, opt.data)){
                    return false;
                }
            	
                //备份opt中error和success方法  
                var fn = {
                    error:function(XMLHttpRequest, textStatus, errorThrown){},
                    success:function(data, textStatus){}
                }
                if(opt.error){
                    fn.error=opt.error;  
                }
                if(opt.success){  
                    fn.success=opt.success;  
                }
                var reqId = window.GenericUtil.getUUID();
                fn.success.reqId = reqId;
                fn.success.url = opt.url;
                
                Dialog.collectReq(reqId, opt.url);
                  
                //扩展增强处理  
                var _opt = $.extend(opt,{  
                    error:function(XMLHttpRequest, textStatus, errorThrown){  
                        //错误方法增强处理  
                    	Dialog.removeCollectReq(fn.success.reqId); //删除请求
                        that.failIntercept(XMLHttpRequest, textStatus, errorThrown, opt.url, opt.url); //拦截错误
                    },  

					success : function(data, textStatus) {
						Dialog.removeCollectReq(fn.success.reqId,
								fn.success.url);
						// 错误处理
						if (that.errorIntercept(opt.url, data)) {
							if (fn.success.errorCB) {
								fn.success.errorCB(data);
							}
							return;
						}
						// Session time out
						if (that.loginIntercept(opt, data)) {
							return;
						}
						if (opt.context)
							fn.success.call(opt.context, data,
									textStatus);
						else
							fn.success(data, textStatus);
					}
                });
                return _ajax(opt);
            };

            // 重写jquery $.get和$.post方法
            /*
			 * jQuery.each( [ "get", "post" ], function( i, method ) { jQuery[
			 * method ] = function( url, data, callback, type ) { if (
			 * jQuery.isFunction( data ) ) { type = type || callback; callback =
			 * data; data = {}; }
			 * 
			 * return jQuery.ajax({ url: url, type: method, dataType: type,
			 * data: data, success: callback, error: function(xhr, textStatus,
			 * errorThrown){ //统一拦截错误 Dialog.removeCollectReq(callback.reqId);
			 * //删除请求 that.failIntercept(xhr, textStatus, errorThrown,
			 * callback.reqBeforeUrl, callback.url); //拦截错误 } }); }; });
			 */

            //$.get 和$.post之前执行
            jQuery.each(['get', 'post'], function(i, method) {
                that.AOP.before(jQuery, method, function(url, data, callback, type) {
                    url = window.GenericUtil.getRootPath() + url;

                    // 如果没有请求的数据，第二个参数应该是回调函数
                    if(jQuery.isFunction(data)){
                        type = type || callback;
                        callback = data;
                        data = {};
                    }
                    // 如果没有回调函数，这里定义一个空函数
                    callback = callback || function(){};
                    // 拦截重复请求
                    /*if(that.repeatReqIntercept(url, data)){
                        return false;
                    }*/

                    /*var reqId = window.GenericUtil.getUUID();
                    var reqBeforeUrl = url;
                    var reqBeforeData = data;*/
                    // 创建json数据
                    if(data){
                        data = that.buildJsonData(data);
                    }

                    // 拦截是用真实接口还是模拟接口
                    //url = that.interfaceIntercept(url);
                    // 在发送请求前输出请求信息
                    //that.printReqData(url, data, 'before');

                    //Dialog.collectReq(reqId, url);

                    /*var success = callback;
                    success.reqId = reqId;
                    success.reqBeforeUrl = reqBeforeUrl;
                    success.url = url;
                    var successObj = {success: success};
                    // ajax请求返回成功，在回调之前执行
                    that.AOP.before(successObj, 'success', function(data){
                        // 删除请求
                        //Dialog.removeCollectReq(success.reqId, url);
                        //自定义错误拦截
                        if(that.errorIntercept(url, data)){
                            if(callback.errorCB){
                                callback.errorCB(data);
                            }
                            return ;
                        }
                        // 检查是否登录过期
                        if(that.loginIntercept(url, reqBeforeUrl, reqBeforeData, callback, type, data)) {
                            return false;
                        }
                        //请求后打印
                        //that.printReqData(url, data, 'after');
                    });*/
                    /*successObj.success.reqId = reqId;
                    successObj.success.reqBeforeUrl = reqBeforeUrl;
                    successObj.success.url = url;
*/
                    arguments[0] = url;
                    arguments[1] = data;
                    arguments[2] = callback;
                    callback.AjaxType = 'get&post';

                    var args = Array.prototype.slice.call(arguments, 0);
                    args[1] = args[1] || data;//可能不会传此参数
                    args[2] = args[2] || callback;
                    args[3] = args[3] || 'json';

                    return args;
                });
             });
        },
        printReqData: function(url, data, pos){
            if(!this.isPrintReqData) return ;

            if(pos === 'before'){
                console.info('请求前数据Start：---------------');
                console.log('请求URL：' + url);
                console.log(data);
                console.log('请求前数据End：-------------');
            }else{
                console.info('-------------请求后数据Start：-------------');
                console.log(data);
                console.log('-------------请求后数据End：-------------');
            }
        },
        execReqQueue: function(){
            var item = null;
            while(item = this.reqQueue.shift()){
                (function(item){
                	var callback = item.success;
                	item.success = function(data, textStatus) {
                		Dialog.closeLoading();
                		callback(data, textStatus);
                	}
                	$.ajax(item);
                })(item);
            }
        },
        repeatReqIntercept: function(url, data){
            var that = this;
            data = JSON.stringify(data || {});
            this.prevReq = this.prevReq || {};
            if(this.prevReq.url === url && this.prevReq.data === data && this.prevReq.thread){
                return true;
            }
            this.prevReq.url = url;
            this.prevReq.data = data;
            if(this.prevReq.thread){
                clearTimeout(this.prevReq.thread);
                this.prevReq.thread = '';
            }
            this.prevReq.thread = setTimeout(function(){
                that.prevReq.url = '';
                that.prevReq.data = '';
            }, 1000);
            return false;
        },
        errorIntercept: function(url, data){
            if(!$.isPlainObject(data) && $.type(data) !== 'array'){//这里对返回null处理
                console.log('java返回null:' + data);
                return false;
            };
            // 登录的密码错误等信息不用弹出窗口显示
            if(url.indexOf('LoginAction.do') != -1) {
                return false;
            }

            var flag=this.requestError(data);
            return flag;
        },
        requestError:function(data){
        		var errorMsg = '';
            if(data.hasOwnProperty("flag")) {
                 if(data.flag === '0' || data.flag.length > 1) {
                	if (!data.msg)
                		 return false;
                    data.msg = data.msg || '请求错误';
                    if(data.flag !== '0'){
                        errorMsg = '错误码: '+ data.flag +'<br/>';
                    }
                    errorMsg += '<div class="alert alert-danger">' + data.msg + '</div>';
                    if(data.detail){
                        errorMsg += '查看更多信息:<a class="btn btn-primary view-more-error-info">查看</a><br/>';
                        $('body').undelegate('.view-more-error-info');
                        $('body').delegate('.view-more-error-info', 'click.view-more-error-info', function(){
                            Dialog.alert('<pre>' + data.detail + '</pre>', 700, 490);
                        });
                    }

                    Dialog.alert(errorMsg);
                    return true;
                }
            }
        },
        failIntercept: function(xhr, textStatus, errorThrown, reqBeforeUrl, url){
            if(textStatus == 'timeout'){
                Dialog.alert('请求超时');
                return ;
            }
            var errorMsg = '数据请求失败，请联系系统管理人员!<br/>';
            errorMsg += '请求真实接口:' + reqBeforeUrl + '<br/>';
            errorMsg += '请求模拟接口:' + url + '<br/>';

            if(textStatus){
                errorMsg += '请求错误状态:' + textStatus + '<br/>';
            }
            if(errorThrown){
                errorMsg += '请求错误异常:' + errorThrown + '<br/>';
            }
            console.log('errorMsg:' + errorMsg);
            console.log('请求返回原始数据:' + xhr.responseText);

            errorMsg = '<div class="alert alert-danger">' + errorMsg + '</div>';
            errorMsg += '查看更多信息:<a class="btn btn-primary">后期开发</a><br/>';
            if(xhr.responseText){
                // errorMsg += '请求返回原始数据:<pre>'+ xhr.responseText +'</pre>';
            }
            Dialog.alert(errorMsg);
        },
        loginIntercept: function(opt, data) {
            var that = this;
            if(opt.url.indexOf('LoginAction.do') == -1) {//非登录退出请求
                if(data && ('isLogin' in data) && data.isLogin === false){
                    require(["ts/common/login/LoginDialog"], function(LoginDialog) {
                        var dialog=new LoginDialog();
                        dialog.destroyOnClose=true;
                        dialog.placeAt(window.top.document.body,"beforeEnd");
                        dialog.onLoginSuccess(function(event) {
                            //var data = event.data;
                            dialog.close();
                            that.execReqQueue();
                        });
                        dialog.open();
                    });
                    that.reqQueue.push(opt);
                    return true;
                }
            }
            return false;
        },
        interfaceIntercept: function(url){
           if(!window.GenericUtil.isRealInterface() && url.indexOf('.json') === -1){
                url = url.replace(/&.*$/, '');
                var simulateUrl = this.getSimulateInterface(url);
                if(!simulateUrl){
                    Dialog.alert('<div class="alert alert-danger">interfaceArr中'+ url +'没有对应的模拟接口,请查看interface\interface.js文件，或访问interface\testInterface.html</div>');
                }
                url = window.rootPath + simulateUrl;
            }
            return url;
        },
        getInterfaceType: function(){
            return this.interfaceType;
        },
        isRealInterface: function(){
            return this.interfaceType === 1;
        },
        getSimulateInterface: function(real){
            return window.interfaceArr.getSimulateInterface(real);
        },
        getSendDataInterface: function(){

        },
        getInterface: function(interfaceObj){
            if(!interfaceObj){
                alert('接口对象不存在！请联系开发人员，谢谢!');
                return ;
            }

            if(this.interfaceType){
                if(typeof interfaceObj.real === 'undefined'){
                    alert('没有真实接口');
                    return ;
                }
                return interfaceObj.real;
            }else{
                if(typeof interfaceObj.simulate === 'undefined'){
                    alert('没有模拟接口');
                    return ;
                }
                return interfaceObj.simulate;
            }
        },
        setInterfaceType: function(interfaceType){
            this.interfaceType = interfaceType;
        },
        useRealInterface: function(){
            this.setInterfaceType(1);
        },
        useSimulateInterface: function(){
            this.setInterfaceType(0);
        },
        setGlobleVar: function(){
            window.rootPath = '/';
            require([
                'ts/widgets/GenericDialog',
                'jquery',
                'knockout',
                'knockout.validation',
                'knockout.mapping',
            ],function(Dialog, $, ko, kv, km){
                window.Dialog = Dialog;
                window.$ = $;
                window.ko = ko;
                window.km = km;
            });
        },
        //考虑不全, 临时用
        isOnLine: function(){
            var url = top.location.href;
            if(url.indexOf('localhost') >= 0 || url.indexOf('file:///') >= 0){
                return false;
            }else{
                this.envType = 'devolopment';
            }
            return true;
        },
        obj2Arr: function(obj){
            var arr = [];
            for(var key in obj){
                arr.push(key);
                arr.push(obj[key]);
            }
            return arr;
        },
        buildJsonData: function(obj){
            var jsonData = {data: ''};
            if(obj != null){
                jsonData.data = JSON.stringify(obj);
            }
            return jsonData;
        },
        getUUID: function(prex){
            var id = 1;
            var prex = prex || 'ts-uu-';
            this.getUUID = (function(){
                return function(){
                    id += 1;
                    return prex + id;
                }
            })();
            return prex + id;
        },
        capitalize: function(str){
            return str.replace(/^([a-z])/, function(m, a){
                return a.toUpperCase();
            });
        },
        AOP: function(){
            var that = this;
            return {
                after: function(obj, method, CB){
                    var _method = obj[method];
                    obj[method] = function(){
                        var returnData = _method.apply(obj, arguments);
                        CB.apply(obj, arguments);
                        return returnData;
                    }

                    that.include(obj[method], _method);
                },
                before: function(object, pointcut, advice){
                    var _orignMethod = object[pointcut];
                    object[pointcut] = function(){
                        var returnData = advice.apply(object, arguments);
                        if(returnData === false){
                            return ;
                        }else if(Object.prototype.toString.call(returnData) === '[object Array]'){
                            return _orignMethod.apply(object, returnData);
                        }
                        return _orignMethod.apply(object, arguments);
                    }
                    that.include(object[pointcut], _orignMethod);
                },
                afterThrow: function(obj, method, CB){
                    var _method = obj[method];
                    obj[method] = function(){
                        try{
                            return _method.apply(obj, arguments);
                        }catch(e){
                            var args = Array.prototype.slice.apply(arguments, 0);
                            args.unshift(e);
                            CB.apply(obj, args);
                        }
                    }
                    that.include(obj[method], _method);
                },
                afterFinally: function(obj, method, CB){
                    var _method = obj[method];
                    obj[method] = function(){
                        try{
                            return _method.apply(obj, arguments);
                        }catch(e){
                            throw e;
                        }finally{
                            return CB.apply(obj, arguments);
                        }
                    }
                    that.include(obj[method], _method);
                }
            }
        },
        array: {
            removeItem: function(array, condition){
                var that = this;
                var newArray;
                if(typeof condition === 'undefined'){
                    array.length = 0;
                }else if(typeof condition === 'number'){
                    if (condition > 0) {
                        array.splice(condition, 1);
                    }else if (condition === 0) {
                        array.shift();
                    }
                }else if(typeof condition === 'function'){
                    var index = 0;

                    for(var i=0;i<array.length;i++){
                        if(condition.call(array, array[i])){
                            that.removeItem(array, i);
                            i --;
                        }
                    }
                }

                return newArray || array;
            },
            indexOf: function(array, item, key){
                for (var i = 0, j = array.length; i < j; i++){
                    var arrayItem = array[i];
                    if (array[i] == item){
                        return i;
                    }else if(typeof arrayItem === 'object' && key && arrayItem[key] == item[key]){
                        return i;
                    }
                }
                return -1;
            },
        },
        arrayRemoveItem: function(array, key, val){
            this.array.removeItem(array, function(item){
                return item[key] === val;
            });
        },
        cookie: {
            //获得Cookie解码后的值
            getCookieVal: function(offset){
                var endstr = document.cookie.indexOf(";", offset);
                if (endstr == -1)
                    endstr = document.cookie.length;
                return unescape(document.cookie.substring(offset, endstr));
            },
            setCookie: function(name, value, time) {//time单位天
                var today = new Date();
                var expires = new Date();
                time = time || 2;
                expires.setTime(today.getTime() + time * 24 * 60 * 60 * 1000);
                document.cookie = name + "=" + escape(value) + "; expires=" + expires.toGMTString();
            },
            delCookie: function(name){
                var exp = new Date();
                exp.setTime(exp.getTime() - 1);
                var cval = GenericUtil.cookie.getCookie(name);
                document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString();
            },
            //获得Cookie的原始值
            getCookie: function (name){
                var that = this;
                var arg = name + "=";
                var alen = arg.length;
                var clen = document.cookie.length;
                var i = 0;
                while (i < clen) {
                    var j = i + alen;
                    if (document.cookie.substring(i, j) == arg)
                        return that.getCookieVal(j);
                    i = document.cookie.indexOf(" ", i) + 1;
                    if (i == 0) break;
                }
                return null;
            }
        },
        extend: function(subClass, superClass){
            var that = this;
            var f = function(){};
            f.prototype = superClass.prototype;
            subClass.prototype = new f();
            subClass.constructor = subClass;
            subClass.superClass = superClass;

            subClass.extend = function(methods){
                that.include(subClass.prototype, methods);
            };
            return subClass;
        },
        include: function(subObj, supperObj){
            for(var prop in supperObj){
                subObj[prop] = supperObj[prop];
            }
            return subObj;
        },
        mapInversion: function(objectMap){
            var inversion = {};
            var key, val;
            for(key in objectMap){
                val = objectMap[key];
                inversion[val] = key;
            }
            return inversion;
        },
        addEventListener: function(type, CB){
            this.addEvent(type, CB);
        },
        removeEventListener: function(type, CB){
            this.removeEvent(type, CB);
        },
        dispatchEvent: function(type){
            this.triggerEvent(type);
        },
        addEvent: function(type, CB){
            this.events = this.events || {};
            if(!this.events[type]){
                this.events[type] = [];
            }
            this.events[type].push(CB);
        },
        removeEvent: function(type){
            if(!this.events[type]){
                return ;
            }

            this.events[type].length = 0;
        },
        triggerEvent: function(type, data){

            if(type){
                if(!this.events[type]){
                    return ;
                }
                this.triggerEventByType(type, data);
            }else{
                for(var eventType in this.events){
                    this.triggerEventByType(eventType, data);
                }
            }
        },
        triggerEventByType: function(type, data){
            var typeEvents = this.events[type];
            for(var i= 0,len=typeEvents.length;i<len;i++){
                var CB = typeEvents[i];
                CB.call(this, data);
            }
        },
        trigger: function(type, data){
            this.triggerEvent(type, data);
        },
        on: function(type, CB){
            this.addEvent(type, CB);
        },
        off: function(type, CB){
            this.removeEvent(type, CB);
        },
        support: {
            transition : (function () {
                            var el = document.createElement('bootstrap')

                            var transEndEventNames = {
                              WebkitTransition : 'webkitTransitionEnd',
                              MozTransition    : 'transitionend',
                              OTransition      : 'oTransitionEnd otransitionend',
                              MsTransition      : 'MSTransitionEnd',
                              transition       : 'transitionend'
                            }

                            for (var name in transEndEventNames) {
                              if (el.style[name] !== undefined) {
                                return { end: transEndEventNames[name] }
                              }
                            }

                            return false // explicit for ie8 (  ._.)
                          })(),
            emulateTransitionEnd : function (el, CB, duration) {
                var called = false;
                var $el = $(el);
                $(this).one('bsTransitionEnd', function () { called = true });
                var callback = function () {
                    CB.call($el);
                    if (!called) {
                        $($el).trigger('bsTransitionEnd')
                    }
                }
                setTimeout(callback, duration)
                return this
            }
        },

        tree: {
            add: function(id, tree){
                top.treePool = top.treePool || {};
                top.treePool[id] = tree;
            },
            remove: function(id){
                top.treePool = top.treePool || {};
                top.treePool[id] = null;
                delete top.treePool[id];
            },
            get: function(id){
                top.treePool = top.treePool || {};
                return top.treePool[id] || null;
            },
        },
        getBrowser: function() {
    		var explorer = navigator.userAgent;
    		if (explorer.indexOf("MSIE") >= 0) {
    			return 'IE';
    		} else if (explorer.indexOf("Firefox") >= 0) {
    			return 'Firefox';
    		} else if (explorer.indexOf("Chrome") >= 0) {
    			return 'Chrome'
    		} else if (explorer.indexOf("Opera") >= 0) {
    			return 'Opera';
    		} else if (explorer.indexOf("Safari") >= 0) {
    			return 'Safari';
    		} else if (explorer.indexOf("Netscape") >= 0) {
    			return 'Netscape';
    		}
        }
    };

    GenericUtil.koExtend = function(){
        ko.bindingHandlers.fadeVisible = {
            update: function(element, valueAccessor, allBindings) {
                var value = valueAccessor();
                var valueUnwrapped = ko.unwrap(value);
                setTimeout(function(){
                    var $elem = $(element);
                    if (valueUnwrapped == true){
                        $elem.addClass('in');
                    }else{
                        $elem.removeClass('in');
                    }
                }, 0);
            }
        };
    }

    GenericUtil.setGlobleVar();
    GenericUtil.koExtend();
    return window.GenericUtil;
});
