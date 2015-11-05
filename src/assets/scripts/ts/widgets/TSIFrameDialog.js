define("ts/widgets/TSIFrameDialog",[
	"ts/widgets/TSDialog",
	"ts/events/TSEvent",
	"jsm/util/MessageBundle",
	"dojo/text!ts/widgets/htm/TSIFrameDialog.htm",
	"dojo/css!ts/widgets/css/TSIFrameDialog.css"
],function(TSDialog,TSEvent,MessageBundle,htm,css){
	"use strict";
	var __super__=TSDialog.prototype;
	function TSIFrameDialog(id,initParams){
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
	function open(url){
		if(this.visible){return;}
		__super__.show.call(this);
		this.roles.get("iframe").src=url;
		this.dispatchEvent(new TSEvent("open"));
	}
	function close(){
		if(!this.visible){return;}
		__super__.hide.call(this);
		this.roles.get("iframe").src="about:blank";
		this.dispatchEvent(new TSEvent("close"));
	}
	ExtendClass(TSIFrameDialog,TSDialog);
	InstallFunctions(TSIFrameDialog.prototype,DONT_DELETE,[
		"open",open,
		"close",close
	]);
	SetProperties(TSIFrameDialog.prototype,DONT_ENUM,[
		"template",htm,
		//"i18n",new MessageBundle(json,__super__.i18n)
	]);
	SetNativeFlag(TSIFrameDialog);
	return TSIFrameDialog;
});