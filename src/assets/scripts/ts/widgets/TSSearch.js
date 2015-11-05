define("ts/widgets/TSSearch",
	["ts/widgets/TSWidget",
	 "dojo/text!./htm/TSSearch.htm",
	 "dojo/css!./css/TSSearch.css",
	 "dojo/nls!./nls/TSSearch.json"],
	function(TSWidget,htm,css,json){
	"use strict";
	
	var i18n=TSWidget.prototype.i18n.createBranch(json);
	
	function TSSearch(){
		TSWidget.call(this);
		defineProperties.call(this);
		addEventListeners.call(this);
	}
	
	function defineProperties(){
		
		this.filter=function(){return []};
		
		this.__data__.searchInput="";
		InstallGetterSetter(this,"searchInput",
			function(){
				return this.__data__.searchInput;
			},
			function(value){
				var input=this.role("searchInput");
				input.value=value;
				this.__data__.searchInput=value;
			}
		);
	}
	
	function addEventListeners(){
		var that=this;
		var tsSearch=this.role("ts-search");
		var searchBtn=this.role("searchBtn");
		var searchInput=this.role("searchInput");
		var open="ts-search-open";
		searchBtn.addEventListener("click",function(e){
			if(tsSearch.classList.contains(open)){
				tsSearch.classList.remove(open);
			}else{
				tsSearch.classList.add(open);
				searchInput.focus();
			}
		});
		searchInput.addEventListener("blur",function(e){
			if(!this.value){
				tsSearch.classList.remove(open);
			}
		});
		this.role("searchform").addEventListener("submit",function(e){
			e.preventDefault();
			return;
		});
		
		searchInput.placeholder="Search";
	}
	
	/**
	 * 用户自定义过滤方法
	 * 可以是远程过滤或者是本地过滤
	 */
	function setFilter(filter){
		var searchInput=this.role("searchInput");
		searchInput.removeEventListener("input",this.filter);
		this.filter=filter;
		searchInput.addEventListener("input",this.filter);
	}
	
	ExtendClass(TSSearch,TSWidget);
	
	SetProperties(TSSearch.prototype,DONT_ENUM,[
		"i18n",i18n,
		"template",htm
	]);
	
	InstallFunctions(TSSearch.prototype, DONT_ENUM, [
	    "setFilter",setFilter
    ]);
	
	return TSSearch;
});
