define("ts/widgets/TSWizardStep",[
	"./TSWidget",
	"dojo/text!./htm/TSWizardStep.htm"
],function(TSWidget,htm){
	"use strict";
	function TSWizardStep(id,initParams){
		TSWidget.call(this,id,initParams);
		init.call(this);
	}
	function init(){
		//title
		this.__data__.title="";
		InstallGetterSetter(this,"title",function(){
			return this.__data__.title;
		},function(v){
			this.__data__.title=v;
		});
		//caption
		InstallGetterSetter(this,"caption",function(){
			return this.roles.get("caption").textContent;
		},function(v){
			this.roles.get("caption").textContent=v;
		});
		//innerWidget
		InstallGetterSetter(this,"innerWidget",function(){
			return this.children.item(0);
		},function(v){
			if(!(v instanceof TSWidget)){
				throw new TypeError(v&&v.toString()+" is not a TSWidget");
			}
			v.placeAt(this.roles.get("content"),"afterBegin");
		});
	}
	"exports";
	ExtendClass(TSWizardStep,TSWidget);
	SetProperties(TSWizardStep.prototype,DONT_ENUM,[
		"template",htm
	]);
	return TSWizardStep;
});