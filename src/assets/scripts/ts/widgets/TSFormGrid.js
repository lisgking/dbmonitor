define("ts/widgets/TSFormGrid",[
	"ts/widgets/TSWidget",
	"dojo/text!./htm/TSFormGrid.htm",
	"dojo/css!./css/TSFormGrid.css"
],function(TSWidget,ComponentConfig,htm){
	"use strict";
	"constrcutor";
	function TSFormGrid(id,initParams){
		TSWidget.call(this,id,initParams);
		init.call(this);
	}
	function init(){
		
	}
	"exports";
	ExtendClass(TSFormGrid,TSWidget);
	SetProperties(TSFormGrid.prototype,NONE,[
		"template",htm
	]);
	return TSFormGrid;
});