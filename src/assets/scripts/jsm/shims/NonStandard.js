define([],function(){
	"use strict";
	var global=this;
	//----------------------------------------------------------------
	// [IE] polyfill Function.prototype.name
	//----------------------------------------------------------------
	/**
	 * @namespace jsm.shims
	 * @class Function
	 * @extension Function
	 */
	/**
	 * @attribute name
	 * @type String
	 */
	if(!Function.prototype.hasOwnProperty("name")){
		Object.defineProperty(Function.prototype,"name",{
			configurable:true,
			get:function(){
				if(this===Function.prototype){return "Empty";}
				var m=/function\s*([\w\$]*)/.exec(Function.prototype.toString.call(this));
				Object.defineProperty(this,"name",{value:m===null?"":m[1]});
			}
		});
	}
	/**
	 * @namespace jsm.shims
	 * @class Object
	 * @extension jsm.shims.Object
	 */
	/**
	 * @method __defineGetter__
	 * @param {String} name
	 * @param {Function} fun
	 */
	function __defineGetter__(name,fun){
		var receiver=this;
		if(typeof receiver!=="object"){
			receiver=global;
		}
		if(typeof fun!=="function"){
			throw new TypeError("Object.prototype.__defineGetter__: Expecting function");
		}
		Object.defineProperty(receiver,name,{enumerable:true,configurable:true,get:fun});
	}
	/**
	 * @method __defineSetter__
	 * @param {String} name
	 * @param {Function} fun
	 */
	function __defineSetter__(name,fun){
		var receiver=this;
		if(typeof receiver!=="object"){
			receiver=global;
		}
		if(typeof fun!=="function"){
			throw new TypeError("Object.prototype.__defineSetter__: Expecting function");
		}
		Object.defineProperty(receiver,name,{enumerable:true,configurable:true,set:fun});
	}
	/**
	 * @method __lookupGetter__
	 * @param {String} name
	 * @return {Function|undefined}
	 */
	function __lookupGetter__(name){
		var receiver=this;
		if(typeof receiver!=="object"){
			receiver=global;
		}
		var d=Object.getOwnPropertyDescriptor(receiver,name);
		return d&&d.get;
	}
	/**
	 * @method __lookupGetter__
	 * @param {String} name
	 * @return {Function|undefined}
	 */
	function __lookupSetter__(name){
		var receiver=this;
		if(typeof receiver!=="object"){
			receiver=global;
		}
		var d=Object.getOwnPropertyDescriptor(receiver,name);
		return d&&d.set;
	}
	/**
	 * @attribute __proto__
	 * @type Object
	 */
	if(!Object.__proto__){
		Object.defineProperties(Object.prototype,{
			"__defineGetter__":{writable:true,configurable:true,value:__defineGetter__},
			"__defineSetter__":{writable:true,configurable:true,value:__defineSetter__},
			"__lookupGetter__":{writable:true,configurable:true,value:__lookupGetter__},
			"__lookupSetter__":{writable:true,configurable:true,value:__lookupSetter__},
			"__proto__":{
				configurable:true,
				get:function __proto__(){
					return Object.getPrototypeOf(this);
				},
				set:function __proto__(){
					throw new TypeError("Generic use of __proto__ accessor not allowed");
				}
			}
		});
	}
});
