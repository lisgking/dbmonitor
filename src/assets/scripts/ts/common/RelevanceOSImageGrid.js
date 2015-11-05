define('ts/common/RelevanceOSImageGrid', [
    "ts/widgets/TSDataGrid",
    "ts/widgets/TSGridColumn",
    "ts/widgets/TSSearch",
	 "ts/widgets/TSButton",
	 "ts/events/TSEvent",
	 'dojo/text!ts/common/RelevanceOSImageGrid.htm',
	'dojo/nls!ts/common/dataCenter.json'
], function( TSDataGrid, TSGridColumn,TSSearch,
		TSButton,TSEvent,html,json){
	'use strict';

	var i18n=TSDataGrid.prototype.i18n.createBranch(json);
	function RelevanceOSImageGrid(opts){
			TSDataGrid.call(this);
		    this.opts=opts;
	        defineProperties.call(this);
	        addEventListeners.call(this);
	}

	function defineProperties() {
		var that = this;
		  var  radio,
		    imageName,
		    osVersion,
		    imageDesc;
	
		radio=new TSGridColumn({
            dataField:"id",
            width:32,
            textAlign: "center",
            labelFunction:function(item){
                var dataField="userId";
                var value=item[dataField];
                return FormatMessage('<input type="radio" name="$1" value="$2" />',dataField,value);
            },
            dataType:"html"
        });
		
		var imageName = new TSGridColumn({
			dataField : "imageName",
			headerText : i18n.getMessage("OSName"),
			width :230
		});
		
		var osVersion = new TSGridColumn({
			dataField : "osVersion",
			headerText : i18n.getMessage("version"),
			width :150,
		});
		
		var imageDesc= new TSGridColumn({
			dataField : "imageDesc",
			headerText : i18n.getMessage("remark"),
			width :150,
		});
		
		this.columns = [
             radio,
             imageName,
             osVersion,
             imageDesc
        ];
		this.usePager = true;
		this.checkable = false;
		this.showToolbar = false;
		this.showFooter = false;
		this.height=280;
	}
	
	function loadData() {
	        var url=this.opts.imageUrl;
	        this.load(url);
	}
	function addEventListeners() {
	        var that=this;
	        this.addEventListener("refreshData",function(e){
	            that.loadData();
	        });
	        this.addEventListener("DOMNodeInserted",function(e){
	         	that.loadData();
	        });
	        this.role("submit").addEventListener("click",function(){
	        	var grid=that.selectedItems;
	        	if(grid.length===0){
	        		Dialog.alert(i18n.getMessage("selectAccount"));
	                return ;
	        	}
	        	var newData= grid[0];
	        	newData.lparPcid = that.opts.data.lparPcid;
	        	$.post(that.opts.updateOSUrl, newData, function(data){
	                if(data.flag === '1'){
	                	that.reload();
	                    Dialog.alert(i18n.getMessage('successful connection system image'));
	                    Dialog.close();
	                }else{
	                    Dialog.alert(Dialog.msg || i18n.getMessage('image correlation systems failure'));
	                }
	            });
	        });
	}
    ExtendClass(RelevanceOSImageGrid, TSDataGrid);
    SetProperties(RelevanceOSImageGrid.prototype,DONT_ENUM,[
         "i18n",i18n,
         "template",html
    ]);
    InstallFunctions(RelevanceOSImageGrid.prototype,NONE,[
         "loadData",loadData,
    ]);

	return RelevanceOSImageGrid;
});