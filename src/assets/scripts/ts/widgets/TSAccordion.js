define("ts/widgets/TSAccordion",
	["ts/widgets/TSWidget",
	 "dojo/text!./htm/TSAccordion.htm",
	 "dojo/css!./css/TSAccordion.css",
	 "dojo/nls!./nls/TSAccordion.json",
	 ],function(TSWidget,htm,accordionNode,css,json){
	"use strict";
	var i18n=TSWidget.prototype.i18n.createBranch(json);
	
	function TSAccordion(){
		TSWidget.call(this);
		this.init();
	}
	
	function init(){
		this.initProperties();
		this.loadData();
	}
	
	function loadData(){
		var url="accondion data";
		
	}
	
	function initEvent(){
		
	}
	
	function initProperties(){
		this.status=
		this.clickCallBack=function(){};
	}
	
	function setClickCallback(callback){
		if(typeof callback === "function"){
			this.removeEventListener("click",this.clickCallBack);
			this.clickCallBack=callback;
			this.addEventListener("click",this.clickCallBack,false);
		}
	}
	
	ExtendClass(TSAccordion,TSWidget);
	
	SetProperties(TSAccordion.prototype,DONT_ENUM,[
 	    "i18n",i18n,
 	    "template",htm
 	]);
 	
 	InstallFunctions(TSAccordion.prototype,DONT_DELETE,[
 	    "init",init,
 	    "initProperties",initProperties,
 	    "setClickCallback",setClickCallback                                           
 	]);
	
	return TSAccordion;
	
});