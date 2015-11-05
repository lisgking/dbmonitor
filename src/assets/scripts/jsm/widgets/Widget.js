define("jsm/widgets/Widget",[
	"jsm/events/EventTarget",
	"jsm/events/Event"
],function(EventTarget,Event){
	function Widget(id,initParams){
		
	}
	function toString(){
		
	}
	ExtendClass(Widget,EventTarget);
	InstallFunctions(Widget.prototype,DONT_DELETE,[
		
	]);
	var installConstants=function(o){
		SetProperties(o,DONT_ENUM|READ_ONLY|DONT_DELETE,[
			"LOADING",0,
			"LOADED",1,
			"INTERACTIVE",2,
			"COMPLETE",3,
			"DESTROYED",4
		]);
	};
	installConstants(Widget.prototype);
	installConstants(Widget);
	SetNativeFlag(Widget);
	return Widget;
});