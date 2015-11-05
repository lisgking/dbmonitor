define("ts/widgets/TSForm",[
	"ts/widgets/TSWidget",
	"dojo/css!./css/TSFormGrid.css",
	"jquery"
],function(TSWidget,css,$){
	"use strict";
	function TSForm(id,initParams){
		TSWidget.call(this,id,initParams);
		
	}
	InstallFunctions($.fn,NONE|DONT_OVERWRITE,[
		"serializeObject",function(){
			return this.serializeArray().reduce(function(obj,param){
				if(!obj.hasOwnProperty(param.name)){
					obj[param.name]=param.value;
				}
				return obj;
			},{});
		}
	]);
	ExtendClass(TSForm,TSWidget);
	SetNativeFlag(TSForm);
	return TSForm;
});