/**
 * @module ts.util
 */
define("ts/util/DOMUtils",[],function(){
	"use strict";
	/**
	 * @namespace ts.util
	 * @static
	 * @class DOMUtils
	 */
	function DOMUtils(){
		
	}
	
	function getScrollbarWidth(){
		var width=getScrollbarWidth.width,div;
		if(width===void 0){
			div=document.createElement('div');
			div.innerHTML='<div style="width:50px;height:50px;position:absolute;left:-50px;top:-50px;overflow:auto;"><div style="width:1px;height:100px;"></div></div>';
			div=div.firstChild;
			document.body.appendChild(div);
			width=getScrollbarWidth.width=div.offsetWidth-div.clientWidth;
			document.body.removeChild(div);
		}
		return width;
	}
	var parseHTML=(function(){
		var tagWrap= {
			option:["select"],
			tbody:["table"],
			thead:["table"],
			tfoot:["table"],
			tr:["table","tbody"],
			td:["table","tbody","tr"],
			th:["table","thead","tr"],
			legend:["fieldset"],
			caption:["table"],
			colgroup:["table"],
			col:["table","colgroup"],
			li:["ul"]
		},
		reTag=/<\s*([\w\:]+)/,
		masterNode= {},
		masterNum=0,
		masterName="___ToDomId";
		for(var param in tagWrap){
			if(tagWrap.hasOwnProperty(param)){
				var tw = tagWrap[param];
				tw.pre = param == "option" ? '<select multiple="multiple">' : "<" + tw.join("><") + ">";
				tw.post = "</" + tw.reverse().join("></") + ">";
			}
		}
		/**
		 * @method parseHTML
		 * @param {String} html
		 * @param {HTMLDocument} [doc=window.document]
		 * @return {Node}
		 */
		function parseHTML(frag,doc){
			doc=doc||window.document;
			var masterId=doc[masterName];
			if(!masterId) {
				doc[masterName]= masterId=++masterNum+"";
				masterNode[masterId]=doc.createElement("div");
			}
			frag+="";
			var match=frag.match(reTag),
				tag= match?match[1].toLowerCase():"",
				master=masterNode[masterId],
				wrap,
				i,
				fc,
				df;
			if(match&&tagWrap[tag]) {
				wrap=tagWrap[tag];
				master.innerHTML=wrap.pre+frag+wrap.post;
				for( i=wrap.length; i; --i) {
					master=master.firstChild;
				}
			} else {
				master.innerHTML=frag;
			}
			if(master.childNodes.length==1) {
				return master.removeChild(master.firstChild);
			}
			df=doc.createDocumentFragment();
			while(( fc=master.firstChild)){
				df.appendChild(fc);
			}
			return df;
		}
		return parseHTML;
	}());
	/**
	 * @method createElement
	 * @param {Object} tag - tag name
	 * @param {Object} [att] - attributes dict(also adopt properties) e.g. {innerHTML:"","data-value":""}
	 * @param {Node} [ref] - reference node
	 * @param {String} [pos] - position
	 * @return {HTMLElement}
	 */
	function createElement(tag,att,ref,pos){
		var elem=document.createElement(tag);
		if(att){
			Object.getOwnPropertyNames(att).forEach(function(name){
				if(name in elem){
					elem[name]=att[name];
				}else{
					elem.setAttribute(name,att[name]);
				}
			});
		}
		if(ref){
			if(!pos){ref.appendChild(elem);}
			else{ref.insertAdjacentElement(pos,elem);}
		}
		return elem;
	}
	/**
	 * @method createEvent
	 * @param {Object} name
	 * @param {Object} type
	 */
	function createEvent(name,type){
		var event=null;
		if(typeof window[name]==="function"){
			event=new window[name](type);
		}else{
			event=document.createEvent(name);
			event.initEvent(type,false,false);
		}
		return event;
	}
	InstallFunctions(DOMUtils,DONT_ENUM,[
		"createElement",createElement,
		"parseHTML",parseHTML,
		"createEvent",createEvent
	]);
	return DOMUtils;
});