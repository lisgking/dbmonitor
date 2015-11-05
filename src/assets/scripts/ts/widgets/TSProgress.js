define("ts/widgets/TSProgress",[
	"ts/widgets/TSWidget",
	"dojo/text!./htm/TSProgress.htm",
	"dojo/css!./css/TSProgress.css"
],function(TSWidget,htm,css){
	"use strict";
	function TSProgress(){
		TSWidget.call(this);
	}
	function setProcess(process){
		// 初始化
		this.reset();
		if(process>100){
			throw new TypeError("进度值不能超过100");
		}
		if(process>50){
			this.roles.get("right").style.display="block";
			this.roles.get("mask").style.display="none";
		}
		this.roles.get("text").innerText = process+"%";
		this.roles.get("left").style["-webkit-transform"]="rotate("+process*3.6+"deg)";
		this.roles.get("left").style["-moz-transform"]="rotate("+process*3.6+"deg)";
	}
	function reset(){
		var img = "url(/assets/scripts/ts/widgets/css/images/green.png)";
		this.roles.get("mask").style.display="block";
		this.roles.get("right").style.display="none";
		this.roles.get("left").style.display="block";
		this.roles.get("rightImage").style.backgroundImage=img;
		this.roles.get("leftImage").style.backgroundImage=img;
	}
	function error(){
		var img = "url(/assets/scripts/ts/widgets/css/images/red.png)";
		this.roles.get("rightImage").style.backgroundImage=img;
		this.roles.get("leftImage").style.backgroundImage=img;
//		this.mask.style.display="none";
//		this.right.style.display="block";
//		this.left.style.display="block";
//		this.left.style["-webkit-transform"]="rotate("+360+"deg)";
//		this.left.style["-moz-transform"]="rotate("+360+"deg)";
	}
	ExtendClass(TSProgress,TSWidget);
	InstallFunctions(TSProgress.prototype,DONT_DELETE,[
  	    "setProcess",setProcess,
  	    "error",error,
  	    "reset",reset
  	]);
	SetProperties(TSProgress.prototype,DONT_ENUM,[
  		"template",htm
  	]);
	//SetNativeFlag(TSProgress);
	return TSProgress;
});