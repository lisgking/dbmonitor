define("jsm/lang/Object",[],function(){
	"use strict";
	var NONE=0,
		READ_ONLY=1,
		DONT_ENUM=2,
		DONT_DELETE=4;
	function ToDescriptor(a){
		a&=7;
		return {
			writable:!(a&1),
			enumerable:!(a&2),
			configurable:!(a&4)
		};
	}
	function assignProperties(object,source){
		if(!(object instanceof Object)){throw new TypeError("assignProperties called on non-object");}
		source=Object(source);
		var keys=Object.keys(source),i,key;
		for(i=0;i<keys.length;i++){
			key=keys[i];
			object[key]=source[key];
		}
		return object;
	}
	function mixinProperties(object,source){
		if(!(object instanceof Object)){throw new TypeError("mixinProperties called on non-object");}
		source=Object(source);
		var keys=Object.keys(source),i,key,desc;
		for(i=0;i<keys.length;i++){
			key=keys[i];
			desc=Object.getOwnPropertyDescriptor(source,key);
			Object.defineProperty(object,key,desc);
		}
		return object;
	}
	function defineDataProperties(object,values,attributes){
		if(!(object instanceof Object)){throw new TypeError("defineDataProperties called on non-object");}
		values=Object(values);
		var desc=ToDescriptor(attributes);
		var keys=Object.keys(values),i,key;
		for(i=0;i<keys.length;i++){
			key=keys[i];
			desc.value=values[key];
			Object.defineProperty(object,key,desc);
		}
		return object;
	}
	function defineAccessorProperties(object,descriptors,attributes){
		if(!(object instanceof Object)){throw new TypeError("defineAccessorProperties called on non-object");}
		descriptors=Object(descriptors);
		var desc=ToDescriptor(attributes);
		delete desc.writable;
		var keys=Object.keys(descriptors),i,key,ownDesc;
		for(i=0;i<keys.length;i++){
			key=keys[i];
			ownDesc=descriptors[key];
			desc.get=ownDesc.get;
			desc.set=ownDesc.set;
			Object.defineProperty(object,key,desc);
		}
	}
	"exports";
	var exports=function Object(){};
	defineDataProperties(exports,{
		assignProperties:assignProperties,
		defineDataProperties:defineDataProperties,
		defineAccessorProperties:defineAccessorProperties
	},NONE);
	return exports;
});