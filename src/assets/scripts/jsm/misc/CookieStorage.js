/**
 * CookieStorage
 * Description: localStorage-like API for cookie manipulation
 * Author:Fuwei Chin
 * Date: Wed, 23 Oct 2013 17:06:00 GMT
 */

/**
 * Miscellaneous Classes
 * @module jsm.misc
 */
define(function(){
	"use strict";
	var document=window.document,
		defineProperties=Object.defineProperties,
		indexOf=Array.prototype.indexOf,
		keywords="expires,max-age,path,domain,secure".split(",");
	/**
	 * Storage
	 * @namespace jsm.misc
	 * @class CookieStorage
	 * @constructor
	 * @example
<pre><code>
require(["jsm/misc/Storage"],function(cookieStorage){
	cookieStorage.setItem("lang","en");
	var length=cookieStorage.length;
	for(var i=0.length;i&lt;length;i++){
		var key=cookieStorage.key(i);
		var value=cookieStorage.getItem(key);
		console.log(key+"="+value);
	}
	cookieStorage.getItem("lang");
	cookieStorage.removeItem("lang");
	cookieStorage.clear();
});</code></pre>
	 */
	function Storage(){
		/**
		 * @attribute length
		 * @type Number
		 */
		defineProperties(this,{
			"length":{get:length,enumerable:false,configurable:true}
		});
	}
	/**
	 * @method key
	 * @param {Number} index
	 * @return {String|null}
	 */
	function key(index){
		index>>>=0;
		var cookie=document.cookie,items,pos,item,name,value;
		if(cookie){
			items=cookie.split("; ");
			if(index<items.length){
				item=items[index],pos=item.indexOf("=");
				if(pos<0){pos=item.length;}
				name=decodeURIComponent(item.substr(0,pos));
				return name;
			}
		}
		return null;
	}
	/**
	 * @method getItem
	 * @param {String} key
	 * @return {String|null}
	 */
	function getItem(key){
		key+="";
		var cookie=document.cookie,items,i,pos,item,name,value;
		if(cookie){
			items=cookie.split("; ");
			for(i=0;i<items.length;i+=1){
				item=items[i],pos=item.indexOf("=");
				if(pos<0){pos=item.length;}
				name=decodeURIComponent(item.substr(0,pos));
				if(key===name){
					value=decodeURIComponent(item.substr(pos+1));
					return value;
				}
			}
		}
		return null;
	}
	/**
	 * @method setItem
	 * @param {String} key
	 * @return {String} value
	 * @return {String|Date|Number} [expires] - UTC date string | Expiration date | Number of seconds
	 * @return {String} [path]
	 * @return {String} [domain]
	 * @return {Boolean} [secure]
	 */
	function setItem(key,value,expires,path,domain,secure){
		if(arguments.length<2){
			throw new TypeError("Failed to execute 'setItem' on 'Storage': 2 arguments required, but only "+
					arguments.length+" present.");
		}
		key+="";
		value+="";
		if(indexOf.call(keywords,key)>-1){return;}
		var cookie,items=[];
		items.push(encodeURIComponent(key)+"="+encodeURIComponent(value));
		if(typeof expires=="string"){
			items.push("expires="+expires);
		}else if(expires instanceof Date){
			items.push("expires="+expires.toUTCString());
		}else if(typeof expires=="number"){
			items.push("max-age="+expires===Infinity?0x7fffffff:Math.round(expires));
		}
		if(path)items.push("path="+path);
		if(domain)items.push("domain="+domain);
		if(secure)items.push("secure");
		cookie=items.join("; ");
		document.cookie=cookie;
	}
	/**
	 * @method removeItem
	 * @param {String} key
	 * @return {String} [path]
	 * @return {String} [domain]
	 */
	function removeItem(key,path,domain){
		key+="";
		if(this.getItem(key)===null){return;}
		var cookie,items=[];
		items.push(encodeURIComponent(key)+"=");
		items.push("expires="+new Date(0).toUTCString());
		if(path)items.push("path="+path);
		if(domain)items.push("domain="+domain);
		cookie=items.join("; ");
		document.cookie=cookie;
	}
	/**
	 * @method clear
	 * @return {String} [path]
	 * @return {String} [domain]
	 */
	function clear(path,domain) {
		var cookie=document.cookie,items=[],i,l,item;
		var extras=("; expires="+new Date(0).toUTCString())+(path?"; path="+path:"")+(domain?"; domain="+domain:"");
		if(cookie){
			items=cookie.split("; "),l=items.length;
			for(i=0;i<l;i+=1){document.cookie=items[i]+extras;}
		}
		return true;
	}
	function length(){
		var cookie=document.cookie;
		return cookie?cookie.split("; ").length:0;
	}
	/*@ccon @if (@jscript_version<9)
	if(!defineProperties&&Object.defineProperty){
		defineProperties=function(object,properties){
			if(object.nodeType>>>0!==object.nodeType){
				throw new TypeError("Object.defineProperties may only be used on DOM objects");
			}
			if(properties===undefined||properties==null){
				throw new TypeError("Cannot convert undefined or null to object");
			}
			var name,descriptor;
			for(name in properties){
				if(properties.hasOwnProperty(name)){
					descriptor=properties[name];
					if(descriptor.set||descriptor.get){
						delete descriptor.writable;
						descriptor.enumerable=false;
						descriptor.configurable=true;
					}else{
						descriptor.writable=true;
						descriptor.enumerable=true;
						descriptor.configurable=true;
					}
					Object.defineProperty(object,name,descriptor);
				}
			}
		};
	}
	if(!indexOf){
		var TO_INTEGER=function(value) {
			var number=+value;
			if(isNaN(number))return 0;
			if(number===0||!isFinite(number))return number;
			return (number>0?1:-1)*Math.floor(Math.abs(number));
		};
		indexOf=function(element,index){
			if(this===null||this===undefined){throw new TypeError("Array.prototype.indexOf called on null or undefined");}
			if(typeof f!=="function"){throw new TypeError(f+" is not a function");}
			var array=this,length=array.length>>>0;
			if(length==0){return -1;}
			if(index===undefined){index=0;}
			else{index=TO_INTEGER(index);if(index<0){index=length+index;if(index<0)index=0;}}
			var min=index,max=length,i;
			if(element!==undefined){for(i=min;i<max;i++){if(array[i]===element)return i;}return -1;}
			for(i=min;i<max;i++){if(array[i]===undefined&&i in array) {return i;}}
			return -1;
		};
	}
	@end
	@*/
	var __proto__=Storage.prototype;
	var cookieStorage=new Storage();
	/*@ccon @if (@jscript_version<9)
	if(!Object.defineProperties){
		__proto__=document.createElement("div");
		__proto__.toString=function(){return "[object Storage]";};
		Storage.call(__proto__);
		cookieStorage=__proto__;
	}
	@end
	@*/
	defineProperties(__proto__,{
		"constructor":{value:Storage,writable:true,configurable:true},
		"key":{value:key,writable:true},
		"getItem":{value:getItem,writable:true},
		"setItem":{value:setItem,writable:true},
		"removeItem":{value:removeItem,writable:true},
		"clear":{value:clear,writable:true}
	});
	window.cookieStorage=cookieStorage;
	return Storage;
});
