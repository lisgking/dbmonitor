(function($){
	"use strict";
	function Steps(options){
		$.extend(true,this,options);
		var t=this;
		t.addListeners();
		if(t.oncreationcomplete){t.oncreationcomplete.call(t);}
	}
	Steps.prototype={
		constructor:Steps,
		//~~~~~properties~~~~~
		currentCls:"current",
		passedCls:"passed",
		prevent:true,
		useHash:false,
		buttons:{     //required
			previous:null,
			next:null,
			submit:null
		},
		labels:null,
		bindLabels:null,
		contents:null,//required
		initIndex:null,
		//~~~~~events~~~~~
		oncreationcomplete:null,
		onchange:null,
		onerror:null,
		//~~~~~listeners~~~~~
		listeners:{},
		addListeners:function(){
			var t=this,
				labels=t.labels,
				contents=t.contents,
				current=t.currentCls,
				passed=t.passedCls,
				btnPrev=t.buttons.previous,
				btnNext=t.buttons.next,
				btnSubmit=t.buttons.submit,
				bindLabels=t.bindLabels;
			function label_clickHandler(event){
				if(event.clientX){return false;}
				if(t.prevent){event.preventDefault();}
				var label=$(this),index=labels.index(label);
				if(label.hasClass(current)){return;}
				var oldLabel=labels.filter("."+current),oldIndex=labels.index(oldLabel);
				label.removeClass(passed);
				label.nextAll().removeClass(passed);
				label.prevAll().addClass(passed);
				oldLabel.removeClass(current);
				label.addClass(current);
				contents.filter("."+current).removeClass(current);
				contents.eq(index).addClass(current);
				btnPrev.prop("disabled",index==0);
				btnNext.toggle(index!=labels.length-1);
				btnSubmit.toggle(index==labels.length-1);
				if(bindLabels){
					bindLabels.eq(oldIndex).removeClass(current);
					bindLabels.eq(index).addClass(current);
				}
				try{if(t.onchange)t.onchange.call(t,oldIndex,index);}catch(e){
					if(t.onerror){t.onerror.call(t,e);}else{throw e;}
				}
			}
			function prev_clickHandler(event){
				labels.filter("."+current).prev().trigger("click");
			}
			function next_clickHandler(event){
				labels.filter("."+current).next().trigger("click");
			}
			t.listeners={
				label_clickHandler:label_clickHandler,
				prev_clickHandler:prev_clickHandler,
				next_clickHandler:next_clickHandler
			};
			labels.on("click",label_clickHandler);
			btnPrev.on("click",prev_clickHandler);
			btnNext.on("click",next_clickHandler);
		},
		//~~~~~methods~~~~~
		prev:function(){
			this.labels.filter("."+current).prev().trigger("click");
		},
		next:function(){
			this.labels.filter("."+current).next().trigger("click");
		},
		/**
		 * index():Number
		 * index(index:Number):void
		 */
		index:function(index){
			if(isFinite(index)){
				this.labels.eq(index).trigger("click");
			}else{
				return this.labels.filter("."+current).index();
			}
		},
		destroy:function(){
			var t=this;
			t.labels.off("click",t.handlers.label_clickHandler);
			t.btnPrev.off("click",t.handlers.prev_clickHandler);
			t.btnNext.off("click",t.handlers.next_clickHandler);
			t.labels.removeData("steps");
		}
	};
	$.fn.performSteps=function(options){
		var api=this.data("steps");
		if(this.length<2){console.warn("Cannot perform Steps due to too little elements(at lease 2)");return this;}
		if(api){console.warn("steps already initialized");return this;}
		options.labels=this,api=new Steps(options);
		if(isFinite(api.initIndex)){api.labels.eq(api.initIndex).trigger("click");}
		return this.data("steps",api);
	};
}(jQuery));