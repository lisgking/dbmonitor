define("ts/util/List",[],function(){
	function List(){
		
	}
	function lookupIterator(value) {
		return (typeof value==="function")?value:function(item){return item[value];};
	}
	function groupBy(iterator/*,receiver*/){
		iterator=lookupIterator(iterator);
		var receiver=arguments[1];
		var groups={};
		Array.prototype.forEach.call(this,function(item,index,array){
			var groupName=iterator.call(this,item,index,array);
			if(!Object.prototype.hasOwnProperty.call(groups,groupName)){
				groups[groupName]=[];
			}
			groups[groupName].push(item);
		},receiver);
		return groups;
	}
	InstallFunctions(List.prototype,DONT_ENUM,[
		"groupBy",groupBy
	]);
	
	return List;
});
