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
			console.log("current step index changed from "+oldIndex+" to "+index);
		}
	});
	btn_cancel.on("click",function(){
		$(frameElement).closest("[data-widget-name]")[0].widget.close();
	});
	btn_submit.on("click",function(){
		alert("data submitted");
		$(frameElement).closest("[data-widget-name]")[0].widget.close();
	});
	//init grid
	var datagrid=$("#node_list").performDataGrid({
		columns:[
			{headerText:'<input type="checkbox" />',dataField:"vmPcid",width:20,labelFunction:function(v){
				return String.format('<input type="checkbox" value="{1}" class="ts-radio"/>',v);
			}},
			{headerText:"Node",dataField:"vmName",width:100},
			{headerText:"Host Name",dataField:"hostName",width:100},
			{headerText:"IP",dataField:"vmIp",width:100}
		],
		typicalItem:{
			"vmPcid": "vm191",
			"vmName": "bigdata10",
			"hostName": "bigdata10",
			"vmIp": "172.24.23.191"
		}
	}).data("datagrid");
	datagrid.load("scripts/json/nodes.json");
});