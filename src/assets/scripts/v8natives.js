(function(global){
	"use strict";
	//--------------------------------
	// v8 features
	//--------------------------------
	/**
	 * Transported this from v8 native to modern browsers
	 * @namespace thirdpart
	 * @class v8natives
	 */
		/**
		 * Indicates a property is writable, enumerable and configurable(000<sub>2</sub>)
		 * @property NONE
		 * @type Number
		 * @default 0
		 * @example use | to combine attributes, or express attributes with 755-like
		 * <pre><code>SetProperty(Math.MAX_INTEGER,READ_ONLY|DONT_ENUM|DONT_DELETE,Math.pow(2,31)-1)
		 * </code></pre>
		 */
	var NONE=0,
		/**
		 * Indicates a property is non-writable(001<sub>2</sub>)
		 * @property READ_ONLY
		 * @type Number
		 * @default 1
		 */
		READ_ONLY=1,
		/**
		 * Indicates a property is non-enumerable(010<sub>2</sub>)
		 * @property DONT_ENUM
		 * @type Number
		 * @default 2
		 */
		DONT_ENUM=2,
		/**
		 * Indicates a property is non-configurable(100<sub>2</sub>)
		 * @property DONT_DELETE
		 * @type Number
		 * @default 4
		 */
		DONT_DELETE=4,
		/**
		 * Indicates only update existing properties(100<sub>2</sub>)
		 * @property DONT_OVERWRITE
		 * @type Number
		 * @default 8
		 */
		DONT_OVERWRITE=8,
		/**
		 * Indicates only update existing properties(100<sub>2</sub>)
		 * @property DONT_EXTEND
		 * @type Number
		 * @default 8
		 */
		DONT_EXTEND=16;
	var kMessages={
		called_non_callable:"$0 is not a function",
		called_on_null_or_undefined:"$0 called on null or undefined",
		no_such_property:"object $0 has no such property $1",
		is_not_a_object:"$0 is not a Object",
		is_not_a_array:"$0 is not a Array",
		is_not_a_function:"$0 is not a function",
		invalid_super:"super class may only be an Object or null",
		invalid_attribute:"invalid attribute: $0",
		invalid_ordinal:"invalid ordinal: $0"
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
	var IsPlainObject=function(v){return typeof v==="object"&&v!==null;},
		IsFunction=function(v){return typeof v==="function";},
		IsObject=function(v){return typeof v==="object"&&v!==null||typeof v==="function";},
		IsNullOrUndefined=function(v){return v===null||v===void 0;},
		ToObject=function(v){return Object(v);},
		ToArray=function(v){return (v===null||v===void 0)?[]:Array.prototype.slice.call(v);;},
		ToDescriptor=function(a){return {writable:!(a&1),enumerable:!(a&2),configurable:!(a&4)};},
		FunctionGetName=function(f){return f.name;},
		FunctionSetName=function(f,name){},
		FunctionRemovePrototype=function(f){f.prototype=null;},
		HasOwnProperty=function(object,key){return Object.prototype.hasOwnProperty.call(object,key);},
		GetDesc=Object.getOwnPropertyDescriptor,
		GetOwnPropertyDescriptors=function(o){
			return Object.getOwnPropertyNames(o).reduce(function(p,n){
				p[n]=Object.getOwnPropertyDescriptor(o,n);
				return p;
			},{});
		},
		CompareDesc=function(a,b){if(!a){return true;}},
		IsReservedWord=function(name){
			return name==="name"||name==="length"||name==="arguments"||name==="caller"||name==="prototype";
		};
	
	var toStringDescriptor0=Object.getOwnPropertyDescriptor(Function.prototype,"toString"),
		toStringDescriptor={
			writable:true,
			conficurable:true,
			value:function(){return "function "+this.name+"() { [custom code] }";}
		},
		toSourceDescriptor={
			writable:true,
			conficurable:true,
			value:function(){return Function.prototype.toString.call(this);}
		};
	function MixIn(object,source,names,excludes){
		if(typeof object!=="object"&&typeof object!=="function"||object===null){object=Object(object);}
		if(typeof source!=="object"&&typeof source!=="function"||source===null){source=Object(source);}
		if(!Array.isArray(names)){names=Object.getOwnPropertyNames(source);}
		var i,pos,name,desc;
		if(Array.isArray(excludes)){
			for(i=0;i<excludes.length;i++){
				name=excludes[i];
				pos=names.indexOf(name);
				if(pos!==-1){
					names.splice(pos,1);
				}
			}
		}
		for(i=0;i<names.length;i++){
			name=names[i];
			desc=Object.getOwnPropertyDescriptor(source,name);
			if(desc){
				Object.defineProperty(object,name,desc);
			}
		}
		return object;
	}
	function Assign(object,source,names,excludes){
		if(typeof object!=="object"&&typeof object!=="function"||object===null){object=Object(object);}
		if(typeof source!=="object"&&typeof source!=="function"||source===null){source=Object(source);}
		if(!Array.isArray(names)){names=Object.getOwnPropertyNames(source);}
		var i,pos,name;
		if(Array.isArray(excludes)){
			for(i=0;i<excludes.length;i++){
				name=excludes[i];
				pos=names.indexOf(name);
				if(pos!==-1){
					names.splice(pos,1);
				}
			}
		}
		for(i=0;i<names.length;i++){
			name=names[i];
			object[name]=source[name];
		}
		return object;
	}
	/**
	 * check whether a function is native code
	 * @method FunctionIsBuiltin
	 * @param {Function} f
	 * @return {Boolean}
	 */
	function FunctionIsBuiltin(f){
		try{
			return typeof f==="function"&&Function.prototype.toString.call(f).indexOf("[native code]")>0;
		}catch(e){
			if(e.message==="Function.prototype.toString called on incompatible object"){
				return true;
			}
			return false;
		}
	}
	/**
	 * set a toString property for a function
	 * @method SetNativeFlag
	 * @param {Function} f
	 */
	function SetNativeFlag(f){
		if(FunctionIsBuiltin(f)){
			//Object.defineProperty(f,"toString",toStringDescriptor0);
		}else{
			Object.defineProperty(f,"toString",toStringDescriptor);
		}
	}
	Object.defineProperty(toStringDescriptor.value,"toString",toStringDescriptor);
	if(!Function.prototype.toSource){
		Object.defineProperty(Function.prototype,"toSource",toSourceDescriptor);
		Object.defineProperty(toSourceDescriptor.value,"toString",toStringDescriptor);
	}
	/**
	 * get type name of o
	 * @method TypeNameOf
	 * @param {Object} o
	 * @returns {String} 
	 * @example <pre><code>TypeNameOf(null); //"Null"</code></pre>
	 */
	function TypeNameOf(o){
		var s=Object.prototype.toString.call(o);
		return s.slice(8,-1);
	}
	/**
	 * MapToList properties converter
	 * @method MapToList
	 * @param {Object} map
	 * @returns {Array}
	 * @example <pre><code>MapToList({a:0,b:1}) //["a",0,"b",1]</code></pre>
	 */
	function MapToList(map){
		var arr=[];
		Object.getOwnPropertyNames(map).forEach(function(name){
			arr.push(name,map[name]);
		});
		return arr;
	}
	/**
	 * extend a object(like ObjectAssign)
	 * @method ExtendObject
	 * @param {Object} object
	 * @param {Object} source
	 * @param {Number} [method=0] [optional] DONT_OVERWRITE, DONT_EXTEND or undefined
	 * @returns {Object} Object(object) itself
	 * @example <pre><code>ExtendObject({width:550,height:400},options);</code></pre>
	 */
	function ExtendObject(object,source/*,method*/){
		object=Object(object);
		var method=arguments[2]>>>0,
			iterator;
		if(IsObject(source)){
			if(method===NONE){
				iterator=function(key){this[key]=source[key];};
			}else if(method&DONT_EXTEND){
				iterator=function(key){if(HasOwnProperty(this,key)){this[key]=source[key];}};
			}else if(method&DONT_OVERWRITE){
				iterator=function(key){if(!HasOwnProperty(this,key)){this[key]=source[key];}};
			}else{
				//iterator=Function.prototype;
				return object;
			}
			Object.keys(source).forEach(iterator,object);
		}
		return object;
	}
	/**
	 * @method ExtendClass
	 * @param {Function} Child
	 * @param {Function} Super
	 * @returns {Object} Child itself
	 * @example <pre><code>ExtendClass(FooBar,Bar);</code></pre>
	 */
	function ExtendClass(Child,Super){
		if(!IsObject(Super)){
			throw new TypeError(FormatMessage("invalid_super"));
		}
		Child.prototype=Object.create(Super.prototype,GetOwnPropertyDescriptors(Child.prototype));
		//Child.prototype=MixIn(Object.create(Super.prototype),Child.prototype);
		return Child;
	}
	function lookupNameFunction(groupName){
		return function nameOf(name){
			return this.__enum__[groupName].ordinals[name];
		};
	}
	/**
	 * @method SetEnumValues
	 * @param {Object} object
	 * @param {Number} attributes
	 * @param {Array} values
	 * @returns {Object} object itself
	 */
	function SetEnumValues(object,attributes,values,groupName){
		if(groupName===void 0){
			groupName="_";
		}else{
			groupName=String(groupName);
		}
		var groups=object.__enum__;
		if(!groups){
			groups={};
			SetProperty(object,DONT_ENUM|READ_ONLY,"__enum__",groups);
		}
		var group=groups[groupName];
		if(!group){groups[groupName]=group={};}
		var ordinals=group.ordinals;
		if(!ordinals){
			group.ordinals=ordinals=[];
			if(groupName==="_"){
				InstallFunctions(object,DONT_ENUM,[
					"nameOf",lookupNameFunction(groupName)
				]);
			}else{
				InstallFunctions(object,DONT_ENUM,[
					groupName+"NameOf",lookupNameFunction(groupName)
				]);
			}
		}
		for(var i=0,l=values.length;i<l;i+=2){
			var name=values[i];
			var ordinal=values[i+1];
			if(typeof ordinal!=="number"){
				throw new TypeError(FormatMessage("invalid_ordinal",[ordinal]));
			}
			ordinals[ordinal]=name;
		}
		SetProperties(object,attributes,values);
		return object;
	}
	/**
	 * @method ImplementInterface
	 * @param {Object} impl
	 * @param {Function} [interface]*
	 * @returns {Boolean} indicates whether passed implementation test
	 * @example <pre><code>ImplementInterface(FooBar,Foo);</code></pre>
	 */
	function ImplementInterface(impl/*,...interfaces*/){
		if(!IsObject(impl)){throw new TypeError(FormatMessage("is_not_a_object",[impl]));}
		return Array.prototype.slice.call(arguments,1).every(function(intf){
			if(!IsObject(intf)){throw new TypeError(FormatMessage("is_not_a_object",[intf]));}
			return Object.getOwnPropertyNames(intf).every(function(name){
				if(IsReservedWord(name)){return true;}
				if(CompareDesc(GetDesc(impl,name),GetDesc(this,name))){
					var type=IsFunction(intf[name])?"function":"property";
					console.assert(false,type+" '"+impl.name+"."+name+"' not implemented");
					return false;
				}
				return true;
			},intf)&&Object.getOwnPropertyNames(intf.prototype).every(function(name){
				if(CompareDesc(GetDesc(impl.prototype,name),GetDesc(this,name))){
					var type=IsFunction(intf.prototype[name])?"function":"property";
					console.assert(false,type+" '"+impl.name+".prototype."+name+"' not implemented");
					return false;
				}
				return true;
			},intf.prototype);
		});
	}
	/**
	 * @method RenameProperty
	 * @param {Object} object
	 * @param {String} name
	 * @param {String} newName
	 * @returns {Object} object itself
	 * @example <pre><code>RenameProperty(Window.prototype,"setTimeout","msSetTimeout");
	 * //now msSetTimeout like "function(){[native code]}"</code></pre>
	 */
	function RenameProperty(object,name,newName){
		var oldD=Object.getOwnPropertyDescriptor(object,name);
		var newD=Object.getOwnPropertyDescriptor(object,name);
		if(oldD){
			if(!newD||newD.configurable){
				Object.defineProperty(object,newName,oldD);
			}else if(newD.writable){
				object[newName]=object[name];
			}else{
				throw new Error("Unable to redefine nor write property '"+name+"'");
			}
			if(oldD.configurable){
				delete object[name];
			}
		}
		return object;
	}
	/**
	 * @method IsArrayLike
	 * @param {Object} o
	 * @returns {Boolean}
	 * @example <pre><code>IsArrayLike({length:2,0:"foo",1:"bar"}); //true</code></pre>
	 */
	function IsArrayLike(o){
		var l;
		return o!==null&&o!==void 0&&(l=o.length)===l>>>0;
	}
	/**
	 * @method SetProperty
	 * @param {Object} object 
	 * @param {Number} attributes
	 * @param {String} name
	 * @param {*} value
	 * @returns {Object} object itself
	 */
	function SetProperty(object,attributes,name,value){
		var d=ToDescriptor(attributes);
		d.value=value;
		Object.defineProperty(object,name,d);
		return object;
	}
	/**
	 * @method InstallFunctions
	 * @param {Object} object
	 * @param {Number} attributes
	 * @param {Array} functions
	 * @returns {Object} object itself
	 * @example <pre><code>InstallFunctions(List.prototype,DONT_ENUM,[
	 * 	"unique",function(){},
	 * 	"add",Array.prototype.push
	 * ]);</code></pre>
	 */
	function InstallFunctions(object,attributes,functions/*,method*/){
		if(!IsObject(object)){throw new TypeError(FormatMessage("is_not_a_object",[object]));}
		if(attributes<0||attributes>31){throw new TypeError(FormatMessage("invalid_attribute",[attributes]));}
		if(!(functions instanceof Array)){throw new TypeError(FormatMessage("is_not_a_array",[functions]));}
		var method=arguments[3]&3;
		var i,name,f,d,desc=ToDescriptor(attributes);
		for(i=0; i<functions.length; i+=2){
			name=functions[i];
			f=functions[i+1];
			if(!IsFunction(f)){
				throw new TypeError(FormatMessage("is_not_a_function",[f]));
			}
			if(name!=="constructor")FunctionRemovePrototype(f);
			d=Object.getOwnPropertyDescriptor(object,name);
			if(!d){
				if(method===DONT_EXTEND||attributes&DONT_EXTEND){
					
				}else{
					desc.value=f;
					Object.defineProperty(object,name,desc);
				}
			}else {
				if(method===DONT_OVERWRITE||attributes&DONT_OVERWRITE){
					
				}else{
					if(d.configurable){
						desc.value=f;
						Object.defineProperty(object,name,desc);
					}else if(d.writable){
						object[name]=f;
					}else{
						throw new Error("Unable redefine nor write property '"+name+"'");
					}
				}
			}
			SetNativeFlag(f);
		}
		return object;
	}
	/**
	 * @method SetProperties
	 * @param {Object} object
	 * @param {Number} attributes
	 * @param {Array} properties
	 * @returns {Object} object itself
	 * @example <pre><code>SetProperties(Number, READ_ONLY|DONT_ENUM|DONT_DELETE,
	 * 	"MIN_SAFE_INTEGER",-(Math.pow(2,53)-1),
	 * 	"MAX_SAFE_INTEGER",Math.pow(2,53)-1,
	 * );</code></pre>
	 */
	function SetProperties(object,attributes,properties){
		if(!IsObject(object)){throw new TypeError(FormatMessage("is_not_a_object",[object]));}
		var i,name,desc=ToDescriptor(attributes);
		for(i=0; i<properties.length; i+=2) {
			name=properties[i];
			desc.value=properties[i+1];
			Object.defineProperty(object,name,desc);
		}
		return object;
	}
	function DefineOrRedefineAccessorProperty(object,name,getter,setter,attributes){
		var d=ToDescriptor(attributes);
		delete d.writable;
		if(getter)d.get=getter;
		if(setter)d.set=setter;
		Object.defineProperty(object,name,d);
	}
	/**
	 * @method InstallGetter
	 * @param {Object} object
	 * @param {String} name
	 * @param {Function} getter
	 * @param {Number} [attributes=0]
	 * @returns {Object} object itself
	 * @example <pre><code>InstallGetter(document.styles,function(){
	 * 	return document.getElementsByTagName("style");
	 * });</code></pre>
	 */
	function InstallGetter(object,name,getter,attributes){
		if(!IsObject(object)){throw new TypeError(FormatMessage("is_not_a_object",[object]));}
		if(!IsFunction(getter)){throw new TypeError(FormatMessage("called_non_callable",[getter]));}
		FunctionSetName(getter,name);
		FunctionRemovePrototype(getter);
		DefineOrRedefineAccessorProperty(object,name,getter,null,attributes);
		SetNativeFlag(getter);
		return object;
	}
	function InstallGetters(object,attributes,getters){
		var i,name,v;
		for(i=0; i<getters.length; i+=2) {
			name=getters[i];
			v=getters[i+1];
			InstallGetter(object,name,v,attributes);
		}
	}
	/**
	 * @method InstallGetterSetter
	 * @param {Object} object
	 * @param {String} name
	 * @param {Function} getter
	 * @param {Function} setter
	 * @param {Number} [attributes=0]
	 * @returns {Object} object itself
	 * @example <pre><code>InstallGetterSetter(HTMLElement.prototype,"hidden",
	 * function(){
	 * 	var v=this.getAttribute("hidden");return v===""||v==="hidden";
	 * },
	 * function(v){
	 * 	v?this.setAttribute("hidden","hidden"):this.removeAttribute("hidden");
	 * },
	 * 0
	 * );</code></pre>
	 */
	function InstallGetterSetter(object,name,getter,setter,attributes){
		if(!IsObject(object)){throw new TypeError(FormatMessage("is_not_a_object",[object]));}
		if(!IsFunction(getter)){throw new TypeError(FormatMessage("is_not_a_function",[getter]));}
		if(!IsFunction(setter)){throw new TypeError(FormatMessage("is_not_a_function",[setter]));}
		FunctionSetName(getter,name);
		FunctionSetName(setter,name);
		FunctionRemovePrototype(getter);
		FunctionRemovePrototype(setter);
		DefineOrRedefineAccessorProperty(object,name,getter,setter,attributes);
		SetNativeFlag(getter);
		SetNativeFlag(setter);
		return object;
	}
	/**
	 * @method InstallEvents
	 * @param {Object} object
	 * @param {Array} events
	 * @returns {Object} object itself
	 * @example <pre><code>InstallEvents(NSWidget.prototype,["click","init","destroy"]);</code></pre>
	 */
	function InstallEvents(object,events){
		if(!IsObject(object)){throw new TypeError(FormatMessage("called_on_null_or_undefined",["InstallEvents"]));}
		if(!Array.isArray(events)){throw new TypeError(FormatMessage("is_not_a_array",[events]));}
		var __prop__="__data__";
		if(!object.hasOwnProperty(__prop__)){
			throw new TypeError(FormatMessage("no_such_property",[object,__prop__]));
		}
		events.forEach(function(type,index){
			var ontype="on"+type.toLowerCase();
			object[__prop__][ontype]=null;
			InstallGetterSetter(object,ontype,
				function(){
					return this.__data__[ontype];
				},
				function(f){
					var handler=this.__data__[ontype];
					if(!IsFunction(f)){
						if(handler){this.removeEventListener(type,handler,false);}
						this.removeEventListener(type,handler,false);
						this.__data__[ontype]=null;
					}else{
						if(handler){this.removeEventListener(type,handler,false);}
						this.addEventListener(type,f,false);
						this.__data__[ontype]=f;
					}
				}
			);
		});
		return object;
	}
	/**
	 * ensure f called not more that once in duration
	 * @method SetMinInterval
	 * @param {Function} f callback
	 * @param {Number} d duration
	 * @return {Function} wrapped function
	 */
	function SetMinInterval(f,d){
		var locked=false,
			buf,
			lock=function(){locked=true;},
			unlock=function(){locked=false;buf=void 0;};
		return function(){
			if(locked){return buf;}
			lock();
			setTimeout(unlock,d);
			buf=f.apply(this,arguments);
			return buf;
		};
	}
	/**
	 * @method GetMessage
	 * @param {String} tpl
	 * @param {*} [arg]*
	 * @example <pre><code>GetMessage("Hello $1!","Kitty");</code></pre>
	 */
	function GetMessage(tpl/*,...args*/){
		tpl+="";
		var args=arguments,len=args.length;
		if(len==2){
			if(Array.isArray(args[1])){
				args=args[1];
				len=args.length;
				return tpl.replace(/\$([0-9])/g,function(exp,num){
					return num==="$"?num:(num<len?args[num]:exp);
				});
			}else if(IsObject(args[1])){
				args=args[1];
				return tpl.replace(/\$([\$\w]+)/g,function(exp,key){
					return key in args?args[key]:exp;
				});
			}
		}
		return tpl.replace(/\$([\$\d])/g,function(exp,num){
			return num==="$"?num:(num<len?args[num]:exp);
		});
	}
	/**
	 * iterate over a array or object with a give callback
	 * @method ForEach
	 * @param {Object} o array or object
	 * @param {Function} f callback function
	 * @param {Object} [r] context(aka receiver) for callback
	 */
	function ForEach(o,f/*,r*/){
		if(IsNullOrUndefined(o)){
			throw new TypeError(FormatMessage("called_on_null_or_undefined",["Array.prototype.forEach"]));
		}
		if(!IsFunction(f)){
			throw new TypeError(FormatMessage("is_not_a_function",[f]));
		}
		var r=arguments[2];
		if(IsNullOrUndefined(r)){r=null;}
		else if(!IsObject(r)){r=ToObject(r);}
		var l=o.length;
		if(l>>>0===l){
			Array.prototype.forEach.call(o,f,r);
		}else{
			o=ToObject(o);
			var keys=Object.keys(o),k,i;
			l=keys.length;
			for(i=0;i<l;i++){
				k=keys[i];
				f.call(r,o[k],k,o);
			}
		}
	}
	//--------------------------------
	// exports
	//--------------------------------
	var exports=global;
	SetProperties(exports,READ_ONLY|DONT_ENUM,[
		//property attribute
		"NONE",NONE,
		"READ_ONLY",READ_ONLY,
		"DONT_ENUM",DONT_ENUM,
		"DONT_DELETE",DONT_DELETE,
		//extend method
		"DONT_OVERWRITE",DONT_OVERWRITE,
		"DONT_EXTEND",DONT_EXTEND
	]);
	InstallFunctions(exports,DONT_ENUM,[
		// level required
		"SetProperty",SetProperty,
		"SetProperties",SetProperties,
		"InstallFunctions",InstallFunctions,
		"InstallGetter",InstallGetter,
		"InstallGetterSetter",InstallGetterSetter,
		"InstallEvents",InstallEvents,
		// level optional
		"ExtendClass",ExtendClass,
		"ImplementInterface",ImplementInterface,
		"ExtendObject",ExtendObject,
		"SetEnumValues",SetEnumValues,
		"SetNativeFlag",SetNativeFlag,
		"FunctionIsBuiltin",FunctionIsBuiltin,
		"FormatMessage",GetMessage,
		"ForEach",ForEach,
		// level temporary
		"InstallGetters",InstallGetters,
		"SetMinInterval",SetMinInterval,
		"MapToList",MapToList,
		"TypeNameOf",TypeNameOf,
		"RenameProperty",RenameProperty,
		"HasOwnProperty",HasOwnProperty
	]);
	if(typeof define==="function"&&define.amd){
		//define.amd.v8natives=true;
		define("v8natives",[],function(){return exports;});
	}
}(this));