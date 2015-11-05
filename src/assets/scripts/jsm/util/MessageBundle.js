define("jsm/util/MessageBundle",[],function(){
	"use strict";
	/**
	 * i18n resource bundle like chrome.i18n
	 * @namespace jsm.util
	 * @class MessageBundle
	 * @constructor
	 * @param {Object} json
	 * @param {MessageBundle} baseBundle
	 * @exmaple
<pre><code>var intl=new MessageBundle({
	"windows":"Windows",
	"unix":"Unix",
	"macintosh":"Macintosh"
});
var i18n=new MessageBundle({
	"macintosh":"麦金塔"
},intl);
i18n.getMessage("windows");//"视窗系统"
i18n.getMessage("unix");//"Unix"
i18n.getMessage("macintosh");//"麦金塔"
</code></pre>
	 */
	function MessageBundle(json,baseBundle){
		var ownData=Object(json),
			baseData;
		if(baseBundle instanceof MessageBundle){
			baseData=baseBundle.__data__;
		}else{
			baseBundle=null;
			baseData={};
		}
		ownData=ExtendObject(Object.create(baseData),ownData);
		SetProperty(this,DONT_ENUM,"__data__",ownData);
		SetProperty(this,DONT_ENUM,"baseBundle",baseBundle);
	}
	/**
	 * get accept languages
	 * @method getAcceptLanguages
	 * @param {Function} callback callback(array:Array):void;
	 */
	function getAcceptLanguages(callback){
		//NOOP
	}
	/**
	 * get message
	 * @method getMessage
	 * @param {String} key
	 * @param {Array} [obj]
	 * @return {String}
	 */
	function getMessage(key,obj){
		var msg;
		//#1. ensure key to be a string
		key+="";
		//#2. get message by key
		msg=this.__data__[key];
		//#3. check message
		if(msg===void 0||msg===null){
			//#3.1 if no message found, return key
			return key;
		}else{
			//#3.2 normalize message
			msg=msg.toString();
		}
		//#4. check given object
		if(obj===void 0||obj===null){
			//#4.1. if no object given, return message
			return msg;
		}else if(typeof obj!=="object"&&typeof obj!=="function"){
			//#4.2. ensure obj to be a Object
			obj=Object(obj);
		}
		//#5. do evaluate and substitute
		if(Array.isArray(obj)){
			//#5.1. replace Array elements
			return msg.replace(/\$([\d$])/g,function(e,n){
				return n==="$"?n:n<obj.length?obj[n]:e;
			});
		}else{
			//#5.2. replace Object properties
			return msg.replace(/\$([\w$]+)(\(\))?/g,function(e,n,f){
				if(n==="$"){return n;}
				var v=obj[n];
				if(v===void 0&&!(n in obj)){
					//#5.2.1. no such property, return expression itself
					return e;
				}else if(f==="()"&&typeof v==="function"){
					//#5.2.2. if expression is a function, return value by calling the value function
					return obj[n]()+"";
				}else{
					//#5.2.3. return value
					return v+"";
				}
			});
		}
	}
	function accessObject(object,path){
		return path.split(".").reduce(function(object,key,index,array){
			var shared=null;
			var value=object[key];
			if(!value){throw new ReferenceError("namespace "+path+" is not defined");}
			if(index===array.length-1&&typeof object["*"]==="object"){
				shared=object["*"];
				if(shared){ExtendObject(value,shared,DONT_OVERWRITE);}
			}
			return value;
		},object);
	}
	function specificKeys(object,keys){
		var temp={},key;
		for(var i=0;i<keys.length;i++){
			key=keys[i];
			if(object.hasOwnProperty(key)){
				temp[key]=object[key];
			}
		}
		return temp;
	}
	/**
	 * @method createBranch
	 * @param {Object} data
	 * @param {String} [path]
	 * @param {Array} [keys]
	 * @return {MessageBundle}
	 */
	function createBranch(data,path,keys){
		if(typeof data!=="object"){
			throw new Error("bundle data "+data+" is not a object");
		}else if(data===null){
			data={};
		}
		if(typeof path==="string"){
			data=accessObject(data,path);
		}
		if(Array.isArray(keys)){
			data=specificKeys(data,keys);
		}
		return new MessageBundle(data,this);
	}
	/**
	 * @method createBranch
	 * @param {Object} data
	 */
	function mixin(data,path,keys,method){
		if(typeof path==="string"){
			data=accessObject(data,path);
		}
		if(Array.isArray(keys)){
			data=specificKeys(data,keys);
		}
		ExtendObject(this.__data__,data,method);
	}
	InstallFunctions(MessageBundle.prototype,DONT_ENUM,[
		"getAcceptLanguages",getAcceptLanguages,
		"getMessage",getMessage
	]);
	InstallFunctions(MessageBundle.prototype,DONT_ENUM,[
		"createBranch",createBranch,
		"mixin",mixin
	]);
	SetNativeFlag(MessageBundle);
	return MessageBundle;
});