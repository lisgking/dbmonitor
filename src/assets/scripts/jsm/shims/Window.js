define([],function(){
	"use strict";
	var nsSetTimeout=Window.prototype.setTimeout,
		nsSetInterval=Window.prototype.setInterval;
	/**
	 * @namespace jsm.shims
	 * @class Window
	 * @extension Window
	 */
	/**
	 * listener arguments support for IE lt 10
	 * @method setTimeout
	 * @param {Object} listener
	 * @param {Object} delay
	 * @return {Number} id
	 */
	function setTimeout(listener,delay){
		if(typeof listener==="function"){
			var args=Array.prototype.slice.call(arguments,2);
			return nsSetTimeout.call(this,function(){listener.apply(this,args);},delay);
		}else{
			return nsSetTimeout.apply(this,arguments);
		}
	}
	/**
	 * listener arguments support for IE lt 10
	 * @method setInterval
	 * @param {Object} listener
	 * @param {Object} delay
	 * @return {Number} id
	 */
	function setInterval(listener,delay){
		if(typeof listener==="function"){
			var args=Array.prototype.slice.call(arguments,2);
			return nsSetInterval.call(this,function(){listener.apply(this,args);},delay);
		}else{
			return nsSetInterval.apply(this,arguments);
		}
	}
	if(document.documentMode===9&&FunctionIsBuiltin(nsSetTimeout)){
		InstallFunctions(Window.prototype,DONT_DELETE,[
			"nsSetTimeout",nsSetInterval,
			"nsSetInterval",nsSetInterval,
			"setTimeout",setTimeout,
			"setInterval",setInterval
		]);
		delete window.setTimeout;
		delete window.setInterval;
	}
	return Window;
});
