define("jsm/lang/Class",[],function(){
	"use strict";
	//--------------------------------
	// scoped
	//--------------------------------
	var LITERAL_PROTO="__proto__",
		LITERAL_INTFS="__intfs__",
		SUPER_CLASS="[[SuperClass]]",
		INTERFACES="[[Interfaces]]";
	function FunctionIsBuiltin(f){
		return typeof f==="function"&&Function.prototype.toString.call(f).indexOf("[native code]")>0;
	}
	var nativeDesc=Object.getOwnPropertyDescriptor(Function.prototype,"toString");
	var customDesc={
		writable:true,
		enumerable:false,
		configurable:true,
		value:function toString(){return "function "+this.name+"() { [custom code] }";}
	};
	function SetNativeFlag(f){
		if(FunctionIsBuiltin(f)){
			Object.defineProperty(f,"toString",nativeDesc);
		}else{
			Object.defineProperty(f,"toString",customDesc);
		}
	}
	SetNativeFlag(customDesc.value);
	function IsReservedWord(name){
		return name==="name"||name==="length"||name==="arguments"||name==="caller"||name==="prototype";
	};
	function FormatMessage(){
		var args=arguments;
		return args[0].replace(/\$([\$\d])/g,function($n,n){
			return n==="$"?n:args.hasOwnProperty(n)?args[n]:$n;
		});
	}
	function ToDescriptors(literals){
		var descriptors={};
		Object.getOwnPropertyNames(literals).forEach(function(name){
			descriptors[name]={writable:true,enumerable:true,configurable:true,value:this[name]};
		},literals);
		return descriptors;
	}
	function ProcessDescriptors(descriptors){
		Object.getOwnPropertyNames(descriptors).forEach(function(name){
			var p=this[name],v=p.value;
			if(v){
				if(typeof v=="function"){
					SetNativeFlag(v);
					if(name!=="constructor"){
						v.prototype=null;
					}
				}
			}else{
				if(p.get){SetNativeFlag(p.get);}
				if(p.set){SetNativeFlag(p.set);}
			}
		},descriptors);
	}
	function DetectDescriptor(literals){
		return !Object.getOwnPropertyNames(literals).some(function(name){
			if(name==SUPER_CLASS||name==INTERFACES){return false;}
			var d=this[name];
			return !d.hasOwnProperty("writable")&&
					!d.hasOwnProperty("enumerable")&&
					!d.hasOwnProperty("configurable");
		},literals);
	}
	function CheckIfImplemented(C,interfaces){
		return interfaces.every(function(I){
			if(typeof I !=="function"){
				console.assert(false,FormatMessage("interface $1 is not a function",
							typeof this[name],C.name,name,I.name));
			}
			return Object.getOwnPropertyNames(I).every(function(name){
				if(IsReservedWord(name)){return true;}
				if(!C.hasOwnProperty(name)){
					console.assert(false,FormatMessage("$1 '$2.$3' not implemented from '$4'",
							typeof this[name],C.name,name,I.name));
					return false;
				}
				return true;
			},I)&&Object.getOwnPropertyNames(I.prototype).every(function(name){
				if(!C.prototype.hasOwnProperty(name)){
					console.assert(false,FormatMessage("$1 '$2.prototype.$3' not implemented from '$4.prototype'",
							typeof this[name],C.name,name,I.name));
					return false;
				}
				return true;
			},I.prototype);
		});
	}
	//--------------------------------
	// Class
	//--------------------------------
	function declareClassWithLiterals(literals,constants){
		var C=literals.constructor,
			superClass=literals[LITERAL_PROTO]||Object.prototype,
			interfaces=literals[LITERAL_INTFS];
		delete literals[LITERAL_PROTO];
		var descriptors=ToDescriptors(literals);
		C.prototype=Object.create(superClass,descriptors);
		ProcessDescriptors(descriptors);
		if(constants){
			descriptors=ToDescriptors(constants);
			Object.defineProperties(C,descriptors);
			ProcessDescriptors(descriptors);
		}
		if(interfaces&&interfaces.length){
			CheckIfImplemented(C,interfaces);
		}
		return C;
	}
	function declareClassWithDescriptors(instanceDescriptors,staticDescriptors){
		var d=instanceDescriptors,s=staticDescriptors;
		var C=d.constructor.value,
			superClass=d[SUPER_CLASS],
			interfaces=d[INTERFACES];
		delete d[SUPER_CLASS];
		delete d[INTERFACES];
		ProcessDescriptors(d);
		if(superClass){
			C.prototype=Object.create(superClass,d);
		}else{
			Object.defineProperties(C.prototype,d);
		}
		if(s){
			Object.defineProperties(C,s);
		}
		SetNativeFlag(C);
		if(interfaces){
			CheckIfImplemented(C,interfaces);
		}
		return C;
	}
	function declareClass(d,s){
		if(typeof d.constructor==="function"){
			return declareClassWithLiterals(d,s);
		}else if(typeof d.constructor==="object"){
			return declareClassWithDescriptors(d,s);
		}else{
			throw new TypeError("unrecognized arguments: class may only declared with literals or descriptors");
		}
	}
	function assignClass(C,d,s){
		if(d){
			if(!DetectDescriptor(d)){d=ToDescriptors(d);}
			Object.defineProperties(C.prototype,d);
			ProcessDescriptors(d);
		}
		if(s){
			if(!DetectDescriptor(s)){s=ToDescriptors(s);}
			Object.defineProperties(C,s);
			ProcessDescriptors(s);
		}
	}
	var Class=declareClass({
		constructor:function Class(){
			
		}
	},{
		create:function create(superClass,descriptors,staticDescriptors,interfaces){
			descriptors[SUPER_CLASS]=superClass;
			descriptors[INTERFACES]=interfaces;
			declareClass(descriptors,staticDescriptors);
		},
		assign:assignClass,
		declare:declareClass
	});
	return Class;
});
