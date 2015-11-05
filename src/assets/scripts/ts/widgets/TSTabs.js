define("ts/widgets/TSTabs",[
	"ts/widgets/TSWidget"
],function(TSWidget){
	"use strict";
	var __super__=TSWidget.prototype;
	function TSTabs(id,initParams){
		__super__.constructor.call(this,id,initParams);
	}
	ExtendClass(TSTabs,TSWidget);
	InstallFunctions(TSTabs.prototype,DONT_ENUM,[
		
	]);
	SetNativeFlag(TSTabs);
	return TSTabs;
});