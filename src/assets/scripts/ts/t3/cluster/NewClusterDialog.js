define("ts/t3/cluster/NewClusterDialog",[
	"ts/widgets/TSSteppedDialog",
	"ts/events/TSEvent",
	"./newClusterSteps/StepIntroduction",
	"./newClusterSteps/StepProfile",
	"./newClusterSteps/StepSelectNodes",
	"./newClusterSteps/StepSelectComponents",
	"./newClusterSteps/StepDeployment",
	"./newClusterSteps/StepConfiguration",
	"./newClusterSteps/StepSummary"
],function(TSSteppedDialog,TSEvent,
	StepIntroduction,
	StepProfile,
	StepSelectNodes,
	StepSelectComponents,
	StepDeployment,
	StepConfiguration,
	StepSummary
){
	"use strict";
	var __super__=TSSteppedDialog.prototype;
	"constrcutor";
	function NewClusterDialog(){
		__super__.constructor.call(this);
		defineProperties.call(this);
		addEventListeners.call(this);
		init.call(this);
	}
	function init(){
		this.add(new StepIntroduction());
		this.add(new StepProfile());
		this.add(new StepSelectNodes());
		this.add(new StepSelectComponents());
		this.add(new StepConfiguration());
		this.add(new StepDeployment());
		this.add(new StepSummary());
	}
	function defineProperties(){
		//dataset
		this.dataset={
			nodesrc:"",
			packagesrc:"",
			componentsrc:"",
			minNodesLength:1,
			minComponentsLength:1
		};
	}
	function addEventListeners(){
		var that=this;
		this.roles.get("submit").addEventListener("click",function(event){
			that.dispatchEvent(new TSEvent("submit"));
		});
		this.addEventListener("beforechange",function(event){
			if(event.oldIndex<event.newIndex){
				return wizard_nextHandler.call(this,event);
			}else{
				return wizard_prevHandler.call(this,event);
			}
		});
		this.addEventListener("beforeclose",function(event){
			if(this.selectedIndex>0){
				return confirm("Are you sure you want to quit?");
			}
		});
		this.addEventListener("submit",function(event){
			if(Math.random()>0.5){//XXX
				alert("Task submitted, see tasks for details");
			}else{
				alert("Failed to create the cluster");
			}
		});
		function wizard_prevHandler(event){
			
		}
		function wizard_nextHandler(event){
			var oldIndex=event.oldIndex;
			
			var stepComponents=this.step("StepSelectComponents");
			if(oldIndex===0){
				//load packages
				var packagesrc=this.dataset.packagesrc;
				if(!packagesrc){
					throw new URIError(FormatMessage("Invalid data source URL: '$1'",packagesrc));
				}
				if(!stepComponents.packages.length){  //component package list not loaded
					stepComponents.packageSource=packagesrc;
				}
			}else if(oldIndex===1){
				//load nodes
				var stepNodes=this.step("StepSelectNodes");
				if(!stepNodes.nodeGrid.dataSource){
					var nodesrc=this.dataset.nodesrc;
					if(!nodesrc){
						throw new URIError(FormatMessage("Invalid data source URL: '$1'",nodesrc));
					}
					stepNodes.nodeGrid.load(nodesrc);
				}
			}else if(oldIndex===2){
				//get selected nodes and validate
				var sNodes=this.step("StepSelectNodes").selectedNodes;
				var minlength=this.dataset.minNodesLength;
				if(sNodes.length<minlength){ //not enough nodes selected
					alert(FormatMessage("Please select at least $1 node(s)",minlength));
					return false;
				}
				var stepDeployment=this.step("StepDeployment");
				stepDeployment.deploymentTable.nodes=sNodes.toArray();
				//load components
				if(!stepComponents.dataSource){
					var componentsrc=this.dataset.componentsrc;
					if(!componentsrc){
						throw new URIError(FormatMessage("Invalid data source URL: '$1'",componentsrc));
					}
					stepComponents.dataSource=componentsrc;
				}
			}else if(event.oldIndex===3){
				//get selected components
				var minlength=this.dataset.minComponentsLength;
				if(stepComponents.selectedComponents.length<minlength){ //not enough components selected
					alert(FormatMessage("Please select at least $1 component(s)",minlength));
					return false;
				}
				//initialize configuration pane
				var pane=this.step("StepConfiguration").configPane;
				var code=stepComponents.selectedPackage.packageGroupCode;
				if(pane.packageGroupCode!==code){         //component package changed
					pane.packageGroupCode=code;
					pane.components=stepComponents.componentGrid.dataRows.toArray();
				}
			}else if(event.oldIndex===4){
				//initialize deployment table
				this.step("StepDeployment").deploymentTable.components=stepComponents.selectedComponents.toArray();
			}else{
				//get checked components data
				console.log(JSON.stringify(this.step("StepDeployment").deploymentTable.selectedComponents));
			}
		}
	}
	"exports";
	ExtendClass(NewClusterDialog,TSSteppedDialog);
	InstallFunctions(NewClusterDialog.prototype,NONE,[
		
	]);
	return NewClusterDialog;
});