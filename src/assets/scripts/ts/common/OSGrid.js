define('ts/common/OSGrid', [
     "ts/widgets/TSDataGrid",
     "ts/widgets/TSGridColumn",
     "ts/widgets/TSSearch",
     "ts/widgets/TSButton",
     "ts/events/TSEvent",
	'dojo/nls!ts/common/dataCenter.json'
], function(TSDataGrid,TSGridColumn,TSSearch,
		TSButton,TSEvent, json){
	'use strict';

	var i18n=TSDataGrid.prototype.i18n.createBranch(json);
	function OSGrid(opts){
		TSDataGrid.call(this);
	    this.opts=opts;
        defineProperties.call(this); 
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
		this.height=270;
	}
	
	function loadData() {
	        var url=this.opts.url;
	        this.load(url);
	}
   
	ExtendClass(OSGrid, TSDataGrid);
    SetProperties(OSGrid.prototype,DONT_ENUM,[
         "i18n",i18n,
        /* "template",html*/
    ]);
    InstallFunctions(OSGrid.prototype,NONE,[
         "loadData",loadData,
    ]);

	return OSGrid;
});