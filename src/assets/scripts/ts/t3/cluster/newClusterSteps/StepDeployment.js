define([
	"ts/widgets/TSWizardStep",
	"ts/t3/cluster/DeploymentTable",
	"ts/t3/cluster/renderers/GPFSRenderer",
	"ts/t3/cluster/renderers/SymphonyRenderer",
	"dojo/text!./htm/StepDeployment.htm"
],function(TSWizardStep,DeploymentTable,GPFSRenderer,SymphonyRenderer,htm){
	"use strict";
	var __super__=TSWizardStep.prototype;
	"constrcutor";
	function StepDeployment(id,initParams){
		__super__.constructor.call(this,id,initParams);
		init.call(this);
	}
	function init(){
		this.title=this.i18n.getMessage("Deployment");
		this.caption=this.i18n.getMessage("Check components to deploy");
		
		var table=new DeploymentTable();
		table.registerRenderer("GPFS",GPFSRenderer);
		table.registerRenderer("Symphony",SymphonyRenderer);
		
		this.deploymentTable=table;
		this.innerWidget=table;
	}
	"exports";
	ExtendClass(StepDeployment,TSWizardStep);
	SetProperties(StepDeployment.prototype,NONE,[
		"template",htm
	]);
	return StepDeployment;
});