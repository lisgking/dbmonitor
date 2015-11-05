define("ts/common/LparAssginIpGridPower8",
	["ts/widgets/TSDataFormGrid",
	 "ts/widgets/TSGridColumn",
	 "ts/widgets/TSTextField",
	 "dojo/text!ts/common/LparAssginIpGridPower8.html",
	 "dojo/nls!./dataCenter.json"
	 ],
	function(TSDataFormGrid,TSGridColumn,TSTextField,html,json){
	
	var i18n=TSDataFormGrid.prototype.i18n.createBranch(json);
	
	function LparAssginIpGridPower8(opts){
		TSDataFormGrid.call(this);
		this.opts=opts;
		defineProperties.call(this);
        addEventListeners.call(this);
	}
	
	
	function defineProperties(){
		var self=this;
		/**
         * 分区名称列
         */
		var lparName=new TSGridColumn({
			dataField:"lparName",
			headerText:i18n.getMessage("lparName"),
			width:230,
			textAlign:"center"
		});
		
		/**
         * 分区IP
         */
		var lparIP=new TSGridColumn({
			dataField:"lparIP",
			headerText:i18n.getMessage("lparIP"),
			width:230,
			textAlign:"center",
			labelFunction:function(item,column){
				var value;
				if(item.networkCardPOList[0]==null){
					value='';
				}else{
				    value=item.networkCardPOList[0].lparIp;
				}
				return new TSTextField({
					value : value,
					allowBlank: false,
					emptyText: '',
					validateFunText: i18n.getMessage("IPCanUsed"),
					vtype:'ip',
					height: 30,
					listeners: {
						validate: function(f, field) {
							var me = this;
							$.post('ivm/IVMLparAction.do?method=checkLparIp', {
									ip:  me.getValue()
							}, function (data) {
								if (data.flag === true) {
									f(false);
								} else {
									f(true);
								}
							});
						},
						"input":function(e){
							//item["lparIp"]=this.getValue();
							item['ip'] = this.getValue();
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
		this.height=253;
	}
	
	function addEventListeners(){
		
	}
	
	function getData(){
		return this.dataRows.toArray();
	}
	
	function loadData(lparList){
		this.setRows(lparList);
	}
	
	function validate(){
		return this.form.isValid();
	}
	
	ExtendClass(LparAssginIpGridPower8,TSDataFormGrid);
	
	InstallFunctions(LparAssginIpGridPower8.prototype,DONT_DELETE,[
	    "loadData",loadData,
	    "getData",getData,
	    "validate",validate
	]);
	SetProperties(LparAssginIpGridPower8.prototype,DONT_ENUM,[
	    "template",html,
	    "i18n",i18n
	]);
	
	return LparAssginIpGridPower8;
	
});