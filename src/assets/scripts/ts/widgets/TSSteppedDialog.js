define("ts/widgets/TSSteppedDialog",[
	"ts/widgets/TSDialog",
	"ts/widgets/TSWizardStep",
	"ts/events/TSEvent",
	"ts/events/TSChangeEvent",
	"ts/util/DOMUtils",
	"ts/util/ItemList",
	"dojo/text!./htm/TSSteppedDialog.htm",
	"dojo/css!./css/TSSteppedDialog.css",
	"dojo/css!./css/TSSteps.css",
	"jquery"
],function(TSDialog,TSWizardStep,TSEvent,TSChangeEvent,DOMUtils,ItemList,
	htm,ownCSS,stepsCcss,$){
	//--------------------------------
	// 
	//--------------------------------
	function StepList(){
		ItemList.apply(this);
	}
	ExtendClass(StepList,ItemList);
	InstallFunctions(StepList.prototype,NONE,[
		"namedItem",function namedItem(name){
			return this.__data__.find(function(step){
				return step.widgetName===name;
			})||null;
		}
	]);
	"use strict";
	var __super__=TSDialog.prototype;
	"constructor";
	/**
	 * @namespace ts.widgets
	 * @class TSSteppedDialog
	 * @extends ts.widgets.TSDialog
	 * @constructor
	 * @param {String} id
	 * @param {Object} [initParams]
	 */
	function TSSteppedDialog(id,initParams){
		__super__.constructor.call(this,id,initParams);
		init.call(this);
	}
	"private";
	function init(){
		InstallEvents(this,[
			/**
			 * @event open
			 */
			"open",
			/**
			 * @event close
			 */
			"close",
			/**
			 * @event beforechange
			 */
			"beforechange",
			/**
			 * @event change
			 */
			"change"
		]);
		defineProperties.call(this);
		addEventListeners.call(this);
		this.visible=false;
		this.roles.get("prev").classList.add("invisible");
		this.roles.get("submit").classList.add("invisible");
	}
	/**
	 * @method selectStepAt
	 * @param {Number} newIndex
	 */
	function selectStepAt(newIndex){
		var steps=this.roles.getAll("step"),
			signs=this.roles.getAll("stepsign"),
			panels=this.roles.getAll("steppanel"),
			oldIndex=this.selectedIndex;
		this.__data__.selectedIndex=newIndex;
		if(oldIndex>=0){
			steps[oldIndex].classList.remove("current");
			signs[oldIndex].classList.remove("current");
			panels[oldIndex].classList.remove("current");
		}
		if(newIndex>=0){
			steps[newIndex].classList.add("current");
			signs[newIndex].classList.add("current");
			panels[newIndex].classList.add("current");
		}
	}
	function defineProperties(){
		/**
		 * @attribute length
		 * @type Number
		 * @readOnly
		 */
		InstallGetter(this,"length",
			function getLength(){
				return this.stepList.length; 
			}
		);
		/**
		 * @attribute selectedIndex
		 * @type Number
		 */
		this.__data__.selectedIndex=-1;
		InstallGetterSetter(this,"selectedIndex",
			function getSelectedIndex(){
				return this.__data__.selectedIndex; 
			},
			function setSelectedIndex(v){
				var index=v>>>0;
				var steps=this.roles.getAll("step");
				if(index<steps.length&&index!==this.selectedIndex){
					selectStepAt.call(this,index);
				}
			}
		);
		/**
		 * @attribute title
		 * @type String
		 */
		this.__data__.title="";
		InstallGetterSetter(this,"title",
			function getTitle(){
				return this.__data__.title=this.roles.get("title").textContent;
			},
			function setTitle(v){
				this.__data__.title=this.roles.get("title").textContent=v;
			}
		);
		/**
		 * @attribute stepList
		 * @type StepList
		 * @readOnly
		 */
		this.__data__.stepList=new StepList();
		InstallGetter(this,"stepList",
			function getStepList(){
				return this.__data__.stepList;
			}
		);
	}
	function addEventListeners(){
		var that=this;
		var close_clickHandler=function(){
			var canceled=!that.dispatchEvent(new TSEvent("beforeclose"));
			if(canceled){return;};
			that.close();
		};
		this.roles.get("close").addEventListener("click",close_clickHandler);
		this.roles.get("cancel").addEventListener("click",close_clickHandler);
		this.roles.get("prev").addEventListener("click",function(){
			that.prev();
		});
		this.roles.get("next").addEventListener("click",function(){
			that.next();
		});
		this.addEventListener("change",function(event){
			if(event.newIndex>event.oldIndex){//next
				if(event.oldIndex===0){
					this.roles.get("prev").classList.remove("invisible");
				}
				if(event.newIndex===this.length-1){
					this.roles.get("next").classList.add("invisible");
					this.roles.get("submit").classList.remove("invisible");
				}
			}else if(event.newIndex<event.oldIndex){//prev
				if(event.oldIndex===this.length-1){
					this.roles.get("next").classList.remove("invisible");
					this.roles.get("submit").classList.add("invisible");
				}
				if(event.newIndex===0){
					this.roles.get("prev").classList.add("invisible");
				}
			}
		});
	}
	function step_clickHandler(event){
		event.preventDefault();
		var that=this.ownerWidget;
		var oldIndex=that.selectedIndex,
			newIndex=that.roles.getAll("step").indexOf(this);
		if(oldIndex===newIndex){return;}
		var canceled=!that.dispatchEvent(new TSChangeEvent("beforechange",{
			cancelable:true,
			oldIndex:oldIndex,
			newIndex:newIndex
		}));
		if(canceled){return;}
		selectStepAt.call(that,newIndex);
		that.dispatchEvent(new TSChangeEvent("change",{
			oldIndex:oldIndex,
			newIndex:newIndex
		}));
	}
	"public";
	/**
	 * @method open
	 */
	function open(){
		if(this.visible){return;}
		__super__.show.call(this);
		this.dispatchEvent(new TSEvent("open"));
	}
	/**
	 * @method close
	 */
	function close(){
		if(!this.visible){return;}
		__super__.hide.call(this);
		this.dispatchEvent(new TSEvent("close"));
	}
	/**
	 * @method prev
	 */
	function prev(){
		var oldIndex=this.selectedIndex;
		var canceled=!this.dispatchEvent(new TSChangeEvent("beforechange",{
			cancelable:true,
			oldIndex:oldIndex,
			newIndex:oldIndex-1
		}));
		if(canceled){return;}
		this.selectedIndex--;
		var newIndex=this.selectedIndex;
		if(oldIndex!=newIndex){
			this.dispatchEvent(new TSChangeEvent("change",{
				oldIndex:oldIndex,
				newIndex:newIndex
			}));
		}
	}
	/**
	 * @method next
	 */
	function next(){
		var oldIndex=this.selectedIndex;
		var canceled=!this.dispatchEvent(new TSChangeEvent("beforechange",{
			cancelable:true,
			oldIndex:oldIndex,
			newIndex:oldIndex+1
		}));
		if(canceled){return;}
		this.selectedIndex++;
		var newIndex=this.selectedIndex;
		if(oldIndex!=newIndex){
			this.dispatchEvent(new TSChangeEvent("change",{
				oldIndex:oldIndex,
				newIndex:newIndex
			}));
		}
	}
	/**
	 * @method add
	 * @param {TSWizardStep} wizardStep
	 */
	function add(wizardStep){
		if(!(wizardStep instanceof TSWizardStep)){
			throw new TypeError(step&&step.toString()+" is not a TSWizardStep");
		}
		var steplist=this.roles.get("steplist"),
			stepsignlist=this.roles.get("stepsignlist"),
			panellist=this.roles.get("panellist");

		var length=this.stepList.length;
		if(length===0){
			steplist.innerHTML="";
			stepsignlist.innerHTML="";
			panellist.innerHTML="";
		}
		var step=DOMUtils.parseHTML('<td data-role="step"></td>');
		step.innerHTML=wizardStep.title;
		step.ownerWidget=this;
		step.addEventListener("click",step_clickHandler);
		steplist.setAttribute("data-step-length",length);
		steplist.appendChild(step);
		
		var stepsign=DOMUtils.parseHTML('<td data-role="stepsign"></td>');
		stepsignlist.appendChild(stepsign);
		
		var steppanel=DOMUtils.parseHTML('<div data-role="steppanel"></div>');
		steppanel.setAttribute("data-step-name",wizardStep.widgetName);
		panellist.appendChild(steppanel);
		
		this.roles.append("step",step);
		this.roles.append("stepsign",stepsign);
		this.roles.append("steppanel",steppanel);
		wizardStep.placeAt(steppanel,"afterBegin");
		length=this.stepList.__data__.push(wizardStep);
		steplist.setAttribute("data-step-length",length);
		if(length===1){
			this.selectedIndex=0;
			this.roles.get("next").disabled=false;
		}
	}
	/**
	 * @method addEmptyStep
	 * @param {String} title
	 * @param {String} caption
	 */
	function addEmptyStep(title,caption){
		var step=new TSWizardStep();
		step.title=title;
		step.caption=caption;
		add.call(this,step);
	}
	/**
	 * @method step
	 * @param {Number|String} index
	 * @return {TSWizardStep|null}
	 */
	function step(index){
		if(typeof index==="number"){
			index>>>=0;
			return this.stepList.item(index);
		}else{
			return this.stepList.namedItem(index);
		}
	}
	ExtendClass(TSSteppedDialog,TSDialog);
	InstallFunctions(TSSteppedDialog.prototype,DONT_DELETE,[
		"open",open,
		"close",close,
		"prev",prev,
		"next",next,
		"step",step,
		"addEmptyStep",addEmptyStep,
		"add",add
	]);
	SetProperties(TSSteppedDialog.prototype,DONT_ENUM,[
		"template",htm
	]);
	SetNativeFlag(TSSteppedDialog);
	return TSSteppedDialog;
});