define([],function(){
	"use strict";
	//----------------------------------------------------------------
	// [IE | Safari] normalize Event constructors
	//----------------------------------------------------------------
	var CheckEventArgs=function(f,r,a){
		if(!(r instanceof f)){
			throw new TypeError("Failed to construct '"+f.name+"': Please use the 'new' operator, this DOM object constructor cannot be called as a function.");
		}
		if(a.length===0){
			throw new TypeError("Failed to construct '"+f.name+"': An event name must be provided.");
		}
	};
	var shim={
		/**
		 * @namespace jsm.shims
		 * @class Event
		 * @extension Event
		 * @constructor
		 * @param {String} type
		 * @param {Object} [init={bubbles:false,cancelable:false}]
		 */
		Event:function Event(type/*,eventInit*/){
			CheckEventArgs(Event,this,arguments);
			var event=document.createEvent("Event"),
				p=ExtendObject({bubbles:false,cancelable:false},arguments[1],DONT_EXTEND);
			event.initEvent(type,p.bubbles,p.cancelable);
			return event;
		},
		/**
		 * @namespace jsm.shims
		 * @class CustomEvent
		 * @extends jsm.shims.Event
		 * @extension CustomEvent
		 * @constructor
		 * @param {String} type
		 * @param {Object} [init={bubbles:false,cancelable:false,detail:null}]
		 */
		CustomEvent:function CustomEvent(type/*,eventInit*/){
			CheckEventArgs(CustomEvent,this,arguments);
			var event=document.createEvent("CustomEvent"),
				p=ExtendObject({bubbles:false,cancelable:false,detail:null},arguments[1],DONT_EXTEND);
			event.initCustomEvent(type,p.bubbles,p.cancelable,p.detail);
			return event;
		},
		/**
		 * @namespace jsm.shims
		 * @class MessageEvent
		 * @extends jsm.shims.Event
		 * @extension MessageEvent
		 * @constructor
		 * @param {String} type
		 * @param {Object} [init={bubbles:false,cancelable:false,data:null,source:null,origin:""}]
		 */
		MessageEvent:function MessageEvent(type/*,eventInit*/){
			CheckEventArgs(MessageEvent,this,arguments);
			var event=document.createEvent("MessageEvent"),
				p=ExtendObject({bubbles:false,cancelable:false,data:null,origin:"",lastEventId:"",source:null},arguments[1],DONT_EXTEND);
			event.initMessageEvent(type,p.bubbles,p.cancelable,p.data,p.origin,p.lastEventId,p.source);
			return event;
		}
	};
	if(typeof Event==="object"){
		Object.getOwnPropertyNames(shim).forEach(function(name){
		if(!window[name]){return;}
			var Fix=shim[name];
			Fix.prototype=window[name].prototype;
			Fix.prototype.constructor=Fix;
			window[name]=Fix;
		});
	}
	return Event;
});
