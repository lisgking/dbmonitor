define("ts/common/InstallOSGrid",
	[
	 "ts/widgets/TSDataFormGrid",
	 "ts/widgets/TSGridColumn",
	 "ts/widgets/TSTextField",
	 "ts/widgets/TSComboBox",
	 "ts/widgets/TSSearch",
	 "ts/widgets/TSButton",
	 "ts/util/NsdFieldGroup",
	 "ts/events/TSEvent",
	 "ts/util/List",
	 "dojo/text!ts/common/InstallOSGrid.html",
	 "dojo/css!ts/common/InstallOSGrid.css",
	 "dojo/nls!ts/common/dataCenter.json"],
	function(TSDataFormGrid,TSGridColumn,TSTextField,TSComboBox,TSSearch,
			TSButton,NsdFieldGroup,TSEvent,List,htm,css,json){
	"use strict";
	
	var i18n=TSDataFormGrid.prototype.i18n.createBranch(json);

	function InstallOSGrid(opts){
		this.opts = opts;
		
		TSDataFormGrid.call(this);
		defineProperties.call(this);
		
		addEventListeners.call(this);
		
		init.call(this);
	}
	
	function init(){
		//addEvent.call(this);
		var that = this;
		this.setRows(this.opts.data)
		
		var group = new NsdFieldGroup();
		group.placeAt(this.rootElement,"beforeEnd");
		
		
		/*var elements=[];
		var nsd=$('td[headers="ip"] input', this.role("tbody")).toArray();
		elements=elements.concat(nsd);
		group.elements=elements;*/
		//selectAll.call(this);
		
		// 获取ip列的field
		var arr = that.form.items.reduce(function(arr, field){
			if(field.getName() == 'ip') {
				arr.push(field);
			}
			return arr;
        },[]);
		
		group.elements = arr;
		
		this.addEventListener("distroy",function(){
			group.distroy();
		});
	}
	
	function toHost(list) {
		var groupMap = List.prototype.groupBy.call(list, "hostPcid");
		return Object.keys(groupMap).map(function(hostPcid) {
			var groupItems = this[hostPcid];
			return {
				hostPcid : hostPcid,
				lparArrayInfo : groupItems.map(function(lpar) {
					return {
						lparPcid : lpar.lparPcid,
						imageId: lpar.imageId,
						lparPassword: lpar.lparPassword,
						ip: lpar.ip
					};
				})
			};
		}, groupMap);
	}
	
	function addEventListeners() {
		
		var that = this;
		var submit = this.roles.get('submit');
		$(submit).on('click', function () {
			if (!that.form.isValid()) {
				return;
			}
			
			/*var list = [
	            {
	            	hostPcid: 'hostPcid1',
	            	lparPcid: 'lparPcid1',
	            	imageId: 'fdasfdsa',
	            	lparPassword: 'fdafd',
	            	ip: '1.1.1.1'	
	            }, {
	            	hostPcid: 'hostPcid1',
	            	lparPcid: 'lparPcid2',
	            	imageId: 'fdasfdsa',
	            	lparPassword: 'fdafd',
	            	ip: '1.1.1.2'
	            }, {
	            	hostPcid: 'hostPcid2',
	            	lparPcid: 'lparPcid1',
	            	imageId: 'fdasfdsa',
	            	lparPassword: 'fdafd',
	            	ip: '1.1.1.3'
	            }, {
	            	hostPcid: 'hostPcid2',
	            	lparPcid: 'lparPcid2',
	            	imageId: 'fdasfdsa',
	            	lparPassword: 'fdafd',
	            	ip: '1.1.1.4'
	            }
			];*/
			
			var reqData = {
				platformPcid: that.opts.data[0].platformPcid,
				hostList: toHost(that.dataRows.toArray())
			};
			
			$.post("hmc/HMCLparAction.do?method=batchInstallOS", reqData, function(data) {
				if(data.flag == 1) {
					Dialog.alert(i18n.getMessage('installSuccess'));
					Dialog.close();
					tree.refresh();
				} else {
					Dialog.alert(data.msg);
				}
			});
		});
	}
	
	function defineProperties(){
		var grid=this;
		
		/**
		 * 表格列
		 */
		var checkbox,lparPcid, lparPassword, imageId, ip;
			
		/**
		 * 第一列选择列
		 */
		checkbox=new TSGridColumn({
			dataField:"id",
			headerHTML:'',//'<input type="checkbox" />',
			width:32,
			textAlign:"center",
			labelFunction:function(item){
				var dataField="lparPcid";
				var value=item[dataField];
				var element='<input type="radio" name="$1" value="$2" />';
				return FormatMessage(element,dataField,value);
			},
			dataType:"html"
		});
		
		var lparName = new TSGridColumn({
			dataField:"nameAlias",
			headerText:i18n.getMessage("lparName"),
			width:150
		});
		
		var url = "hmc/HMCLparAction.do?method=getImageList";
		$.post(url, {
			"pageNo" : 1,
			"pageSize" : 20,
			"condition" : {}
		}, function (data) {
			var event = new TSEvent('comboload');
			event.data = data.rows;
			grid.dispatchEvent(event);
		});
		
		imageId=new TSGridColumn({
			dataField:"imageId",
			headerHTML:i18n.getMsg('selectOS'),
			width:200,
			labelFunction:function(item){
				var field = new TSComboBox({
					//allowBlank: false,
					height: 29,
					name: 'imageId',
					displayField: 'imageName',
					valueField: 'imageId',
					listeners: {
						input: function() {
							item.imageId = this.getValue();
						},
						change: function() {
							item.imageId = this.getValue();
						}
					}
				});
				
				grid.addEventListener('comboload', function(e) {
					field.load(e.data);
					item.imageId = field.getValue();
				})
                return field;
			},
			dataType:"widget"
		});
		
		ip=new TSGridColumn({
			dataField:"ip",
			headerHTML:i18n.getMsg('ip'),
			width:150,
			labelFunction:function(item){
				var field = new TSTextField({
					//allowBlank: false,
					height: 30,
					vtype: 'ip',
					emptyText: '',
					listeners: {
						input: function() {
							item.ip = this.getValue();
						},
						change: function() {
							item.ip = this.getValue();
						}
					}
				})
                return field;
			},
			dataType:"widget"
		});
		
		lparPassword=new TSGridColumn({
			dataField:"lparPassword",
			headerHTML:i18n.getMsg('lparPassword'),
			width:150,
			labelFunction:function(item){
				var field = new TSTextField({
					type: 'password',
					allowBlank: false,
					height: 30,
					listeners: {
						input: function() {
							item.lparPassword = this.getValue();
						}
					}
				})
				return field;
			},
			dataType:"widget"
		});
		
		this.columns=[
		    lparName,
	  		imageId,
	  		ip,
	  		lparPassword
  		];
		this.height = 290;
		this.usePager=false;
		this.checkable=false;
		this.showToolbar=false;
		this.showFooter=false;
	}
	
	ExtendClass(InstallOSGrid,TSDataFormGrid);
	
	SetProperties(InstallOSGrid.prototype,DONT_ENUM,[
        "i18n",i18n,
        "template",htm
  	]);
  	InstallFunctions(InstallOSGrid.prototype,DONT_ENUM,[
  	    "init",init		
  	]);
  	
  	return InstallOSGrid;
});
