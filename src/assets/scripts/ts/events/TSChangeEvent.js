/**
 * Event classes
 * @module ts.events
 */
define("ts/events/TSChangeEvent",[
	//"jsm/events/ChangeEvent",
	"ts/events/TSEvent"
],function(/*ChangeEvent,*/TSEvent){
	"use strict";
	/**
	 * @namespace ts.events
	 * @class TSChangeEvent
	 * @constructor
	 * @param {String} type
	 * @param {Object} [init={bubbles:false,cancelable:false}]
	 */
	function TSChangeEvent(type,init){
		TSEvent.call(this,type);
		var o=ExtendObject({
			"bubbles":false,
			"cancelable":false,
			"oldIndex":-1,
			"newIndex":-1
		},init,DONT_EXTEND);
		ExtendObject(this,o);
	}
	/**
	 * @method initChangeEvent
	 * @param {String} type
	 * @param {Boolean} [bubbles=false]
	 * @param {Boolean} [cancelable=false]
	 * @param {Number} [oldIndex=0]
	 * @param {Number} [newIndex=0]
	 */
	function initChangeEvent(type,bubbles,cancelable,oldIndex,newIndex){
		this.type=String(type);
		ExtendObject(this,{
			"bubbles":bubbles,
			"cancelable":cancelable,
			"oldIndex":oldIndex|0,
			"newIndex":newIndex|0
		});
	}
	ExtendClass(TSChangeEvent,TSEvent);
	InstallFunctions(TSChangeEvent.prototype,DONT_DELETE,[
		"initChangeEvent",initChangeEvent
	]);
	SetNativeFlag(TSChangeEvent);
	//ImplementInterface(TSChangeEvent,ChangeEvent);
	return TSChangeEvent;
});