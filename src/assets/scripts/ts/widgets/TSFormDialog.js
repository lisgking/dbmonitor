define("ts/widgets/TSFormDialog",[
	"ts/widgets/TSDialog",
	"ts/widgets/TSWizardStep",
	"ts/events/TSEvent",
	"dojo/text!./htm/TSFormDialog.htm",
	"dojo/css!./css/TSFormDialog.css",
	"jquery"
],function(TSDialog,TSWizardStep,TSEvent,htm,css,$){
	"use strict";
	var __super__=TSDialog.prototype;
	"constructor";
	/**
	 * @namespace ts.widgets
	 * @class TSFormDialog
	 * @extends ts.widgets.TSDialog
	 * @constructor
	 * @param {String} id
	 * @param {Object} [initParams]
	 */
	function TSFormDialog(id,initParams){
		__super__.constructor.call(this,id,initParams);
		init.call(this);
	}
	"private";
	function init(){
		InstallEvents(this,[
			/**
			 * @event open
			 */
			"open",
			/**
			 * @event close
			 */
			"close"
		]);
		defineProperties.call(this);
		addEventListeners.call(this);
		this.visible=false;
		this.closeOnEsc=true;
	}
	function defineProperties(){
		/**
		 * @attribute title
		 * @type String
		 */
		this.__data__.title="";
		InstallGetterSetter(this,"title",
			function getTitle(){
				return this.__data__.title=this.roles.get("title").textContent;
			},
			function setTitle(v){
				this.__data__.title=this.roles.get("title").textContent=v;
			}
		);
	}
	function addEventListeners(){
		var that=this;
		var close_clickHandler=function(){
			var canceled=!that.dispatchEvent(new TSEvent("beforeclose"));
			if(canceled){return;};
			that.close();
		};
		this.roles.get("close").addEventListener("click",close_clickHandler);
	}
	"public";
	/**
	 * @method open
	 */
	function open(){
		if(this.visible){return;}
		__super__.show.call(this);
		this.dispatchEvent(new TSEvent("open"));
	}
	/**
	 * @method close
	 */
	function close(){
		if(!this.visible){return;}
		__super__.hide.call(this);
		this.dispatchEvent(new TSEvent("close"));
	}
	ExtendClass(TSFormDialog,TSDialog);
	InstallFunctions(TSFormDialog.prototype,DONT_DELETE,[
		"open",open,
		"close",close
	]);
	SetProperties(TSFormDialog.prototype,DONT_ENUM,[
		"template",htm
	]);
	SetNativeFlag(TSFormDialog);
	return TSFormDialog;
});