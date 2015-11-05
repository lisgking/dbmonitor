define("ts/util/TSEventTarget",[
	"jsm/events/EventTarget",
	"jsm/util/Map"
],function(EventTarget,Map){
	"use strict";
	function Listener(target,type,handler,useCapture){
		this.target=target;
		this.type=type;
		this.handler=handler;
		this.useCapture=!!useCapture;
	}
	InstallFunctions(Listener.prototype,DONT_ENUM,[
		"equals",function equals(that){
			return that&&this.target===that.target&&
			this.type===that.type&&
			this.handler===that.handler&&
			this.useCapture===that.useCapture;
		}
	]);
	function ListenerArray(){
		this.length=0;
	}
	InstallFunctions(ListenerArray.prototype,DONT_ENUM,[
		"queryAll",function queryAll(target,type){
			var r=[],o;
			for(var i=0;i<this.length;i+=1){
				o=this[i];
				if(o.target===target&&o.type===type){
					r.push(o);
				}
			}
			var ret=new ListenerArray();
			Array.prototype.push.apply(ret,r);
			return ret;
		},
		"findIndexBy",function findIndexBy(target,type,handler,useCapture){
			var o;
			for(var i=0;i<this.length;i+=1){
				o=this[i];
				if(o.target===target&&o.type===type&&o.handler===handler&&o.useCapture===useCapture){
					return i;
				}
			}
			return -1;
		},
		"addBy",function addBy(target,type,handler,useCapture){
			var index=this.findIndexBy(target,type,handler,useCapture);
			if(index===-1){
				Array.prototype.push.call(this,new Listener(target,type,handler,useCapture));
			}
		},
		"removeBy",function removeBy(target,type,handler,useCapture){
			var index=this.findIndexBy(target,type,handler,useCapture);
			if(index!==-1){
				Array.prototype.splice.call(this,index,1);
			}
		}
	]);
	var ThrowErrorLater=function(e){
		if("stack" in e){console.log(e.stack);}
		setTimeout(function(){throw e;},0);
	};
	//var et_map=new Map();
	var et_list=new ListenerArray();
	var AddEventListener=function(target,type,handler,useCapture){
		ListenerArray.prototype.addBy.apply(et_list,arguments);
	};
	var RemoveEventListener=function(target,type,handler,useCapture){
		ListenerArray.prototype.removeBy.apply(et_list,arguments);
	};
	var DispatchEvent=function(target,event){
		var listeners=ListenerArray.prototype.queryAll.call(et_list,target,event.type);
		var rv=true;
		if(!listeners||listeners.length===0){return rv;}
		Array.prototype.forEach.call(listeners,function(listener){
			try{
				if(listener.handler.call(target,event)===false||event.returnValue===false){
					rv=false;
				}
			}catch(e){
				ThrowErrorLater(e);
			}
		});
		return rv;
	};
	var DispatchOneEvent=function(target, name){
		 if (!target.listeners)
             return;
         if (target.listeners[name]) {
             for (var i = 0 ; i < target.listeners[name].length; i++) {
            	 target.listeners[name][i].call(target);
             }
             target.listeners[name] = [];
         }
	}
	
	//--------------------------------
	// TSEventTarget
	//--------------------------------
	/**
	 * @namespace ts.util
	 * @class TSEventTarget
	 * @constructor
	 */
	function TSEventTarget(){
		SetProperty(this,DONT_ENUM,"__data__",Object.create(null));
	}
	/**
	 * 
	 * @method addEventListener
	 * @param {String} type
	 * @param {Function} handler
	 * @param {Boolean} [useCapture=false]
	 */
	function addEventListener(type,handler/*,useCapture*/){
		if(!(this instanceof TSEventTarget)){
			throw new TypeError("EventTarget.prototype.addEventListener called on non-EventTarget");
		}
		if(typeof handler!=="function"){return;}
		AddEventListener(this,""+type,handler,!!arguments[2]);
	}
	/**
	 * 
	 * @method removeEventListener
	 * @param {String} type
	 * @param {Function} handler
	 * @param {Boolean} [useCapture=false]
	 */
	function removeEventListener(type,handler/*,useCapture*/){
		if(typeof handler!=="function"){return;}
		RemoveEventListener(this,""+type,handler,!!arguments[2]);
	}
	/**
	 * 
	 * @method dispatchEvent
	 * @param {TSEvent} event
	 * @return {Boolean} returnValue
	 */
	function dispatchEvent(event){
		if(arguments.length===0){
			throw new TypeError("Failed to execute 'dispatchEvent' on 'EventTarget': 1 argument required, but only 0 present.");
		}else if(!(event&&event.type)){
			throw new Error("An attempt was made to use an object that is not, or is no longer, usable.");
		}
		var Val = DispatchEvent(this,event);
		DispatchOneEvent(this, event.type)
		return Val;
	}
	/**
	 * 
	 * @method oneEvent
	 * this event will dispatch once, like jQuery.one
	 * 
	 */
	function oneEvent(name, event) {
        if (!this.listeners)
            this.listeners = {};
        if (this.listeners[name])
            this.listeners[name].push(event);
        else
            this.listeners[name] = [event];
    }
	InstallFunctions(TSEventTarget.prototype,0,[
		"addEventListener",addEventListener,
		"removeEventListener",removeEventListener,
		"dispatchEvent",dispatchEvent,
		"oneEvent",oneEvent
	]);
	TSEventTarget.registry=et_list;
	
	SetNativeFlag(TSEventTarget);
	ImplementInterface(TSEventTarget,EventTarget);
	return TSEventTarget;
});
