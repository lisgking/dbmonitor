var CronExp=(function(){
	function CronExp(){
		this.length=0;
		Array.prototype.push.apply(this,["*","*","*","*","*","?"]);
		Array.prototype.forEach.call(arguments,function(v,i){this[i]=v;},this);
		this.clean();
	}
	Object.defineProperties(CronExp.prototype,{
		join:{value:Array.prototype.join},
		clean:{value:function(){Array.prototype.splice.call(this,7,this.length-2);}},
		toString:{value:function(){this.clean();return this.join(" ");}},
		setSeconds:{value:function(v){this[0]=v;}},
		setMinutes:{value:function(v){this[1]=v;}},
		setHours:{value:function(v){this[2]=v;}},
		setDate:{value:function(v){this[3]=v;}},
		setMonth:{value:function(v){this[4]=v;}},
		setDay:{value:function(v){this[5]=v;}},
		setYear:{value:function(v){this[6]=v;}}
	});
	Object.defineProperties(CronExp,{
		EVERY:{value:"*"},
		INTERVAL:{value:"/"},
		RANGE:{value:"-"},
		VALUES:{value:","}
	});
	return CronExp;
}());
/**
 * month (1[012]|[1-9]) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)
 * day of month (3[01]|[12][0-9]|[1-9])
 * day of week (1-7) (Sun|Mon|Tue|Wed|Thu|Fri|Sat)
 */
jQuery(function($){
	//init steps
	var btn_cancel=$("#btn_cancel"),
		btn_submit=$("#btn_submit");
	$(".step-signs>td").performSteps({
		buttons:{
			cancel:btn_cancel,
			previous:$("#btn_prev"),
			next:$("#btn_next"),
			submit:btn_submit
		},
		contents:$(".step-contents>div"),
		bindLabels:$(".step-names>td"),
		onchange:function(oldIndex,index){
			if(oldIndex<index){//namely forward
				
			}
			console.log("current step index changed from "+oldIndex+" to "+index);
		},
		onerror:function(err){
			alert(err);
		}
	});
	$(".step-contents").performCronExpEditor({
		initCronExp:"* * * * * ?"
	});
	btn_cancel.on("click",function(){
		$(frameElement).closest("[data-widget-name]")[0].widget.close();
	});
	btn_submit.on("click",function(){
		var exp=queryCronExp(),expStr;
		if(!exp){return;}
		expStr=exp.toString();
	});
	
});