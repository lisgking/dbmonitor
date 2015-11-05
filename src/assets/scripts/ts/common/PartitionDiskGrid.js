define('ts/common/PartitionDiskGrid', 
	["ts/widgets/TSDataGrid",
	 "ts/widgets/TSGridColumn",
	 "ts/widgets/TSButton",
	 "ts/events/TSEvent",
	 "jsm/util/UUID",
	 "ts/util/DOMUtils",
  	 'dojo/nls!ts/common/dataCenter.json'],
  	 function(TSDataGrid,TSGridColumn,
  		TSButton,TSEvent,UUID,DOMUtils,json){
	"use strict";
	var i18n=TSDataGrid.prototype.i18n.createBranch(json);
	function PartitionDiskGrid(opts){
		TSDataGrid.call(this);
		defineProperties.call(this,opts);
	}
	
	
	function defineProperties(opts){
		var that = this;
		var checkbox,
			fileSystemPartition,
			mountDirectory,
			DiskSize,
			isfixed;
			
		
		/**
		 * 第一列选择列
		 */
		checkbox=new TSGridColumn({
			dataField:"id",
			headerHTML:'<input type="checkbox" style="vertical-align:middle" name="all" />',
			width:32,
			textAlign:"center",
			labelFunction:function(item,column){
				var value=item[column.dataField];
				var input = DOMUtils.createElement("input",{type:"checkbox",name:column.dataField,value:value});
				return input;
			},
			dataType:"element"
		});
		fileSystemPartition=new TSGridColumn({
			dataField:"fileSystem",
			headerHTML:i18n.getMsg('fileSystemPartition'),
			width:160
		});
		mountDirectory=new TSGridColumn({
			dataField:"mountDir",
			headerHTML:i18n.getMsg('mountDirectory'),
			width:160
		});
		DiskSize=new TSGridColumn({
			dataField:"partSize",
			headerHTML:i18n.getMsg('DiskSize')+"(MB)",
			width:160
		});
		isfixed=new TSGridColumn({
			dataField:"isFixed",
			headerHTML:i18n.getMsg('isfixed'),
			width:160,
			labelFunction:function(item,column){
				var text = "";
				if(item[column.dataField]==="1"){
					text = "fixed space";
				}else if(item[column.dataField]==="0"){
					text = "all space";
				}
				return i18n.getMsg(text);
			}
		});
		
		this.columns=[checkbox,
		              fileSystemPartition,
		              mountDirectory,
		              DiskSize,
		              isfixed];
		
		this.usePager=false;
		this.checkable=true;
		this.showToolbar=true;
		this.showFooter=true;
		this.height=172;
		var addPartition = new TSButton({
			buttonName:i18n.getMsg('addPartition'),
			iconClass:"glyphicon glyphicon-plus",
			click:function(){
				//if(opts.partitionDisk.validate()){
				if(opts.partitionDisk.isValid()){
					Dialog.create({
						title : i18n.getMsg('addPartition'),
						url : 'ts/common/PartitionInfo',
						widgetOpts : {grid:that},
						width:600, 
						height: 300
					});
				}
			}
		});
		var removePartition = new TSButton({
			buttonName:i18n.getMsg('removePartition'),
			iconClass:"glyphicon glyphicon-minus-sign",
			click:function(){
				that.removeRows();
			}
		});
		this.actions=[addPartition,removePartition];
	}
	function addRow(row){
		row.id = UUID.randomUUID();
		var data = this.dataProvider;
		data.rows.push(row);
		this.dataProvider = data;
	}
	function removeRows(){
		var rows = this.selectedItems;
		var allRows = this.dataProvider.rows;
		if(rows.length>0){
			var newRows = []; 
			allRows.forEach(function(r){
				var delRow = false;
				rows.forEach(function(row){
					if(row.id===r.id){
						delRow =true;
					}
				});
				if(!delRow)
					newRows.push(r);
			});
			this.dataProvider.rows = newRows;
		}
		var data = this.dataProvider;
		this.dataProvider = data;
	}
	ExtendClass(PartitionDiskGrid,TSDataGrid);
	InstallFunctions(PartitionDiskGrid.prototype, DONT_ENUM,[ "addRow",addRow,"removeRows",removeRows]);
	SetProperties(PartitionDiskGrid.prototype,DONT_ENUM,[
        "i18n",i18n
  	]);
  	
  	return PartitionDiskGrid;
});
