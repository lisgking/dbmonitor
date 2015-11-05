define("ts/widgets/TSPromptDialog",[
	"ts/widgets/TSDialog",
	"jsm/util/MessageBundle",
	"dojo/text!./htm/TSPromptDialog.htm",
	"dojo/css!./css/TSPromptDialog.css"
],function(TSDialog,MessageBundle,htm,css){
	"use strict";
	var __super__=TSDialog.prototype;
	/**
	 * @namespace ts.widgets
	 * @class TSPromptDialog
	 * @extends ts.widgets.TSDialog
	 * @constructor
	 * @param {Object} id
	 * @param {Object} [initParams]
	 */
	function TSPromptDialog(id,initParams){
		__super__.constructor.call(this,id,initParams);
		init.call(this);
	}
	function init(){
		this.visible=false;
		var that=this;
		this.roles.get("close").addEventListener("click",function(){
			that.returnValue="";
			that.close();
		});
		this.roles.get("cancel").onclick=function(){
			that.returnValue="";
			that.close();
		};
		this.roles.get("ok").onclick=function(){
			that.returnValue=that.roles.get("returnvalue").value;
			that.close();
		};
		this.roles.get("caption").textContent=FormatMessage("The page at $1 says:",location.host);
		this.rootElement.oncontextmenu=function(event){
			event.preventDefault();
			event.stopPropagation();
		};
	}
	/**
	 * @method open
	 */
	function open(){
		if(this.visible){return;}
		__super__.show.call(this);
	}
	/**
	 * @method close
	 */
	function close(){
		if(!this.visible){return;}
		__super__.hide.call(this);
		if(this.onclose){this.onclose.call(this);}
	}
	/**
	 * @event close
	 */
	ExtendClass(TSPromptDialog,TSDialog);
	InstallFunctions(TSPromptDialog.prototype,DONT_DELETE,[
		"open",open,
		"close",close
	]);
	SetProperties(TSPromptDialog.prototype,DONT_ENUM,[
		"template",htm
	]);
	SetNativeFlag(TSPromptDialog);
	return TSPromptDialog;
});