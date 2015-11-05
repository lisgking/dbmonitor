/**
 * @module ts.events
 */
define("ts/events/TSMessageEvent",[
	"jsm/events/MessageEvent",
	"ts/events/TSEvent"
],function(MessageEvent,TSEvent){
	"use strict";
	/**
	 * @namespace ts.events
	 * @class TSMessageEvent
	 * @constructor
	 * @param {String} type
	 * @param {Object} [init={bubbles:false,cancelable:false,
	 * 	source:null,lastEventId:"",data:null,origin:""
	 * }]
	 */
	function TSMessageEvent(type/*,init*/){
		TSEvent.call(this,type);
		/**
		 * @attribute data
		 * @type *
		 */
		this.data=null;
		/**
		 * @attribute source
		 * @type Window
		 */
		this.source=null;
		/**
		 * @attribute lastEventId
		 * @type String
		 */
		this.lastEventId="";
		/**
		 * @attribute origin
		 * @type String
		 */
		this.origin="";
		
		var init=arguments[1];
		if(init instanceof Object){
			if("source" in init){this.source=init.source;}
			if("lastEventId" in init){this.lastEventId=String(init.lastEventId);}
			if("data" in init){this.data=init.data;}
			if("origin" in init){this.source=String(init.origin);}
		}
	}
	/**
	 * @method initChangeEvent
	 * @param {String} type
	 * @param {Boolean} [bubbles=false]
	 * @param {Boolean} [cancelable=false]
	 * @param {Window} [source=null]
	 * @param {String} [lastEventId=""],
	 * @param {Object} [data=null],
	 * @param {String} [origin=""],
	 */
	function initMessageEvent(type,bubbles,cancelable,source,lastEventId,data,origin){
		this.type=String(type);
		this.bubbles=!!bubbles;
		this.cancelable=!!cancelable;
		this.source=source||null;
		this.lastEventId=""+lastEventId;
		this.origin=""+origin;
	}
	ExtendClass(TSMessageEvent,TSEvent);
	InstallFunctions(TSMessageEvent.prototype,DONT_DELETE,[
		"initMessageEvent",initMessageEvent
	]);
	SetNativeFlag(TSMessageEvent);
	ImplementInterface(TSMessageEvent,MessageEvent);
	return TSMessageEvent;
});