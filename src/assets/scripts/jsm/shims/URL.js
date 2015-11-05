define(function(){
	"use strict";
	var hasOwnProperty=Object.prototype.hasOwnProperty;
	
	/*
	 * @namespace jsm.shims
	 * @class URLSearchParams
	 * @for jsm.shims.URL
	 * @constructor
	 * @param {String} search
	 */
	function URLSearchParams(search){
		var d={};
		Array.prototype.forEach.call(search.substr(1).split("&"),function(token){
			if(token===""){return;}
			var index=token.indexOf("=");
			if(index===-1){index=token.length;}
			var name=decodeURIComponent(token.substr(0,index));
			var value=decodeURIComponent(token.substr(index+1));
			if(!hasOwnProperty.call(d,name)){
				d[name]=[];
			}
			d[name].push(value);
		});
		this.__data__=d;
	}
	InstallFunctions(URLSearchParams.prototype,DONT_DELETE,[
		/**
		 * @method append
		 * @param {String} name
		 * @param {String} value
		 */
		"append",function append(name,value){
			var d=this.__data__;
			if(hasOwnProperty.call(d,name)){
				d[name]=[];
			}
			d[name].push(value);
		},
		/**
		 * @method delete
		 * @param {String} name
		 * @return {Boolean}
		 */
		"delete",function _delete(name){
			var d=this.__data__;
			if(hasOwnProperty.call(d,name)){
				return delete d[name];
			}
			return false;
		},
		/**
		 * @method get
		 * @param {String} name
		 * @return {String|null}
		 */
		"get",function get(name){
			var d=this.__data__;
			if(hasOwnProperty.call(d,name)){
				return d[name][0];
			}
			return null;
		},
		/**
		 * @method getAll
		 * @param {String} name
		 * @return {Array}
		 */
		"getAll",function getAll(name){
			var d=this.__data__;
			if(hasOwnProperty.call(d,name)){
				return d[name];
			}
			return [];
		},
		/**
		 * @method has
		 * @param {String} name
		 * @return {Boolean}
		 */
		"has",function has(name){
			var d=this.__data__;
			if(hasOwnProperty.call(d,name)){
				return true;
			}
			return false;
		},
		/**
		 * @method set
		 * @param {String} name
		 * @param {String} value
		 */
		"set",function set(name,value){
			var d=this.__data__;
			d[name]=[value];
		}
	]);
	var nativeURL=(window.webkitURL||window.mozURL||window.msURL);
	if(nativeURL){
		return nativeURL;
	}
	var rURI=/^(([a-z-]+:)\/\/(([^:\/]+)(:\d+)?))([^?#]*)([^#]*)(.*)$/;
	var __base__,
		__link__;
	var initDoc=function(){
		console.time("t");
		var doc=document.implementation.createHTMLDocument("");
		doc.head.appendChild(__base__=doc.createElement("base"));
		doc.body.appendChild(__link__=doc.createElement("a"));
		console.timeEnd("t");
	};
	/**
	 * @namespace jsm.shims
	 * @class URL
	 * @constructor
	 * @param {String} url
	 * @param {String} [base]
	 */
	function URL(url/*,base*/){
		if(!(this instanceof URL)){
			throw new TypeError("Failed to construct 'URL': Please use the 'new' operator, this DOM object constructor cannot be called as a function.");
		}
		if(arguments.length===0){
			throw new TypeError("Failed to construct 'URL': 1 argument required, but only 0 present");
		}
		if(arguments.length===1){
			url=(url+"").trim();
			if(!rURI.test(url)){
				throw new SyntaxError("Failed to construct 'URL': Invalid URL");
			}
			URLUtils.call(this,getURLAnchor(url));
		}else if(arguments.length>=2){
			url=(url+"").trim();
			var base=(arguments[1]+"").trim();
			if(!rURI.test(base)){
				throw new SyntaxError("Failed to construct 'URL': Invalid URL");
			}
			URLUtils.call(this,getURLAnchor(url,base));
		}
	}
	function getURLAnchor(url,base){
		if(!__base__){initDoc();}
		if(base){__base__.href=arguments.length===2&&base?base:"";}
		__link__.href=url;
		var a=document.createElement("a");
		a.href=__link__.href;
		return a;
	}
	InstallFunctions(URL.prototype,DONT_ENUM|DONT_DELETE,[
		/**
		 * @method toString
		 * @return String
		 */
		"toString",function toString(){return this.href;}
	]);
	function URLUtils(url){
		/**
		 * @attribute href
		 * @type String
		 */
		InstallGetterSetter(this,"href",function(){return url.href;},function(v){url.href=v;});
		/**
		 * @attribute origin
		 * @type String
		 */
		InstallGetterSetter(this,"origin",function(){return url.origin||location.protocol+"//"+location.host;},function(v){url.origin=v;});
		/**
		 * @attribute protocol
		 * @type String
		 */
		InstallGetterSetter(this,"protocol",function(){return url.protocol;},function(v){url.protocol=v;});
		/**
		 * @attribute host
		 * @type String
		 */
		InstallGetterSetter(this,"host",function(){return url.host;},function(v){url.host=v;});
		/**
		 * @attribute hostname
		 * @type String
		 */
		InstallGetterSetter(this,"hostname",function(){return url.hostname;},function(v){url.hostname=v;});
		/**
		 * @attribute port
		 * @type String
		 */
		InstallGetterSetter(this,"port",function(){return url.port;},function(v){url.port=v;});
		/**
		 * @attribute pathname
		 * @type String
		 */
		InstallGetterSetter(this,"pathname",function(){return url.pathname;},function(v){url.pathname=v;});
		/**
		 * @attribute search
		 * @type String
		 */
		InstallGetterSetter(this,"search",function(){return url.search;},function(v){url.search=v;});
		/**
		 * @attribute hash
		 * @type String
		 */
		InstallGetterSetter(this,"hash",function(){return url.hash;},function(v){url.hash=v;});
		/**
		 * @attribute username
		 * @type String
		 */
		this.username="";
		/**
		 * @attribute password
		 * @type String
		 */
		this.password="";
		//this.searchParams=new URLSearchParams(url.search);
	}
	SetNativeFlag(URL);
	return URL;
});