/**
 * @module ts.events
 */
define("ts/events/TSEvent",["jsm/events/Event"],function(Event){
	"use strict";
	/**
	 * @namespace ts.events
	 * @class TSEvent
	 * @constructor
	 * @param {String} type
	 * @param {Object} [init]
	 */
	function TSEvent(type/*,init*/){
		this.type=""+type;
		this.cancelBubble=false;
		this.returnValue=true;
		this.defaultPrevented=false;
		this.timeStamp=Date.now();
		this.cancelable=false;
		this.bubbles=false;
		this.eventPhase=0;
		this.currentTarget=null;
		this.target=null;
		
		var init=arguments[1];
		if(init instanceof Object){
			if("bubbles" in init){this.bubbles=Boolean(init.bubbles);}
			if("cancelable" in init){this.cancelable=Boolean(init.cancelable);}
		}
	}
	/**
	 * Initialize the Event object
	 * @method initEvent
	 * @param {Object} type
	 * @param {Object} [bubbles=false]
	 * @param {Object} [cancelable=false]
	 */
	function initEvent(type,bubbles,cancelable){
		this.type=""+type;
		this.bubbles=!!cancelable;
		this.cancelable=!!cancelable;
	}
	/**
	 * Prevent the Event object act from default behaviour
	 * @method preventDefault
	 */
	function preventDefault(){
		if(this.cancelable){
			this.defaultPrevented=true;
			this.returnValue=false;
		}
	}
	/**
	 * Prevent the Event object act from bubbling
	 * @method stopPropagation
	 */
	function stopPropagation(){
		if(this.bubbles){
			this.cancelBubble=false;
		}
	}
	/**
	 * Prevent the Event object act from bubbling and
	 *  prevent following listeners from called
	 * @method stopPropagation
	 */
	function stopImmediatePropagation(){
		
	}
	InstallFunctions(TSEvent.prototype,0,[
		"initEvent",initEvent,
		"preventDefault",preventDefault,
		"stopPropagation",stopPropagation,
		"stopImmediatePropagation",stopImmediatePropagation
	]);
	SetNativeFlag(TSEvent);
	ImplementInterface(TSEvent,Event);
	return TSEvent;
});
