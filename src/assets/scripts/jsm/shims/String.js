define([],function(){
	/**
	 * @namespace jsm.shims
	 * @class String
	 * @extension String
	 */
	function ToUint32(v){
		return v>>>0;
	}
	function ToInteger(v){
		var n=+v;
		if(n!==n){return 0;}
		if(n===0||1/n===0){return n;}
		return (n>0?1:-1)*Math.floor(Math.abs(n));
	}
	/**
	 * @static
	 * @method fromCodePoint
	 * @param {Number} [point]*
	 * @return {String}
	 */
	function fromCodePoint(){
		var points=Array.prototype.slice.call(arguments,0);
		var result=[];
		var next;
		for(var i=0, length=points.length;i<length;i++){
			next=+points[i];
			if(!Object.is(next,ToInteger(next))||next<0||next>0x10FFFF){
				throw new RangeError("Invalid code point "+next);
			}
			if(next<0x10000){
				result.push(next);
			} else {
				next-=0x10000;
				result.push((next>>10)+0xD800);
				result.push((next%0x400)+0xDC00);
			}
		}
		return String.fromCharCode.apply(null,result);
	}
	/**
	 * @static
	 * @method raw
	 * @param {Object} callSite
	 * @param {String} [substitution]
	 * @return {String}
	 */
	function raw(){
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
	InstallFunctions(String,DONT_ENUM|DONT_OVERWRITE,[
		"fromCodePoint",fromCodePoint,
		"raw",raw
	]);
	/**
	 * @method repeat
	 * @param {Number} times
	 * @return {String}
	 */
	function repeat(t){
		t=+t;
		if(t!==t||t<0){
			throw new RangeError("Invalid count value");
		}
		var s=this,r="";
		while(true) {
			if(t&1)
				r+=s;
			t>>=1;
			if(t===0)
				return r;
			s+=s;
		}
		return s;
	}
	/**
	 * @method startsWith
	 * @param {String} str
	 * @param {Number} [pos=0]
	 * @return {Boolean}
	 */
	function startsWith(str,pos){
		if(this===null||this===void 0){
			throw new TypeError("String.prototype.startsWith called on null or undefined.");
		}
		str=String(str);
		var pos=Math.max(ToInteger(pos),0);
		return this.substr(pos,str.length)===str;
	}
	/**
	 * @method endsWith
	 * @param {String} str
	 * @param {Number} [pos=0]
	 * @return {Boolean}
	 */
	function endsWith(str,pos){
		if(this===null||this===void 0){
			throw new TypeError("String.prototype.endsWith called on null or undefined.");
		}
		str=String(str);
		var len=this.length;
		var pos=Math.min(Math.max(ToInteger(pos),0),len);
		return this.substr(pos-str.length,str.length)===str;
	}
	/**
	 * @method contains
	 * @param {String} str
	 * @param {Number} pos
	 * @return {Boolean}
	 */
	function contains(str,pos){
		return this.indexOf(str,pos)!==-1;
	}
	/**
	 * @method codePointAt
	 * @param {Number} pos
	 * @return {Number}
	 */
	function codePointAt(pos){
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
	InstallFunctions(String.prototype,DONT_ENUM|DONT_OVERWRITE,[
		"repeat", repeat,
		"startsWith",startsWith,
		"endsWith",endsWith,
		"contains",contains,
		"codePointAt",codePointAt
	]);
});
