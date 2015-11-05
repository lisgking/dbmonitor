define("ts/widgets/Slider",
	["ts/widgets/TSWidget",
	"ts/util/Drag",
	"dojo/text!./htm/Slider.htm",
	"dojo/css!./css/TSSlider.css",
	"dojo/nls!./nls/TSSlider.json",
	"jquery"],
	function(TSWidget,htm,css,json,$){
		
	"use strict";
	var i18n=TSWidget.prototype.i18n.createBranch(json);
	
	function Slider(){
		TSWidget.call(this);
		init.call(this);
	}
	
	function init(){
		pre
		addEvent.call(this);
	}
	
	function addEvent(){
		var warnBtn=this.role("warning");
		
		warnBtn.addEventListener("click",function(e){
			e.preventDefault();
			return;
		},false);
		
		warnBtn.addEventListener("drag",function(){
			
		},false);
		
		document.addEventListener("dragstart", function( event ) {
		    warnBtn.style.opacity = .5;
		}, false);
		document.addEventListener("dragend", function( event ) {
		    warnBtn.style.opacity = "";
		}, false);
	}
	//根据最大最小值和滑动百分比取值 
	function getValue(){
		return this.minValue + this.getPercent() * (this.maxValue - this.minValue); 
	}
	//根据滑动条滑块取百分比  
	function getPercent(){
	    return this._horizontal ? this.Bar.offsetLeft / (this.Container.clientWidth - this.Bar.offsetWidth)  
	        : this.Bar.offsetTop / (this.Container.clientHeight - this.Bar.offsetHeight) ;
	}
	
	ExtendClass(Slider,TSWidget);
	
	SetProperties(Slider.prototype,DONT_ENUM,
		["i18n",i18n,
		 "template",htm]);
		 
	return Slider;
		
});
