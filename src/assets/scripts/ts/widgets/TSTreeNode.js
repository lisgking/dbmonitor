define("ts/widgets/TSTreeNode",[
	"ts/widgets/TSWidget",
	"ts/events/TSEvent",
	"ts/util/ItemList",
	"ts/util/DOMUtils",
	"jquery"
],function(TSWidget,TSEvent,ItemList,DOMUtils,$){
	/**
	 * @namespace ts.widgets
	 * @class TSTreeNode
	 * @extends ts.widgets.TSWidget
	 */
	function TSTreeNode(id,initParams){
		TSWidget.call(this,id,initParams);
		defineProperties.call(this);
	}
	function defineProperties(){
		/**
		 * @attribute itemType
		 * @type String
		 */
		InstallGetter(this,"itemType",function(){
			return this.__data__.itemData.type;
		});
		/**
		 * @attribute itemData
		 * @type Object
		 */
		InstallGetter(this,"itemData",function(){
			return this.__data__.itemData;
		});
		/**
		 * @attribute ownerTree
		 * @type TSTree|null
		 */
		InstallGetter(this,"ownerTree",function(){
			return this.__data__.ownerTree;
		});
		/**
		 * @attribute firstChild
		 * @type TSTreeNode|null
		 */
		InstallGetter(this,"firstChild",function(){
			return this.children.item(0);
		});
		/**
		 * @attribute lastChild
		 * @type TSTreeNode|null
		 */
		InstallGetter(this,"lastChild",function(){
			var len=this.children.length;
			return len>0?this.children.item(len-1):null;
		});
		/**
		 * @attribute descendantItems
		 * @type ItemList
		 */
		this.__data__.descendantItems=new ItemList();
		InstallGetter(this,"descendantItems",function(){
			var items=this.__data__.descendantItems;
			items.__data__.length=0;
			var ul=this.roles.get("childlist");
			if(ul){
				ForEach(ul.querySelectorAll("a[role=treeitem]"),function(link){
					this.push(link.parentNode.widget);
				},items.__data__);
			}
			return items;
		});
		/**
		 * @attribute parentItem
		 * @type TSTreeNode|null
		 */
		InstallGetter(this,"parentItem",function(){
			var item=this.parentWidget;
			if(item&&item.hasOwnProperty("expanded")){
				return item;
			}
			return null;
		});
		/**
		 * @attribute previousSibling
		 * @type TSTreeNode|null
		 */
		InstallGetter(this,"previousSibling",function(){
			var prev=this.rootElement.previousElementSibling;
			var item=prev&&prev.widget;
			return (item instanceof TSTreeNode)?item:null;
		});
		/**
		 * @attribute nextSibling
		 * @type TSTreeNode|null
		 */
		InstallGetter(this,"nextSibling",function(){
			var prev=this.rootElement.nextElementSibling;
			var item=prev&&prev.widget;
			return (item instanceof TSTreeNode)?item:null;
		});
		/**
		 * @attribute grades
		 * @type ItemList
		 */
		InstallGetter(this,"grades",function(){
			var ownerTree=this.ownerTree||this;
			return ownerTree.grades;
		});
		/**
		 * @attribute loadable
		 * @type Boolean
		 * @readOnly
		 */
		InstallGetter(this,"loadable",function(){
			var ownerTree=this.ownerTree||this;
			return this.level<ownerTree.hierarchy.length;
		});
		/**
		 * @attribute expandable
		 * @type Boolean
		 */
		/*InstallGetterSetter(this,"expandable",function(){
			var attr=this.roles.get("span").getAttribute("data-expandable");
			if(attr!==null){return attr==="true";}
			var ownerTree=this.ownerTree||this;
			return this.level>=ownerTree.hierarchy.length;
		},function(v){
			//v=!!v;
			//this.roles.get("span").setAttribute("data-expandable",v);
		});*/
		/**
		 * @attribute loading
		 * @type Boolean
		 */
		InstallGetterSetter(this,"loading",function(){
			return this.roles.get("link").classList.contains("loading");
		},function(v){
			this.roles.get("link").classList.toggle("loading",!!v);
		});
		/**
		 * @attribute loaded
		 * @type Boolean
		 */
		InstallGetterSetter(this,"loaded",function(){
			return this.roles.get("link").getAttribute("aria-loaded")==="true";
		},function(v){
			this.roles.get("link").setAttribute("aria-loaded",!!v);
		});
		/**
		 * @attribute expanded
		 * @type Boolean
		 */
		InstallGetterSetter(this,"expanded",function(){
			return this.roles.get("link").getAttribute("aria-expanded")==="true";
		},function(v){
			this.roles.get("link").setAttribute("aria-expanded",!!v);
		});
		
		/**
		 * @attribute selected
		 * @type Boolean
		 */
		InstallGetterSetter(this,"selected",function(){
			return this.roles.get("link").getAttribute("aria-selected")==="true";
		},function(v){
			this.roles.get("link").setAttribute("aria-selected",!!v);
		});
		/**
		 * @attribute innerJSON
		 * @type Array
		 */
		InstallGetterSetter(this,"innerJSON",function(){
			return this.__data__.itemData.children;
		},function(v){
			if(!Array.isArray(v)){
				throw new TypeError("Invalid arguments: innerJSON may only be a Array");
			}
			clearListItems.call(this);
			addJSONArray.call(this,v);
		});
		/**
		 * @attribute level
		 * @type Number
		 */
		this.__data__.level=0;
		InstallGetterSetter(this,"level",function(){
			return this.__data__.level;
		},function(v){
			v>>>=0;
			this.__data__.level=v;
			this.roles.get("link").setAttribute("aria-level",v);
		});
	}
	/**
	 * @method appendItem
	 * @param {TSTreeNode} item
	 * @return {TSTreeNode}
	 */
	function appendItem(item){
		if(!(item instanceof TSTreeNode)){
			throw new TypeError("Cannot appendChild, invalid TSTreeNode: "+item);
		}
		this.appendChild(item);
		var ul=createChildList.call(this);
		ul.appendChild(item.rootElement);
		//level
		item.level=this.level+1;
		if(item.children.length){
			item.descendantItems.forEach(function(child){
				child.level=child.parentItem.level+1;
			});
		}
		//children
		var children=item.itemData.children;
		if(children.length){
			addJSONArray.call(item,children);
			item.expandable = true;
			
		}
		else
			item.expandable = false;
		
		this.__data__.itemData.children.push(item.itemData);
		return item;
	}
	/**
	 * @private
	 * @method clearListItems
	 */
	function clearListItems(){
		this.children.__data__.slice().reverse().forEach(removeItem,this);
		this.__data__.itemData.children.length=0;
	}
	/**
	 * @method removeItem
	 * @param {TSTreeNode} item
	 * @return {TSTreeNode}
	 */
	function removeItem(item){
		if(!(item instanceof TSTreeNode)){
			throw new TypeError(item+" is not a TSTreeNode");
		}
		var index=this.children.__data__.indexOf(item);
		var ul=this.roles.get("childlist");
		if(index!==-1&&ul){
			ul.removeChild(item.rootElement);
			this.removeChild(item);
			var index2=this.itemData.children.indexOf(item.itemData);
			if(index2!==-1){
				this.itemData.children.splice(index2,1);
			}
			item.level=0;
		}
		return item;
	}
	/**
	 * @method toJSON
	 * @return {String}
	 */
	function toJSON(){
		return this.__data__.itemData;
	}
	/**
	 * @private
	 * @method addJSONItem
	 * @param {Object} obj
	 * @return {TSTreeNode}
	 */
	function addJSONItem(obj){
		if(!(obj instanceof Object)){
			throw new TypeError();
		}
		var ownerTree=this.ownerTree||this;
		var item=this.appendItem(ownerTree.createItem(obj));
		/*if(!item.loadable){
			item.expandable=false;
		}*/
		var children=obj.children;
		if(Array.isArray(obj.children)){
			addJSONArray.call(item,obj.children);
			item.loaded=true;
		}else{
			children=[];
		}
		SetProperty(obj,DONT_ENUM,"children",children);
		this.__data__.itemData.children.push(obj);
		return item;
	}
	/**
	 * @private
	 * @method mergeJSONArray
	 */
	function mergeJSONArray(data){
		if(!Array.isArray(data)){
			throw new TypeError(data+" is not a Array: ");
		}
		var item=this,
			ownerTree=this.ownerTree||this,
			jsonArray=item.itemData.children,
			dataArray=data.slice(0),
			changes=[];
		var newItems=[];
		jsonArray.slice(0).forEach(function(obj,index){
			var pos=dataArray.findIndex(function(newObj){return obj.id===newObj.id;}),
				newObj,
				change;
			if(pos===-1){//node was deleted
				change={
					object:obj,
					type:"deleted"
				};
				changes.push(change);
				jsonArray.splice(index,1);
			}else{//new node data found, then compare and merge
				dataArray.splice(pos,1);
				newObj=jsonArray[i];
				var names=Object.keys(newObj).filter(function(key){return (newObj[key]!==obj[key]);}),
					values;
				if(names.length){
					values=names.map(function(name){return obj[name];});
					names.forEach(function(name){obj[name]=newObj[name];});
					change={
						object:obj,
						type:"updated",
						name:names,
						oldValue:values
					};
					changes.push(change);
				}
				newItems.push(item[index]);
			}
		},this);
		dataArray.forEach(function(newObj){
			var change={
				object:newObj,
				type:"new"
			};
			jsonArray.push(newObj);
			newItems.push(ownerTree.createItem(obj));
		},this);
		clearListItems.call(this);
		newItems.forEach(this.appendItem,this);
		if(changes.length){
			var e=new TSEvent("itemchanged");
			e.changes=changes;
			ownerTree.dispatchEvent(e);
		}
	}
	/**
	 * @private
	 * @method addJSONArray
	 * @param {Array} array
	 * @return {Array} array of added tree items
	 */
	function addJSONArray(data){
		if(!Array.isArray(data)){
			throw new TypeError(data+" is not a Array: ");
		}
		var ownerTree=this.ownerTree||this;
		var items=data.map(function(obj){
			var item=this.appendItem(ownerTree.createItem(obj));
			return item;
		},this);
		var hash=ownerTree.__data__.hash;
		if(hash){
			locateTarget.call(this,items);
			if(ownerTree.__data__.taskQueue.length){
				var taskQueue=ownerTree.__data__.taskQueue,
					task,
					target=items.find(function(item){return item.itemData.id===hash;});
				if(taskQueue.length){
					task=taskQueue.shift();
					task.call(ownerTree,target);
				}
			}
		}
		return items;
	}
	/**
	 * @private
	 * @method addJSONItem
	 * @param {Object} obj
	 * @return {TSTreeNode}
	 */
	function locateTarget(/*items*/){
		var ownerTree=this.ownerTree||this;
		var items=arguments[0];
		if(!Array.isArray(items)){items=this.descendantItems;}
		var hash=ownerTree.__data__.hash,target=null;
		if(hash){
			target=items.find(function(item){
				return item.itemData.id===hash;
			});
			if(target){
				target.select();
				ownerTree.__data__.hash="";
			}
		}
	}
	/**
	 * @private
	 * @method createChildList
	 * @return {HTMLULElement}
	 */
	function createChildList(){
		var link=this.roles.get("link");
		//a.className
		var ul=link.nextElementSibling;
		if(!ul){
			ul=DOMUtils.createElement("ul",{
				"data-role":"childlist",
				"class" : this.itemData.UlCss?this.itemData.UlCss:""
			},link,"afterEnd");
			this.roles.append("childlist",ul);
		}
		return ul;
	}
	function GernerateCssClass(data, level, tree){
		for(var i = 0; i < data.length; i++) {
			if(tree.showLine){
				if (level == 0 && i == 0 && i == data.length - 1) {
					data[i].Css = 'root';
				} else if (level == 0 && i == 0) {
					data[i].Css = 'roots';
				} else if (i == data.length - 1) {
					data[i].Css = 'bottom';
				} else {
					data[i].Css = 'center';
				}
			}
			else {
				data[i].Css = 'noline';
			}
			if(data[i].children.length == 0) {
				data[i].Css += '_docu'
			}
			else {
				data[i].Css += '_close'
			}
			if(tree.showLine && i != data.length - 1)
				data[i].UlCss = 'line';
			data[i].level = level;
			if(tree.iconFn){
				data[i].iconCls = tree.iconFn(data[i]);
			}
			GernerateCssClass(data[i].children, level + 1, tree);
		}
	}
	
	/**
	 * @method load
	 */
	function load(){
		if(this.loading){return;}
		var tree=this.ownerTree||this,
			grade=this.grades.item(this.level),
			itemData=this.__data__.itemData,
			src="",
			timer=setTimeout(function(that){that.loading=false;},5000,this),
			dataFunction=tree.dataFunction,
			data,
			update=arguments[1]||"update";
		if(typeof dataFunction==="function"){
			data=dataFunction.call(tree,itemData);
		}else{
			data={
				id:itemData.id,
				pid:itemData.id,
				type:itemData.type,
				parentId:itemData.id,
				itemType:!!grade?grade.type:itemData.type
			};
		}
		if("dataSource" in itemData){
			src=itemData.dataSource;
		}else 
			return;
		//*/
		//qmw 2014-5-20 修改为post提交
		var that = this;
		/*that.loading=true;
		var url = src + (src.indexOf('?') == -1 ? '?' : '&');
		url += $.param(data);
		$.post(url, function(data){
			that.loading=false;
			that.loaded=true;
			data.forEach(function(item){
				ExtendObject(item,grade,DONT_OVERWRITE);
			});
			GernerateCssClass(data, 0, that);
			var t=that.ownerTree||that,
				e;
			if(update==="update"){
				clearListItems.call(that);
				addJSONArray.call(that,data);
				e=new TSEvent("load");
				e.data=data;
				e.currentTarget=that;
				e.target=t;
				t.dispatchEvent(e);
			}else if(update==="merge"){
				mergeJSONArray.call(that,data);
				e=new TSEvent("synchronized");
				e.data=data;
				e.currentTarget=that;
				e.target=t;
				t.dispatchEvent(e);
			}
		},"json").error(function(request,text,error){
			console.log(error);
		}).always(function(){
			clearInterval(timer);
			that.loading=false;
		});*/
		this.loading=true;
		$.ajax(src,{
			data:data,
			dataType:"json",
			context:this,
			success:function(data){
				data.forEach(function(item){
					ExtendObject(item,grade,DONT_OVERWRITE);
				});
				GernerateCssClass(data, 0, that);
				var t=this.ownerTree||this;
				this.loaded=true;
				clearListItems.call(this);
				addJSONArray.call(this,data);
				var e=new TSEvent("load");
				e.data=data;
				e.currentTarget=this;
				e.target=t;
				t.dispatchEvent(e);
			},
			error:function(request,text,error){
				console.log(error);
			},
			complete:function(){
				clearInterval(timer);
				this.loading=false;
			}
		});
	}

	/**
	 * @method reload
	 */
	function reload(){
		if(this.loading){
			return;
		}
		clearListItems.call(this);
		load.call(this);
	}
	/**
	 * @method select
	 */
	function select(){
		if(this.selected){return;}
		var tree=this.ownerTree;
		var sLink=tree.rootElement.querySelector('a[aria-selected="true"]');
		if(sLink){
			sLink.setAttribute("aria-selected","false");
		}
		for(var parent=this.parentItem; parent&&parent!==tree; parent=parent.parentItem){
			parent.expand();
		}
		var link=this.roles.get("link");
		link.setAttribute("aria-selected",true);
		
		var e=new TSEvent("select");
		e.currentTarget=this;
		e.target=this.ownerTree;
		this.ownerTree.dispatchEvent(e);
	}
	/**
	 * @method expand
	 */
	function expand(){
		if(this.expanded){return;}
		var tree=this.ownerTree;
		if(tree.collapseSiblings){
			this.parentItem.children.__data__.forEach(function(item){
				if(this!==item&&item.expanded){
					item.collapse();
				}
			},this);
		}
		this.roles.get("link").setAttribute("aria-expanded",true);
		var cssClass = this.roles.get("span").classList;
		for(var i = 0; i < cssClass.length; i++) {
			if(cssClass[i].indexOf('_close') != -1){
				cssClass.add(cssClass[i].replace('_close','_open'));
				cssClass.remove(cssClass[i]);
			}
		}
        var e=new TSEvent("expand");
		e.currentTarget=this;
		e.target=this.ownerTree;
		this.ownerTree.dispatchEvent(e);
	}
	/**
	 * @method collapse
	 */
	function collapse(){
		if(!this.expanded){return;}
		this.roles.get("link").setAttribute("aria-expanded",false);
		var cssClass = this.roles.get("span").classList;
		for(var i = 0; i < cssClass.length; i++) {
			if(cssClass[i].indexOf('_open') != -1){
				cssClass.add(cssClass[i].replace('_open','_close'));
				cssClass.remove(cssClass[i]);
			}
		}
		var e=new TSEvent("collapse");
		e.currentTarget=this;
		e.target=this.ownerTree;
		this.ownerTree.dispatchEvent(e);
	}
	/**
	 * @deprecated
	 * @method selectChildAt
	 * @param {Number} index
	 */
	function selectChildAt(index){
		var child=this.children.item(index);
		if(child){child.select();}
	}
	/**
	 * @deprecated
	 * @method expandChildAt
	 * @param {Number} index
	 */
	function expandChildAt(index){
		var child=this.children.item(index);
		if(child){child.expand();}
	}
	/**
	 * @deprecated
	 * @method collapseChildAt
	 * @param {Number} index
	 */
	function collapseChildAt(index){
		var child=this.children.item(index);
		if(child){child.collapse();}
	}
	/**
	 * @method getItemsByType
	 * @param {String} id
	 * @return {ItemList}
	 */
	function getItemsByType(id){
		var items=new ItemList();
		if(!this.roles.has("childlist")){return items;}
		var links=this.roles.get("childlist").querySelectorAll('a[data-type="'+id+'"]');
		Array.prototype.slice.call(links).forEach(function(link){
			this.push(link.parentNode.widget);
		},items.__data__);
		return items;
	}
	/**
	 * @method find
	 * @param {Function} iterator
	 * @param {Object} [receiver]
	 * @return {TSTreeNode|null}
	 */
	function find(f/*,receiver*/){
		var receiver=arguments[1];
		return this.descendantItems.__data__.find(f,receiver);
	}
	/**
	 * @method findAll
	 * @param {Function} iterator
	 * @param {Object} [receiver]
	 * @return {Array}
	 */
	function findAll(f/*,receiver*/){
		var receiver=arguments[1];
		return new ItemList(this.descendantItems.__data__.filter(f,receiver));
	}
	/**
	 * @method insertBefore
	 * @param {TSTreeNode} newItem
	 * @param {TSTreeNode} refItem
	 * @return {TSTreeNode}
	 */
	function insertBefore(newItem,refItem){
		var index=refItem?this.children.__data__.indexOf(refItem):-1;
		var parentItem=newItem.parentItem;
		if(parentItem){parentItem.removeChild(newItem);}
		newItem.__data__.parentWidget=this;
		if(index===-1){
			index=this.children.__data__.length;
		}
		this.__data__.itemData.children.splice(index,0,newItem.itemData);
		this.children.__data__.splice(index,0,newItem);
		window.newItem=newItem;
		return newItem;
	}
	/**
	 * @method insertAdjacentItem
	 * @param {String} position
	 * @param {TSTreeNode} item
	 * @return {TSTreeNode}
	 */
	function insertAdjacentItem(position,item){
		var p=(""+position).toLowerCase();
		if(!(p==="beforebegin"||p==="afterbegin"||p==="beforeend"||p==="afterend")){
			throw new TypeError("postion not supported: "+p);
		}
		if(!(item instanceof TSTreeNode)){
			throw new TypeError(item+"is not a  TSTreeNode");
		}
		var ul=createChildList.call(this),li=this.rootElement;
		if(p==="beforebegin"){
			li.insertAdjacentElement(p,item.rootElement);
			item.level=this.level;
			insertBefore.call(this.parentItem,item,this);
		}else if(p==="afterbegin"){
			ul.insertAdjacentElement(p,item.rootElement);
			item.level=this.level+1;
			insertBefore.call(this,item,this.firstChild);
		}else if(p==="beforeend"){
			ul.insertAdjacentElement(p,item.rootElement);
			item.level=this.level+1;
			insertBefore.call(this,item,null);
		}else if(p==="afterend"){
			li.insertAdjacentElement(p,item.rootElement);
			item.level=this.level;
			insertBefore.call(this.parentItem,item,this.nextSibling);
		}
		if(item.children.length){
			item.descendantItems.forEach(function(child){
				child.level=child.parentItem.level+1;
			});
		}
		return item;
	}
	/**
	 * @method insertAdjacentJSON
	 * @param {String} position
	 * @param {Object} json
	 */
	function insertAdjacentJSON(position,json){
		var ownerTree=this.ownerTree||this;
		if(Array.isArray(json)){
			json.forEach(function(json){
				insertAdjacentItem.call(this,position,ownerTree.createItem(json));
			},this);
		}else{
			insertAdjacentItem.call(this,position,ownerTree.createItem(json));
		}
	}
	/**
	 * @deprecated
	 * @method before
	 * @param {Object} json
	 */
	function before(json){
		if(json instanceof TSTreeNode){
			insertAdjacentItem.call(this,"beforebegin",json);
		}else if(json instanceof Object){
			insertAdjacentJSON.call(this,"beforebegin",json);
		}else{
			throw new TypeError("content is not a TSTreeNode nor Object");
		}
	}
	/**
	 * @deprecated
	 * @method after
	 * @param {Object} json
	 */
	function after(json){
		if(json instanceof TSTreeNode){
			insertAdjacentItem.call(this,"afterend",json);
		}else if(json instanceof Object){
			insertAdjacentJSON.call(this,"afterend",json);
		}else{
			throw new TypeError("content is not a TSTreeNode nor Object");
		}
	}
	/**
	 * @deprecated
	 * @method append
	 * @param {Object} json
	 */
	function append(json){
		if(json instanceof TSTreeNode){
			insertAdjacentItem.call(this,"beforeend",json);
		}else if(json instanceof Object){
			insertAdjacentJSON.call(this,"beforeend",json);
		}else{
			throw new TypeError("content is not a TSTreeNode nor Object");
		}
	}
	/**
	 * @deprecated
	 * @method loadAndSelectChild
	 * @param {String} id
	 */
	function loadAndSelectChild(id){
		var ownerTree=this.ownerTree||this;
		ownerTree.hash=id;
		ownerTree.__data__.taskQueue.push(function(item){
			item.select();
		});
		this.load();
	}
	
	function setName(name){
		this.rootElement.children[1].innerText = name;
		this.rootElement.children[1].title = name;
	}
	/**
	 * @method synchronize
	 */
	function synchronize(){
		this.load(void 0,"merge");
	}
	ExtendClass(TSTreeNode,TSWidget);
	
	//tree node
	InstallFunctions(TSTreeNode.prototype,NONE,[
		"appendItem",appendItem,
		"removeItem",removeItem,
		
		"load",load,
		"reload",reload,
		"synchronize",synchronize,
		"select",select,
		"expand",expand,
		"collapse",collapse,
		
		"selectChildAt",selectChildAt,
		"expandChildAt",expandChildAt,
		"collapseChildAt",collapseChildAt,
		"loadAndSelectChild",loadAndSelectChild,
		
		"find",find,
		"findAll",findAll,
		"getItemsByType",getItemsByType,
		
		"insertBefore",insertBefore,
		"insertAdjacentItem",insertAdjacentItem,
		"insertAdjacentJSON",insertAdjacentJSON,
		"before",before,
		"after",after,
		"append",append,
		"setName",setName,
		
		"toJSON",toJSON
	]);
	return TSTreeNode;
});
