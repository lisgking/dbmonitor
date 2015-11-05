define("ts/widgets/TSFlexiGrid",[
	"ts/widgets/TSWidget",
	"jquery/flexigrid",
	"dojo/text!ts/widgets/htm/TSFlexiGrid.htm",
	"dojo/css!ts/widgets/css/TSFlexiGrid.css"
	],function(TSWidget,flexigrid,htm){
		var __super__=TSWidget.prototype;
		function TSFlexiGrid(id,initParams){
			__super__.constructor.call(this,id,initParams);
			init.call(this);
		};
		
		function init(){
			this.addEventListener("DOMNodeInserted",function(){
				console.log(this.constructor.name,"DOMNodeInserted");
			});
			this.addEventListener("DOMNodeInserted",initFlexigrid);
		}
		
		function initFlexigrid(){
			var opts=this.initParams;
			$(this.rootElement).flexigrid({
				url: opts.url,
				dataType: opts.dataType,
				colModel : opts.colModel,
				searchitems : opts.searchitems,
				sortname: opts.sortname,
				sortorder: opts.sortorder,
				usepager: opts.usepager||true,
				title: opts.title,
				useRp: opts.useRp||true,
				rp: opts.rp,
				showTableToggleBtn: opts.showTableToggleBtn||true,
				width: opts.width,
				height: opts.height
			});
			this.removeEventListener("DOMNodeInserted",initFlexigrid);
		}
		ExtendClass(TSFlexiGrid,TSWidget);
		SetProperties(TSFlexiGrid.prototype, DONT_ENUM, [
			'template', htm
			//'i18n', new MessageBundle(json)
		]);
		return TSFlexiGrid;
});