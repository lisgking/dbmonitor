define([],function(){
	"use strict";
	var document=window.document;
	var __proto__=Document.prototype;
	/**
	 * Document's Familial Polyfills
	 * @namespace jsm.shims
	 * @class Document
	 */
	/**
	 * @attribute documentURI
	 * @type String
	 */
	if(!document.documentURI){
		InstallGetter(__proto__,"documentURI",function(){
			return this.URL;
		});
	}
	/**
	 * @attribute baseURI
	 * @type String
	 */
	if(!document.baseURI){
		InstallGetter(__proto__,"baseURI",function(){
			var base=this.head.getElementsByTagName("base")[0];
			if(base){
				return base.href;
			}else{
				return this.documentURI;
			}
		});
	}
	/**
	 * @method contains
	 * @param {Node} node
	 */
	if(!__proto__.contains){
		InstallFunctions(__proto__,NONE,[
			"contains",function contains(b) {
				var a=this;
				while(b){
					b=b.parentNode;
					if(b===a){return true;}
				}
				return false;
			}
		]);
	}
	return Document;
});