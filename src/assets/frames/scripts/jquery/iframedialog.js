(function($){
	"use strict";
	function IframeDialog(options){
		$.extend(true,this,options);
		var t=this,iframe=t.iframe;
		t.dialog=iframe.parent();
		t.overlay=t.dialog.parent();
		t.addListeners();
		if(t.onload)iframe.on("load",t.onload);
		if(t.oncreationcomplete){t.oncreationcomplete.call(t);}
	}
	IframeDialog.prototype={
		constructor:IframeDialog,
		//~~~~~properties~~~~~
		width:800,
		height:520,
		closeOnEsc:true,
		hiddenCls:"hidden",
		//~~~~~events~~~~~
		oncreationcomplete:null,
		onload:null,
		//~~~~~listeners~~~~~
		listeners:{},
		addListeners:function(){
			var t=this;
			function esc_keydownHandler(event){
				var k=event.keyCode||event.which;
				if(k===27&&t.closeOnEsc){t.close();}
			}
			t.listeners={
				esc_keydownHandler:esc_keydownHandler
			};
		},
		//~~~~~methods~~~~~
		open:function(src){
			this.load(src);
			this.show();
		},
		close:function(){
			this.hide();
			this.unload();
		},
		show:function(){
			var hidden=this.hiddenCls;
			if(this.overlay.hasClass(hidden)){
				$(window).on("keydown",this.listeners.esc_keydownHandler);
				this.overlay.removeClass(hidden);
			}
		},
		hide:function(){
			var hidden=this.hiddenCls;
			if(!this.overlay.hasClass(hidden)){
				this.overlay.addClass(hidden);
				$(window).off("keydown",this.listeners.esc_keydownHandler);
			}
		},
		load:function(src){
			this.iframe[0].contentWindow.location.replace(src);
		},
		unload:function(){
			var that=this;
			setTimeout(function(){
				that.iframe[0].contentWindow.location.replace("src","about:blank");
			},17);
		},
		/**
		 * resize(width:Number,height:Number):void
		 */
		resize:function(width,height){
			if(isFinite(width)){
				this.width=width;
				this.dialog.css({width:(width-2)+"px",marginLeft:(-width/2)+"px"});
			}
			if(isFinite(height)){
				this.height=height;
				this.dialog.css({height:(height-2)+"px",marginTop:(-height/2)+"px"});
			}
		},
		destroy:function(){
			this.iframe.removeData("iframedialog");
		}
	};
	$.fn.performIframeDialog=function(options){
		var api=this.data("iframedialog");
		if(this.length<1){console.warn("Cannot perform IframeDialog due to empty node list");return this;}
		if(api){console.warn("steps already initialized");return this;}
		options.iframe=this;
		api=new IframeDialog(options);
		if(api.hasOwnProperty("width")){api.resize(api.width,api.height);}
		return this.data("iframedialog",api);
	};
}(jQuery));
