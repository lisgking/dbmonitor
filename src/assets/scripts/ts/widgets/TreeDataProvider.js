define(["jquery"],function($){
	var typicalItem={
		"id":"23b8ea6c-f5a5-409e-a6b6-b8232f267b51",
		"pid":null,
		"type":0,
		"name":"name",
		"title":"description",
		"href":"module.html",
		"target":"_frame",
		"icon":"vm"
	};
	function nextUUID() {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
			var r=Math.random()*16|0;
			return (c=='x'?r:(r&0x3|0x8)).toString(16);
		});
	}
	function nextInt(min,max){
		return Math.floor(Math.random()*(max-min+1)+min);
	}
	function nextWord(){
		return words[Math.random()*words.length|0];
	}
	function nextSentense(min,max){
		var str=nextWord();
		var len=nextInt(min,max);
		for(var i=0;i<len;i++){
			str+=" ";
			str+=nextWord();
		}
		return str;
	}
	function getChildren(params,callback){
		var that=this;
		var src=that.dataSource;
		var cfg=that.hierarchy[params.type];
		if("dataSource" in cfg){
			src=cfg.dataSource;
		}
		
		//qmw 2014-5-20 修改为post提交
		var that = this;
		var url = src + (src.indexOf('?') == -1 ? '?' : '&');
		url += $.param(data);
		$.post(url, function(treeitems){
			treeitems.forEach(function(item){
				ExtendObject(item,cfg,DONT_OVERWRITE);
			});
			callback(treeitems);
		});

		// $.ajax(src,{
		// 	data:params,
		// 	dataType:"json",
		// 	context:this,
		// 	success:function(treeitems){
		// 		treeitems.forEach(function(item){
		// 			ExtendObject(item,cfg,DONT_OVERWRITE);
		// 		});
		// 		callback(treeitems);
		// 	}
		// });
	}
	function typedItem(type){
		var item=null;
		this.some(function(level){
			if(level.type===type){
				item=level;
				return true;
			}
		});
		return item;
	}
	function TreeDataProvider(dataSource,hierarchy){
		this.dataSource=dataSource;
		this.hierarchy=hierarchy.slice(0);
		this.maxLevel=hierarchy.length;
		//SetProperty(this.hierarchy,DONT_ENUM,"typedItem",typedItem);
		this.hierarchy.forEach(function(level,index,hierarchy){
			hierarchy[level.type]=level;
		});
		this.timeout=5000;
	}
	InstallFunctions(TreeDataProvider.prototype,DONT_ENUM,[
		"getChildren",getChildren
	]);
	return TreeDataProvider;
});
