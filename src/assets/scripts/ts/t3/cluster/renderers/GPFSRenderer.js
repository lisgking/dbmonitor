define([
	"ts/widgets/TSWidget",
	"ts/util/ItemList",
	"ts/util/DOMUtils",
	"ts/util/CascadingCheckboxGroup",
	"./ComponentRenderer",
	"../requestEntities"
],function(TSWidget,ItemList,DOMUtils,CascadingCheckboxGroup,ComponentRenderer,requestEntities){
	"use strict";
	var PACKAGE_CATALOG_NAME="packageCatalogName";
	var PARTITION_NAME="partitionName";
	var NODE_ID="nodeId";
	var EXTERNAL_DISK=1,
		INTERNAL_DISK=0;
	var gpfsDiskTypes=new ItemList([
		{text:"Internal",value:0,dataField:"disks"},
		{text:"External",value:1,dataField:"external",isDefault:true}
	]);
	//--------------------------------
	// GPFSRenderer
	//--------------------------------
	var createElement=DOMUtils.createElement;
	var __super__=ComponentRenderer.prototype;
	function GPFSRenderer(comp,nodes,thead,tbody){
		__super__.constructor.call(this,comp,nodes,thead,tbody);
		defineProperties.call(this);
		this.renderHead(thead);
		this.renderBody(tbody);
		this.buildCascadingCheckbox(this.roles.get("mastercheckbox"),this.roles.getAll("slavecheckbox"));
	}
	function defineProperties(){
		//diskSelects
		this.diskSelects=[];
		//selectedNodes
		this.__data__.diskType=null;
		InstallGetter(this,"diskType",
			function getDiskType(){
				var value=this.roles.get("disktypeselect").value>>>0;
				return gpfsDiskTypes.by("value",value);
			}
		);
		//selectedNodes
		this.__data__.selectedNodes=new ItemList([]);
		InstallGetter(this,"selectedNodes",
			function getSelectedNodes(){
				var sNodes=[];
				var diskType=this.diskType;
				this.roles.getAll("slavecheckbox").forEach(function(input,index){
					if(!input.checked){return;}
					var node=this.nodes.by(NODE_ID,input.value);
					var sNode=ExtendObject(new requestEntities.Node(),node,DONT_EXTEND);
					gpfsDiskTypes.toArray().forEach(function(type){sNode[type.dataField]=[];});
					sNode[diskType.dataField]=this.diskSelects[index].selectedDisks;
					sNodes.push(sNode);
				},this);
				this.__data__.selectedNodes.__data__=sNodes;
				return this.__data__.selectedNodes;
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
				sComponent.diskType=this.diskType.value;
				return sComponent;
			}
		);
	}
	function renderHead(thead){
		__super__.renderHead.call(this,thead,renderHeaderContent);
	}
	function renderHeaderContent(th){
		var that=this;
		var select=createElement("select",null,th);
		gpfsDiskTypes.toArray().forEach(function(type,index){
			select.options.add(new Option(type.text,type.value));
			if(type.isDefault)select.selectedIndex=index;
		});
		select.addEventListener("change",function(){
			var type=gpfsDiskTypes.by("value",this.value>>>0);
			switchDiskType.call(that,type);
		});
		this.roles.append("disktypeselect",select);
	}
	function switchDiskType(type){
		this.diskSelects.forEach(function(select,index){
			var node=this.nodes.item(index);
			select.options=node[type.dataField];
		},this);
	}
	function renderBody(tbody){
		__super__.renderBody.call(this,tbody,renderCellContent);
		switchDiskType.call(this,gpfsDiskTypes.by("isDefault",true));
	}
	function renderCellContent(td,node){
		var select=new DiskSelect();
		td.appendChild(select.rootElement);
		this.diskSelects.push(select);
		//...TODO more
	}
	ExtendClass(GPFSRenderer,ComponentRenderer);
	InstallFunctions(GPFSRenderer.prototype,NONE,[
		"renderHead",renderHead,
		"renderBody",renderBody
	]);
	//--------------------------------
	// DiskSelect
	//--------------------------------
	function DiskSelect(id,initParams){
		TSWidget.prototype.constructor.call(this,id,initParams);
		defineProperties.call(this);
		function defineProperties(){
			//options
			this.__data__.options=new ItemList([]);
			InstallGetterSetter(this,"options",
				function getOptions(){
					return this.__data__.options;
				},
				function setOptions(v){
					this.__data__.options.__data__=v;
					renderOptions.call(this,v);
				}
			);
			//selectedDisks
			this.__data__.selectedDisks=new ItemList([]);
			InstallGetter(this,"selectedDisks",
				function getSelectedOptions(){
					var names=querySelectedNames.call(this);
					this.__data__.selectedDisks.__data__=names.map(function(name){
						var disk=this.by(PARTITION_NAME,name);
						var sDisk=new requestEntities.Disk();
						sDisk.partitionName=disk.partitionName;
						return sDisk;
					},this.options);
					return this.__data__.selectedDisks;
				}
			);
		}
	}
	function renderOptions(options){
		//渲染磁盘列表
		var ul=this.roles.get("disklist");
		ul.innerHTML="";
		if(options.length){
			this.roles.delete("slavecheckbox");
			options.forEach(function(item){
				var li=createElement("li",null,ul);
				var label=createElement("label",null,li);
				var input=createElement("input",{
					type:"checkbox",
					name:PARTITION_NAME,
					value:item[PARTITION_NAME]
				},label);
				label.appendChild(document.createTextNode(item[PARTITION_NAME]));
				this.roles.append("slavecheckbox",input);
			},this);
			var group=new CascadingCheckboxGroup(
				createElement("input",{type:"checkbox"}),
				this.roles.getAll("slavecheckbox")
			);
			var that=this;
			group.master.addEventListener("slavechange",function(event){
				var detail=event.detail;
				setCheckingStatus.call(that,detail.checkedCount,detail.totalCount);
			});
		}
		setCheckingStatus.call(this,0,options.length);
	}
	function querySelectedNames(){
		//返回选中的磁盘磁盘名称列表
		var names=[];
		ForEach(this.roles.get("disklist").querySelectorAll('input[type="checkbox"]'),function(input){
			if(input.checked){names.push(input.value);}
		});
		return names;
	}
	function setCheckingStatus(count,total){
		var stat=this.roles.get("selectionstatus");
		stat.setAttribute("data-count",count);
		stat.setAttribute("data-total",total);
		stat.textContent=FormatMessage("($1/$2)",count,total);
	}
	ExtendClass(DiskSelect,TSWidget);
	DiskSelect.prototype.template=
	'<div class="-ts-diskselect" data-role="diskselect">\
		<a href="javascript:;" data-role="label">Disks</a>\
		<span data-role="selectionstatus" data-count="0" data-total="0">(0/0)</span>\
		<ul data-role="disklist"></ul>\
	</div>';
	SetNativeFlag(DiskSelect);
	return GPFSRenderer;
});