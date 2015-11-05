/*!
 * HTMLHttpRequest.js
 * Provide JavaEE-like request API for the web
 * Author: Fuwei Chin
 * Date: Fri, 16 May 2014 02:48:02 GMT
 */
(function(global){
	"use strcit";
	var InstallFunctions=global.InstallFunctions;
	if(typeof InstallFunctions!=="function"){
		InstallFunctions=function(o,a,p){
			o=Object(o);
			p.forEach(function(k,i,a){
				if(!(i&1)){
					this[k]=a[i+1];
				}
			},o);
			return o;
		};
	}
	//================================
	// Manifest
	//================================
	/**
	 * @namespace jsm.util
	 * @class Manifest
	 * @constructor
	 */
	function Manifest(){
		this.cacheBaseUrl="";// offline resource root path
		this.networkBaseUrl="";// online network root path
		this.cache={};
		this.network={};
		this.fallback={};
	}
	"private";
	function startsWith(str,pos){
		var len=this.length,start=0;
		if(pos!==undefined){start=Math.min(len,pos|0);}
		return this.substr(start-len,str.length)===str;
	}
	function endsWith(str,pos){
		var len=this.length,end=len;
		if(pos!==undefined){end=Math.min(len,pos|0);}
		return this.slice(end-str.length,end)===str;
	}
	/**
	 * @private
	 * @method findResourceURL
	 * @param {String} type
	 * @return {String|null}
	 */
	function findResourceURL(type){
		var manifest=this.manifest,
			base=this.onLine?manifest.networkBaseUrl:manifest.cacheBaseUrl,
			dict=this.onLine?manifest.network:manifest.cache,
			path;
		if(!this.onLine){return base+"/"+type+".json";}//XXX
		if(dict.hasOwnProperty(type)){
			path=dict[type];
		}else{
			var matchedType=Object.keys(dict).find(function(key){
				if(key.charAt(key.length-1)==="*"){
					return startsWith.call(type,key.substr(0,key.length-1));
				}else if(key.charAt(0)==="*"){
					return endsWith.call(type,key.substr(1));
				}
			});
			if(!matchedType){return null;}
			path=dict[matchedType];
		}
		if(base.substr(-1)==="/"&&path.substr(0,1)==="/"){
			return base.slice(0,-1)+path;
		}
		return base+path;
	}
	function findCacheResourceURL(type){
		var url=manifest.cacheBaseUrl;
		if(url===""){
			url="./";
		}else if(url.charAt(url.length-1)!=="/"){
			url+="/";
		}
		url=url+type+".json";
		return url;
	}
	"public";
	/**
	 * @method getResourceURL
	 * @param {String} contentType
	 * @return {String}
	 */
	function getResourceURL(type){
		if(typeof type!=="string"){
			throw new TypeError(type+" is not a string");
		}
		var url=findResourceURL.call(this,type);
		if(!url){return "";}
		return url;
	}
	function getOwnPropertyDescriptors(o){
		return Object.getOwnPropertyNames(o).reduce(function(p,n){
			return p[n]=Object.getOwnPropertyDescriptor(o,n),p;
		},{});
	}
	//================================
	// Account
	//================================
	function Account(){
		
	}
	InstallFunctions(Account,0,[
		"fromObject",function fromObject(obj){
			return Object.defineProperties(new Account(),getOwnPropertyDescriptors(obj));
		}
	]);
	InstallFunctions(Account.prototype,0,[
		"eq",function eq(that){return this.userId===that.userId;},
		"gt",function gt(that){return this.userType<that.userType;},
		"lt",function lt(that){return this.userType>that.userType;}
	]);
	//================================
	// Session
	//================================
	function Session(){
		this.storage=sessionStorage;
	}
	InstallFunctions(Session.prototype,0,[
		"getAttribute",function getAttribute(name){
			return sessionStorage.getItem("pd_"+name);
		},
		"setAttribute",function setAttribute(name,value){
			return sessionStorage.setItem("pd_"+name,value);
		},
		"removeAttribute",function removeAttribute(name,value){
			return sessionStorage.removeItem("pd_"+name);
		}
	]);
	//================================
	// Application
	//================================
	function Application(){
		this.storage=localStorage;
	}
	InstallFunctions(Application.prototype,0,[
		"getAttribute",function getAttribute(name){
			return localStorage.getItem("pd_"+name);
		},
		"setAttribute",function setAttribute(name,value){
			return localStorage.setItem("pd_"+name,value);
		},
		"removeAttribute",function removeAttribute(name,value){
			return localStorage.removeItem("pd_"+name);
		}
	]);
	//================================
	// HTMLHttpRequest
	//================================
	
	/**
	 * @namespace jsm.util
	 * @param {URL} url - can also be Location | HTMLAnchorElement | HTMLAreaElement
	 */
	function HTMLHttpRequest(url){
		/**
		 * @attribute __data__
		 * @type Object
		 */
		Object.defineProperty(this,"__data__",{
			writable:true,
			enumerable:false,
			configurable:true,
			value:{}
		});
		this.vars=this.__data__;
		this.vars.quietOnOK=false;
		var session,
			application;
		this.session=session=new Session();
		this.application=application=new Application();
		/**
		 * @attribute language
		 * @type String
		 */
		Object.defineProperty(this,"language",{
			get:function(){
				return document.documentElement.lang;
			},
			set:function(v){
				if(this.language===v){return;}
				document.documentElement.lang=v;
			}
		});
		/**
		 * @attribute manifest
		 * @type Object
		 */
		this.manifest=new Manifest();
		/**
		 * @attribute onLine
		 * @type Boolean
		 * @default true
		 */
		Object.defineProperty(this,"onLine",{
			enumerable:true,
			configurable:true,
			get:function(){
				return session.getAttribute("onLine")!=="false";
			},
			set:function(v){
				session.setAttribute("onLine",!!v);
			}
		});
		/**
		 * @attribute account
		 * @type Object
		 */
		this.__data__.account=null;
		Object.defineProperty(this,"account",{
			enumerable:true,
			configurable:true,
			get:function(){
				var account=this.__data__.account;
				var str;
				if(!account){
					str=session.getAttribute("account");
					if(str){
						try{
							this.__data__.account=account=Account.fromObject(JSON.parse(str));
						}catch(e){
							session.removeAttribute("account");
						}
					}
				}
				return account;
			},
			set:function(obj){
				if(typeof obj==="object"){
					var account=this.__data__.account=Account.fromObject(obj);
					session.setAttribute("account",JSON.stringify(account,
						["userId","userName","userStatus","userType"]
					));
				}
			}
		});
		url.search.substr(1).split("&").forEach(function(pair){
			if(!pair){return;}
			var eq,name,value;
			eq=pair.indexOf("=");
			if(eq<0){eq=pair.length;}
			name=decodeURIComponent(pair.substr(0,eq));
			value=decodeURIComponent(pair.substr(eq+1));
			if(!this.hasOwnProperty(name)){this[name]=[];}
			this[name].push(value);
		},this.__data__);
	}
	function getParameter(name){
		return this.__data__.hasOwnProperty(name)?this.__data__[name][0]:null;
	}
	function getParameterValues(name){
		return this.__data__.hasOwnProperty(name)?this.__data__[name]:[];
	}
	function getParameterNames(){
		return Object.keys(this.__data__);
	}
	function getParameterMap(){
		return this.__data__;
	}
	function concatParameters(url,param){
		var qpos=url.indexOf("?"),
			search=qpos===-1?"":url.substr(qpos),
			str=url;
		if(typeof param==="object"&&param!==null){
			var pairs=Object.keys(param).reduce(function(p,k){
				var v=param[k];
				if(v===null||v===void 0){v="";}
				p.push(encodeURIComponent(k)+"="+encodeURIComponent(v));
				return p;
			},[]);
			param=pairs.join("&");
		}
		if(typeof param==="string"&&param!==""){
			if(!search){
				if(param.charAt(0)==="?"){
					str+=param;
				}else if(param.charAt(0)==="&"){
					str+="?"+param.slice(1);
				}else{
					str+="?"+param;
				}
			}else{
				if(param.charAt(0)==="?"){
					param=param.slice(1);
				}
				if(str.slice(-1)==="&"){
					//str=str.slice(0,-1);
					if(param.charAt(0)==="&"){
						str+=param.slice(1);
					}else{
						str+=param;
					}
				}else{
					if(param.charAt(0)==="&"){
						str+=param;
					}else{
						str+="&"+param;
					}
				}
			}
		}
		return str;
	}
	InstallFunctions(HTMLHttpRequest.prototype,0,[
		"concatParameters",concatParameters,
		"getParameter",getParameter,
		"getParameterValues",getParameterValues,
		"getParameterNames",getParameterNames,
		"getParameterMap",getParameterMap,
		"getResourceURL",getResourceURL
	]);
	"exports";
	if(typeof define==="function"&&define.amd){
		define([],function(){return HTMLHttpRequest;});
	}else{
		global.HTMLHttpRequest=HTMLHttpRequest;
	}
}(this));