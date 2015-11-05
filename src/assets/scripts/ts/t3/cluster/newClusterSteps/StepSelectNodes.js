define([
	"ts/widgets/TSWizardStep",
	"ts/util/ItemList",
	"tebe/node/NodeGrid",
	"dojo/text!./htm/StepSelectNodes.htm"
],function(TSWizardStep,ItemList,NodeGrid,htm){
	"use strict";
	var __super__=TSWizardStep.prototype;
	"constrcutor";
	function StepSelectNodes(id,initParams){
		__super__.constructor.call(this,id,initParams);
		defineProperties.call(this);
		addEventListeners.call(this);
		init.call(this);
	}
	function init(){
		this.title=this.i18n.getMessage("Nodes");
		this.caption=this.i18n.getMessage("Select hosts as cluster nodes");
		//this.innerWidget=new NodeGrid();
	}
	function defineProperties(){
		//selectedNodes
		this.__data__.selectedNodes=new ItemList([]);
		InstallGetter(this,"selectedNodes",
			function getSelectedNodes(){
				var l=this.__data__.selectedNodes;
				l.__data__=Array.from(this.nodeGrid.roles.get("tbody").querySelectorAll('input[name="nodeId"]:checked')).map(function(input){
					return this.by("nodeId",input.value);
				},this.nodeGrid.dataRows);
				return l;
			}
		);
	}
	function addEventListeners(){
		this.addEventListener("DOMNodeInserted",function(){
			var grid=new NodeGrid();
			this.nodeGrid=grid;
			this.innerWidget=grid;
			grid.height=105;
		});
	}
	"exports";
	ExtendClass(StepSelectNodes,TSWizardStep);
	SetProperties(StepSelectNodes.prototype,NONE,[
		"template",htm
	]);
	return StepSelectNodes;
});