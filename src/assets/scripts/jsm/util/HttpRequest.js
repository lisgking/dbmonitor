(function(global){
	"use strict";
	function HttpRequest(location){
		Object.defineProperty(this,"__data__",{configurable:true,value:{}});
		var params={};
		this.__data__.params=params;
		location.search.substr(1).split("&").forEach(function(pair){
			if(!pair){return;}
			var eq,name,value;
			eq=pair.indexOf("=");
			if(eq<0){eq=pair.length;}
			name=decodeURIComponent(pair.substr(0,eq));
			value=decodeURIComponent(pair.substr(eq+1));
			if(!params.hasOwnProperty(name)){params[name]=[];}
			params[name].push(value);
		});
	}
	[
		"getParameter",function getParameter(name){
			return this.__data__.params.hasOwnProperty(name)?this.__data__.params[name][0]:null;
		},
		"getParameterValues",function getParameterValues(name){
			return this.__data__.params.hasOwnProperty(name)?this.__data__.params[name]:[];
		},
		"getParameterNames",function getParameterNames(){
			return Object.keys(this.__data__.params);
		},
		"getParameterMap",function getParameterMap(){
			return this.__data__.params;
		}
	].forEach(function(v,i,a){if(!(i&1)){this[v]=a[i+1];}},HttpRequest.prototype);
	if(typeof define==="function"&&define.amd){
		define([],function(){return HttpRequest;});
	}else{
		global["HttpRequest"]=HttpRequest;
	}
}(this));