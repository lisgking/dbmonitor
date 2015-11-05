define([
	"ts/widgets/TSWizardStep",
	"dojo/text!./htm/StepSummary.htm"
],function(TSWizardStep,htm){
	"use strict";
	var __super__=TSWizardStep.prototype;
	"constrcutor";
	function StepSummary(id,initParams){
		__super__.constructor.call(this,id,initParams);
		init.call(this);
	}
	function init(){
		this.title=this.i18n.getMessage("Summary");
		this.caption=this.i18n.getMessage("Summary");
	}
	"exports";
	ExtendClass(StepSummary,TSWizardStep);
	SetProperties(StepSummary.prototype,NONE,[
		"template",htm
	]);
	return StepSummary;
});