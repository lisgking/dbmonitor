define(["prefix"],function(prefix){
	"use strict";
	//test
	var div=document.createElement("div");
	var support=TypeNameOf(div.classList)==="DOMTokenList";
	var partialSupport=support&&div.classList.toggle("a",false);
	if(support&&!partialSupport){return window.DOMTokenList;}
	//------------------------------------------------------------
	// class InvalidCharacterError
	//------------------------------------------------------------
	function InvalidCharacterError(message){
		this.message=message;
	}
	ExtendClass(InvalidCharacterError,Error);
	SetProperty(InvalidCharacterError.prototype,DONT_ENUM,"name",InvalidCharacterError);
	
	var checkToken=function(token){
		if(token===""){
			throw new SyntaxError("The token provided must not be empty.");
		}else if(/\s/.test(token)){
			throw new InvalidCharacterError("The token provided ('"+token
					+"') contains HTML space characters, which are not valid in tokens.");
		}
	};
	if(support&&partialSupport){
		(function fix(proto){
			var DOMTokenListAdd=proto.add,
				DOMTokenListRemove=proto.remove,
				DOMTokenListToggle=proto.toggle;
			RenameProperty(proto,"add",prefix.lowercase+"Add");
			RenameProperty(proto,"remove",prefix.lowercase+"Remove");
			RenameProperty(proto,"toggle",prefix.lowercase+"Toggle");
			InstallFunctions(proto,0,[
				"add",function add(/*tokens..*/){
					var tokens=Array.prototype.slice.call(arguments);
					tokens.forEach(checkToken);
					tokens.forEach(DOMTokenListAdd.bind(this));
				},
				"remove",function remove(/*tokens..*/){
					var tokens=Array.prototype.slice.call(arguments);
					tokens.forEach(checkToken);
					tokens.forEach(DOMTokenListRemove.bind(this));
				},
				"toggle",function toggle(token/*,force*/){
					checkToken(token);
					var present=this.contains(token),force;
					if(arguments.length>1){
						force=!!arguments[1];
						if(force!==present){
							force=DOMTokenListToggle.call(this,token);
						}
						return force;
					}else{
						return DOMTokenListToggle.call(this,token);
					}
				}
			]);
		}(window.DOMTokenList.prototype));
		return window.DOMTokenList;
	}
	var addToken=function(token){
		var index=Array.prototype.indexOf.call(this,token);
		if(index===-1){
			Array.prototype.push.call(this,token);
		}
	},
	hasToken=function(token){
		return this.domNode.className.trim().split(/\s/).indexOf(token)!==-1;
	},
	removeToken=function(token){
		var index=Array.prototype.indexOf.call(this,token);
		if(index!=-1){
			Array.prototype.splice.call(this,index,1);
		}
	},
	syncClass=function(){
		for(var key in this){delete this[key];}
		try{Array.prototype.splice.call(this,0,this.length);}catch(e){this.length=0;}
		var className=this.domNode.className.trim();
		if(className){
			Array.prototype.push.apply(this,className.split(/\s+/));
		}
	},
	applyClass=function(){
		this.domNode.className=toClassName.call(this);
	},
	toClassName=function(){
		return Array.prototype.join.call(this," ");
	};
	//------------------------------------------------------------
	// class DOMTokenList
	//------------------------------------------------------------
	/**
	 * DOMTokenList polyfill
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList
	 * @namespace jsm.shims
	 * @class DOMTokenList
	 * @constructor
	 * @param {HTMLElement} domNode
	 */
	function DOMTokenList(domNode){
		SetProperties(this,DONT_ENUM,[
			"domNode",domNode,
			"length",0
		]);
		syncClass.call(this);
	}
	/**
	 * returns an item in the list by its index
	 * @method item
	 * @param {Number} index
	 * @return {HTMLElement|null}
	 */
	function item(index){
		index>>>=0;
		return this.hasOwnProperty(index)?this[index]:null;
	}
	/**
	 * return true if the underlying string contains token, otherwise false
	 * @method contains
	 * @param {String} token
	 * @return {Boolean}
	 */
	function contains(token){
		checkToken(token);
		syncClass.call(this);
		return Array.prototype.indexOf.call(this,token)!=-1;
	}
	/**
	 * adds a list of tokens to the underlying string
	 * @method add
	 * @param {String} [token]*
	 */
	function add(/*tokens..*/){
		var tokens=Array.prototype.slice.call(arguments);
		tokens.forEach(checkToken);
		syncClass.call(this);
		tokens.forEach(addToken,this);
		applyClass.call(this);
	}
	/**
	 * remove a list of tokens from the underlying string
	 * @method remove
	 * @param {String} [token]*
	 */
	function remove(/*tokens..*/){
		var tokens=Array.prototype.slice.call(arguments);
		tokens.forEach(checkToken);
		syncClass.call(this);
		tokens.forEach(removeToken,this);
		applyClass.call(this);
	}
	/**
	 * removes token from string and returns false.
	 * If force not specified, If token doesn't exist it's added and the function returns true.
	 * If force specified, toggle by force and return force it self.
	 * @method toggle
	 * @param {String} token
	 * @param {Boolean} [force]
	 * @return {Boolean}
	 */
	function toggle(token/*,force*/){
		checkToken(token);
		syncClass.call(this);
		var present=hasToken.call(this,token),force;
		if(arguments.length>1){
			force=!!arguments[1];
			if(force){
				addToken.call(this,token);
			}else{
				removeToken.call(this,token);
			}
			applyClass.call(this);
			present=force;
		}else{
			if(present){
				removeToken.call(this,token);
			}else{
				addToken.call(this,token);
			}
			applyClass.call(this);
			present=!present;
		}
		return present;
	}
	/**
	 * return class name
	 * @method toString
	 * @return {String}
	 */
	function toString(){
		return this.domNode.className;
	}
	//------------------------------------------------------------
	// exports
	//------------------------------------------------------------
	InstallFunctions(DOMTokenList.prototype,DONT_DELETE,[
		"item",item,
		"contains",contains,
		"add",add,
		"remove",remove,
		"toggle",toggle,
		"toString",toString
	]);
	SetProperties(window,DONT_ENUM,["DOMTokenList",DOMTokenList]);
	InstallGetter(HTMLElement.prototype,"classList",function get(){
		var propName=prefix.lowercase+"ClassList",
			classList=this[propName];
		if(!classList){
			classList=this[propName]=new DOMTokenList(this);
		}
		return classList;
	});
	return DOMTokenList;
});