define("jsm/events/MessageEvent",["jsm/events/Event"],function(Event){
	function MessageEvent(type,eventInit){
		
	}
	function initMessageEvent(type,bubbles,cancelable,source,lastEventId,data,origin){
		
	}
	ExtendClass(MessageEvent,Event);
	InstallFunctions(MessageEvent.prototype,DONT_DELETE,[
		"initMessageEvent",initMessageEvent
	]);
	SetNativeFlag(MessageEvent);
	return MessageEvent;
});