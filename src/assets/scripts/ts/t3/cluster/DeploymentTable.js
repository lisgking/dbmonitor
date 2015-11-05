define("ts/t3/cluster/DeploymentTable",[
	"ts/widgets/TSWidget",
	"tebe/node/NodeGrid",
	"ts/util/DOMUtils",
	"ts/util/ItemList",
	"dojo/text!./htm/DeploymentTable.htm",
	"dojo/css!./css/DeploymentTable.css"
],function(TSWidget,NodeGrid,DOMUtils,ItemList,htm,css){
	"use strict";
	var __super__=TSWidget.prototype;
	"constrcutor";
	function DeploymentTable(id,initParams){
		__super__.constructor.call(this,id,initParams);
		init.call(this);
	}
	"private";
	function init(){
		defineProperties.call(this);
	}
	function defineProperties(){
		//nodes
		this.__data__.nodes=[];
		InstallGetterSetter(this,"nodes",
			function getNodes(){
				return this.__data__.nodes;
			},
			function setNodes(v){
				this.__data__.nodes=v;
				clearNodes.call(this);
				v.forEach(addNode,this);
			}
		);
		//components
		this.__data__.components=[];
		InstallGetterSetter(this,"components",
			function getComponents(){
				return this.__data__.components;
			},
			function setComponents(v){
				this.__data__.components=v;
				this.columnAPIs.length=0;
				clearComponents.call(this);
				v.forEach(addComponent,this);
				restoreUserData.call(this);
			}
		);
		//selectedComponents
		this.__data__.selectedComponents=new ItemList([]);
		InstallGetter(this,"selectedComponents",
			function getSelectedComponents(){
				var sComponents=[];
				this.columnAPIs.forEach(function(columnAPI){
					var sComponent=columnAPI.componentData;
					if(sComponent.nodes.length){
						sComponents.push(sComponent);
					}
				});
				this.__data__.selectedComponents.__data__=sComponents;
				return this.__data__.selectedComponents;
			}
		);
		//renderers
		this.renderers={};
		//columnAPIs
		this.columnAPIs=[];
		var ITEM_KEY="deployState";
		//userData
		this.__data__.userData=null;
		InstallGetterSetter(this,"userData",
			function getUserData(){
				var data=localStorage.getItem(ITEM_KEY);
				try{data=JSON.parse(data);}catch(e){return;}
				return data;
			},
			function setUserData(v){
				if(v===null||v===undefined){
					localStorage.removeItem(ITEM_KEY);
				}else{
					localStorage.setItem(ITEM_KEY,JSON.stringify(v));
				}
			}
		);
	}
	var createElement=DOMUtils.createElement;
	function clearNodes(){
		//删除所有节点行，删除所有组件列
		clearComponents.call(this);
		var tbody=this.roles.get("tbody");
		tbody.innerHTML="";
	}
	function addNode(node){
		//添加一个节点行
		var tbody=this.roles.get("tbody");
		var tr=createElement("tr",null,tbody);
		var td=createElement("td",null,tr);
		td.textContent=node["nodeNameAlias"];
	}
	function persistUserData(){
		//TODO 持久化用户数据，存入this.userData
		this.userData=this.selectedComponents;
	}
	function restoreUserData(){
		//TODO 还原用户数据,从this.userData中取数据
		var data=this.userData;
	}
	function clearComponents(){
		//清空所有组件列
		var tbody=this.roles.get("tbody");
		ForEach(tbody.parentNode.rows,function(tr){
			for(var i=1,len=tr.cells.length;i<len;i++){
				tr.deleteCell(len-i);
			}
		});
	}
	function addComponent(comp){
		//添加一个组件列
		var thead=this.roles.get("thead"),
			tbody=this.roles.get("tbody"),
			name=comp["packageCatalogName"],
			Renderer=this.renderers[name]||null;
		if(Renderer){
			var r=new Renderer(comp,this.nodes,thead,tbody);
			this.columnAPIs.push(r);
		}else{
			throw new TypeError("No such component renderer: "+name);
		}
	}
	"public";
	function registerRenderer(name,renderer){
		//注册一个组件的渲染函数
		this.renderers[name]=renderer;
	}
	"exports";
	ExtendClass(DeploymentTable,TSWidget);
	InstallFunctions(DeploymentTable.prototype,NONE,[
		"registerRenderer",registerRenderer
	]);
	SetProperties(DeploymentTable.prototype,NONE,[
		"template",htm
	]);
	return DeploymentTable;
});