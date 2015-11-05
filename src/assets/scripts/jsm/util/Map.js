define("jsm/util/Map",[],function(){
	"use strict";
	if(FunctionIsBuiltin(window.Map)){return window.Map;}
	/**
	 * ECMAScript 6 Map
	 * @namespace jsm.util
	 * @class Map
	 * @constructor
	 * @example
	 * <pre><code>var m=new Map();
	 * m.set(-0,-0);
	 * m.set(0,0);
	 * Object.is(m.get(-0),m.get(-0));//false
	 * m.set(document.body,document.body.dataset);
	 * m.get(document.body);//document.body.dataset
	 * m.delete(0);//true
	 * m.has(0);//false
	 * m.clear();
	 * </code></pre>
	 */
	function Map(){
		SetProperty(this,DONT_ENUM,"__data__",[]);
	}
	var is=Object.is||function is(a,b){return a===b?a!==0||1/a===1/b:a!==a&&b!==b;};
	/**
	 * Asserting whether a value has been associated to the key in the Map object or not.
	 * @method has
	 * @param {*} key
	 */
	function has(key){
		this.__data__.some(function(item){return is(item.key,key);});
	}
	/**
	 * Sets the value for the key in the Map object.
	 * @method set
	 * @param {*} key
	 * @param {*} value
	 */
	function set(key,value){
		if(!this.__data__.some(function(item){if(is(item.key,key)){item.value=value;return true;}})){
			this.__data__.push({key:key,value:value});
		}
	}
	/**
	 * Returns the value associated to the key, or undefined if there is none.
	 * @method get
	 * @param {*} key
	 * @return {*} value
	 */
	function get(key){
		var item=this.__data__.filter(function(item){return is(item.key,key);})[0];
		return item&&item.value;
	}
	/**
	 * Removes all key/value pairs from the Map object.
	 * @method delete
	 * @param {*} key
	 * @return {Boolean}
	 */
	function _delete(key){
		var itemIndex=-1;
		this.__data__.some(function(item,index){if(is(item.key,key)){itemIndex=index;return true;}});
		if(itemIndex!==-1){
			this.__data__.splice(itemIndex,1);
		}
	}
	/**
	 * Removes all key/value pairs from the Map object.
	 * @method clear
	 */
	function clear(){
		this.__data__.length=0;
	}
	
	function forEach(callbackfn /*,[thisArg]*/){
		this.__data__.forEach(callbackfn);
	}
	/**
	 * @attribute size
	 * @type Number
	 */
	InstallGetter(Map.prototype,"size",function(){
		return this.__data__.length;
	},DONT_ENUM);
	InstallFunctions(Map.prototype,DONT_ENUM,[
		"has",has,
		"set",set,
		"get",get,
		"delete",_delete,
		"clear",clear,
		"forEach",forEach
	]);
	SetNativeFlag(Map);
	return Map;
});