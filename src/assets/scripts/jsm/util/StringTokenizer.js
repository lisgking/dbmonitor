(function(global){
"use strict";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ES6 String (partial)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
if(!String.prototype.codePointAt)
String.prototype.codePointAt=function codePointAt(position) {
	if (this == null) {
		throw TypeError();
	}
	var string = String(this);
	var size = string.length;
	// `ToInteger`
	var index = position ? Number(position) : 0;
	if (index != index) { // better `isNaN`
		index = 0;
	}
	// Account for out-of-bounds indices:
	if (index < 0 || index >= size) {
		return undefined;
	}
	// Get the first code unit
	var first = string.charCodeAt(index);
	var second;
	if ( // check if it’s the start of a surrogate pair
		first >= 0xD800 && first <= 0xDBFF && // high surrogate
		size > index + 1 // there is a next code unit
	) {
		second = string.charCodeAt(index + 1);
		if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
			// http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
			return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
		}
	}
	return first;
};
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Java Character (partial)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function Character(){}
Character.MIN_HIGH_SURROGATE='\uD800';
Character.MAX_LOW_SURROGATE='\uDBFF';
Character.MIN_SUPPLEMENTARY_CODE_POINT=0x10000;
Character.charCount=function charCount(codePoint){
	return codePoint >= Character.MIN_SUPPLEMENTARY_CODE_POINT ? 2 : 1;
};
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Java StringTokenizer
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function StringTokenizer(_str,_delim,_returnDelims){
	"private";
	var currentPosition=0;
	var newPosition=0;
	var maxPosition=0;
	var str=null;
	var delimiters=null;
	var retDelims=false;
	var delimsChanged=false;
	
	var maxDelimCodePoint=0;
	var hasSurrogates=false;
	var delimiterCodePoints;
	"private";
	function constructor(_str, _delim, _returnDelims){
		currentPosition=0;
		newPosition=-1;
		delimsChanged=false;
		str=String(_str);
		maxPosition=str.length;
		delimiters=String(_delim);
		retDelims=Boolean(_returnDelims);
		setMaxDelimCodePoint.call(this);
	}
	function setMaxDelimCodePoint(){
		if(delimiters==null) {
			maxDelimCodePoint=0;
			return;
		}
		var m=0, c, count=0, i, j;
		for( i=0; i<delimiters.length; i+=Character.charCount(c)) {
			c=delimiters.charCodeAt(i);
			if(c>=Character.MIN_HIGH_SURROGATE&&c<=Character.MAX_LOW_SURROGATE) {
				c=delimiters.codePointAt(i);
				hasSurrogates=true;
			}
			if(m<c)
				m=c;
			count++;
		}
		maxDelimCodePoint=m;
		if(hasSurrogates) {
			delimiterCodePoints=new int[count];
			for( i=0, j=0; i<count; i++,j+=Character.charCount(c)) {
				c=delimiters.codePointAt(j);
				delimiterCodePoints[i]=c;
			}
		}
	}
	function skipDelimiters(startPos) {
		if(delimiters==null)
			throw new Error("NullPointerException");
		var position=startPos>>>0, c;
		while(!retDelims&&position<maxPosition) {
			if(!hasSurrogates) {
				c=str.charAt(position);
				if((c.charCodeAt(0)>maxDelimCodePoint)||(delimiters.indexOf(c)<0))
					break;
				position++;
			} else {
				c=str.codePointAt(position);
				if((c>maxDelimCodePoint)||!isDelimiter(c)) {
					break;
				}
				position+=Character.charCount(c);
			}
		}
		return position;
	}
	function scanToken(startPos){
		var position=startPos>>>0, c;
		while(position<maxPosition) {
			if(!hasSurrogates) {
				c=str.charAt(position);
				if((c.charCodeAt(0)<=maxDelimCodePoint)&&(delimiters.indexOf(c)>=0))
					break;
				position++;
			} else {
				c=str.codePointAt(position);
				if((c<=maxDelimCodePoint)&&isDelimiter(c))
					break;
				position+=Character.charCount(c);
			}
		}
		if(retDelims&&(startPos==position)) {
			if(!hasSurrogates) {
				c=str.charAt(position);
				if((c.charCodeAt(0)<=maxDelimCodePoint)&&(delimiters.indexOf(c)>=0))
					position++;
			} else {
				c=str.codePointAt(position);
				if((c<=maxDelimCodePoint)&&isDelimiter(c))
					position+=Character.charCount(c);
			}
		}
		return position;
	}
	function isDelimiter(codePoint){
		for(var i=0; i<delimiterCodePoints.length; i++) {
			if(delimiterCodePoints[i]==codePoint) {
				return true;
			}
		}
		return false;
	}
	"public";
	function hasMoreTokens(){
		newPosition = skipDelimiters(currentPosition);
		return (newPosition < maxPosition);
	}
	function nextToken(){
		currentPosition=(newPosition>=0&&!delimsChanged)?newPosition:skipDelimiters(currentPosition);
		/* Reset these anyway */
		delimsChanged=false;
		newPosition=-1;
		if(currentPosition>=maxPosition)
			throw new Error("NoSuchElementException");
		var start=currentPosition;
		currentPosition=scanToken(currentPosition);
		return str.substring(start,currentPosition);
	}
	function countTokens() {
		var count=0, currpos=currentPosition;
		while(currpos<maxPosition) {
			currpos=skipDelimiters(currpos);
			if(currpos>=maxPosition)
				break;
			currpos=scanToken(currpos);
			count++;
		}
		return count;
	}
	"export";
	this.hasMoreTokens=hasMoreTokens;
	this.nextToken=nextToken;
	this.countTokens=countTokens;
	this.debug=function(){
		debugger;
	};
	"constructor";
	switch(arguments.length){
		case 0:
			throw new TypeError("1 argument required, but 0 passed");
		case 1:
			constructor.call(this, _str, " \t\n\r\f", false);
			break;
		case 2:
			constructor.call(this, _str, _delim, false);
			break;
		case 3:default:
			constructor.call(this, _str, _delim, _returnDelims);
			break;
	}
}
if(typeof define==="function"&&define.amd){
	define([],function(){return StringTokenizer;});
}else{
	global["StringTokenizer"]=StringTokenizer;
}
}(this));