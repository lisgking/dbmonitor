define(["module"], function (module) {
	"use strict";
	function JSONLoader(){
		
	}
	function getHash(){
		var pos=this.indexOf("#");
		if(pos!==-1){
			return this.substring(pos+1);
		}
		return "";
	}
	function stripHash(){
		var pos=this.indexOf("#");
		if(pos!==-1){
			return this.substring(0,pos);
		}
		return this.valueOf();
	}
	function load(name,req,ok,cfg){
		var hash=getHash.call(name);
		if(!hash){
			var xhr=new XMLHttpRequest(),
				url=require.toUrl(name);
				xhr.onload=function(){
				try{
					ok(JSON.parse(xhr.responseText));
				}catch(e){
					if(e.name==="SyntaxError"){
						console.error("Error parsing \"%s\".",url);
					}else{
						throw e;
					}
				}
			};
			xhr.open("GET",url,true);
			xhr.send();
		}else{
			req([module.id+"!"+stripHash.call(name)],function(json){
				ok(hash.split(".").reduce(function(value,name){return value[name];},json));
			});
		}
	}
	[
		"version","0.0.1",
		"settings",module.config()||{},
		"load",load
	].forEach(function(v,i,a){
		if(!(i&1)){this[v]=a[i+1];}
	},JSONLoader);
	return JSONLoader;
});