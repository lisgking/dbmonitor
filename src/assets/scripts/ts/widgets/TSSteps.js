define("ts/widgets/TSSteps",[
	"ts/widgets/TSWidget",
	"ts/events/TSEvent",
	"ts/events/TSChangeEvent",
	"ts/util/DOMUtils",
	"dojo/text!./htm/TSSteps.htm",
	"dojo/css!./css/TSSteps.css"
],function(TSWidget,TSEvent,TSChangeEvent,DOMUtils,htm,css){
	"use strict";
	var __super__=TSWidget.prototype;
	"constructor";
	/**
	 * @namespace ts.widgets
	 * @class TSSteps
	 * @extends ts.widgets.TSWidget
	 */
	function TSSteps(id,initParams){
		__super__.constructor.call(this,id,initParams);
		init.call(this);
	}
	"private";
	function init(){
		InstallEvents(this,["beforechange","change"]);
		defineProperties.call(this);
		this.selectedIndex=0;
	}
	/**
	 * @protected
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
		InstallEvents(this,[
			/**
			 * @event beforechange
			 * @param {Number} oldIndex
			 * @param {Number} newIndex
			 */
			"beforechange",
			/**
			 * @event change
			 * @param {Number} oldIndex
			 * @param {Number} newIndex
			 */
			"change"
		]);
		/**
		 * @attribute length
		 * @type Number
		 * @readOnly
		 */
		this.__data__.length=this.roles.getAll("step").length;
		InstallGetter(this,"length",
			function get(){
				return this.__data__.length; 
			}
		);
		/**
		 * @attribute selectedIndex
		 * @type Number
		 */
		this.__data__.selectedIndex=-1;
		InstallGetterSetter(this,"selectedIndex",
			function get(){
				return this.__data__.selectedIndex; 
			},
			function set(v){
				var index=v>>>0;
				var steps=this.roles.getAll("step");
				if(index<steps.length&&index!==this.selectedIndex){
					selectStepAt.call(this,index);
				}
			}
		);
	}
	function step_clickHandler(event){
		event.preventDefault();
		var that=this.ownerWidget;
		var oldIndex=that.selectedIndex,
			newIndex=that.roles.getAll("step").indexOf(this);
		var returnValue=that.dispatchEvent(new TSChangeEvent("beforechange",{
			cancelable:true,
			oldIndex:oldIndex,
			newIndex:newIndex
		}));
		if(returnValue===false){return;}
		console.log(oldIndex,newIndex);
		selectStepAt.call(that,newIndex);
		that.dispatchEvent(new TSChangeEvent("change",{
			oldIndex:oldIndex,
			newIndex:newIndex
		}));
	}
	function addEventListeners(){
		var that=this;
		this.roles.getAll("step").forEach(function(step,index){
			step.ownWidget=this;
			step.addEventListener("click",step_clickHandler);
		},this);
	}
	"public";
	/**
	 * @method selectItemAt
	 * @param {Number} index
	 */
	function selectItemAt(index){
		var oldIndex=this.selectedIndex;
		this.selectedIndex=index;
		var newIndex=this.selectedIndex;
		if(oldIndex!=newIndex){
			this.dispatchEvent(new TSChangeEvent("change",{
				oldIndex:oldIndex,
				newIndex:newIndex
			}));
		}
	}
	/**
	 * @method prev
	 */
	function prev(){
		var oldIndex=this.selectedIndex--,
			newIndex=this.selectedIndex;
		if(oldIndex!=newIndex){
			this.dispatchEvent(new TSChangeEvent("change",{
				oldIndex:oldIndex,
				newIndex:newIndex
			}));
			this.dispatchEvent(new TSChangeEvent("prev",{
				oldIndex:oldIndex,
				newIndex:newIndex
			}));
		}
	}
	/**
	 * @method next
	 */
	function next(){
		var oldIndex=this.selectedIndex++,
			newIndex=this.selectedIndex;
		if(oldIndex!=newIndex){
			this.dispatchEvent(new TSChangeEvent("change",{
				oldIndex:oldIndex,
				newIndex:newIndex
			}));
			this.dispatchEvent(new TSChangeEvent("next",{
				oldIndex:oldIndex,
				newIndex:newIndex
			}));
		}
	}
	/**
	 * @method addStep
	 * @param {String} title
	 */
	function addStep(title){
		var step,
			steplist=this.roles.get("steplist"),
			stepsignlist=this.roles.get("stepsignlist"),
			panellist=this.roles.get("panellist");
		var length=steplist.getAttribute("data-step-length")>>>0;
		if(length==0){
			steplist.innerHTML="";
			stepsignlist.innerHTML="";
			panellist.innerHTML="";
		}
		step=DOMUtils.parseHTML('<td data-role="step"></td>');
		step.innerHTML=title;
		step.ownerWidget=this;
		step.addEventListener("click",step_clickHandler);
		
		steplist.appendChild(step);
		stepsignlist.appendChild(DOMUtils.parseHTML('<td data-role="stepsign"></td>'));
		panellist.appendChild(DOMUtils.parseHTML('<div data-role="steppanel"></div>'));
		this.roles.append("step",steplist.lastElementChild);
		this.roles.append("stepsign",stepsignlist.lastElementChild);
		this.roles.append("steppanel",panellist.lastElementChild);
		length+=1;
		steplist.setAttribute("data-step-length",length);
		this.__data__.length=length;
		if(length===1){
			this.selectedIndex=0;
		}
	}
	ExtendClass(TSSteps,TSWidget);
	InstallFunctions(TSSteps.prototype,DONT_DELETE,[
		"prev",prev,
		"next",next,
		"selectItemAt",selectItemAt,
		"addStep",addStep
	]);
	SetProperties(TSSteps.prototype,DONT_ENUM,[
		"template",htm
	]);
	SetNativeFlag(TSSteps);
	return TSSteps;
});