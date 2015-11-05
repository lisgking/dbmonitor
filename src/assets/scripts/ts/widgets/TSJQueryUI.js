define("ts/widgets/TSJQueryUI",[
	"ts/widgets/TSWidget",
	"jqueryui/ui/jquery.ui.core",
	"jqueryui/ui/jquery.ui.widget",
	"dojo/text!ts/widgets/htm/JqueryTabs.htm",
	"dojo/css!jqueryui/themes/base/jquery.ui.all.css",
	"dojo/css!jqueryui/demos/demos.css"
],function(TSWidget,core,widget){
	"use strict";
	var __super__=TSWidget.prototype;
	function TSJQueryUI(id,initParams){
		__super__.constructor.call(this,id,initParams);
		init.call(this);
		//this.dispatchEvent(new TSEvent("readystatechange"));
	}
	
	function init(){}
	ExtendClass(TSJQueryUI,TSWidget);
	return TSJQueryUI;
});