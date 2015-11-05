define("ts/widgets/TSSelect",
	["ts/widgets/TSWidget",
	 "dojo/text!./htm/TSSelect.htm",
	 "dojo/css!./css/TSSelect.css",
	 "dojo/nls!./nls/TSSearch.json"],
	function(TSWidget,htm,css,json){
	"use strict";
	
	var i18n=TSWidget.prototype.i18n.createBranch(json);
	
	function TSSelect(opts){
		TSWidget.call(this);
		this.opts=opts;
		defineProperties.call(this);
		addEventListeners.call(this);
	}
	
	function init(o){
		this.searchInput=o;
	}
	
	function defineProperties(){
		
		this.filter=function(){return []};
		
		this.__data__.searchInput=[];
		InstallGetterSetter(this,"searchInput",
			function(){
				return this.__data__.searchInput;
			},
			function(values){
				this.__data__.searchInput=values;
				var select=this.role("searchSelelct");
				select.innerHTML=" ";
				select.add(new Option(i18n.getMessage("select"),""))
				values.forEach(function(v){
					var option=new Option(v.key,v.value);
					select.add(option);
				});
			}
		);
	}
	
	function setFilter(filter){
		if(!filter) return;
		var searchInput=this.role("searchSelelct");
		searchInput.removeEventListener("change",this.filter);
		this.filter=filter
		searchInput.addEventListener("change",this.filter);
	}
	
	function addEventListeners(){
		var that=this;
		var search=this.role("ts-select");
		var searchBtn=this.role("searchBtn");
		var searchInput=this.role("searchSelelct");
		var open="ts-search-open";
		searchBtn.addEventListener("click",function(e){
			if(search.classList.contains(open)){
				search.classList.remove(open);
			}else{
				search.classList.add(open);
			}
		});
		searchInput.addEventListener("blur",function(e){
			if(!this.value){
				search.classList.remove(open);
			}
		});
	}
	
	ExtendClass(TSSelect,TSWidget);
	
	SetProperties(TSSelect.prototype,DONT_ENUM,[
		"i18n",i18n,
		"template",htm
	]);
	
	InstallFunctions(TSSelect.prototype,DONT_ENUM,[
		"init",init,
		"setFilter",setFilter
	]);
	
	return TSSelect;
});
