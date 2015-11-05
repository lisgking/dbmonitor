define(["./DOMStringMap"],function(DOMStringMap){
	"use strict";
	/**
	 * Element's Familial Polyfills
	 * @namespace jsm.shims
	 * @class Element
	 */
	var __proto__=Element.prototype;
	var __elem__=document.createElement("div");
	/**
	 * @attribute innerText
	 * @type String
	 */
	if(typeof __elem__.innerText!=="string")
		InstallGetterSetter(__proto__,"innerText",
			function(){
				var r=this.ownerDocument.createRange();
				r.selectNodeContents(this);
				return r.toString();
			},
			function(v){
				this.textContent=v;
				this.innerHTML=this.innerHTML.replace(/\r\n?|\n/g,"<br />\n");
			}
		);
	/**
	 * @attribute hidden
	 * @type boolean
	 */
	if(typeof __elem__.hidden!=="boolean")
		InstallGetterSetter(__proto__,"hidden",
			function(){
				var attr=this.getAttribute("hidden");
				return attr===""||attr==="hidden";
			},
			function(v){
				if(v){
					this.setAttribute("hidden","hidden");
				}else{
					this.removeAttribute("hidden");
				}
			}
		);
	/**
	 * @method insertAdjacentElement
	 * @param {String} position
	 * @param {HTMLElement} newNode
	 * @return {HTMLElement}
	 */
	if(!__proto__.insertAdjacentElement)
		InstallFunctions(__proto__,NONE,[
			"insertAdjacentElement",function insertAdjacentElement(position,newNode) {
				var p=(position+"").toLowerCase();
				var self=this;
				if(p==="beforebegin"){
					self.parentNode.insertBefore(newNode,self);
				}else if(p==="afterend"){
					self.parentNode.insertBefore(newNode,self.nextSibling);
				}else if(p==="afterbegin"){
					self.insertBefore(newNode,self.firstChild);
				}else if(p==="beforeend"){
					self.insertBefore(newNode,null);
				}else{
					throw TypeError("postion not supported");
				}
			}
		]);
	/**
	 * @method insertAdjacentText
	 * @param {String} position
	 * @param {String} text
	 */
	if(!__proto__.insertAdjacentText)
		InstallFunctions(__proto__,NONE,[
			"insertAdjacentText",function insertAdjacentText(position,text){
				var newNode=document.createTextNode(text);
				var p=(position+"").toLowerCase();
				var self=this;
				if(p==="beforebegin"){
					self.parentNode.insertBefore(newNode,self);
				}else if(p==="afterend"){
					self.parentNode.insertBefore(newNode,self.nextSibling);
				}else if(p==="afterbegin"){
					self.insertBefore(newNode,self.firstChild);
				}else if(p==="beforeend"){
					self.insertBefore(newNode,null);
				}else{
					throw TypeError("postion not supported");
				}
			}
		]);
	/**
	 * @method matchesSelector
	 * @param {String} selector
	 * @return {Boolean}
	 */
	if(!__proto__.matchesSelector){
		InstallFunctions(__proto__,NONE,[
			"matchesSelector",(__proto__.webkitMatchesSelector||__proto__.mozMatchesSelector||__proto__.msMatchesSelector)
		]);
	}
	var ptoa=function(p){
		return "data-"+p.replace(/([A-Z])/g,function(c){return "-"+c.toLowerCase();});
	},
	atop=function(a){
		return a.substr(5).replace(/-((\w+)*)/g,function(dword,word){return word.toUpperCase();});
	};
	/**
	 * @namespace jsm.shims
	 * @class HTMLElement
	 * @extends jsm.shims.Element
	 */
	/**
	 * @attribute dataset
	 * @type String
	 * @readOnly
	 */
	if(TypeNameOf(document.documentElement.dataset)!=="DOMStringMap"){
		InstallGetter(HTMLElement.prototype,"dataset",function get(){
			var propName="msDataset",
				dataset=this[propName];
			if(!dataset){
				dataset=this[propName]=new DOMStringMap(this);
			}else{
				for(var key in dataset){delete dataset[key];}
			}
			Array.prototype.slice.call(this.attributes)
				.forEach(function(attr){
					if(/^data-([-\w+]*)$/.test(attr.name)){
						dataset[atop(attr.name)]=attr.value;
					}
				});
			return dataset;
		});
		SetProperties(window,DONT_ENUM,["DOMStringMap",DOMStringMap]);
	}
	/**
	 * @namespace jsm.shims
	 * @class HTMLAnchorElement
	 * @extends jsm.shims.HTMLElement
	 */
	/**
	 * @attribute origin
	 * @type String
	 * @readOnly
	 */
	if(typeof __elem__.origin!=="string")
		InstallGetter(HTMLAnchorElement.prototype,"origin",function(){
			return this.protocol+"//"+this.host;
		});
	return Element;
});