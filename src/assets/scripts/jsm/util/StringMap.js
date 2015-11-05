define("jsm/util/StringStringMap",[],function(){
	"use strict";
	var HasOwnProperty=Object.prototype.hasOwnProperty,
		ToString=function(v){try{return v+"";}catch(e){return Object.prototype.toString.call(v);}};
	/**
	 * Simple String-* Map
	 * @namespace jsm.util
	 * @class StringMap
	 * @constructor
	 */
	function StringMap(){
		SetProperty(this,DONT_ENUM,"__data__",{});
	}
	/**
	 * Asserting whether a value has been associated to the key in the Map object or not.
	 * @method has
	 * @param {String} key
	 */
	function has(key){
		return HasOwnProperty.call(this.__data__,key);
	}
	/**
	 * Sets the value for the key in the Map object.
	 * @method set
	 * @param {String} key
	 * @param {*} value
	 */
	function set(key,value){
		this.__data__[key]=value;
	}
	/**
	 * Returns the value associated to the key, or undefined if there is none.
	 * @method get
	 * @param {String} key
	 * @return {*} value
	 */
	function get(key){
		return HasOwnProperty.call(this.__data__,key)?this.__data__[key]:undefined;
	}
	/**
	 * Removes all key/value pairs from the Map object.
	 * @method delete
	 * @param {String} key
	 * @return {Boolean}
	 */
	function _delete(key){
		return delete this.__data__[key];
	}
	/**
	 * Removes all key/value pairs from the Map object.
	 * @method clear
	 */
	function clear(){
		Object.keys(this.__data__).forEach(function(key){delete this[key];},this.__data__);
	}
	/**
	 * key count of the Map object
	 * @attribute size
	 * @type Number
	 */
	InstallGetter(StringMap.prototype,"size",function(){
		return Object.keys(this.__data__).length;
	},DONT_ENUM);
	InstallFunctions(StringMap.prototype,DONT_ENUM,[
		"has",has,
		"set",set,
		"get",get,
		"delete",_delete,
		"clear",clear 
	]);
	SetNativeFlag(StringMap);
	return StringMap;
});