/**
 * @module ts.widgets
 */
define("ts/widgets/TSAlertDialog",[
	"ts/widgets/TSDialog",
	"jsm/util/MessageBundle",
	"dojo/text!./htm/TSAlertDialog.htm",
	"dojo/css!./css/TSAlertDialog.css"
],function(TSDialog,MessageBundle,htm,css){
	"use strict";
	var __super__=TSDialog.prototype;
	/**
	 * @namespace ts.widgets
	 * @class TSAlertDialog
	 * @extends ts.widgets.TSDialog
	 * @constructor
	 * @param {Object} id
	 * @param {Object} [initParams]
	 */
	function TSAlertDialog(id,initParams){
		__super__.constructor.call(this,id,initParams);
		init.call(this);
	}
	function init(){
		this.visible=false;
		var that=this;
		this.roles.get("close").addEventListener("click",function(){
			that.close();
		});
		this.roles.get("ok").onclick=function(){
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
	ExtendClass(TSAlertDialog,TSDialog);
	InstallFunctions(TSAlertDialog.prototype,DONT_DELETE,[
		"open",open,
		"close",close
	]);
	SetProperties(TSAlertDialog.prototype,DONT_ENUM,[
		"template",htm
	]);
	SetNativeFlag(TSAlertDialog);
	return TSAlertDialog;
});