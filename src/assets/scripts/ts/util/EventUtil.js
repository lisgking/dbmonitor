define("ts/util/EventUtil",
		["ts/util/GenericUtil"],
		function(GenericUtil){
	"use strict";
	function EventUtil(){
		
	}
	
	/**
	 * 增加监听
	 */
	function addHandler(element,type,handler){
		if(element.addEventListener){
			element.addEventListener(type,handler,false);
		}else if(element.attachEvent){
			element.attachEvent("on"+type,handler);
		}else{
			element["on"+type]=handler;
		}
	}
	
	/**
	 * 删除监听
	 */
	function removeHandler(element,type,handler){
		if(element.removeEventListener){
			element.removeEventListener(type,handler,false);
		}else if(element.detachEvent){
			element.detachEvent("on"+type,handler);
		}else{
			element["on"+type]=null;
		}
	}
	
	function getEvent(event){
		return event?event:window.event;
	}
	
	function getTarget(event){
		return event.target || event.srcElement;
	}
	
	function preventDefault(event){
		if(event.preventDefault){
			event.preventDefault();
		}else{
			event.returnValue=false;
		}
	}
	
	function stopPropagation(event){
		if(event.stopPropagation){
			event.stopPropagation();
		}else{
			event.cancelBubble=true;
		}
	}
	
	function getClickEvent(){
		var evt = new MouseEvent("click", {
		    bubbles: true,
		    cancelable: true,
		    view: window,
		  });
		return evt;
	}
	
	function bindAsEventListener(object, fun){
		return function(event) {
			return fun.call(object, extendEvent(event));
		};
	}
	
	function bind(object, fun) {
		var args = Array.prototype.slice.call(arguments).slice(2);
		return function() {
			return fun.apply(object, args);
		};
	}
	
	function extendEvent(e) {
		var oEvent;
		var browser = GenericUtil.getBrowser();
		
		if (browser != 'Firefox') {
			oEvent = $.extend({}, window.event);	// 严格模式下无法改变属性
		} else {
			oEvent = $.extend({}, e);
		}

		oEvent.pageX = oEvent.clientX + document.documentElement.scrollLeft;	
		oEvent.pageY = oEvent.clientY + document.documentElement.scrollTop;
		
		oEvent.preventDefault = function () {
			this.returnValue = false;
		};

		oEvent.stopPropagation = function () {
			this.cancelBubble = true;
		};

		if (browser == 'Firefox') {
			oEvent.step = oEvent.detail; //正数：向下滚动，负数：向上滚动,滚动一次值3
		} else {
			oEvent.step = oEvent.wheelDelta / -40; //正数：向上滚动，负数：向下滚动,滚动一次值120
		}

		return oEvent;
	}
	
	
	InstallFunctions(EventUtil.prototype, DONT_ENUM, [
	    "addHandler",addHandler,
	    "removeHandler",removeHandler,
	    "getEvent",getEvent,
	    "getTarget",getTarget,
	    "preventDefault",preventDefault,
	    "getClickEvent",getClickEvent,
	    "bindAsEventListener",bindAsEventListener,
	    "bind",bind,
    ]);
	
	return new EventUtil();
	
});