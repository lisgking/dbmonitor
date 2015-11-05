/**
 * Teamsun Utility Classes
 * @module ts.util
 */
define("ts/util/CascadingCheckboxGroup",[
	"ts/util/TSEventTarget"
],function(TSEventTarget){
	//--------------------------------
	// Utilities
	//--------------------------------
	function isArray(arr){
		return Array.isArray(arr);
	}
	function isCheckbox(input){
		return input&&input.nodeName==="INPUT"&&input.type==="checkbox";
	}
	function isChecked(input){
		return input.checked;
	}
	function isChangeable(input){
		return !input.disabled&&!input.readOnly;
	}
	function checkIt(input){
		input.checked=true;
	}
	function uncheckIt(input){
		input.checked=false;
	}
	function toggleIt(input){
		input.checked=!input.checked;
	}
	var assertIsCheckbox=function(master){
		if(!(isCheckbox(master))){
			throw new TypeError("the master is not a checkbox");
		}
	};
	var checkSlaves=function(slaves){
		if(!isArray(slaves)||slaves.some(function(slave){return !isCheckbox(slave);})){
			throw new TypeError("there is a slave which is not a checkbox");
		}
	};
	var fireSlaveChangeEvent=function(){
		var e=new CustomEvent("slavechange");
		e.initCustomEvent("slavechange",false,false,"slave change");
		this.dispatchEvent(e);
	};
	/**
	 * Cascading Checkbox Group
	 * @namespace ts.util
	 * @class CascadingCheckboxGroup
	 * @extends ts.util.TSEventTarget
	 * @constructor
	 * @param {HTMLInputElement} master
	 * @param {Array} slaves
	 */
	function CascadingCheckboxGroup(master,slaves){
		assertIsCheckbox(master);
		checkSlaves(slaves);
		TSEventTarget.call(this);
		var that=this;
		var master_changeHandler=function(){
			if(this.checked){
				that.checkAll();
			}else{
				that.uncheckAll();
			}
		};
		var slave_changeHandler=function(e){
			if(this.readOnly){
				e.preventDefault();
				e.stopImmediatePropagation();
				return false;
			}
			fireSlaveChangeEvent.call(master);
			syncMasterWithSlaves.call(that);
		};
		/**
		 * @attribute master
		 * @type HTMLInputElement
		 */
		this.__data__.master=null;
		InstallGetterSetter(this,"master",
			function getMaster(){
				return this.__data__.master;
			},
			function setMaster(master){
				assertIsCheckbox(master);
				if(this.__data__.master)
					this.__data__.master.removeEventListener("click",master_changeHandler);
				master.addEventListener("click",master_changeHandler);
				if(this.slaves){
					master.ariaControls=this.slaves;
					this.slaves.forEach(function(slave){slave.ariaOwns=master;});
				}
				this.__data__.master=master;
			}
		);
		/**
		 * @attribute slaves
		 * @type Array
		 */
		this.__data__.slaves=null;
		InstallGetterSetter(this,"slaves",
			function(){
				return this.__data__.slaves;
			},
			function(slaves){
				checkSlaves(slaves);
				if(this.__data__.slaves)
					this.__data__.slaves.forEach(function(slave){
						delete slave.ariaOwns;
						slave.removeEventListener("click",slave_changeHandler);
					});
				var master=this.__data__.master;
				master.ariaControls=slaves;
				slaves.forEach(function(slave){
					slave.ariaOwns=master;
					slave.addEventListener("click",slave_changeHandler);
				});
				this.__data__.slaves=slaves;
			}
		);
		/**
		 * @attribute checkedValues
		 * @type Array
		 */
		InstallGetterSetter(this,"values",
			function(){
				return this.slaves.reduce(function(values,input){
					if(!input.disabled&&input.checked){values.push(input.value);}
					return values;
				},[]);
			},
			function(values){
				if(!isArray(values)){return;}
				var changed=false;
				this.slaves.reduce(function(values,input){
					if(!input.disabled){
						var matched=values.indexOf(input.value)!==-1;
						if(input.checked!==matched){changed=true;}
						input.checked=matched;
					}
					return values;
				},values);
				if(changed){
					slave_changeHandler.call(this.slaves[0]);
				}
			}
		);
		this.master=master;
		this.slaves=slaves;
	}
	/**
	 * @method checkAll
	 */
	function checkAll(){
		var master=this.master,
			slaves=this.slaves.filter(isChangeable);
		master.checked=true;
		master.indeterminate=false;
		slaves.forEach(checkIt);
		fireSlaveChangeEvent.call(master);
	}
	/**
	 * @method uncheckAll
	 */
	function uncheckAll(){
		var master=this.master,
			slaves=this.slaves.filter(isChangeable);
		master.checked=false;
		master.indeterminate=false;
		slaves.forEach(uncheckIt);
		fireSlaveChangeEvent.call(master);
	}
	/**
	 * @method invert
	 */
	function invert(){
		var master=this.master,
			slaves=this.slaves.filter(isChangeable);
		slaves.forEach(toggleIt);
		fireSlaveChangeEvent.call(master);
	}
	/**
	 * @private
	 * @method syncMasterWithSlaves
	 */
	function syncMasterWithSlaves(){
		var master=this.master,
			slaves=this.slaves.filter(isChangeable);
		if(slaves.some(isChecked)){
			if(slaves.every(isChecked)){
				master.checked=true;
				master.indeterminate=false;
			}else{
				master.checked=false;
				master.indeterminate=true;
			}
		}else{
			master.checked=false;
			master.indeterminate=false;
		}
	}
	/**
	 * @private
	 * @method syncSlavesWithMaster
	 */
	function syncSlavesWithMaster(){
		var master=this.master,
			slaves=this.slaves.filter(isChangeable);
		if(!master.indeterminate){
			if(master.checked){
				slaves.forEach(checkIt);
			}else{
				slaves.forEach(uncheckIt);
			}
		}
	}
	ExtendClass(CascadingCheckboxGroup,TSEventTarget);
	InstallFunctions(CascadingCheckboxGroup.prototype,NONE,[
		"checkAll",checkAll,
		"uncheckAll",uncheckAll,
		"invert",invert
	]);
	SetNativeFlag(CascadingCheckboxGroup);
	return CascadingCheckboxGroup;
});
