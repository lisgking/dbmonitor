define(["module","jquery"],function(module,$){
	function ServerDate(){
		this.__value__=Date.now()+this.__offset__;
	}
	function valueOf(){
		return this.__value__;
	}
	function getTime(){
		return this.__value__;
	}
	function toString(){
		return new Date(this.__value__).toString();
	}
	function now(){
		return Date.now()+ServerDate.prototype.__offset__;
	}
	InstallFunctions(ServerDate.prototype,DONT_ENUM,[
		"valueOf",valueOf,
		"getTime",getTime,
		"toString",toString
	]);
	InstallGetter(ServerDate,"now",now);
	ServerDate.prototype.__offset__=0;
	InstallGetter(ServerDate,"millisOffset",function(){
		return this.prototype.__offset__;
	});
	function load(name,require,resolve,config){
		if(request.onLine){
			var then=Date.now();
			$.ajax("LoginAction.do?method=currentTimeMillis",{
				success:function(millis){
					var now=Date.now();
					ServerDate.prototype.__offset__=+millis-Math.round((then+now)/2);
					resolve(ServerDate);
				}
			}).fail(function(){
				resolve(ServerDate);//XXX
			});
		}else{
			resolve(ServerDate);
		}
	}
	ServerDate.load=load;
	return ServerDate;
});
