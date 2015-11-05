define("ts/widgets/Tab",
	["ts/util/TSEventTarget"
	 ],function(TSEventTarget){
	
	function Tab(name,panel){
		this.name=name;
		this.panel=panel;
	}
	
	ExtendClass(Tab,TSEventTarget);
	
	return Tab;
	
});