jQuery(function($){
	var btn_cancel=$("#btn_cancel"),
		btn_submit=$("#btn_submit");
	//prev next
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
			console.log("current step index changed from "+oldIndex+" to "+index);
		}
	});
	//cancel
	btn_cancel.on("click",function(){
		$(frameElement).closest("[data-widget-name]")[0].widget.close();
	});
	btn_submit.on("click",function(){
		alert("data submitted");
		$(frameElement).closest("[data-widget-name]")[0].widget.close();
	});
});