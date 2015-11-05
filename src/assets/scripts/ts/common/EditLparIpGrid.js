define("ts/common/EditLparIpGrid",
	["ts/widgets/TSDataFormGrid",
	 "ts/widgets/TSGridColumn",
	 "ts/widgets/TSTextField",
	 "ts/widgets/TSComboBox",
	 "ts/util/DOMUtils",
	 'ts/util/Cryption!',
	 //"dojo/text!./htm/EditLparIpGrid.html",
	 "dojo/text!ts/common/EditLparIpGrid.html",
	 //"dojo/css!./css/EditLparIpGrid.css",
	 "dojo/nls!./dataCenter.json"
	 ],
	function(TSDataFormGrid,TSGridColumn,TSTextField,TSComboBox,DOMUtils,
			Cryption,html,json){
	
	var i18n=TSDataFormGrid.prototype.i18n.createBranch(json,"EditLparIpGrid");
	
	function EditLparIpGrid(opts){
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
			width:150,
			textAlign:"center"
		});
		
		/**
         * 分区IP
         */
		var lparIP=new TSGridColumn({
			dataField:"lparIP",
			headerText:i18n.getMessage("lparIP"),
			width:142,
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
							$.post('xcat/XCATLparAction.do?method=checkLparIp', {
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
							item['ipConfig']['ip'] = this.getValue();
						}
					}
				});
			},
			dataType:"widget"
		});
		
		/**
         * 分区网关
         */
		var lparGateway=new TSGridColumn({
			dataField:"lparGateway",
			headerText:i18n.getMessage("lparGateway"),
			width:142,
			textAlign:"center",
			labelFunction:function(item,column){
				var value;
				if(item.networkCardPOList[0]==null){
					value='';
				}else{
				    value=item.networkCardPOList[0].lparGateway;
				}
				return new TSTextField({
					value : value,
					allowBlank: false,
					emptyText: '',
					vtype:'ip',
					height: 30,
					listeners:{
						"input":function(e){
							//item["lparGateway"]=this.getValue();
							item['ipConfig']['gateway'] = this.getValue();
						}
					}
				});
			},
			dataType:"widget"
		});
		
		/**
         * 分区密码
         */
		var lparPassword=new TSGridColumn({
			dataField:"lparPassword",
			headerText:i18n.getMessage("lparPassword"),
			width:142,
			textAlign:"center",
			labelFunction:function(item,column){
				return new TSTextField({
					value : '',
					allowBlank: false,
					emptyText: '',
					vtype:'alphanum',
					type:'password',
					height: 30,
					listeners:{
						input: function(e) {
							item.lparPassword = Cryption.encryptKey(this.getValue());
						}
					}
				});
			},
			dataType:"widget"
		});
		
		/**
         * 网卡
         */
		var netCard=new TSGridColumn({
			dataField:"netCard",
			headerText:i18n.getMessage("netCard"),
			width:100,
			textAlign:"center",
			labelFunction:function(item,column){
				var networkCardPOList = item.networkCardPOList.filter(function(item) {
				    return item.bootProto == '1';
				}).sort(function(x, y) {
					return x.netCard < y.netCard;
				});
				
				var value;
				if (networkCardPOList[0] == null) {
					value = '';
				} else {
					value = networkCardPOList[0].netCard;
				}
				
				item.netCardInfo = value;
				/*return new TSTextField({
					value : value,
					allowBlank: false,
					emptyText: '',
					vtype:'alphanum',
					readOnly:true,
					height: 30,
				});*/
				
				var field = new TSComboBox({
					allowBlank: false,
					height : 29,
					name : 'netCard',
					value: value,
					displayField : 'netCard',
					valueField : 'netCard',
					listeners : {
						input : function () {
							item.netCardInfo = this.getValue();
						},
						change : function () {
							item.netCardInfo = this.getValue();
						}
					}
				});
				
				field.load(networkCardPOList);
				field.setValue(value);
				return field;
			},
			dataType:"widget"
		});
	
		this.columns=[lparName,
		              lparIP,
		              lparGateway,
		              lparPassword,
		              netCard];
		this.usePager=false;
		this.checkable=false;
		this.showToolbar=false;
		this.showFooter=false;
		this.height=290;
	}
	
	function addEventListeners(){
		var grid=this;
		this.addEventListener("DOMNodeInserted",function(e){
			var opts=this.opts;
			this.setRows(opts.data);
		});
		
		this.role("save").addEventListener("click",function(e){
			
			if(!grid.form.isValid()) {
				return;
			}
			$.post(grid.opts.url, grid.dataRows.toArray(), function(data){
				if(data.flag==="1"){
					Dialog.alert("修改LparIp成功");
				}
				
				if(grid.opts.widgetOpts.cb) {
					grid.opts.widgetOpts.cb.call();
				}
			});
		});
	}
	
	function loadData(lparList){
		this.setRows(lparList);
	}
	
	ExtendClass(EditLparIpGrid,TSDataFormGrid);
	
	InstallFunctions(EditLparIpGrid.prototype,DONT_DELETE,[
	    "loadData",loadData
	]);
	SetProperties(EditLparIpGrid.prototype,DONT_ENUM,[
	    "template",html,
	    "i18n",i18n
	]);
	
	return EditLparIpGrid;
	
});