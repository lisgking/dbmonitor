define([
	"ts/widgets/TSWidget",
	"ts/util/ItemList",
	"ts/util/DOMUtils",
	"./ComponentRenderer",
	"../requestEntities"
],function(TSWidget,ItemList,DOMUtils,ComponentRenderer,requestEntities){
	"use strict";
	var PACKAGE_CATALOG_NAME="packageCatalogName";
	var PARTITION_NAME="partitionName";
	var NODE_ID="nodeId";
	var symphonyRoles=new ItemList([
		{text:"Master",value:0},
		{text:"Secondary Master",value:1},
		{text:"Compute",value:2,isDefault:true}
	]);
	//--------------------------------
	// SymphonyRenderer
	//--------------------------------
	var createElement=DOMUtils.createElement;
	var __super__=ComponentRenderer.prototype;
	function SymphonyRenderer(comp,nodes,thead,tbody){
		__super__.constructor.call(this,comp,nodes,thead,tbody);
		defineProperties.call(this);
		this.renderHead(thead);
		this.renderBody(tbody);
		this.buildCascadingCheckbox(this.roles.get("mastercheckbox"),this.roles.getAll("slavecheckbox"));
		addEventListeners.call(this);
	}
	function defineProperties(){
		//roleSelects
		this.roleSelects=[];
		//selectedNodes
		this.__data__.selectedNodes=new ItemList([]);
		InstallGetter(this,"selectedNodes",
			function getSelectedNodes(){
				var sNodes=this.__data__.selectedNodes.__data__=[];
				this.roles.getAll("slavecheckbox").forEach(function getNodeByCheckbox(input,index){
					if(!input.checked){return;}
					var node=this.nodes.by(NODE_ID,input.value);
					var sNode=ExtendObject(new requestEntities.Node(),node,DONT_EXTEND);
					sNode.nodeRole=this.roleSelects[index].value>>>0;
					sNode["disks"]=[];
					sNode["external"]=[];
					sNodes.push(sNode);
				},this);
				return this.__data__.selectedNodes;
			}
		);
		//masterNode
		this.__data__.masterNode=null;
		InstallGetter(this,"masterNode",
			function getMasterNode(){
				return this.selectedNodes.by("nodeRole",0);
			}
		);
		//secondaryMasterNode
		this.__data__.secondaryMasterNode=null;
		InstallGetter(this,"secondaryMasterNode",
			function getSecondaryMasterNode(){
				return this.selectedNodes.by("nodeRole",1);
			}
		);
		//computeNodes
		this.__data__.computeNodes=new ItemList([]);
		InstallGetter(this,"computeNodes",
			function getComputeNodes(){
				this.__data__.computeNodes.__data__=this.selectedNodes.filter(function(node){
					return node.nodeRole===2;
				});
				return this.__data__.computeNodes;
			}
		);
		//componentData
		this.__data__.componentData=null;
		InstallGetter(this,"componentData",
			function getComponentData(){
				var sComponent=ExtendObject(new requestEntities.Component(),this.component,DONT_EXTEND);
				sComponent.nodes=this.selectedNodes;
				sComponent.options=this.component.options.map(function(option){
					var sOption=ExtendObject(new requestEntities.Option(),option,DONT_EXTEND);
					return sOption;
				});
				return sComponent;
			}
		);
	}
	function addEventListeners(){
		var role_changeHandler=function(event){
			this.setAttribute("data-value",this.value);
		};
		this.roleSelects.forEach(function(select){
			select.addEventListener("change",role_changeHandler);
		});
	}
	function renderHead(thead){
		__super__.renderHead.call(this,thead);
	}
	function renderBody(tbody){
		__super__.renderBody.call(this,tbody,renderCellContent);
	}
	function renderCellContent(td,node){
		var select=createElement("select",{
			"class":"-ts-roleselect",
			"data-role":"roleselect"
		},td);
		symphonyRoles.toArray().forEach(function(role,index){
			select.options.add(new Option(role.text,role.value));
			if(role.isDefault){select.selectedIndex=index;}
		},this);
		this.roleSelects.push(select);
	}
	ExtendClass(SymphonyRenderer,ComponentRenderer);
	InstallFunctions(SymphonyRenderer.prototype,NONE,[
		"renderHead",renderHead,
		"renderBody",renderBody
	]);
	SetNativeFlag(SymphonyRenderer);
	return SymphonyRenderer;
});