define("ts/common/EditHostIPGrid",
	["ts/widgets/TSDataFormGrid",
	 "ts/widgets/TSGridColumn",
	 "ts/widgets/TSTextField",
	 "ts/util/DOMUtils",
	 'ts/util/Cryption!',
	 "dojo/text!ts/common/EditHostIPGrid.html",
	 "dojo/nls!./dataCenter.json"
	 ],
	function(TSDataFormGrid,TSGridColumn,TSTextField,DOMUtils,
			Cryption,html,json){
	
	var i18n=TSDataFormGrid.prototype.i18n.createBranch(json,"EditHostIPGrid");
	function EditHostIPGrid(opts){
		TSDataFormGrid.call(this);
		this.opts=opts;
		defineProperties.call(this);
        addEventListeners.call(this);
	}
	
	
	function defineProperties(){
		var self=this;
		/**
         * 名称列
         */
		var lparName=new TSGridColumn({
			dataField:"hostName",
			headerText:i18n.getMessage("hostName"),
			width:250,
			textAlign:"center"
		});
		
		/**
         * IP
         */
		var lparIP=new TSGridColumn({
			dataField:"iP",
			headerText:i18n.getMessage("IP"),
			width:150,
			textAlign:"center",
			labelFunction:function(item,column){
				var value=item.ip;
				return new TSTextField({
					value : value,
					allowBlank: false,
					emptyText: '',
					validateFunText: i18n.getMessage("IPCanUsed"),
					vtype:'ip',
					height: 30,
					width:135,
					listeners: {
						input:function(e){
							item.ip=this.getValue();
						}
					}
				});
			},
			dataType:"widget"
		});

		this.columns=[lparName,
		              lparIP];
		this.usePager=false;
		this.checkable=false;
		this.showToolbar=false;
		this.showFooter=false;
	}
	
	function addEventListeners(){
		var grid=this;
		var opts=this.opts;
		this.addEventListener("DOMNodeInserted",function(e){
			
			this.setRows(opts.data);
		});
		this.role("save").addEventListener("click",function(e){
			var hostList = grid.dataRows.toArray();
			
			if(!grid.form.isValid()) {
				return;
			}
			$.post(grid.opts.url, hostList, function(data){
				
                if(data.flag === '1'){
                    Dialog.close();
                    Dialog.alert(i18n.getMsg('editHostIPSucc'));
                }else{
                    Dialog.alert(data.msg);
                }
                opts.gridWidget.reload();
            });
		});
	}
	
	function loadData(lparList){
		this.setRows(lparList);
	}
	
	ExtendClass(EditHostIPGrid,TSDataFormGrid);
	
	InstallFunctions(EditHostIPGrid.prototype,DONT_DELETE,[
	    "loadData",loadData
	]);
	SetProperties(EditHostIPGrid.prototype,DONT_ENUM,[
	    "template",html,
	    "i18n",i18n
	]);
	
	return EditHostIPGrid;
	
});