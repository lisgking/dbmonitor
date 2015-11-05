define([],function(){
	"use strict";
	var v8natives=require("v8natives");
	var READ_ONLY=v8natives.READ_ONLY,
		DONT_ENUM=v8natives.DONT_ENUM,
		DONT_DELETE=v8natives.DONT_DELETE,
		InstallFunctions=v8natives.InstallFunctions;
	//----------------------------------------------------------------
	// Internal functions
	//----------------------------------------------------------------
	function ToUint32(x){
		return x>>>0;
	}
	function ToInteger(v){
		var n=+v;
		if(n!==n){return 0;}
		if(n===0||1/n===0){return n;}
		return (n>0?1:-1)*Math.floor(Math.abs(n));
	}
	function RepeatString(){
		if(times<1){
			return '';
		}else if(times%2){
			return RepeatString(s,times-1)+s;
		}else{
			var half=RepeatString(s,times/2);
			return half+half;
		}
	}
	var SetProtoOf=(function(){
		var set;
		try{
			set=Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").set;
			set.call({},null);// Firefox Safari will be OK
		}catch(e){
			if(Object.prototype!=={}.__proto__){
				set=function(){throw new TypeError("Generic use of __proto__ accessor not allowed");};
			}// lte IE 10 cannot be shimmed
			set=function(proto){this.__proto__=proto;};// Chrome
		}
		return set;
	}());
	
	//----------------------------------------------------------------
	// String
	//----------------------------------------------------------------
	/**
	 * @namespace jsm.shims
	 * @class String
	 * @extension String
	 */
	InstallFunctions(String,DONT_ENUM,[
		/**
		 * @static
		 * @method fromCodePoint
		 * @param {Number} [point]*
		 * @return {String}
		 */
		"fromCodePoint",function fromCodePoint(){
			var points=_slice.call(arguments,0);
			var result=[];
			var next;
			for(var i=0, length=points.length;i<length;i++){
				next=Number(points[i]);
				if(!Object.is(next,ToInteger(next))||next<0||next>0x10FFFF){
					throw new RangeError("Invalid code point "+next);
				}
				if(next<0x10000){
					result.push(String.fromCharCode(next));
				} else {
					next-=0x10000;
					result.push(String.fromCharCode((next>>10)+0xD800));
					result.push(String.fromCharCode((next%0x400)+0xDC00));
				}
			}
			return result.join('');
		},
		/**
		 * @static
		 * @method raw
		 * @param {Object} callSite
		 * @param {String} [substitution]
		 * @return {String}
		 */
		"raw",function raw(){
			var callSite=arguments[0];
			var substitutions=_slice.call(arguments,1);
			var cooked=Object(callSite);
			var rawValue=cooked.raw;
			var raw=Object(rawValue);
			var len=Object.keys(raw).length;
			var literalsegments=ToUint32(len);
			if(literalsegments===0){
				return '';
			}
			var stringElements=[];
			var nextIndex=0;
			var nextKey, next, nextSeg, nextSub;
			while(nextIndex<literalsegments){
				nextKey=String(nextIndex);
				next=raw[nextKey];
				nextSeg=String(next);
				stringElements.push(nextSeg);
				if(nextIndex+1>=literalsegments){
					break;
				}
				next=substitutions[nextKey];
				if(next===undefined){
					break;
				}
				nextSub=String(next);
				stringElements.push(nextSub);
				nextIndex++;
			}
			return stringElements.join('');
		}
	]);
	InstallFunctions(String.prototype,DONT_ENUM,[
		/**
		 * @method repeat
		 * @param {Number} times
		 * @return {String}
		 */
		"repeat", function repeat(times){
			times=ToInteger(times);
			if(times<0||times===Infinity){
				throw new RangeError();
			}
			return RepeatString(String(this),times);
		},
		/**
		 * @method startsWith
		 * @param {String} str
		 * @param {Number} pos
		 * @return {Boolean}
		 */
		"startsWith",function startsWith(str,pos){
			var pos=Math.max(ToInteger(pos),0);
			return this.substr(pos,str.length)===str;
		},
		/**
		 * @method endsWith
		 * @param {String} str
		 * @param {Number} pos
		 * @return {Boolean}
		 */
		"endsWith",function endsWith(str,pos){
			var len=this.length;
			var pos=Math.min(Math.max(ToInteger(pos),0),len);
			return this.substr(pos-str.length,str.length)===str;
		},
		/**
		 * @method contains
		 * @param {String} str
		 * @param {Number} pos
		 * @return {Boolean}
		 */
		"contains",function contains(str,pos){
			return this.indexOf(str,pos)!==-1;
		},
		/**
		 * @method codePointAt
		 * @param {Number} pos
		 * @return {Number}
		 */
		"codePointAt",function codePointAt(pos){
			var s=String(this);
			var position=ToInteger(pos);
			var length=s.length;
			if(position<0||position>=length)
				return undefined;
			var first=s.charCodeAt(position);
			var isEnd=(position+1===length);
			if(first<0xD800||first>0xDBFF||isEnd)
				return first;
			var second=s.charCodeAt(position+1);
			if(second<0xDC00||second>0xDFFF)
				return first;
			return ((first-0xD800)*1024)+(second-0xDC00)+0x10000;
		}
	]);
	//----------------------------------------------------------------
	// Array
	//----------------------------------------------------------------
	/**
	 * @namespace jsm.shims
	 * @class ArrayIterator
	 * @constructor
	 * @param {Array} array
	 * @param {String} kind
	 */
	function ArrayIterator(array,kind){
		this.i=0;
		this.array=array;
		this.kind=kind;
	}
	InstallFunctions(this,DONT_ENUM,[
		"ArrayIterator",ArrayIterator
	]);
	InstallFunctions(ArrayIterator.prototype,DONT_ENUM,[
		/**
		 * @method next
		 * @return {*}
		 */
		"next",function next(){
			var i=this.i;
			this.i=i+1;
			var array=this.array;
			if(i>=array.length){
				throw new Error();
			}
			if(array.hasOwnProperty(i)){
				var kind=this.kind;
				var retval;
				if(kind==="key"){
					retval=i;
				}
				if(kind==="value"){
					retval=array[i];
				}
				if(kind==="entry"){
					retval=[i,array[i]];
				}
			} else {
				retval=this.next();
			}
			return retval;
		}
	]);
	//----------------------------------------------------------------
	// Array
	//----------------------------------------------------------------
	/**
	 * @namespace jsm.shims
	 * @class Array
	 * @extension Array
	 */
	InstallFunctions(Array,DONT_ENUM,[
		/**
		 * @static
		 * @method from
		 * @param {Object} iterable
		 * @return {Array}
		 */
		"from",function from(iterable){
			var mapFn=arguments[1];
			var thisArg=arguments[2];
			if(mapFn!==undefined&&typeof mapFn!=="function]"){
				throw new TypeError("when provided, the second argument must be a function");
			}
			var list=Object(iterable);
			var length=ToUint32(list.length);
			var result= typeof this==="function"?Object(new this(length)):new Array(length);
			for(var i=0;i<length;i++){
				var value=list[i];
				if(mapFn!==undefined){
					result[i]= thisArg?mapFn.call(thisArg,value):mapFn(value);
				} else {
					result[i]=value;
				}
			}
			result.length=length;
			return result;
		},
		/**
		 * @static
		 * @method of
		 * @param {*} [element]*
		 * @return {Array}
		 */
		"of",function of(){
			return Array.from(arguments);
		}
	]);
	InstallFunctions(Array.prototype,DONT_ENUM,[
		/**
		 * Copy a range of elements to another
		 * @method copyWithin
		 * @param {Array} target
		 * @param {Number} start
		 * @param {Number} [end]
		 * @return {Object} target itself, if target is a object, otherwise, Object(target)
		 */
		"copyWithin",function copyWithin(target,start){
			var o=Object(this);
			var len=Math.max(ToInteger(o.length),0);
			var to=target<0?Math.max(len+target,0):Math.min(target,len);
			var from=start<0?Math.max(len+start,0):Math.min(start,len);
			var end=arguments.length>2?arguments[2]:len;
			var final=end<0?Math.max(len+end,0):Math.min(end,len);
			var count=Math.min(final-from,len-to);
			var direction=1;
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
		},
		/**
		 * Fill a value in this array
		 * @method fill
		 * @param {*} value
		 * @param {Number} [start]
		 * @param {Number} [end]
		 * @return {Array}
		 * @chainable
		 */
		"fill",function fill(value){
			var len=this.length;
			var start=arguments.length>1?ToInteger(arguments[1]):0;
			var end=arguments.length>2?ToInteger(arguments[2]):len;
			var relativeStart=start<0?Math.max(len+start,0):Math.min(start,len);
			for(var i=relativeStart;i<len&&i<end;++i){
				this[i]=value;
			}
			return this;
		},
		/**
		 * Find a element with the given iterator function
		 * @method find
		 * @param {Function} f Iterator function f(element:*,index:Number,array:Array):Boolean
		 * @param {*} [receiver]
		 * @return {*} the first matched element
		 */
		"find",function find(predicate){
			var list=Object(this);
			var length=ToUint32(list.length);
			if(length===0)
				return undefined;
			if( typeof predicate!=="function"){
				throw new TypeError("Array#find: predicate must be a function");
			}
			var thisArg=arguments[1];
			for(var i=0, value;i<length&& i in list;i++){
				value=list[i];
				if(predicate.call(thisArg,value,i,list))
					return value;
			}
			return undefined;
		},
		/**
		 * Find the first matched element index with the given iterator function
		 * @method findIndex
		 * @param {Function} f iterator function f(element:*,index:Number,array:Array):Boolean
		 * @param {*} [receiver]
		 * @return {Number} index of the first matched element
		 */
		"findIndex",function findIndex(predicate){
			var list=Object(this);
			var length=ToUint32(list.length);
			if(length===0)
				return -1;
			if( typeof predicate!=="function"){
				throw new TypeError("Array#findIndex: predicate must be a function");
			}
			var thisArg=arguments[1];
			for(var i=0, value;i<length&& i in list;i++){
				value=list[i];
				if(predicate.call(thisArg,value,i,list))
					return i;
			}
			return -1;
		},
		/**
		 * Return a key-kind ArrayIterator object
		 * @method keys
		 * @return {Number} index of the first matched element
		 */
		"keys",function keys(){
			return new ArrayIterator(this,"key");
		},
		/**
		 * Return a value-kind ArrayIterator object
		 * @method values
		 * @return {Number} index of the first matched element
		 */
		"values",function values(){
			return new ArrayIterator(this,"value");
		},
		/**
		 * Return a entry-kind ArrayIterator object
		 * @method entries
		 * @return {Number} index of the first matched element
		 */
		"entries",function entries(){
			return new ArrayIterator(this,"entry");
		},
	]);
	//----------------------------------------------------------------
	// Number
	//----------------------------------------------------------------
	/**
	 * @namespace jsm.shims
	 * @class Number
	 * @extension Number
	 */
	SetProperties(Number,READ_ONLY|DONT_ENUM|DONT_DELETE,[
		/**
		 * @static
		 * @final
		 * @property MAX_SAFE_INTEGER
		 * @type Number
		 * @default 9007199254740991
		 */
		"MAX_SAFE_INTEGER",Math.pow(2,53)-1,
		/**
		 * @static
		 * @final
		 * @property MIN_SAFE_INTEGER
		 * @type Number
		 * @default -9007199254740991
		 */
		"MIN_SAFE_INTEGER",-(Math.pow(2,53)-1),
		/**
		 * @static
		 * @final
		 * @property EPSILON
		 * @type Number
		 * @default 2.220446049250313e-16
		 */
		"EPSILON",2.220446049250313e-16
	]);
	InstallFunctions(Number,DONT_ENUM,[
		/**
		 * @static
		 * @method parseInt
		 * @param {String} expression
		 * @param {Number} radix
		 * @return {Number}
		 */
		"parseInt",this.parseFloat,
		/**
		 * @static
		 * @method parseInt
		 * @param {String} expression
		 * @return {Number}
		 */
		"parseFloat",this.parseFloat,
		/**
		 * @static
		 * @method isFinite
		 * @param {Number} value
		 * @return {Boolean}
		 */
		"isFinite",function isFinite(value){
			return typeof value==="number"&&this.isFinite(value);
		},
		/**
		 * @static
		 * @method isFinite
		 * @param {Number} value
		 * @return {Boolean}
		 */
		"isSafeInteger",function isSafeInteger(value){
			return Number.parseInt(value,10)===value&&
				value>=Number.MIN_SAFE_INTEGER&&
				value<=Number.MAX_SAFE_INTEGER;
		},
		/**
		 * @static
		 * @method isNaN
		 * @param {Number} value
		 * @return {Boolean}
		 */
		"isNaN",function isNaN(value){
			return value!==value;
		}
	]);
	
	InstallFunctions(Number.prototype,DONT_ENUM,[
		/**
		 * @method clz
		 * @return {Number}
		 */
		"clz",function clz(){
			var number=+this;
			if(!number||!Number.isFinite(number))
				return 32;
			number=number<0?Math.ceil(number):Math.floor(number);
			number=number-Math.floor(number/0x100000000)*0x100000000;
			return 32-(number).toString(2).length;
		}
	]);
	//----------------------------------------------------------------
	// Object
	//----------------------------------------------------------------
	/**
	 * @namespace jsm.shims
	 * @class Object
	 * @extension Object
	 */
	InstallFunctions(Object,DONT_ENUM,[
		/**
		 * @static
		 * @method getOwnPropertyDescriptors
		 * @param {Object} object
		 * @return {Object}
		 */
		"getOwnPropertyDescriptors",function getOwnPropertyDescriptors(object){
			if(!(object instanceof Object)){
				throw new TypeError("Object.getOwnPropertyDescriptors called on non-object");
			}
			var descs={};
			Object.getOwnPropertyNames(object).forEach(function(name){
				descs[name]=Object.getOwnPropertyDescriptor(object,name);
			});
			return descs;
		},
		/**
		 * @static
		 * @method getPropertyDescriptor
		 * @param {Object} object
		 * @param {String} name
		 * @return {Object|null}
		 */
		"getPropertyDescriptor",function getPropertyDescriptor(object,name){
			if(!(object instanceof Object)){
				throw new TypeError("Object.getPropertyDescriptor called on non-object");
			}
			var d=Object.getOwnPropertyDescriptor(object,name);
			var proto=Object.getPrototypeOf(object);
			while(d===undefined&&proto!==null){
				d=Object.getOwnPropertyDescriptor(proto,name);
				proto=Object.getPrototypeOf(proto);
			}
			return d;
		},
		/**
		 * @static
		 * @method getPropertyNames
		 * @param {Object} object
		 * @return {Array}
		 */
		"getPropertyNames",function getPropertyNames(object){
			if(!(object instanceof Object)){
				throw new TypeError("Object.getPropertyNames called on non-object");
			}
			var result=Object.getOwnPropertyNames(object);
			var proto=Object.getPrototypeOf(object);
			var addProperty=function(name,names,result){
				if(result.indexOf(name)===-1){
					result.push(name);
				}
			};
			while(proto!==null){
				Object.getOwnPropertyNames(proto).forEach(addProperty,result);
				proto=Object.getPrototypeOf(proto);
			}
			return result;
		},
		/**
		 * @static
		 * @method assign
		 * @param {Object} target
		 * @param {Object} source
		 * @return {Object}
		 */
		"assign",function assign(target,source){
			if(!(object instanceof Object)){
				throw new TypeError("Object.getPropertyNames called on non-object");
			}
			Object.keys(source).forEach(function(key){
				Object.defineProperty();
				target[key]=source[key];
			});
			return target;
		},
		/**
		 * @static
		 * @method setPrototypeOf
		 * @param {Object} target
		 * @param {Object} proto
		 * @return {Object}
		 */
		"setPrototypeOf",function setPrototypeOf(O,proto){
			if(typeof O!=="object"||O===null){
				throw new TypeError("cannot set prototype on a non-object");
			}
			if(typeof proto!=="object"){
				throw new TypeError("can only set prototype to an object or null");
			}
			SetProto.call(O,proto);
			return O;
		},
		/**
		 * @static
		 * @method getOwnPropertyKeys
		 * @param {Object} subject
		 * @return {Array}
		 */
		"getOwnPropertyKeys",function getOwnPropertyKeys(subject){
			return Object.keys(subject);
		},
		/**
		 * @static
		 * @method is
		 * @param {*} a
		 * @param {*} b
		 * @return {Boolean}
		 */
		"is",function is(a,b){
			if(a===b){
				return (a!==0)||(1/a===1/b);
			}else{
				return (a!==a)&&(b!==b);
			}
		}
	]);
	//----------------------------------------------------------------
	// Math
	//----------------------------------------------------------------
	/**
	 * @namespace jsm.shims
	 * @class Math
	 * @extension Math
	 */
	InstallFunctions(Math,DONT_ENUM,[
		/**
		 * @static
		 * @method acosh
		 * @param {Number} value
		 * @return {Number}
		 */
		"acosh",function acosh(value){
			value=Number(value);
			if(Number.isNaN(value)||value<1)
				return NaN;
			if(value===1)
				return 0;
			if(value===Infinity)
				return value;
			return Math.log(value+Math.sqrt(value*value-1));
		},
		/**
		 * @static
		 * @method asinh
		 * @param {Number} value
		 * @return {Number}
		 */
		"asinh",function asinh(value){
			value=Number(value);
			if(value===0||!global_isFinite(value)){
				return value;
			}
			return Math.log(value+Math.sqrt(value*value+1));
		},
		/**
		 * @static
		 * @method atanh
		 * @param {Number} value
		 * @return {Number}
		 */
		"atanh",function atanh(value){
			value=Number(value);
			if(Number.isNaN(value)||value<-1||value>1){
				return NaN;
			}
			if(value===-1)
				return -Infinity;
			if(value===1)
				return Infinity;
			if(value===0)
				return value;
			return 0.5*Math.log((1+value)/(1-value));
		},
		/**
		 * @static
		 * @method cbrt
		 * @param {Number} value
		 * @return {Number}
		 */
		"cbrt",function cbrt(value){
			value=Number(value);
			if(value===0)
				return value;
			var negate=value<0, result;
			if(negate)
				value=-value;
			result=Math.pow(value,1/3);
			return negate?-result:result;
		},
		/**
		 * @static
		 * @method cosh
		 * @param {Number} value
		 * @return {Number}
		 */
		"cosh",function cosh(value){
			value=Number(value);
			if(value===0)
				return 1;
			// +0 or -0
			if(!global_isFinite(value))
				return value;
			if(value<0)
				value=-value;
			if(value>21)
				return Math.exp(value)/2;
			return (Math.exp(value)+Math.exp(-value))/2;
		},
		/**
		 * @static
		 * @method expm1
		 * @param {Number} value
		 * @return {Number}
		 */
		"expm1",function expm1(value){
			value=Number(value);
			if(value===-Infinity)
				return -1;
			if(!global_isFinite(value)||value===0)
				return value;
			var result=0;
			var n=50;
			for(var i=1;i<n;i++){
				for(var j=2, factorial=1;j<=i;j++){
					factorial*=j;
				}
				result+=Math.pow(value,i)/factorial;
			}
			return result;
		},
		/**
		 * @static
		 * @method hypot
		 * @param {Number} x
		 * @param {Number} y
		 * @return {Number}
		 */
		"hypot",function hypot(x,y){
			var anyNaN=false;
			var allZero=true;
			var anyInfinity=false;
			var numbers=[];
			Array.prototype.every.call(arguments, function(arg){
				var num=Number(arg);
				if(Number.isNaN(num))
					anyNaN=true;
				else if(num===Infinity||num===-Infinity)
					anyInfinity=true;
				else if(num!==0)
					allZero=false;
				if(anyInfinity){
					return false;
				} else if(!anyNaN){
					numbers.push(Math.abs(num));
				}
				return true;
			});
			if(anyInfinity)
				return Infinity;
			if(anyNaN)
				return NaN;
			if(allZero)
				return 0;
			numbers.sort(function(a,b){
				return b-a;
			});
			var largest=numbers[0];
			var divided=numbers.map(function(number){
				return number/largest;
			});
			var sum=divided.reduce(function(sum,number){
				return sum+=number*number;
			},0);
			return largest*Math.sqrt(sum);
		},
		/**
		 * @static
		 * @method log2
		 * @param {Number} value
		 * @return {Number}
		 */
		"log2",function log2(value){
			return Math.log(value)*Math.LOG2E;
		},
		/**
		 * @static
		 * @method log10
		 * @param {Number} value
		 * @return {Number}
		 */
		"log10",function log10(value){
			return Math.log(value)*Math.LOG10E;
		},
		/**
		 * @static
		 * @method log1p
		 * @param {Number} value
		 * @return {Number}
		 */
		"log1p",function log1p(value){
			value=Number(value);
			if(value<-1||Number.isNaN(value))
				return NaN;
			if(value===0||value===Infinity)
				return value;
			if(value===-1)
				return -Infinity;
			var result=0;
			var n=50;
			if(value<0||value>1)
				return Math.log(1+value);
			for(var i=1;i<n;i++){
				if((i%2)===0){
					result-=Math.pow(value,i)/i;
				} else {
					result+=Math.pow(value,i)/i;
				}
			}
			return result;
		},
		/**
		 * @static
		 * @method sign
		 * @param {Number} value
		 * @return {Number}
		 */
		"sign",function sign(value){
			var number=+value;
			if(number===0)
				return number;
			if(Number.isNaN(number))
				return number;
			return number<0?-1:1;
		},
		/**
		 * @static
		 * @method sinh
		 * @param {Number} value
		 * @return {Number}
		 */
		"sinh",function sinh(value){
			value=Number(value);
			if(!global_isFinite(value)||value===0)
				return value;
			return (Math.exp(value)-Math.exp(-value))/2;
		},
		/**
		 * @static
		 * @method tanh
		 * @param {Number} value
		 * @return {Number}
		 */
		"tanh",function tanh(value){
			value=Number(value);
			if(Number.isNaN(value)||value===0)
				return value;
			if(value===Infinity)
				return 1;
			if(value===-Infinity)
				return -1;
			return (Math.exp(value)-Math.exp(-value))/(Math.exp(value)+Math.exp(-value));
		},
		/**
		 * @static
		 * @method trunc
		 * @param {Number} value
		 * @return {Number}
		 */
		"trunc",function trunc(value){
			var number=Number(value);
			return number<0?-Math.floor(-number):Math.floor(number);
		},
		/**
		 * @static
		 * @method imul
		 * @param {Number} value
		 * @return {Number}
		 */
		"umul",function imul(x,y){
			// taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul
			var ah=(x>>>16)&0xffff;
			var al=x&0xffff;
			var bh=(y>>>16)&0xffff;
			var bl=y&0xffff;
			// the shift by 0 fixes the sign on the high part
			// the final |0 converts the unsigned value into a signed value
			return ((al*bl)+(((ah*bl+al*bh)<<16)>>>0)|0);
		}
	]);
}());