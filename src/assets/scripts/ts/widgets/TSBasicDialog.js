define("ts/widgets/TSBasicDialog",[
	"ts/widgets/TSDialog",
	"ts/events/TSEvent",
	"jsm/util/MessageBundle",
	"dojo/text!ts/widgets/htm/TSBasicDialog.htm",
	"dojo/css!ts/widgets/css/TSBasicDialog.css"
],function(TSDialog,TSEvent,MessageBundle,htm,css){
	"use strict";
	var __super__=TSDialog.prototype;
	function TSBasicDialog(id,initParams){
		__super__.constructor.call(this,id,initParams);
		init.call(this);
	}
	function init(){
		this.visible=false;
		var that=this;
		this.roles.get("close").addEventListener("click",function(){
			that.close();
		});
	}
	function open(){
		if(this.visible){return;}
		__super__.show.call(this);
		this.dispatchEvent(new TSEvent("open"));
	}
	function close(){
		if(!this.visible){return;}
		__super__.hide.call(this);
		this.dispatchEvent(new TSEvent("close"));
	}
	ExtendClass(TSBasicDialog,TSDialog);
	InstallFunctions(TSBasicDialog.prototype,DONT_DELETE,[
		"open",open,
		"close",close
	]);
	SetProperties(TSBasicDialog.prototype,DONT_ENUM,[
		"template",htm,
		//"i18n",new MessageBundle(json,__super__.i18n)
	]);
	SetNativeFlag(TSBasicDialog);
	return TSBasicDialog;
});