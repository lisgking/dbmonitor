define("ts/widgets/JqueryTabs",[
	"ts/widgets/TSJQueryUI",
	"jqueryui/ui/jquery.ui.tabs",
	"dojo/text!ts/widgets/htm/JqueryTabs.htm",
	],function(TSJQueryUI,tabs,htm,all,demos){
		var __super__=TSJQueryUI.prototype;
		function JqueryTabs(id,initParams){
			__super__.constructor.call(this,id,initParams);
			this.selectedIndex=0;
			init.call(this);
		}
		function init(){
			this.addEventListener("DOMNodeInserted",function(){
				$(this.rootElement).tabs();
			});
		}
		ExtendClass(JqueryTabs,TSJQueryUI);
		SetProperties(JqueryTabs.prototype,DONT_ENUM,[
      		"template",htm
      		//"i18n",new MessageBundle(json,__super__.i18n)
      	]);
		return JqueryTabs;
});