define("jsm/events/EventTarget",[],function(){
	function EventTarget(){
		
	}
	function addEventListener(type,handler,useCapture){
		
	}
	function removeEventListener(type,handler){
		
	}
	function dispatchEvent(event){
		
	}
	function oneEvent(name, event){
		
	}
	InstallFunctions(EventTarget.prototype,0,[
		"addEventListener",addEventListener,
		"removeEventListener",removeEventListener,
		"dispatchEvent",dispatchEvent,
		"oneEvent",oneEvent
	]);
	SetNativeFlag(EventTarget);
	return EventTarget;
});
