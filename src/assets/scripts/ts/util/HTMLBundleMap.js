define([],function(){
	"use strict";
	var hasOwn=Object.prototype.hasOwnProperty;
	var rHTMLSection=/<!--\[([\w\$]+)\]-->([\s\S]*)<!--\[\/\1\]-->/mg;
	
	function HTMLBundleMap(input){
		this.__data__=parse(input);
	}
	"internal";
	function parse(input){
		var map={};
		input=String(input);
		input.replace(rHTMLSection,function(section,key,value,index,input){
			map[key]=value;
			return "";
		});
		return map;
	}
	"public";
	function get(key){
		if(this.has(key)){
			return this.__data__[key];
		}
	}
	function set(key,value){
		this.__data__[key]=String(value);
	}
	function has(key){
		return hasOwn.call(this.__data__,key);
	}
	function _delete(key){
		if(this.has(key)){
			return delete this.__data__[key];
		}
		return false;
	}
	function clear(){
		Object.keys(this.__data__).forEach(function(k){
			delete this[k];
		},this.__data__);
	}
	InstallFunctions(HTMLBundleMap.prototype,DONT_ENUM,[
		"get",get,
		"set",set,
		"has",has,
		"delete",_delete,
		"clear",clear
	]);
	function getMessage(key,args){
		var str=this.get(key);
		if(!str){return str;}
		if(!args){return str;}
		return str.replace(/\$\{([\w\$]+)\}/g,function(el,key){
			var v=args[key];
			return v===void 0?key:v;
		});
	}
	InstallFunctions(HTMLBundleMap.prototype,NONE,[
		"getMessage",getMessage
	]);
	SetNativeFlag(HTMLBundleMap);
	return HTMLBundleMap;
});