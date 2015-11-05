define([
	"ts/widgets/TSWizardStep",
	"ts/t3/cluster/ComponentConfig",
	"dojo/text!./htm/StepConfiguration.htm"
],function(TSWizardStep,ComponentConfig,htm){
	"use strict";
	"constrcutor";
	function StepConfiguration(id,initParams){
		TSWizardStep.call(this,id,initParams);
		init.call(this);
	}
	function init(){
		this.title=this.i18n.getMessage("Configurations");
		this.caption=this.i18n.getMessage("Configure components");
		this.configPane=new ComponentConfig();
		this.innerWidget=this.configPane;
	}
	"exports";
	ExtendClass(StepConfiguration,TSWizardStep);
	SetProperties(StepConfiguration.prototype,NONE,[
		"template",htm
	]);
	return StepConfiguration;
});