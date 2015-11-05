define(["exports","jquery"],function(exports,$){
	var GET="GET",
		POST="POST",
		PUT="POST",
		DELETE="POST";
	function getEntityActionsMapping(arg0,context){
		return $.ajax(require.toUrl("ts/common/log/entity-actions-mapping.json"),{
			method:GET,
			dataType:"json",
			context:context
		});
	}
	function getLogPage(query,context){
		return $.ajax(request.getResourceURL("GET/log-list"),{
			method:GET,
			data:{method:"list",data:JSON.stringify(query)},
			dataType:"json",
			context:context
		});
	}
	return InstallFunctions({},NONE,[
		"getEntityActionsMapping",getEntityActionsMapping,
		"getLogPage",getLogPage
	]);
});