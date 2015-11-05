(function($){
//extend window
$.extend(window,{
	setFPS:function(fn,fps){
		var locked=false,delay=1000/fps;
		return function(){
			if(locked){return;}
			locked=true;
			setTimeout(function(){locked=false;},delay);
			fn.apply(this,arguments);
		};
	},
	toFeaturesString:function(eq,d){
		var o=this,f=[],p;
		for(p in o)if(o.hasOwnProperty(p))f.push(p+eq+o[p]);
		return f.join(d);
	},
	openWindow:function(){
		var featuresObject2={left:100,top:100,width:800,height:520};
		var dialog=$("#_dialog"),
			url=dialog.prop("src"),
			features=toFeaturesString.call(featuresObject2,"=",",");
		window.open(url,"",features);
	},
	showDialog:function(){
		var featuresObject={dialogLeft:100+"px",dialogTop:100+"px",dialogWidth:800+"px",dialogheight:520+"px"};
		var dialog=$("#_dialog"),
			url=dialog.prop("src"),
			features=toFeaturesString.call(featuresObject,":",";");
		window.showModalDialog(url,"_blank",features);
	},
	openOverlayDialog:function(url,target,width,height){
		var iframe=$("#"+target),
			dialog=iframe.parent(),
			overlay=dialog.parent();
		overlay.removeClass("hidden");
		if(url){iframe.attr("src",url);}
		if(width&&height)dialog.css({
			width:(width-2)+"px",
			height:(height-2)+"px",
			marginLeft:(-width/2)+"px",
			marginTop:(-height/2)+"px"
		});
	},
	closeOverlayDialog:function(target,delay){
		var iframe=$("#"+target),
			dialog=iframe.parent(),
			overlay=dialog.parent();
		overlay.addClass("hidden");
		setTimeout(function(){iframe.attr("src","about:blank");},delay||200);
	},
	encodeHTML:(function(){
		var charmap={"&":"&amp;","\"":"&quot;","'":"&39;","<":"&lt;",">":"&gt;","\n":"&#13;",};
		return function(text){
			return text.replace(/["'&<>\n]/g,function(c){return charmap[c];});
		};
	}())
});

$.fn.extend({
	removeStyle:function(prop){
		return prop?this.forEach(function(elem,index){
			elem.style.removeProperty.call(elem,prop);
		}):this.removeAttr("style");
	}
});
//extend string
$.extend(String,{
	format:function(str,args){
		args=(args instanceof Object)?args:Array.prototype.slice.call(arguments,1);
		return String(str).replace(/\{(\w+)\}/g,function(exp,key){return key in args?args[key]:exp;});
	}
});

var repeat=function(s,times){
	times=times>>>0;
	if(times<1){
		return '';
	}else if(times%2){
		return repeat(s,times-1)+s;
	}else{
		var half=repeat(s,times/2);
		return half+half;
	}
}; 

//extend date
var p0=function(s,l){
	s=s+"";
	l=l>>>0||2;
	var z=l-s.length;
	return z>0?"00000000000000000000".substr(-z)+s:s;
};
$.extend(Date.prototype,{
	toString:function(){
		return isFinite(this)?p0(this.getFullYear())+':'+p0(this.getMonth())+':'+p0(this.getDate())+
				" "+p0(this.getHours())+':'+p0(this.getMinutes())+':'+p0(this.getSeconds()):null;
	},
	toDateString:function(){
		return isFinite(this)?p0(this.getFullYear())+':'+p0(this.getMonth())+':'+p0(this.getDate()):null;
	},
	toTimeString:function(){
		return isFinite(this)?p0(this.getHours())+':'+p0(this.getMinutes())+':'+p0(this.getSeconds()):null;
	},
	toUTCTimeString:function(){
		return isFinite(this)?this.toUTCString().substr(-12,8):null;
	},
});
}(jQuery));