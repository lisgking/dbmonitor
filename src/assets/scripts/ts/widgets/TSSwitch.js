define("ts/widgets/TSSwitch",
	["ts/widgets/TSWidget",
	 "dojo/text!./htm/TSSwitch.htm",
	 "dojo/css!./css/bootstrap-switch.css",
	 "dojo/nls!./nls/TSSwitch.json",
	 "bootstrap-switch"],
	function (TSWidget,htm,css,json){
	var i18n=TSWidget.prototype.i18n.createBranch(json);
	function TSSwitch(){
		TSWidget.call(this);
		addEventListeners.call(this);
		//init.call(this);
	}
	
	function addEventListeners(){
		this.addEventListener("DOMNodeInserted",function(){
			$(this.rootElement).find("input").bootstrapSwitch("state",false);
		});
	}
	
	ExtendClass(TSSwitch,TSWidget);
	
	SetProperties(TSSwitch.prototype,DONT_ENUM,[
  		"template",htm,
  		"i18n",i18n
  	]);
	
	return TSSwitch;
		
});
