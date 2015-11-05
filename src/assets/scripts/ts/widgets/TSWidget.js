/**
 * Provides core Widget classes
 * @module ts.widgets
 */
define("ts/widgets/TSWidget",[
	"jsm/widgets/Widget",
	"jsm/util/MessageBundle",
	"jsm/util/RoleMap",
	"jsm/util/UUID",
	"ts/util/ItemList",
	"ts/util/DOMUtils",
	"ts/util/TSEventTarget",
	"ts/events/TSEvent",
	"dojo/css!ts/widgets/css/TSWidget.css",
	"dojo/nls!ts/widgets/nls/TSWidget.json",
	"jquery"
].concat(function(shims){
	if(!Function.prototype.hasOwnProperty("name")){
		shims.push("jsm/shims/NonStandard");
	}
	if(typeof console!=="object"||typeof console.debug!=="function"){
		shims.push("jsm/shims/Console");
	}
	if(typeof Array.from!=="function"){
		shims.push("jsm/util/Array");
	}
	if(document.documentMode===9){
		shims.push("jsm/shims/Window");
	}
	if(typeof String.prototype.startsWidth!=="function"){
		shims.push("jsm/shims/String");
	}
	if(typeof EventSource!=="function"){
		shims.push("jsm/shims/EventSource");
	}
	if(typeof document.baseURI!=="string"){
		shims.push("jsm/shims/Document");
	}
	if(!Element.prototype.hasOwnProperty("matchesSelector")){
		shims.push("jsm/shims/Element");
	}
	if(typeof DOMTokenList!=="function"){
		shims.push("jsm/shims/DOMTokenList");
	}
	if(typeof Event!=="function"){
		shims.push("jsm/shims/Event");
	}
	if(typeof location.origin!=="string"){
		shims.push("jsm/shims/Location");
	}
	if(typeof URL!=="function"){
		shims.push("jsm/shims/URL");
	}
	if(!Element.prototype.hasOwnProperty("classList")){
		shims.push("jsm/shims/ClassList");
	}
	if(!Array.prototype.hasOwnProperty("reduce")){
		shims.push("jsm/shims/array/Reduce");
	}
	return shims;
}([])),function(Widget,MessageBundle,RoleMap,UUID,ItemList,DOMUtils,TSEventTarget,TSEvent,css,json,$){
	"use strict";
	//----------------------------------------------------------
	// WidgetCollection
	//----------------------------------------------------------
	function WidgetCollection(){
		ItemList.call(this);
	}
	window.WidgetCollection=WidgetCollection;
	function namedItem(name){
		return this.by("widgetName",name)||null;
	}
	ExtendClass(WidgetCollection,ItemList);
	InstallFunctions(WidgetCollection.prototype,DONT_DELETE,[
		"namedItem",namedItem
	]);
    // Make shortcut getMsg --> getMessage
    MessageBundle.prototype.getMsg = MessageBundle.prototype.getMessage;
	/**
	 * Provides the base Widget class
	 * @namespace ts.widgets
	 * @class TSWidget
	 * @extends ts.util.TSEventTarget
	 * @constructor
	 * @param {String} [id] if of the Widget object
	 * @param {Object} [initParams] required properties to construct the widget
	 */
	function TSWidget(id,initParams){
		if(!(this instanceof TSWidget)){
			debugger;
		}
		this.initParams=Object(initParams);
		this.id=id?""+id:UUID.randomUUID();
		TSEventTarget.call(this);
		defineProperties.call(this);
		init.call(this);
		InstallEvents(this,["destroy"]);
	}
	/**
	 * 
	 * @method addEventListenerTo
	 * @param {EventTarget} target
	 * @param {String} type
	 * @param {Function} handler
	 * @param {Boolean} [useCapture=false]
	 */
	function addEventListenerTo(target,type,handler/*,useCapture*/){
		var useCapture=Boolean(arguments[3]);
		target.addEventListener(type,handler,useCapture);
		var listeners=this.__data__.listeners;
		if(!listeners){
			listeners=this.__data__.listeners=[];
		}
		listeners.push({
			target:target,
			type:type,
			listener:handler,
			useCapture:useCapture
		});
	}
	function removeAllOuterEventListener(){
		var listeners=this.__data__.listeners;
		if(!listeners){
			return;
		}
		listeners.forEach(function(item){
			item.target.removeEventListener(item.type,item.listener,item.useCapture);
		});
	}
	function init(){
		var root=parseTemplate.call(this);
		//roles
		var roles=new RoleMap();
		if(root.hasAttribute("data-role")){
			roles.append(root.getAttribute("data-role"),root);
		}
		Array.prototype.forEach.call(root.querySelectorAll("[data-role]"),function(elem){
			roles.append(elem.getAttribute("data-role"),elem);
		});
		SetProperties(this,NONE,[
			"rootElement",root,
			"placeholder",null,
			"roles",roles
		]);
		this.setData("widgetName",this.constructor.name);
		this.setData("widgetId",this.id);
		this.setData("widgetOwner","any");
		registerInstance.call(this.constructor,this);
	}
	function registerInstance(instance){
		var c=this,
			p="instanceCount";
		var n=+c[p];
		if(n!==n){n=0;}
		c[p]=n+1;
	}
	function unregisterInstance(instance){
		var c=this,
			p="instanceCount";
		var n=+c[p];
		if(n!==n){n=0;}
		c[p]=n-1;
	}
	function parseTemplate(){
		var root;
		var template=this.template;
		if(typeof template!=="string"){template+="";}
		if(template===""){
			root=document.createElement("div");
		}else{
			template=template.trim();
			if(template===""){
				throw new TypeError("Tempalte string becomes empty after triming");
			}
			template=substitute(template,this.i18n.__data__);
			//parse template, with jQuery
			var nodes=$.parseHTML(template);
			if(!nodes||!(nodes[0] instanceof HTMLElement)){
				debugger;
				throw new TypeError("Root node may only be a HTMLElement");
			}
			root=nodes[0];
			//or, with dojo
			// var node=DOMUtils.parseHTML(template);
			// switch(node.nodeType){
				// case Node.ELEMENT_NODE:
					// root=node;
					// break;
				// case Node.DOCUMENT_FRAGMENT_NODE:
					// root=node.children[0];
					// if(!(root instanceof HTMLElement)){
						// throw new TypeError("First child node may only be a HTMLElement");
					// }
					// break;
				// default:
					// throw new TypeError("Root node may only be a HTMLElement");
			// }
			this.template=template;
		}
		root.widget=this;
		return root;
	}
	function defineProperties(){
		/**
		 * class name of the widget
		 * @attribute widgetName
		 * @type {String}
		 */
		SetProperty(this,READ_ONLY,"widgetName",this.constructor.name);
		/**
		 * parent widget of current widget
		 * @attribute parentWidget
		 * @type {TSWidget} may be null
		 */
		this.__data__.parentWidget=null;
		InstallGetter(this,"parentWidget",function(){
			return this.__data__.parentWidget;
		});
		/**
		 * child widgets of current widget
		 * @attribute children
		 * @type {ItemList}
		 */
		this.__data__.children=new WidgetCollection();
		InstallGetter(this,"children",function(){
			return this.__data__.children;
		});
		/**
		 * @attribute busy
		 * @type Boolean
		 */
		this.__data__.busy=false;
		InstallGetterSetter(this,"busy",function(){
			return this.__data__.busy;
		},function(v){
			v=!!v;
			this.__data__.busy=v;
			var busyarea=this.roles.get("busyarea")||this.rootElement;
			busyarea.classList.toggle("busy",v);
		});
		/**
		 * @attribute visible
		 * @type Boolean
		 */
		this.__data__.visible=true;
		InstallGetterSetter(this,"visible",function(){
			return getComputedStyle(this.rootElement).visibility!=="hidden";
		},function(v){
			this.rootElement.style.visibility=v?"visible":"hidden";
		});
	}
	/**
	 * @static
	 * @private
	 * @method substitute
	 * @param {String} str String to be substituted
	 * @param {Object} msgs A key-value dictionary as parameters
	 * @example substitute("Reply from ${host}: bytes=${bytes} time=${time}ms TTL=${TTL}",{
	 * 	host:"66.235.202.42",
	 * 	bytes:32,
	 * 	time:254,
	 * 	TTL:51
	 * });
	 */
	function substitute(str,msgs){
		return str.replace(/\$\{([^\}]+)\}/g,function(el,key){
			if(key[0]==="\""&&key.substr(-1)==="\""||
				key[0]==="'"&&key.substr(-1)==="'"){
				key=JSON.parse(key);
			}
			var v=msgs[key];
			return v===void 0?key:v;
		});
	}
	function closestWidgetNode(){
		var elem=this;
		while(elem&&elem.parentNode!==elem.ownerDocument){
			elem=elem.parentNode;
			if(elem&&elem.hasAttribute&&elem.hasAttribute("data-widget-name")) {
				return elem;
			}
		}
	}
	function capturingDispatch(handler){
		handler.call(this);
		var children=this.children,length=children.length,i;
		for(i=0;i<length;i++){
			capturingDispatch.call(children.item(i),handler);
		}
	}
	function bubblingDispatch(handler){
		var children=this.children,length=children.length,i;
		for(i=0;i<length;i++){
			bubblingDispatch.call(children.item(i),handler);
		}
		handler.call(this);
	}
	//beforeBegin<div id="placeholder">afterBegin<span></span>beforeEnd</div>afterEnd
	var rPos=/beforeBegin|afterBegin|beforeEnd|afterEnd|replaceInner/i;
	/**
	 * place the widget root element to a specified place
	 * @method placeAt
	 * @param {Node|String} refNode - A node or a element id of the reference node
	 * @param {String} position - One of ["beforeBegin", "afterBegin", "beforeEnd", "afterEnd"], case insensitive
	 */
	function placeAt(refNode/*,position*/){
		if(refNode instanceof jQuery){
			refNode=refNode[0];
		}else if(typeof refNode==="string"){
			refNode=(refNode[0]==="#")?document.querySelector(refNode):document.getElementById(refNode);
		}
		if(!(refNode instanceof window.top.Node) && !(refNode instanceof Node)){
			throw new TypeError(refNode+" is not a Node");
		}
		var position=arguments[1];
		if(position&&!rPos.test(position)){
			throw new TypeError("The value provided '"+position+
					"' is not one of 'beforeBegin', 'afterBegin', 'beforeEnd', or 'afterEnd'");
		}
		var root=this.rootElement,
			rootInDom=root.ownerDocument.contains(root),
			refInDom=refNode.ownerDocument.contains(refNode);
		if(rootInDom){
			if(refInDom){//move at doc
				moveTo.call(this,refNode,position);
			}else{       //move out of doc
				moveTo.call(this,refNode,position);
			}
		}else{
			if(refInDom){//insert into doc
				moveTo.call(this,refNode,position);
				capturingDispatch.call(this,function(){
					if(this.widgetName != "GenericDialog")
						allWidgets.__data__.push(this);
					this.readyState=this.COMPLETE;
                    this.dispatchEvent(new TSEvent("DOMNodeInserted"));
				});
			}else{      //insert into fragment
				moveTo.call(this,refNode,position);
				this.dispatchEvent(new TSEvent("DOMNodeInserted"))
			}
		}
	}
	/**
	 * place the widget root element to a specified place
	 * @private
	 * @method moveTo
	 * @param {Node} ref
	 * @param {Node} [pos]
	 */
	function moveTo(ref,pos){
		var root=this.rootElement,
			closestNode=closestWidgetNode.call(ref);
		if(closestNode){
			var newParent=closestNode.widget;
			appendChild.call(newParent,this);
		}else{
			this.__data__.parentWidget=null;
		}
		if(!pos){
			this.placeholder=ref;
			ref.parentNode.replaceChild(root,ref);
		}else if(pos==="replaceInner"){
			//add by lisg 2014-11-11 start
			while (ref.firstChild) {
				ref.removeChild(ref.firstChild);
			}
			ref.appendChild(root);
			//add by lisg 2014-11-11 end
		}else{
			ref.insertAdjacentElement(pos,root);
		}
	}
	/**
	 * Make a parent-child reference between current widget and the passed widget
	 * @method appendChild
	 * @param {TSWidget} child Widget to be adopted as child
	 */
	function appendChild(child){
		var index=this.children.__data__.indexOf(child);
		if(index===-1){
			var parentWidget=child.parentWidget;
			if(parentWidget){parentWidget.removeChild(child);}
			child.__data__.parentWidget=this;
			this.children.__data__.push(child);
		}
		return child;
	}
	/**
	 * Remove the parent-child reference between current widget and the passed widget
	 * @method removeChild
	 * @param {TSWidget} child Widget to be removed
	 * @return {TSWidget} The removed Widget
	 */
	function removeChild(child){
		var index=this.children.__data__.indexOf(child);
		if(index!==-1){
			this.children.__data__.splice(index,1);
			child.__data__.parentWidget=null;
		}
		return child;
	}
	/**
	 * Destroy the widget and restore place holder(if exists)
	 * @method destroy
	 */
	function destroy(){
		if(this.readyState===this.DESTROYED){return;}
		bubblingDispatch.call(this,function(){
			var parentNode=this.rootElement.parentNode;
			if(parentNode){
				if(this.placeholder){
					parentNode.replaceChild(this.placeholder,this.rootElement);
				}else{
					parentNode.removeChild(this.rootElement);
				}
			}
			var index=allWidgets.__data__.indexOf(this);
			if(index!==-1){
				allWidgets.__data__.splice(index,1);
			}
			delete this.rootElement.widget;
			if(this.rootElement.parentNode){
				this.rootElement.parentNode.removeChild(this.rootElement);
			}
			this.readyState=this.DESTROYED;
			this.dispatchEvent(new TSEvent("destroy"));
			unregisterInstance.call(this.constructor,this);
			removeAllOuterEventListener.call(this);
		});
	}
	/**
	 * returns string expression of the Widget Object
	 * @method toString
	 * @return {String}
	 */
	function toString(){
		return "[object "+Object.getPrototypeOf(this).constructor.name+"]";
	}
	function role(name){
		return this.roles.get(name);
	}
	//--------------------------------
	// data set
	//--------------------------------
	var ptoa=function(p){
		return "data-"+p.replace(/([A-Z])/g,function(A){return "-"+A.toLowerCase();});
	};
	/**
	 * Simplified setAttribute method for data-* attributes
	 * @protected
	 * @method setData
	 * @param {String} prop
	 * @param {String} value
	 */
	function setData(prop,value){
		var attr=ptoa(prop);
		return this.rootElement.setAttribute(attr,value);
	}
	/**
	 * Simplified getAttribute method for data-* attributes
	 * @protected
	 * @method getData
	 * @param {String} prop
	 * @return String|null
	 */
	function getData(prop){
		var attr=ptoa(prop);
		return this.rootElement.hasAttribute(attr)?this.rootElement.getAttribute(attr):void 0;
	}
	/**
	 * Simplified hetAttribute method for data-* attributes
	 * @protected
	 * @method hasData
	 * @param {String} prop
	 * @return Boolean
	 */
	function hasData(prop){
		var attr=ptoa(prop);
		return this.rootElement.hasAttribute(attr);
	}
	/**
	 * Simplified removeAttribute method for data-* attributes
	 * @protected
	 * @method removeData
	 * @param {String} prop
	 */
	function removeData(prop){
		var attr=ptoa(prop);
		return this.rootElement.removeAttribute(attr);
	}
	//--------------------------------
	// query API
	//--------------------------------
	function ParseSelector(json){
		var obj;
		if(json instanceof Object){
			obj=json;
		}else{
			try{obj=JSON.parse(json);}catch(e){
				throw new SyntaxError("Failed to execute query on '"+this.constructor+"': '"+s+"' is not a valid expression.");
			}
		}
		var s="";
		Object.keys(obj).forEach(function(key){
			var val=obj[key];
			s+=(val==="*")?"[data-widget-"+key+"]":"[data-widget-"+key+"=\""+val+"\"]";
		});
		if(s===""){
			throw new SyntaxError("Failed to execute query on '"+this.constructor+"': The provided expression is empty.");
		}
		//console.log(s);
		return s;
	}
	function QueryJSON(json){
		var selector=ParseSelector.call(this,json);
		var elem=this.querySelector(selector);
		return elem&&elem.widget;
	}
	function QueryJSONAll(json){
		var selector=ParseSelector.call(this,json);
		var result=new WidgetCollection();
		var widgets=Array.prototype.map.call(this.querySelectorAll(selector),function(elem){return elem.widget;});
		Array.prototype.push.apply(this.children.__data__,widgets);
		return result;
	}
	//--------------------------------
	// query API for document
	//--------------------------------
	/*InstallFunctions(document,NONE,[
		"getWidgetById",function getWidgetById(id){return QueryJSON.call(this,{id:id});},
		"queryJSON",function queryJSON(json){return QueryJSON.call(this,json);},
		"queryJSONAll",function queryJSONAll(json){return QueryJSONAll.call(this,json);},
		"getWidgetsByName",function getWidgetsByName(name){return QueryJSONAll.call(this,{name:name});}
	]);*/
	var allWidgets=new WidgetCollection();
	SetProperty(document,NONE,"widgets",allWidgets);
	//--------------------------------
	// exports
	//--------------------------------
	ExtendClass(TSWidget,TSEventTarget);
	InstallFunctions(TSWidget.prototype,DONT_ENUM,[
		//core API
		"placeAt",placeAt,
		"destroy",destroy,
		"appendChild",appendChild,
		"removeChild",removeChild,
		"toString",toString,
		"role",role,
		//query API
		// "queryJSON",function queryJSON(json){return QueryJSON.call(this.rootElement,json);},
		// "queryJSONAll",function queryJSONAll(json){return QueryJSONAll.call(this.rootElement,json);},
		// "getWidgetsByName",function getWidgetsByName(name){return QueryJSONAll.call(this.rootElement,{name:name});},
		//data API
		"setData",setData,
		"getData",getData,
		"hasData",hasData,
		"removeData",removeData,
		"addEventListenerTo",addEventListenerTo
	]);
	SetProperties(TSWidget.prototype,DONT_ENUM,[
		/**
		 * @attribute template
		 * @type String
		 */
		"template","",
		/**
		 * @attribute i18n
		 * @type MessageBundle
		 */
		"i18n",new MessageBundle(json)
	]);
	SetProperties(TSWidget.prototype,DONT_ENUM|READ_ONLY|DONT_DELETE,[
		/**
		 * @property LOADING
		 * @type Number
		 * @static
		 * @final
		 */
		"LOADING",0,
		/**
		 * @property LOADED
		 * @type Number
		 * @static
		 * @final
		 */
		"LOADED",1,
		/**
		 * @property INTERACTIVE
		 * @type Number
		 * @static
		 * @final
		 */
		"INTERACTIVE",2,
		/**
		 * @property COMPLETE
		 * @type Number
		 * @static
		 * @final
		 */
		"COMPLETE",3,
		/**
		 * @property DESTROYED
		 * @type Number
		 * @static
		 * @final
		 */
		"DESTROYED",4
	]);
	SetProperties(TSWidget,DONT_ENUM|READ_ONLY|DONT_DELETE,[
		"LOADING",0,
		"LOADED",1,
		"INTERACTIVE",2,
		"COMPLETE",3,
		"DESTROYED",4
	]);
	SetNativeFlag(TSWidget);
	ImplementInterface(TSWidget,Widget);
	return TSWidget;
});
