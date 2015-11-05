define([
	"ts/widgets/TSWidget",
	"ts/util/DOMUtils",
	"dojo/text!./htm/ComponentConfig.htm",
	"dojo/css!./css/ComponentConfig.css",
	"jquery"
],function(TSWidget,DOMUtils,htm,css,$){
	var PACKAGE_CATALOG_NAME="packageCatalogName";
	function ComponentConfig(id,props){
		TSWidget.call(this,id,props);
		defineProperties.call(this);
	}
	function defineProperties(){
		this.packageGroupCode="";
		//components
		this.__data__.components=[];
		InstallGetterSetter(this,"components",
			function getComponents(){
				return this.__data__.components;
			},
			function setComponents(v){
				if(!Array.isArray(v)){throw new TypeError(v+" is not a Array");}
				this.__data__.components=v;
				clearComponents.call(this);
				if(v.length===0){return;}
				var title=this.roles.get("title");
				var tablist=this.roles.get("tablist");
				var panellist=this.roles.get("panellist");
				
				v.forEach(function addComponent(comp,index,components){
					tablist.appendChild(createTab.call(this,comp,index,components));
					panellist.appendChild(createTabPanel.call(this,comp,index,components));
				},this);
				function tab_clickHandler(event){
					event.preventDefault();
					var tab=this;
					if(tab.classList.contains("current")){return;}
					
					$(tabs).filter(".current").removeClass("current");
					tab.classList.add("current");
					
					$(panels).filter(".current").removeClass("current");
					tab.ariaControls.classList.add("current");
					
					title.textContent=tab.textContent;
				}
				var tabs=this.roles.getAll("tab");
				var panels=this.roles.getAll("tabpanel");
				tabs.forEach(function(tab,index){
					tab.ariaControls=panels[index];
					tab.addEventListener("click",tab_clickHandler);
				});
				tabs[0].click();
			}
		);
	}
	function clearComponents(){
		var title=this.roles.get("title");
		var tablist=this.roles.get("tablist");
		var panellist=this.roles.get("panellist");
		this.roles.delete("tab");
		this.roles.delete("tabpanel");
		title.textContent="\xA0";
		tablist.innerHTML="";
		panellist.innerHTML="";
	}
	var createElement=DOMUtils.createElement;
	function createTab(comp){
		var name=comp[PACKAGE_CATALOG_NAME];
		var li=createElement("li");
		var a=createElement("a",{
			href:"javascript:;",
			"data-role":"tab",
			textContent:name
		},li);
		this.roles.append("tab",a);
		return li;
	}
	function createTabPanel(comp,index){
		var name=comp[PACKAGE_CATALOG_NAME];
		var div=createElement("div",{
			"data-role":"tabpanel"
		});
		div.textContent=name;
		div.style.height=500+"px";
		this.roles.append("tabpanel",div);
		return div;
	}
	ExtendClass(ComponentConfig,TSWidget);
	SetProperties(ComponentConfig.prototype,DONT_ENUM,[
		"template",htm
	]);
	return ComponentConfig;
});
