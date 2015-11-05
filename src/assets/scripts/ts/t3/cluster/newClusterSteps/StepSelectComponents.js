define([
	"ts/widgets/TSWizardStep",
	"ts/events/TSEvent",
	"ts/util/ItemList",
	"tebe/cluster/SoftwareGrid",
	"dojo/text!./htm/StepSelectComponents.htm"
],function(TSWizardStep,TSEvent,ItemList,SoftwareGrid,htm){
	"use strict";
	var __super__=TSWizardStep.prototype;
	"constrcutor";
	function StepSelectComponents(id,initParams){
		__super__.constructor.call(this,id,initParams);
		defineProperties.call(this);
		addEventListeners.call(this);
		InstallEvents(this,["packagechange"]);
		init.call(this);
	}
	function init(){
		this.title=this.i18n.getMessage("Components");
		this.caption=this.i18n.getMessage("Select a software package");
		//this.innerWidget=new SoftwareGrid();        //do this after DOMNodeInserted
	}
	function defineProperties(){
		//packageSource
		this.__data__.packageSource="";
		InstallGetterSetter(this,"packageSource",
			function getPackageSource(){
				return this.__data__.packageSource;
			},
			function setPackageSource(v){
				this.__data__.packageSource=v;
				$.ajax(v,{
					async:false,
					dataType:"json",
					context:this,
					success:function(data){
						this.packages=data;
					}
				});
			}
		);
		//packages
		this.__data__.packages=[];
		InstallGetterSetter(this,"packages",
			function getPackages(){
				return this.__data__.packages;
			},
			function setPackages(v){
				if(!Array.isArray(v)){throw new TypeError(v+" is not a Array");}
				this.__data__.packages=v;
				//clear options
				var select=this.roles.get("packageselect");
				Array.prototype.slice.call(select.options).forEach(function(option){
					select.removeChild(option);
				});
				//add options
				v.forEach(function(pack){
					var optgroup=this.roles.get("type"+pack["packageGroupType"]);
					if(optgroup){
						var option=new Option(pack["packageGroupName"],pack["packageGroupCode"]);
						option.title=pack["packageGroupDesc"];
						optgroup.appendChild(option);
					}
				},this);
			}
		);
		//selectedPackage
		InstallGetter(this,"selectedPackage",function(){
			var code=this.roles.get("packageselect").value;
			if(!code){return null;}
			return this.__data__.packages.find(function(p){
				return p["packageGroupCode"]===code;
			})||null;
		});
		//dataSource
		this.__data__.dataSource="";
		InstallGetterSetter(this,"dataSource",
			function getDataSource(){
				return this.__data__.dataSource;
			},
			function setDataSource(v){
				this.__data__.dataSource=v;
				doLoad.call(this);
			}
		);
		//selectedComponents
		this.__data__.selectedComponents=new ItemList([]);
		InstallGetter(this,"selectedComponents",
			function getSelectedComponents(){
				var l=this.__data__.selectedComponents;
				l.__data__=Array.from(this.componentGrid.roles.get("tbody").querySelectorAll('input[name="packageVersionCode"]:checked')).map(function(input){
					return this.by("packageVersionCode",input.value);
				},this.componentGrid.dataRows);
				return l;
			}
		);
	}
	function addEventListeners(){
		this.addEventListener("DOMNodeInserted",function(){
			var grid=new SoftwareGrid();
			this.componentGrid=grid;
			this.innerWidget=grid;
			grid.height=105;
		});
		var that=this;
		var select=this.roles.get("packageselect");
		select.addEventListener("change",function(){
			that.dataSource=that.dataSource;
			this.disabled=true;
			setTimeout(function(){select.disabled=false;},200);
		});
	}
	function doLoad(){
		var pack=this.selectedPackage;
		if(!pack){throw new TypeError("Package not found");}
		var url=this.dataSource;
		url+=(url.indexOf("?")===-1)?"?":"&";
		url+="packageGroupCode="+encodeURIComponent(pack.packageGroupCode);
		this.componentGrid.dataSource=url;
	}
	"exports";
	ExtendClass(StepSelectComponents,TSWizardStep);
	SetProperties(StepSelectComponents.prototype,NONE,[
		"template",htm
	]);
	return StepSelectComponents;
});