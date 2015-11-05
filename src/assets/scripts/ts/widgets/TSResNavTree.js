define("ts/widgets/TSResNavTree",[
	"ts/widgets/TSTree",
	"ts/widgets/TSTreeItem",
	"ts/events/TSEvent",
	"jsm/util/MessageBundle",
	"ts/util/ItemList",
	"dojo/text!./htm/TSResNavTree.htm",
	"dojo/css!./css/TSResNavTree.css"
],function(TSTree,TSTreeItem,TSEvent,MessageBundle,ItemList,htm,css){
	"use strict";
	/**
	 * @namespace ts.widgets
	 * @class TSResNavTree
	 * @extends ts.widgets.TSTree
	 * @constructor
	 * @param {Object} id
	 * @param {Object} [initParams]
	 * @example
	 * <pre><code>var tree=new TSResNavTree();
tree.placeAt(document.body,"beforeEnd");
//tree.hash="#"+"fd3bb66c-4203-4f54-80df-fb71b39ffb36";
tree.collapseSiblingsOnExpand=false;
tree.hierarchy=[
	{
		"type":"platform",
		"href":"platform.html",
		"target":"_platform"
	},
	{
		"type":"host",
		"href":"host.html",
		"target":"_host"
	},
	{
		"type":"lpar",
		"href":"lpar.html",
		"target":"_lpar"
	}
];
tree.dataFunction=function(item){
	var itemData=item.itemData;
	var data={
		id:itemData.id,
		type:itemData.type
	};
	return data;
};
tree.onselect=function(event){
	var tree=event.target;
	var treeitem=event.currentTarget;
	var data=treeitem.itemData;
	console.log("%s selected",treeitem.itemData.name,data);
};
tree.onexpand=function(event){
	console.log("%s expanded",event.currentTarget.itemData.name);
};
tree.oncollapse=function(event){
	console.log("%s collapsed",event.currentTarget.itemData.name);
};
tree.selectFirstChildOnLoad=false;
tree.dataSource="dataProvider.jsp";
</code></pre>
	 */
	function TSResNavTree(id,initParams){
		TSTree.call(this,id,initParams);
		defineTreeProperties.call(this);
		init.call(this);
	}
	"private";
	function init(){
		InstallEvents(this,[
			/**
			 * @event select
			 * @param {TSResNavTree} target
			 * @param {TSTreeItem} currentTarget
			 */
			"select",
			/**
			 * @event expand
			 * @param {TSResNavTree} target
			 * @param {TSTreeItem} currentTarget
			 */
			"expand",
			/**
			 * @event collapse
			 * @param {TSResNavTree} target
			 * @param {TSTreeItem} currentTarget
			 */
			"collapse",
			/**
			 * @event load
			 * @param {TSResNavTree} target
			 * @param {TSTreeItem} currentTarget
			 * @param {Array} data
			 */
			"load"
		]);
		this.selectFirstChildOnLoad=true;
		var root=this.rootElement;
		root.setAttribute("role","tree");
		root.setAttribute("data-level",0);
	}
	function defineTreeProperties(){
		this.__data__.taskQueue=[];
		this.__data__.level=0;
		this.__data__.ownerTree=null;
		this.__data__.itemData=SetProperty({
			"id":"",
			"pid":null,
			"type":"root",
			"name":"",
			"title":"",
			"href":"#",
			"target":""
		},DONT_ENUM,"children",[]);
		/**
		 * @attribute hierarchy
		 * @type Array
		 * @default []
		 */
		this.__data__.hierarchy=[];
		InstallGetterSetter(this,"hierarchy",function(){
			return this.__data__.hierarchy;
		},function(v){
			if(!Array.isArray(v)){
				throw new TypeError("Invalid hierarchy array");
			}
			this.__data__.hierarchy=v;
		});
		/**
		 * @attribute showLine
		 * @type Boolean
		 */
		this.__data__.showLine = true;
		InstallGetterSetter(this,"showLine",function(){
			return this.__data__.showLine;
		},function(v){
			this.__data__.showLine = !!v;
		});
		/**
		 * @attribute defaultLevel
		 * @type int
		 */
		this.__data__.defaultLevel = 2;
		InstallGetterSetter(this,"defaultLevel",function(){
			return this.__data__.defaultLevel;
		},function(v){
			this.__data__.defaultLevel = v;
		});
		/**
		 * @attribute grades
		 * @type ItemList
		 */
		this.__data__.grades=new ItemList();
		InstallGetter(this,"grades",function(){
			var grades=this.__data__.grades;
			grades.__data__=this.__data__.hierarchy;
			return grades;
		});
		/**
		 * @attribute dataSource
		 * @type String
		 * @default ""
		 */
		this.__data__.dataSource="";
		InstallGetterSetter(this,"dataSource",function(){
			return this.__data__.dataSource;
		},function(v){
			this.__data__.dataSource=v+"";
			this.__data__.itemData.dataSource=v+"";
			var tree=this.ownerTree||this;
			//if(tree.hierarchy.length>0){
				this.load();
			//}
		});
		/**
		 * @attribute onLine
		 * @type Boolean
		 * @default true
		 */
		this.__data__.onLine=true;
		InstallGetterSetter(this,"onLine",function(){
			return this.__data__.onLine;
		},function(v){
			this.__data__.onLine=!!v;
		});
		/**
		 * @attribute hash
		 * @type String
		 * @default ""
		 */
		this.__data__.hash="";
		InstallGetterSetter(this,"hash",function(){
			var hash=this.__data__.hash;
			return hash===""?"":"#"+hash;
		},function(v){
			v+="";
			if(v.charAt(0)==="#"){v=v.substr(1);}
			this.__data__.hash=v;
			var target=this.getItemById(v);
			if(target){
				target.select();
			}
		});
		/**
		 * @attribute selectedItem
		 * @type TSTreeItem
		 */
		InstallGetter(this,"selectedItem",function(){
			var link=this.roles.get("childlist").querySelector('a[aria-selected="true"]');
			if(link){
				return link.parentNode.widget;
			}
			return this;
		});
		/**
		 * @attribute selectedId
		 * @type String
		 */
		InstallGetterSetter(this,"selectedId",function(){
			return this.selectedItem.itemData.id;
		},function(v){
			var item=this.getItemById(v);
			if(item){item.select();}
		});
		/**
		 * @attribute selectFirstChildOnLoad
		 * @type Boolean
		 * @default true
		 */
		this.__data__.selectFirstChildOnLoad=false;
		InstallGetterSetter(this,"selectFirstChildOnLoad",function(){
			return this.__data__.selectFirstChildOnLoad;
		},function(v){
			var v=!!v;
			if(v){
				this.addEventListener("load",selectFirstChild);
			}else{
				this.removeEventListener("load",selectFirstChild);
			}
			this.__data__.selectFirstChildOnLoad=v;
		});
		/**
		 * @attribute collapseSiblingsOnExpand
		 * @type Boolean
		 * @default false
		 */
		this.__data__.collapseSiblingsOnExpand=true;
		InstallGetterSetter(this,"collapseSiblingsOnExpand",function(){
			return this.__data__.collapseSiblingsOnExpand;
		},function(v){
			this.__data__.collapseSiblingsOnExpand=!!v;
		});
		/**
		 * @attribute dataFunction
		 * @type Function|null
		 * @default null
		 */
		this.dataFunction=null;
	}
	/**
	 * @private
	 * @method selectFirstChild
	 */
	function selectFirstChild(e){
		var node=e.currentTarget;
		if(node.constructor.name==="TSResNavTree"){
			var firstChild=this.firstChild;
			if(firstChild){
				firstChild.select();
				//if(!firstChild.loaded)firstChild.load();
				firstChild.expand();
			}
		}
	}
	function expander_clickHandler(event){
		event.preventDefault();
		var span=this,
			item=this.parentNode.widget,
			link=this.nextElementSibling,
			level=item.level;
		if(!item.expandable)
			return;
		if(!item.expanded){ // expand
			item.expand();
			if(item.loadable&&!item.loaded){
				item.load();
			}
		}else{
			item.collapse();
		}
	}
	function treeitem_clickHandler(event){
		event.preventDefault();
		var item=this.parentNode.widget;
		if(item){
			item.select();
		}
	}
	function treeitem_dblclickHandler(event){
		event.preventDefault();
		this.previousElementSibling.click();
	}
	"public";
	/**
	 * @method getItemById
	 * @param {String} id
	 * @return {TSTreeItem|null}
	 */
	function getItemById(id){
		if(!this.roles.has("childlist")){return null;}
		var link=this.roles.get("childlist").querySelector('a[data-id="'+id+'"]');
		if(!link){return null;}
		return link.parentNode.widget;
	}
	/**
	 * @deprecated
	 * @method appendJSONById
	 * @param {String} id
	 * @param {Object} json
	 */
	function appendJSONById(id,json){
		var ownerTree=this;
		var item=this.getItemById(id);
		if(!item){return;}
		if(Array.isArray(json)){
			json.forEach(function(json){
				append.call(item,ownerTree.createItem(json));
			},item);
		}else if(json instanceof Object){
			append.call(item,ownerTree.createItem(json));
		}
	}
	/**
	 * @method createItem
	 * @param {Object} json
	 * @return {TSTreeItem}
	 */
	function createItem(json){
		if(!(json instanceof Object)){
			throw new TypeError("Invalid tree item data");
		}
		var item=new TSTreeItem();
		var li=item.rootElement,
			span=li.querySelector("span"),
			a=li.querySelector("a");
		a.textContent=json.name;
		
		//a.setAttribute("href",json.href);
		//a.setAttribute("target",json.target);
		a.setAttribute("title",json.name);
		a.setAttribute("data-id",json.id);
		//a.setAttribute("data-pid",json.pid);
		a.setAttribute("data-type",json.type);
		a.setAttribute("role","treeitem");
		a.setAttribute("aria-selected",false);
		a.setAttribute("aria-expanded",false);
		a.setAttribute("aria-loaded",false);
		a.setAttribute("aria-level",0);
		a.addEventListener("click",treeitem_clickHandler);
		a.addEventListener("dblclick",treeitem_dblclickHandler);
		span.addEventListener("click",expander_clickHandler);
		
		if(json.hasOwnProperty("iconCls")) {
			a.setAttribute("class", json.iconCls);
		}
		span.classList.add(json.Css)
		if(!json.dataset){
			json.dataset=Object(json.dataset);
		}
		/*var ptoa=function(p){
			return "data-"+p.replace(/([A-Z])/g,function(A){return "-"+A.toLowerCase();});
		};
		Object.keys(json.dataset).forEach(function(key){
			a.setAttribute(ptoa(key),this[key]);
		},json.dataset);*/
		item.__data__.ownerTree=this;
		SetProperty(json,DONT_ENUM,"children",Array.isArray(json.children)?json.children:[]);
		item.__data__.itemData=json;
		if(json.level < this.defaultLevel)
			item.expand();
		return item;
	}
	/**
	 * TreeItem query (like jQuery)
	 * @method query
	 * @param {String|Array} selector - accept single id, single item, a array of ids, a array of items
	 * @return {TreeNodeList}
	 * @example tree.$("id");
	 * @example tree.$(["id1","id2"]).load();
	 * @example tree.$(["id1","id2","id3"]).expand();
	 */
	function query(s){
		return new TreeNodeList(this,s);
	}
	"exports";
	ExtendClass(TSResNavTree,TSTree);
	InstallFunctions(TSResNavTree.prototype,DONT_ENUM,[
		"createItem",createItem,
		"getItemById",getItemById,
		"appendJSONById",appendJSONById,
		"query",query
	]);
	SetProperties(TSResNavTree.prototype,DONT_ENUM,[
		"template",htm
	]);
	SetNativeFlag(TSResNavTree);
	
	function TreeNodeList(c,s){
		SetProperty(this,DONT_ENUM,"length",0);
		var tree=c,item,items;
		if(typeof s==="string"){
			var c0=s.charAt(0),value=s.substr(1);
			if(c0==="."){     //by class name
				items=Array.prototype.map.call(
					tree.roles.get("childlist").querySelectorAll("a"+s),
					function(a){return a.parentNode.widget;}
				);
				Array.prototype.push.call(this,items);
			}else if(c0==="#"){//by #id
				item=tree.getItemById(value);
				if(item){Array.prototype.push.call(this,item);}
			}else{             //by id
				item=tree.getItemById(s);
				if(item){Array.prototype.push.call(this,item);}
				//Array.prototype.push.apply(this,tree.getItemsByType(value));
			}
		}else if(Array.isArray(s)){
			var items=[];
			s.forEach(function(item){
				if(item instanceof TSTreeItem){
					items.push(item);
				}else if(typeof item==="string"){   //regard item as id
					var i=tree.getItemById(item);
					if(i){
						items.push(i);
					}
				}
			});
			Array.prototype.push.apply(this,items);
		}else if(s instanceof ItemList){
			Array.prototype.push.apply(this,s.__data__);
		}else{
			throw new TypeError("Unrecognized query selector");
		}
	}
	InstallFunctions(TreeNodeList.prototype,NONE,[
		"forEach",Array.prototype.forEach,
		"load",function load(){this.forEach(function(item){item.load();});},
		"reload",function reload(){this.forEach(function(item){item.reload();});},
		"select",function select(){this.forEach(function(item){item.select();});},
		"expand",function expand(){this.forEach(function(item){item.expand();});},
		"collapse",function collapse(){this.forEach(function(item){item.collapse();});}
	]);
	
	return TSResNavTree;
});