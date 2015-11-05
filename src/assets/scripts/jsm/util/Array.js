/**
 * JavaScript Module Utility Classes
 * @module jsm.util
 */
define("jsm/util/Array",[],function(){
	"use strict";
	//----------------------------------------------------------------
	// Internal functions
	//----------------------------------------------------------------
	function ToNumber(v){
		return +v;
	}
	function ToInteger(v){
		var n=+v;
		if(n!==n){return 0;}//NaN
		if(n===0||n===1/0||n===-1/0){return n;}//0, -0, Infinity, -Infinity
		return (n>0?1:-1)*Math.floor(Math.abs(n));
	}
	function ToUint32(v){
		return v>>>0;
	}
	function ToObject(v){
		return Object(v);
	}
	function IsNullOrUndefined(v){
		return v===null||v===void 0;
	}
	function IsFunction(v){
		return typeof v==="function";
	}
	function IsObject(v){
		return v instanceof Object||typeof v==="object";
	}
	var kMessages={
		called_non_callable:"$0 is not a function",
		called_on_null_or_undefined:"$0 called on null or undefined"
	};
	var FormatMessage=function(key,args){
		if(!Object.prototype.hasOwnProperty.call(kMessages,key)){return "<unknown message "+key+">";}
		var msg=kMessages[key];
		if(!args){args="";}
		var len=args.length;
		return msg.replace(/\$([$\d])/g,function(exp,num){
			return num==="$"?num:num>>>0<len?args[num]:exp;
		});
	};
	//----------------------------------------------------------------
	// Array
	//----------------------------------------------------------------
	/**
	 * Array - ECMAScript 6 draft API
	 * @namespace jsm.util
	 * @class Array
	 * @extension Array
	 * @example
	 * <pre><code>Array.of(1,2,3);//[1,2,3]</code></pre>
	 * @example
	 * <pre><code>Array.of(1,2,3);//[1,2,3]</code></pre>
	 */
	/**
	 * Make a array from a iterable object
	 * @method from
	 * @static
	 * @param {Object} iterable
	 * @param {Function} [iterator]
	 * @param {Object} [receiver]
	 * @return {Array}
	 * @example
	 * <pre><code>Array.from({length:2,0:"one","1":"two"});//convert Indexed List(e.g HTMLCollection) to Array
	 * </code></pre>
	 */
	function from(iterable/*,f,receiver*/){
		var f=arguments[1],
			receiver=arguments[2];
		if(IsNullOrUndefined(receiver)){receiver=null;}
		else{receiver=ToObject(receiver);}
		if(f&&!IsFunction(f)){
			throw new TypeError(FormatMessage("called_non_callable",[f]));
		}
		var list=ToObject(iterable),
			length=ToUint32(list.length),
			result=IsFunction(this)?ToObject(new this(length)):new Array(length),
			i,
			value;
		if(f){
			for(i=0;i<length;i++){
				value=list[i];
				result[i]=receiver!=null?f.call(receiver,value):f(value);
			}
		}else{
			for(i=0;i<length;i++){
				result[i]=list[i];
			}
		}
		result.length=length;
		return result;
	}
	/**
	 * Make a array from given arguments
	 * @method of
	 * @static
	 * @param {*} [value]*
	 * @return {Array}
	 * @example <pre><code>Array.of(1,2,3); //[1,2,3]</code></pre>
	 */
	function of(){
		return Array.from(arguments);
	}
	InstallFunctions(Array,DONT_ENUM|DONT_OVERWRITE,[
		"from",from,
		"of",of
	]);
	/**
	 * Copy a range of elements to another
	 * @method copyWithin
	 * @param {Array} target
	 * @param {Number} start
	 * @param {Number} [end]
	 * @return {Object} target itself, if target is a object, otherwise, Object(target)
	 */
	function copyWithin(target,start/*,end*/){
		var o=ToObject(this),
			len=Math.max(ToInteger(o.length),0),
			to=target<0?Math.max(len+target,0):Math.min(target,len),
			from=start<0?Math.max(len+start,0):Math.min(start,len),
			end=arguments.length>2?arguments[2]:len,
			final1=end<0?Math.max(len+end,0):Math.min(end,len),
			count=Math.min(final1-from,len-to),
			direction=1;
		if(from<to&&to<(from+count)){
			direction=-1;
			from+=count-1;
			to+=count-1;
		}
		while(count>0){
			if(_hasOwnProperty.call(o,from)){
				o[to]=o[from];
			} else {
				delete o[from];
			}
			from+=direction;
			to+=direction;
			count-=1;
		}
		return o;
	}
	/**
	 * Fill a value in this array
	 * @method fill
	 * @param {*} value
	 * @param {Number} [start]
	 * @param {Number} [end]
	 * @return {Array}
	 * @chainable
	 * @example <pre><code>var arr=new Array(32);
	 * arr.fill(0);
	 * arr.fill(0,0,16);
	 * arr.fill(1,16,32);</code></pre>
	 */
	function fill(value/*,start,end*/){
		var l=arguments.length,
			len=this.length,
			start=l>1?ToInteger(arguments[1]):0,
			end=l>2?ToInteger(arguments[2]):len,
			from=start<0?Math.max(len+start,0):Math.min(start,len);
		for(var i=from;i<len&&i<end;++i){
			this[i]=value;
		}
		return this;
	}
	/**
	 * Find a element with the given iterator function
	 * @method find
	 * @param {Function} f Iterator function f(element:*,index:Number,array:Array):Boolean
	 * @param {*} [receiver]
	 * @return {*} the first matched element
	 * @exmaple
	 * <pre><code>var flash=Array.from(navigator.plugins).find(function(p){
	 * 	return p.name==="Shockwave Flash";
	 * });
	 * </code></pre>
	 */
	function find(f/*,receiver*/){
		if(IsNullOrUndefined(this)){
			throw new TypeError(FormatMessage("called_on_null_or_undefined",["Array.prototype.find"]));
		}
		var list=ToObject(this),
			length=ToUint32(list.length);
		if(length===0){return;}
		if(!IsFunction(f)){
			throw new TypeError(f+"is not a function");
		}
		var receiver=arguments[1];
		if(IsNullOrUndefined(receiver)){
			receiver=null;
		}else{
			receiver=ToObject(receiver);
		}
		for(var i=0;i<length;i++){
			if(i in list&&f.call(receiver,list[i],i,list)){
				return list[i];
			}
		}
	}
	/**
	 * Find the first matched element index with the given iterator function
	 * @method findIndex
	 * @param {Function} f iterator function f(element:*,index:Number,array:Array):Boolean
	 * @param {*} [receiver]
	 * @return {Number} index of the first matched element
	 */
	function findIndex(f/*receiver*/){
		if(IsNullOrUndefined(this)){
			throw new TypeError(FormatMessage("called_on_null_or_undefined",["Array.prototype.findIndex"]));
		}
		var list=ToObject(this),
			length=ToUint32(list.length);
		if(length===0){return -1;}
		if(!IsFunction(f)){
			throw new TypeError(FormatMessage("called_non_callable",[f]));
		}
		var receiver=arguments[1];
		if(IsNullOrUndefined(receiver)){
			receiver=null;
		}else{
			receiver=ToObject(receiver);
		}
		for(var i=0;i<length;i++){
			if(i in list&&f.call(receiver,list[i],i,list)){
				return i;
			}
		}
		return -1;
	}
	InstallFunctions(Array.prototype,DONT_ENUM|DONT_OVERWRITE,[
		"copyWithin",copyWithin,
		"fill",fill,
		"find",find,
		"findIndex",findIndex
	]);
	return Array;
});