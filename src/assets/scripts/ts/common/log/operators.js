define(["module","jquery"],function(module,$){
	function getAccountPage(data,context){
		return $.ajax(request.getResourceURL("GET/account"),{
			method:"GET",
			data:{method:"list",data:JSON.stringify(data)},
			dataType:"json",
			context:context
		});
	}
	return {
		load:function(name,require,resolve,config,context){
			if(request.getParameter("standalone")==="true"){//TMP for PD-plugin standalone debug
				resolve({rows:[]});
				return;
			}
			$.ajax(request.getResourceURL("GET/account"),{
				method:"GET",
				data:{method:"list",data:JSON.stringify({pageNo:1,pageSize:255})},
				dataType:"json",
				context:context,
				success:function(page){
					if(page.rows){
						resolve(page);
					}else{
						resolve({rows:[]});
					}
				}
			});
			/*getAccountPage({pageNo:1,pageSize:255}).done(function(page){
				if(page.rows){
					resolve(page);
				}else{
					resolve({rows:[]});
				}
			});*/
		}
	};
});