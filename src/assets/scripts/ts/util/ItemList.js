/**
 * @module ts.util
 */
define("ts/util/ItemList",[],function(){
	"use strcit";
	/**
	 * @namespace ts.util
	 * @class ItemList
	 * @constructor
	 * @param {Object} @exmaple array
	 */
	function ItemList(a){
		var data;
		if(arguments.length===1){
			if(typeof a==="number"){
				data=new Array(a>>>0);
			}else if(Array.isArray(a)){
				data=a;
			}else{
				data=Array.prototype.slice.call(arguments);
			}
		}else{
			data=Array.prototype.slice.call(arguments);
		}
		SetProperty(this,DONT_ENUM,"__data__",data);
		InstallGetter(this,"length",function getLength(){
			return this.__data__.length;
		},DONT_ENUM);
	}
	function is(a,b){
		if(a===b){
			return (a!==0)||(1/a===1/b);
		}else{
			return (a!==a)&&(b!==b);
		}
	}
	/**
	 * 
	 * @method item
	 * @param {Object} index
	 * @return {*}
	 */
	function item(index){
		index>>>=0;
		return index in this.__data__?this.__data__[index]:null;
	}
	/**
	 * 
	 * @method by
	 * @param {String} field
	 * @param {*} value
	 * @return {*}
	 */
	function by(field,value){
		return this.__data__.find(function(item){return item&&is(item[field],value);});
	}
	/**
	 * 
	 * @method toArray
	 * @return {Array}
	 */
	function toArray(){
		return this.__data__;
	}
	/**
	 * @method toJSON
	 * @return {Object}
	 */
	function toJSON(){
		return this.__data__;
	}
	"exports";
	InstallFunctions(ItemList.prototype,NONE,[
		"item",item,
		"by",by,
		"toArray",toArray,
		"toJSON",toJSON
	]);
	return ItemList;
});
