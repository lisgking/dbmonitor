define([],function(){
	"use strict";
	var ptoa=function(p){
		return "data-"+p.replace(/([A-Z])/g,function(c){return "-"+c.toLowerCase();});
	},
	atop=function(a){
		return a.name.substr(5).replace(/-((\w+)*)/g,function(dword,word){return word.toUpperCase();});
	};
	/**
	 * @namespace jsm.shims
	 * @class DOMStringMap
	 * @constructor
	 * @param {Object} domNode
	 */
	function DOMStringMap(domNode){
		SetProperties(this,DONT_ENUM,["domNode",domNode]);
	}
	/**
	 * @deprecated
	 * @method set
	 * @param {Object} prop
	 * @param {Object} value
	 */
	function set(prop,value){
		this.domNode.setAttribute(ptoa(prop),value);
	}
	/**
	 * @deprecated
	 * @method get
	 * @param {Object} prop
	 * @return {String|undefined}
	 */
	function get(prop){
		return this.domNode.getAttribute(ptoa(prop));
	}
	InstallFunctions(DOMStringMap.prototype,0,[
		"set",set,
		"get",get
	]);
	return DOMStringMap;
});