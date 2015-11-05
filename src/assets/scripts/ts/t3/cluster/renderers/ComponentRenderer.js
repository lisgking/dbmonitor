define([
	"ts/util/TSEventTarget",
	"jsm/util/RoleMap",
	"ts/util/DOMUtils",
	"ts/util/ItemList",
	"ts/util/CascadingCheckboxGroup"
],function(TSEventTarget,RoleMap,DOMUtils,ItemList,CascadingCheckboxGroup){
	"use strict";
	var PACKAGE_CATALOG_NAME="packageCatalogName";
	var PARTITION_NAME="partitionName";
	var NODE_ID="nodeId";
	//--------------------------------
	// ComponentRenderer
	//--------------------------------
	var createElement=DOMUtils.createElement;
	/**
	 * @param {Object} component
	 * @param {Object} nodes
	 * @param {HTMLTableSectionElement} thead
	 * @param {HTMLTableSectionElement} tbody
	 */
	function ComponentRenderer(component,dataNodes,thead,tbody){
		TSEventTarget.call(this);
		var roles=new RoleMap();
		roles.append("thead",thead);
		roles.append("tbody",tbody);
		/*
		this.ownRoles={
			thead:[],
			tbody:[],
			mastercheckbox:[],
			slavecheckbox:[],
			checkingstatus:[],
		};
		*/
		var nodes=new ItemList(dataNodes);
		ExtendObject(this,{
			component:component,
			nodes:nodes,
			roles:roles
		});
		defineProperties.call(this);
	}
	function defineProperties(){
		
	}
	function renderHead(thead,extraFunction){
		var tr=thead.rows[0];
		var th=createElement("th",{
			abbr:this.component[PACKAGE_CATALOG_NAME]
		},tr);
		renderHeaderContent.call(this,th);
		if(extraFunction)extraFunction.call(this,th);
	}
	function renderHeaderContent(th){
		var label=createElement("label",null,th);
		var input=createElement("input",{
			type:"checkbox",
			"data-role":"mastercheckbox"
		},label);
		this.roles.append("mastercheckbox",input);
		label.appendChild(document.createTextNode(this.component[PACKAGE_CATALOG_NAME]));
		var span=createElement("span",{
			"data-role":"checkingstatus",
			textContent:"(0/0)"
		},th);
		this.roles.append("checkingstatus",span);
	}
	function renderBody(tbody,extraFunction){
		this.nodes.toArray().forEach(function(node,index){
			var tr=tbody.rows[index];
			var td=createElement("td",null,tr);
			td.axis=this.component[PACKAGE_CATALOG_NAME];
			renderCellContent.call(this,td,node);
			if(extraFunction)extraFunction.call(this,td,node);
		},this);
	}
	function renderCellContent(td,node){
		var input=createElement("input",{
			type:"checkbox",
			name:this.component[PACKAGE_CATALOG_NAME],
			value:node[NODE_ID],
			"data-role":"slavecheckbox"
		},td);
		this.roles.append("slavecheckbox",input);
	}
	function buildCascadingCheckbox(master,slaves){
		var group=new CascadingCheckboxGroup(master,slaves);
		var that=this;
		group.master.addEventListener("slavechange",function(event){
			var detail=event.detail;
			setCheckingStatus.call(that,detail.checkedCount,detail.totalCount);
		});
		setCheckingStatus.call(this,0,slaves.length);
	}
	function setCheckingStatus(count,total){
		var status=this.roles.get("checkingstatus");
		status.setAttribute("data-count",count);
		status.setAttribute("data-total",total);
		status.textContent=FormatMessage("($1/$2)",count,total);
	}
	ExtendClass(ComponentRenderer,TSEventTarget);
	InstallFunctions(ComponentRenderer.prototype,NONE,[
		"buildCascadingCheckbox",buildCascadingCheckbox,
		"renderHead",renderHead,
		"renderBody",renderBody
	]);
	return ComponentRenderer;
});