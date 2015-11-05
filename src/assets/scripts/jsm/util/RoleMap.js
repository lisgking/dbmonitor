define("jsm/util/RoleMap",[],function(){
	"use strict";
	/**
	 * Reserved roles names are ["append","delete","get","set","getAll","has","set","length","hasOwnProperty"]
	 * @namespace jsm.util
	 * @class RoleMap
	 * @constructor
	 * @example
<pre><code>var roles=new RoleMap();
roles.set("master","Master");
roles.append("slave","Slave 1");
roles.append("slave","Slave 2");
roles.append("slave","Slave 3");
roles.get("master");//"Master"
roles.get("slave");//,"Slave 1"
roles.getAll("slave");//["Slave 1","Slave 2","Slave 3"]
roles.has("secondary","Master");//false
</code></pre>
	 */
	function RoleMap(){
		/**
		 * @attribute length
		 * @type Number
		 */
		SetProperty(this,DONT_ENUM,"length",0);
	}
	var rMultiple=/\s\s*/;
	/**
	 * @method append
	 * @param {String} name
	 * @param {Object} element
	 */
	function append(name,element){
		var i,n,names;
		if(rMultiple.test(name)){
			names=name.split(rMultiple);
			for(i=0;i<names.length;i++){
				n=names[i];
				if(!this.hasOwnProperty(n)){
					this[n]=[];
					this.length++;
				}
				this[n].push(element);
			}
			return;
		}else{
			n=name;
			if(!this.hasOwnProperty(n)){
				this[n]=[];
				this.length++;
			}
			this[n].push(element);
		}
	}
	/**
	 * @method delete
	 * @param {String} name
	 * @return {Boolean}
	 */
	function _delete(name){
		if(this.hasOwnProperty(name)){
			this.length--;
			return delete this[name];
		}
		return false;
	}
	/**
	 * @method get
	 * @param {String} name
	 * @return {Node|null}
	 */
	function get(name){
		if(this.hasOwnProperty(name)){
			return this[name][0];
		}
		return null;
	}
	/**
	 * @method getAll
	 * @param {String} name
	 * @return {Array}
	 */
	function getAll(name){
		if(this.hasOwnProperty(name)){
			return this[name];
		}
		return [];
	}
	/**
	 * @method has
	 * @param {String} name
	 * @return {Boolean}
	 */
	function has(name){
		if(this.hasOwnProperty(name)){
			return true;
		}
		return false;
	}
	/**
	 * @method set
	 * @param {String} name
	 * @param {Object} value
	 */
	function set(name,value){
		if(this.hasOwnProperty(name)){
			this[name]=[value];
			return;
		}
		this[name]=[value];
		this.length++;
	}
	InstallFunctions(RoleMap.prototype,DONT_ENUM,[
		"append",append,
		"delete",_delete,
		"get",get,
		"getAll",getAll,
		"has",has,
		"set",set
	]);
	SetNativeFlag(RoleMap);
	return RoleMap;
});