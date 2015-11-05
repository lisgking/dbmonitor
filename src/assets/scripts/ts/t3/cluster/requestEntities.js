define([],function(){
	function Cluster(){
		ExtendObject(this,{
			clusterName:"",
			clusterDesc:"",
			packageGroupCode:"",
			components:[]
		});
	}
	function Component(){
		ExtendObject(this,{
			packageCatalogCode:"",
			packageCatalogName:"",
			packageVersionCode:"",
			diskType:-1,
			options:[],
			nodes:[]
		});
	}
	function Option(){
		ExtendObject(this,{
			parameterNameCode:"",
			parameterNameKey:"",
			parameterValue:""
		});
	}
	function Node(){
		ExtendObject(this,{
			nodeId:"",
			nodeName:"",
			nodeNameAlias:"",
			osVersion:"",
			rack: {
				partitionNo:"",
				positionNo:"",
				rackDesc:"",
				rackName:"",
				rackNumber:"",
				rackPcId:""
			},
			nodeRole:-1,
			disks:[],
			external:[]
		});
	}
	function Disk(){
		ExtendObject(this,{
			partitionName:""
		});
	}
	var exports={};
	SetProperties(exports,NONE,[
		"Cluster",Cluster,
		"Component",Component,
		"Option",Option,
		"Node",Node,
		"Disk",Disk
	]);
	return exports;
});
