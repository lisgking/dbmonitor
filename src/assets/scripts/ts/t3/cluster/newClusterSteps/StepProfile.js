define([
	"ts/widgets/TSWizardStep",
	"ts/widgets/TSFormTest",
	"dojo/text!./htm/StepProfile.htm"
],function(TSWizardStep,TSFormTest,htm){
	"use strict";
	function StepProfile(id,initParams){
		TSWizardStep.call(this,id,initParams);
		//formData
		this.__data__.formData={};
		InstallGetter(this,"formData",function(){
			var data=this.__data__.formData;
			ForEach(this.rootElement.querySelectorAll('[name]'),function(item){
				this[item.name]=item.value;
			},data);
			return data;
		});
		init.call(this);
	}
	function init(){
		this.title=this.i18n.getMessage("Profile");
		this.caption=this.i18n.getMessage("Please input cluster name and description for the new cluster");
	}
	"exports";
	ExtendClass(StepProfile,TSWizardStep);
	SetProperties(StepProfile.prototype,NONE,[
		"template",htm
	]);
	return StepProfile;
});