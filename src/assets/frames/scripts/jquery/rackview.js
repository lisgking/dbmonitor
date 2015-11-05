function uuid(){
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	};
	jQuery(function($){
		var data={
			racks:[
				{
					rackNo:1,
					rackName:"rack01",
					layers:[
						{nodeId:uuid(),nodeName:"node1"},
						{nodeId:uuid(),nodeName:"node2"},
						{nodeId:uuid(),nodeName:"node3"},
						{nodeId:uuid(),nodeName:"node4"},
						{nodeId:uuid(),nodeName:"node5"},
						{nodeId:uuid(),nodeName:"node6"}
					]
				},
				{
					rackNo:2,
					rackName:"rack02",
					layers:[
						{nodeId:uuid(),nodeName:"node1"},
						{nodeId:uuid(),nodeName:"node2"},
						{nodeId:uuid(),nodeName:"node3"},
						{nodeId:uuid(),nodeName:"node4"},
						{nodeId:uuid(),nodeName:"node5"},
						{nodeId:uuid(),nodeName:"node6"},
						{nodeId:uuid(),nodeName:"node7"},
						{nodeId:uuid(),nodeName:"node8"},
						{nodeId:uuid(),nodeName:"node9"}
					]
				},
				{
					rackNo:3,
					rackName:"rack03",
					layers:[
						{nodeId:uuid(),nodeName:"node1"},
						{nodeId:uuid(),nodeName:"node2"},
						{nodeId:uuid(),nodeName:"node3"},
						{nodeId:uuid(),nodeName:"node4"},
						{nodeId:uuid(),nodeName:"node5"}
					]
				}
			]
		}
		var doc=document;
		function RackLayer(){
			var li=doc.createElement("li");
			return li;
		}
		function Rack(layers){
			var ul=doc.createElement("ul"),i,layer;
			ul.className="rack";
			for(i=0;i<layers;i+=1){
				layer=RackLayer();
				ul.appendChild(layer);
			}
			return ul;
		}
		function Racks(frame,columns,layers){
			var i,rack,td;
			for(i=0;i<columns;i+=1){
				td=doc.createElement("td");
				rack=Rack(layers);
				td.appendChild(rack);
				frame.appendChild(td);
			}
			return frame;
		}
		var frame=$("#racks");
		Racks(frame[0],3,20);
		
		//data.racks.forEach(function(rack,rackIndex,racks){});
	});