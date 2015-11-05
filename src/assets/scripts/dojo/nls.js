/**
 * nls plugin for RequireJs
 * @license RequireJS i18n 2.0.4
 * (c) 2014, Beijing Teamsun Co. Ltd. All Rights Reserved.
 */
define(['module'], function (module) {
	"use strict";
	/**
	 * 
	 * @param {String} lang
	 * @param {String} path
	 * @return {String}
	 * @example <pre><code>
	 * dojoUrlFunction("zh-CN","path/to/message.json") returns "path/to/zh-CN/message.json"
	 * </code></pre>
	 */
	function dojoUrlFunction(lang,path){
		var qIndex=path.indexOf("?"),
			search="";
		if(qIndex!==-1){
			search=path.substring(qIndex);
			path=path.substring(0,qIndex);
		}
		var sIndex=path.lastIndexOf("/"),
			dIndex=path.lastIndexOf("."),
			base=path.substring(0,sIndex+1),
			name=path.substr(sIndex+1),
			firstname=path.substr(sIndex+1),
			lastname="";
		if(dIndex>sIndex){
			firstname=path.substring(sIndex+1,dIndex);
			lastname=path.substr(dIndex);
		}
		var url=base+lang+"/"+firstname+lastname;
		if(search){url+=search;}
		return url;
	}
	/**
	 * 
	 * @param {String} lang
	 * @param {String} path
	 * @return {String}
	 * @example <pre><code>
	 * javaUrlFunction("zh-CN","path/to/message.json") returns "path/to/message_zh_CN.json"
	 * </code></pre>
	 */
	function javaUrlFunction(lang,path){
		var qIndex=path.indexOf("?"),
			search="";
		if(qIndex!==-1){
			search=path.substring(qIndex);
			path=path.substring(0,qIndex);
		}
		var sIndex=path.lastIndexOf("/"),
			dIndex=path.lastIndexOf("."),
			base=path.substring(0,sIndex+1),
			name=path.substr(sIndex+1),
			firstname=path.substr(sIndex+1),
			lastname="";
		if(dIndex>sIndex){
			firstname=path.substring(sIndex+1,dIndex);
			lastname=path.substr(dIndex);
		}
		var url=base+firstname+"_"+lang.replace("-","_")+lastname;
		if(search){url+=search;}
		return url;
	}
	function toJSON(){
		try{
			return JSON.parse(this.responseText);
		}catch(e){
			if(e.name==="SyntaxError"){
				console.error("Error parsing \"%s\".",this.URL);
			}else{
				throw e;
			}
		}
	}
	function dispatchLoadEnd(){
		var event=document.createEvent("Event");
		event.initEvent("loadend",false,false);
		if(typeof this.onloaded==="function"){this.onloaded.call(this,event);}
		this.dispatchEvent(event);
	}
	function createEvent(name,type,init){
		var e=document.createEvent(name);
		e.initEvent(type,false,false);
		return e;
	}
	function setResponseJSON(event){
		try{
			this.responseJSON=toJSON.call(this);
		}catch(e){
			event.stopImmediatePropagation();
			this.dispatchEvent(createEvent("Event","error"));
		}
	}
	function getJSON(url,options){
		var xhr,def;
		xhr=new XMLHttpRequest();
		def={method:"GET",async:true};
		if(typeof options==="object"&&options!==null){
			Object.keys(options).forEach(function(k){def[k]=this[k];},options);
		}
		xhr.URL=url;
		try{xhr.timeout=5000;}catch(e){}
		xhr.addEventListener("load",setResponseJSON);
		if(options.success){xhr.addEventListener("load",options.success);}
		if(options.error){xhr.addEventListener("error",options.error);}
		if(options.complete){xhr.addEventListener("loadend",options.complete);}
		if(typeof xhr.onloadend==="undefined"){
			xhr.addEventListener("load",dispatchLoadEnd);
			xhr.addEventListener("error",dispatchLoadEnd);
		}
		xhr.open(def.method,url,def.async);
		xhr.send();
		return xhr;
	}
	function getLang(name,options){
		return getJSON(require.toUrl(plugin.config.urlFunction(plugin.config.lang,name)),options);
	}
	function getRoot(name,options){
		return getJSON(require.toUrl(name),options);
	}
	function load(name,req,resolve,cfg){
		var url=require.toUrl(name);
		var baseJSON=null;
		function loadHandler(){
			var json=this.responseJSON;
			if(baseJSON){
				Object.keys(baseJSON).forEach(function(k){json[k]=this[k];},baseJSON);
			}
			resolve(json);
		}
		
		function printErrorLog(){
			console.error("Error loading \"%s\".",this.URL);
		}
		if(plugin.config.hasRoot){
			getRoot(name,{
				success:function(){
					baseJSON=this.responseJSON;
				},
				error:printErrorLog,
				complete:function(){
					getLang(name,{
						success:loadHandler,
						error:printErrorLog
					});
				}
			});
		}else{
			getLang(name,{
				success:loadHandler,
				error:printErrorLog
			});
		}
	}
	var cfg=Object(module.config());
	var plugin={
		name:"nls loader",
		description:"nls loader 0.0.1a",
		version:"0.0.1",
		config:{
			lang:typeof cfg.lang==="string"?cfg.lang:"en-US",
			hasRoot:typeof cfg.hasRoot==="boolean"?!!cfg.hasRoot:false,
			urlFunction:typeof cfg.urlFunction==="function"?cfg.urlFunction:javaUrlFunction
		},
		load:load,
		javaUrlFunction:javaUrlFunction,
		dojoUrlFunction:dojoUrlFunction
	};
	return plugin;
});