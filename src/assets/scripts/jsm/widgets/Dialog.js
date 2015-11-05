define("jsm/widgets/Dialog",[
	"jsm/widgets/Widget"
],function(Widget){
	function Dialog(id,initParams){
		
	}
	function open(){
		
	}
	function close(){
		
	}
	ExtendClass(Dialog,Widget);
	InstallFunctions(Dialog.prototype,DONT_DELETE,[
		"open",open,
		"close",close
	]);
	SetNativeFlag(Dialog);
	return Dialog;
});