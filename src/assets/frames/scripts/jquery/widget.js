
if(!Function.prototype.hasOwnProperty("name")){
	Object.defineProperty(Function.prototype, "name", {
		set:function(name){},
		get:function(){
			return this.toString().match(/^\W*function\s*([\w$]*)\s*\(/)[1];
		}
	});
}
if(!Function.prototype.hasOwnProperty("extends")){
	Object.defineProperty(Function.prototype, "extends", {
		value:function(Parent){
			if(typeof Parent==="string"){Parent=Class.forName(Parent);}
			var Self=this,proto=new Parent(),names=Object.keys(Parent.prototype),i,p;
			Object.defineProperties(proto,{
				"constructor":{
					value:Self
				},
				"__super__":{
					get:function(){
						Parent.prototype
					}
				}
			});
			Self.prototype=proto;
			Self.superClass=Parent;
		}
	});
}
if(!Function.prototype.hasOwnProperty("implements")){
	Object.defineProperty(Function.prototype, "implements", {
		value:function(Interface){
			var Self=this,proto=Self.prototype,l=arguments.length,
				intfs=[],keys,key,val,i,j,intf;
			if(typeof Parent==="string"){Parent=Class.forName(Parent);}
			for(i=0;i<l;i++){
				intf=arguments[i],keys=Object.keys(intf);
				for(j=0;j<keys.length;j++){
					key=keys[j];
					if(!(key in proto)){
						throw new ReferenceError(key+" is not implemented for "+intf.constructor.name);
					}else if((val=proto[key])!==null&&val!==undefined&&val.constructor!==intf[key]){
						throw new TypeError(key+" type mismatch interface definition");
					}
				}
				intfs.push(intf);
			}
			Self.interfaces=intfs;
		}
	});
}
var Class=(function(){
	function Class(classname,classbody){
		var path=classname.split("."),space=window,plen=path.length-1,name,i;
		for(i=0;i<plen;i++){
			name=path[i];
			if(!space[name]){space=space[name]={};}else{space=space[name];}
		}
		name=path[plen],space[name]=classbody();
	}
	Class.createNamespace=function(ns){
		var path=ns.split("."),space=window,plen=path.length,name,i;
		for(i=0;i<plen;i++){
			name=path[i];
			if(!space[name]){space=space[name]={};}
		}
		return space;
	};
	Class.getNamespace=function(ns){
		var path=ns.split("."),space=window,plen=path.length-1,name,i;
		for(i=0;i<plen;i++){
			name=path[i];
			if(!(space=space[name])){
				throw new Error("Namespace not found");
			}
		}
		return space;
	};
	var descriptor={enumerable:false,writable:false,configurable:false,value:null};
	Class.defineProperties=function(obj,props){
		var names=Object.keys(props),len=names.length,desc=descriptor,
			name,value,p,i;
		for(i=0;i<len;i++){
			name=names[i],value=props[name];
			desc.value=value,desc.writable=(typeof value!=="function");
			Object.defineProperty(obj,name,desc);
		}
	};
	return Class;
}());

var Interface=(function(){
	function Interface(props){
		var keys=Object.keys(props),p,i;
		for(i=0;i<keys.length;i++){
			p=keys[i],this[p]=props[p];
		}
	};
	return function(props){
		if(this.constructor===arguments.callee){
			throw new TypeError("Illegal constructor, cannot be instantiated");
		}
		return new Interface(props);
	};
}());

Class.forName=function(classname){
	var path=classname.split("."),space=window,plen=path.length-1,name,i,cls;
	for(i=0;i<plen;i++){
		name=path[i];
		if(space[name]){space=space[name];}else{throw new Error("Class not found");}
	}
	name=path[plen],cls=space[name];
	if(cls){return cls;}else{throw new Error("Class not found");}
}

Class("Widget",function(){
	//constructor
	function Widget(){
		var t=this;
		if(t.constructor===Widget){
			console.log("new Widget");
		}else{
			console.log("Widget constructed");
		}
	}
	Widget.extends(Object);
	//properties
	Class.defineProperties(Widget.prototype,{
		"widgetName":"Widget",
		"show":function(name){
			console.log("Widget show",name);
		},
		
	});
	Object.defineProperties(DataList.prototype,{
		
	});
	return Widget;
});


var Clonable=Interface({
	clone:Function
});
var Serializable=Interface({
	serialize:Function
});

Class("ts.wgt.DataList",function(){               //define namespace and classname
	function DataList(){                          //define constructor
		this.__proto__.constructor();
		if(this.constructor===DataList){
			console.log("new DataList");
		}else{
			console.log("DataList constructed");
		}
	}
	DataList.extends(Widget);                     //extend from a class
	Class.defineProperties(DataList.prototype,{  //define properties
		"widgetName":"DataList",
		"show":function(name){
			this.__super__.show(name);
			console.log("DataList show",name);
		},
		"clone":function(){
			throw new Error("Cannot clone yet");
		},
		"serialize":function(){
			return JSON.parse(JSON.stringify(this));
		}
	});
	//DataList.implements(Clonable);             //declare implementations(for validation use)
	return DataList;                             //put the new constructed class into name space
});

Class("ts.wgt.AdvancedDataList",function(){
	function AdvancedDataList(){
		this.__proto__.constructor();
		if(this.constructor===AdvancedDataList){
			console.log("new AdvancedDataList");
		}else{
			console.log("AdvancedDataList constructed");
		}
	}
	AdvancedDataList.extends("ts.wgt.DataList");
	Class.defineProperties(AdvancedDataList.prototype,{
		"widgetName":AdvancedDataList,
		"show":function(name){
			this.__super__.show(name);
			console.log("AdvancedDataList show",name);
		}
	});
	return AdvancedDataList;
});

