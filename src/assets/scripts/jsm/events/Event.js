define("jsm/events/Event",[],function(){
	function Event(type,eventInit){
		
	}
	function initEvent(type,bubbles,cancelable){
		
	}
	function preventDefault(){
		
	}
	function stopPropagation(){
		
	}
	function stopImmediatePropagation(){
		
	}
	InstallFunctions(Event.prototype,0,[
		"initEvent",initEvent,
		"preventDefault",preventDefault,
		"stopPropagation",stopPropagation,
		"stopImmediatePropagation",stopImmediatePropagation
	]);
	SetNativeFlag(Event);
	return Event;
});
