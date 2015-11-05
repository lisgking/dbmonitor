define("ts/widgets/TSMenuGrid", [ 
      "ts/widgets/TSDataGrid",
	  "ts/widgets/TSMenuItem",
	  "ts/util/DOMUtils",
	  "jsm/events/MozKeys",
	  "dojo/text!./htm/TSMenuGrid.htm",
	  "dojo/css!./css/TSMenuGrid.css",
	  "dojo/css!./css/TSContextMenu.css",
	  "jquery"], function(TSDataGrid, TSMenuItem,DOMUtils,Keys,htm,css,menucss,$) {
	"use strict";
	// --------------------------------
	// TSMenuGrid
	// --------------------------------
	/**
	 * @namespace ts.widgets
	 * @class TSMenuGrid
	 * @extends ts/widgets/TSDataGrid
	 * @constructor
	 * @param props
	 */
	function TSMenuGrid(props) {
		TSDataGrid.call(this);
		defineProperties.call(this);
	}
	function defineProperties() {
		var that = this;
		this.__data__.ondblclick = function(e) {
		};
		InstallGetterSetter(this, "ondblclick", function getOndblclick() {
			return this.__data__.ondblclick;
		}, function setOndblclick(v) {
			if (typeof v == "function") {
				this.__data__.ondblclick = v;
			}
		});

		function namedItem(name) {
			return this.find(function(item) {
				return item.menuName === name;
			});
		};
		this.__data__.contextMenus = [];
		InstallGetterSetter(this, "contextMenus", function getContextMenus() {
			return this.__data__.contextMenus;
		}, function setContextMenus(v) {
			if (v instanceof Array && v.every(function(col) {
				return col instanceof TSMenuItem;
			})) {
				this.__data__.contextMenus = v;
				createContextMenu.call(that);
				addMenus.call(that);
			} else {
				throw new TypeError("contextMenus must be a TSMenuItem array");
			}
		});
		var hideContextMenu=function(event){
			var menu=that.role("contextmenu");
			menu.hidden=true;
			window.removeEventListener("keydown",hideContextMenuOnEsc);
			document.removeEventListener("click",hideContextMenuOnFocusOut,true);
		};
		var hideContextMenuOnEsc=function(e){
			if(e.keyCode===Keys.ESCAPE){//if Esc
				hideContextMenu.call(this,e);
			}
		};
		var hideContextMenuOnFocusOut=function(e){
			if(!$(e.target).closest(".-ts-context-menu").length){
				e.stopPropagation();
				hideContextMenu.call(this,e);
			}
		};
		var showContextMenu=function(event){
			var menu=that.role("contextmenu");
			event.preventDefault(this);
			menuFunction.call(this);
			$(menu).css({left:event.pageX+"px",top:event.pageY+"px"});
			menu.hidden=false;
			window.addEventListener("keydown",hideContextMenuOnEsc);
			document.addEventListener("click",hideContextMenuOnFocusOut,true);
			document.addEventListener("contextmenu",hideContextMenu,true);
			return false;
		};
		function menuFunction(){
			var trIndex = this.rowIndex;
			var item = that.dataProvider.rows[trIndex];
			var menus = that.roles.get("contextmenu");
			ForEach(menus.children,function(menu,index){
				if(typeof that.contextMenus[index].lableFunction ==="function"){
					that.contextMenus[index].lableFunction.call(menu,item);
				}else if(that.contextMenus[index].lableFunction !=null){
					throw new TypeError("lableFunction must be a function");
				}
				if(typeof that.contextMenus[index].callback ==="function"){
					menu.onclick = function() {
						hideContextMenu();
						that.contextMenus[$(this).index()].callback.call(this,item);
						return false;
					};
				}else if(that.contextMenus[index].callback !=null){
					throw new TypeError("callback must be a function");
				}
			});
		};
		function createContextMenu(){
			var menu=that.role("contextmenu");
			function menuitemRenderer(menuItem,index){
				var html=processTemplate(this.contextMenuTemplate,{
					id:this.widgetName+"_"+Math.random().toFixed(18).substr(2),
					label:menuItem.menuName
				});
				var li=DOMUtils.parseHTML(html);
				menu.appendChild(li);
				li.addEventListener("click",toggleMenu);
			}
			this.contextMenus.forEach(menuitemRenderer,this);
		}
		function toggleMenu(){
			
		}
		function addMenus() {
			var that = this;
			this.addEventListener("rowsAdded", function() {
				var tbody = that.roles.get("tbody");
				ForEach(tbody.rows, function(tr, index) {
					var item = that.dataProvider.rows[index];
//					addMenuTo.call(that,tr);
					tr.addEventListener("contextmenu",showContextMenu)
					tr.ondblclick = function(e) {
						that.ondblclick
								.call(this, e,item);
					};
				});
			});
		}
	}
	
	
	function processTemplate(tpl,obj){
		return tpl.replace(/\$\{([\$\w+]+)\}/g,function(el,key){
			return key in obj?obj[key]:el;
		});
	}
	ExtendClass(TSMenuGrid, TSDataGrid);
	SetProperties(TSMenuGrid.prototype,DONT_ENUM,[
        "template",htm,
  		"contextMenuTemplate",'<li role="contextmenuitem" class="unselectable"><label for="${id}" class="nowrap">${label}</label></li>'
  		]);
	return TSMenuGrid;
});