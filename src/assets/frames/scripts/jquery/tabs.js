(function($){
	"use strict";
	function Tabs(options){
		$.extend(true,this,options);
		var t=this;
		t.addListeners();
		if(t.oncreationcomplete){t.oncreationcomplete.call(t);}
	}
	Tabs.prototype={
		constructor:Tabs,
		//~~~~~properties~~~~~
		currentCls:"current",
		prevent:true,
		useHash:false,
		labels:null,
		panels:null, //required
		initIndex:null,
		//~~~~~events~~~~~
		oncreationcomplete:null,
		onchange:null,
		onerror:null,
		//~~~~~listeners~~~~~
		listeners:{},
		addListeners:function(){
			var t=this;
			function label_clickHandler(event){
				if(t.prevent){event.preventDefault();}
				var label=$(this),current=t.currentCls;
				if(label.hasClass(current)){return;}
				var labels=t.labels,panels=t.panels,
					index=labels.index(label),
					oldLabel=labels.filter("."+current),
					oldIndex=labels.index(oldLabel);
				oldLabel.removeClass(current);
				label.addClass(current);
				panels.filter("."+current).removeClass(current);
				panels.eq(index).addClass(current);
				try{if(t.onchange)t.onchange.call(t,oldIndex,index);}catch(e){
					if(t.onerror){t.onerror.call(t,e);}else{throw e;}
				}
			}
			t.listeners={
				label_clickHandler:label_clickHandler
			};
			t.labels.on("click",label_clickHandler);
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
			t.labels.removeData("tabs");
		}
	};
	
	$.fn.performTabs=function(options){
		var api=this.data("tabs");
		if(this.length<2){console.warn("Cannot perform Tabs due to too little elements(at lease 2)");return this;}
		if(api){console.warn("tabs already initialized");return this;}
		options.labels=this,api=new Tabs(options);
		if(isFinite(api.initIndex)){api.labels.eq(api.initIndex).trigger("click");}
		return this.data("tabs",api);
	};
}(jQuery));