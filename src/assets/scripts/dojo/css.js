/**
 * require ELement.prototype.insertAdjacentElement
 */
define(['module'],function(module){
	"use strict";
	var document=window.document;
	var insertAdjacentElement=Element.prototype.insertAdjacentElement||
		function insertAdjacentElement(position,newNode) {
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
		};
	var lastItem=function lastItem(){
		return this.item(this.length-1);
	};
	var plugin={
		name:"css",
		version:"0.0.1",
		currentLink:lastItem.call(document.head.querySelectorAll('link[rel="stylesheet"]')),
		settings:Object(module.config()),
		load:function(name,req,ok,cfg){
			var url=require.toUrl(name);
			var link=document.head.querySelector("link[href=\""+url+"\"]");
			if(link){
				ok(link);
			}else{
				link=document.createElement("link");
				link.rel="stylesheet";
				link.href=url;
				link.addEventListener("load",function(){
					//console.debug("AMD finished loading: \"%s\".",this.href);
					ok(this);
				});
				link.addEventListener("error",function(){
					//console.debug("Error loading: \"%s\".",this.href);
					document.head.removeChild(link);
				});
				var currentLink=plugin.currentLink;
				if(currentLink){
					insertAdjacentElement.call(currentLink,"afterEnd",link);
				}else{
					plugin.currentLink=link;
					document.head.appendChild(link);
				}
			}
		}
	};
	return plugin;
});