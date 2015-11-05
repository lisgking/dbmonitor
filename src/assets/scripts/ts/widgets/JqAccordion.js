define("ts/widgets/JqAccordion",[
	"ts/widgets/TSJQueryUI",
	"jqueryui/ui/jquery.ui.accordion",
	"dojo/text!ts/widgets/htm/JqAccordion.htm"
	],function(TSJQueryUI,accordion,htm){
		var __super__=TSJQueryUI.prototype;
		function JqAccordion(id,initParams){
			__super__.constructor.call(this,id,initParams);
			init.call(this);
			
		}
		function init(){
			this.addEventListener("DOMNodeInserted",function(){
				$(this.rootElement).accordion({
					heightStyle:"auto",
					widthStyle:200
				});
			});
		}
		ExtendClass(JqAccordion,TSJQueryUI);
		SetProperties(JqAccordion.prototype,DONT_ENUM,[
		    "template",htm
		]);
		return JqAccordion;
	
});