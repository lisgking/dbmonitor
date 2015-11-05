define([
	"ts/widgets/TSWizardStep",
	"dojo/text!./htm/StepIntroduction.htm"
],function(TSWizardStep,htm){
	"use strict";
	var __super__=TSWizardStep.prototype;
	"constrcutor";
	function StepIntroduction(id,initParams){
		__super__.constructor.call(this,id,initParams);
		init.call(this);
	}
	function init(){
		this.title=this.i18n.getMessage("Introduction");
		this.caption=this.i18n.getMessage("Introduction");
	}
	"exports";
	ExtendClass(StepIntroduction,TSWizardStep);
	SetProperties(StepIntroduction.prototype,NONE,[
		"template",htm
	]);
	return StepIntroduction;
});