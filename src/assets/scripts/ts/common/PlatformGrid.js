define("ts/common/PlatformGrid",
	["ts/widgets/TSDataGrid",
	 "ts/widgets/TSGridColumn",
	 "ts/widgets/TSSearch",
	 "ts/widgets/TSButton",
	 "ts/events/TSEvent",
	 "infrastructure/engine/EngineService",
	 "dojo/text!ts/common/PlatformGrid.htm",
	 "dojo/css!ts/common/PlatformGrid.css",
	 "dojo/nls!ts/common/dataCenter.json"],
	function(TSDataGrid,TSGridColumn,TSSearch,
			TSButton,TSEvent,EngineService,htm,css,json){
	"use strict";
	
	var i18n=TSDataGrid.prototype.i18n.createBranch(json);
	
	var platformTypeMap = {
		0: 'IVM',
		1: 'HMC',
		2: 'XCAT'
	};
	var XCAT="XCAT",
		IVM="IVM",
		HMC="HMC";
	
	function PlatformGrid(){
		TSDataGrid.call(this);
		defineProperties.call(this);
		this.init();
	}
	
	function init(){
		addEvents.call(this);
	}
	
	/**
	 * 模拟鼠标点击事件
	 */
	function ClickEvent(){
		var evt = new MouseEvent("click", {
		    bubbles: true,
		    cancelable: true,
		    view: window,
		  });
		return evt;
	}
	
	function addEvents(){
		var grid=this;
		
		this.addEventListener("done",function(){
			/**
			 * radio点击触发事件
			 */
			$("input[type=radio]",this.role("tbody")).on("click",function(e){
				if(e.target.type !== "radio"){
					e.stopPropagation();
					return;
				}
				var type=e.target.getAttribute("data-type");
				isVisibleRegisterLparBtn(type);
				setInterfacePrefix(type);
			});
		});
		
		this.addEventListener("refreshData",function(){
			var url='/DataCenterAction.do?method=platformList';
			this.load(url);
		});
		
		/**
		 * 根据平台类型是否显示注册Lpar按钮
		 */
		function isVisibleRegisterLparBtn(type){
			if(IVM===type){
				grid.registerLparButton.setVisiable(false);
			}else if(XCAT===type){
				grid.registerLparButton.setVisiable(true);
			}else if(HMC===type){
				grid.registerLparButton.setVisiable(true);
			}
		}
		
		function setInterfacePrefix(type){
			if(XCAT===type){
				grid.interfacePrefix="xcat/XCAT";
			}else if(IVM===type){
				grid.interfacePrefix="ivm/IVM";
			}else if(HMC===type){
				grid.interfacePrefix="hmc/HMC";
			}else{
				grid.interfacePrefix="";
			}
		}
		
		
	}
	
	function defineProperties(){
		var grid=this;
		//注册Lpar按钮
		this.registerLparButton=null;
		
		this.interfacePrefix="";
		/**
		 * 表格列
		 */
		var checkbox,
			nameColumn,
			typeColumn,
			ipColumn,
			hostCountColumn
		/**
		 * 第一列选择列
		 */
		checkbox=new TSGridColumn({
			dataField:"id",
			headerHTML:'',//'<input type="checkbox" />',
			width:32,
			textAlign:"center",
			labelFunction:function(item){
				var dataField="platformPcid";
				var value=item[dataField];
				var type=platformTypeMap[item["type"]];
				var element='<input type="radio" name="$1" value="$2" data-type="$3" />';
				return FormatMessage(element,dataField,value,type);
			},
			dataType:"html"
		});
		/**
		 * 平台名称列
		 */
		nameColumn=new TSGridColumn({
			dataField:'name',
			headerElement:searchPlatformName(),
			width:100,
			labelFunction:function(item){
				return item["name"];
			},
			dataType:"text"
		});
		
		function searchPlatformName(){
			var span=document.createElement("span");
			span.innerHTML=i18n.getMsg('platformName');
			var search=new TSSearch();
			var input=search.role("searchInput");
			input.placeholder="Search platform name";
			input.addEventListener("input",function(){
				grid.dataProvider.condition["name"]=this.value;
				grid.reload();
			});
			search.placeAt(span,"beforeEnd");
			return span;
		}
		/**
		 * 平台类型列
		 */
		typeColumn=new TSGridColumn({
			dataField:'type',
			headerHTML:i18n.getMsg('platformType'),
			width:100,
			labelFunction:function(item){
				return platformTypeMap[item["type"]];
			},
			dataType:"text"
		});
		
		/**
		 * 平台Ip列
		 */
		ipColumn=new TSGridColumn({
			dataField:'ip',
			headerHTML:i18n.getMsg('ip'),
			width:120,
			labelFunction:function(item){
				return item["ip"];
			},
			dataType:"text"
		});
		/**
		 * 主机数量列
		 */
		hostCountColumn=new TSGridColumn({
			dataField:'hostCount',
			headerHTML:i18n.getMsg('hostCount'),
			width:100,
			labelFunction:function(item){
				return item["hostCount"];
			},
			dataType:"text"
		});
			
		this.columns=[checkbox,
		              nameColumn,
		              typeColumn,
		              ipColumn,
		              hostCountColumn];
		
		this.usePager=true;
		this.checkable=false;
		this.showToolbar=true;
		setToolButtons.call(this);
		this.showFooter=true;
	}
	
	function setToolButtons(){
		var grid=this;
		/**
		 * 注册XCat平台Button
		 */
		var registerXcatButton=new TSButton({
        	buttonName:i18n.getMessage("registerXcatPlatform"),
        	iconClass:"glyphicon glyphicon-plus",
        	click:function(){
        		/*Dialog.create({
                    title: i18n.getMsg('registerXcatPlatform'),
                    url: 'xcat/host/RegisterPHLWizard',
                    widgetOpts: {
                        platformId: '',
                        platformPcid: '',
                        platformType: 'xcat',
                        gridWidget : grid
                    },
                    width: 1012,
                    height: 450
                });*/
        		require(['xcat/host/RegisterPHLWizard'],
        			function(RegisterPHLWizard){
        				var innerWidget = new RegisterPHLWizard({
		                    platformId: '',
		                    platformPcid: '',
		                    platformType: 'xcat',
		                    gridWidget : grid
		                });
			    		Dialog.create({
			                title: i18n.getMsg('registerXcatPlatform'),
			                contentType: "widget",
		                	widget: innerWidget,
			                width: 1012,
			                height: 450
			            });
        			}
        		);
        	}
		});
		
		/**
		 * 注册IVM平台Button
		 */
		var registerIvmButton=new TSButton({
			buttonName:i18n.getMsg('registerIvmPlatform'),
			iconClass:"glyphicon glyphicon-plus",
			click : function() {
				Dialog.create({
					title : i18n.getMsg('registerIvmPlatform'),
					url : 'ivm/host/RegisterIvmWizard',
					widgetOpts : {
						platformId : '',
						platformPcid : '',
						platformName : '',
						gridWidget : grid,
						wizardType : 'platform'
					},
					width : 1012,
					height : 450
				});
			}
		});
		
		var registerHmcButton=new TSButton({
			buttonName:i18n.getMsg('registerHmcPlatform'),
			iconClass:"glyphicon glyphicon-plus",
			click : function() {
				Dialog.create({
					title : i18n.getMsg('registerHmcPlatform'),
					url : 'hmc/RegisterHmcWizard',
					widgetOpts : {
						platformId : '',
						platformPcid : '',
						platformName : '',
						gridWidget : grid,
						wizardType : 'platform'
					},
					width : 1012,
					height : 450
				});
			}
		});
		
		/**
		 * 注册主机Button
		 */
		var registerHostButton=new TSButton({
			buttonName:i18n.getMsg('registerHost'),
			iconClass:"glyphicon glyphicon-plus",
			click : function() {
				var gridData = grid.selectedItems;
				if (gridData.length === 0) {
					Dialog.alert(i18n
							.getMsg('please choose to register the host platform'));
					return;
				} else if (gridData.length > 1) {
					Dialog.alert(i18n
							.getMsg('can only select a platform at a time'));
					return;
				}
				var platformModel = gridData[0];
				platformModel.platformName = platformModel.name;
				platformModel.gridWidget = grid;
				
				var type=platformTypeMap[platformModel.type];
				if(XCAT===type){
					Dialog.create({
						title : i18n.getMsg('registerXcatHost'),
						url : 'xcat/host/RegisterXcatHostWizard',
						widgetOpts : platformModel,
						width : 1012,
						height : 450
					});
				}else if(IVM===type){
					Dialog.create({
						title : i18n.getMsg('registerIvmHost'),
						url : 'ivm/host/RegisterIvmWizard',
						widgetOpts : {
							platformId : platformModel.platformPcid,
							platformPcid : platformModel.platformPcid,
							platformName : platformModel.platformName,
							gridWidget : grid,
							wizardType : 'host'
						},
						width : 1012,
						height : 460
					});
				}else if(HMC===type){
					Dialog.create({
						title : i18n.getMsg('registerHmcHost'),
						url : 'hmc/host/RegisterHmcHostWizard',
						widgetOpts : {
							platformId : platformModel.platformPcid,
							platformPcid : platformModel.platformPcid,
							platformName : platformModel.platformName,
							gridWidget : grid,
							wizardType : 'host'
						},
						width : 1012,
						height : 460
					});
				}
			}
		});
		
		/**
		 * xcat注册Lpar
		 */
		var registerLparButton=new TSButton({
			buttonName:i18n.getMsg('registerLpar'),
			iconClass:"glyphicon glyphicon-plus",
			click:function(){
                var gridData = grid.selectedItems;
                if(gridData.length === 0){
                    Dialog.alert(i18n.getMsg('please choose to register the lpar platform'));
                    return ;
                }else if(gridData.length > 1){
                    Dialog.alert(i18n.getMsg('can only select a platform at a time'));
                    return ;
                }
               var platformModel = gridData[0];
                platformModel.platformId = platformModel.platformPcid;
                platformModel.platformPcid = platformModel.platformPcid;
                platformModel.platformName = platformModel.name;
                platformModel.gridWidget = grid;
            
                Dialog.create({
                    title: i18n.getMsg('registerLpar'),
                    url: 'xcat/host/PlatformRegisterLpartWizard',
                    widgetOpts: platformModel,
                    width: 1012,
                    height: 450
                });
            
			}
		});
		this.registerLparButton=registerLparButton;
		
		var renameButton=new TSButton({
			buttonName:i18n.getMsg('rename'),
			iconClass:"glyphicon glyphicon-edit",
			click : function() {
				var gridData = grid.selectedItems;
				if (gridData.length === 0) {
					Dialog.alert(i18n
							.getMsg('please select a platform to rename'));
					return;
				} else if (gridData.length > 1) {
					Dialog.alert(i18n
							.getMsg('can only select a platform at a time'));
					return;
				}
				var platformModel=gridData[0];
				var interfacePrefix=grid.interfacePrefix;
				
				Dialog.create({
					title : i18n.getMsg('rename'),
					url : 'ts/common/EditPlatform',
					widgetOpts : {
						url : interfacePrefix
								+ 'PlatformAction.do?method=rename',
						checkNameUrl : interfacePrefix
								+ 'PlatformAction.do?method=checkPlatformName',
						data : platformModel,
						gridWidget : grid
					},
					height : 320
				});
			}
		});
		
		// sun
		var renameButtonTest=new TSButton({
			buttonName:i18n.getMsg('rename'),
			iconClass:"glyphicon glyphicon-edit",
			click : function() {
				var gridData = grid.selectedItems;
				if (gridData.length === 0) {
					Dialog.alert(i18n
							.getMsg('please select a platform to rename'));
					return;
				} else if (gridData.length > 1) {
					Dialog.alert(i18n
							.getMsg('can only select a platform at a time'));
					return;
				}
				var platformModel=gridData[0];
				var interfacePrefix=grid.interfacePrefix;
				
				Dialog.create({
					title : i18n.getMsg('rename'),
					url : 'ts/common/EditPlatformTest',
					widgetOpts : {
						url : interfacePrefix + 'PlatformAction.do?method=rename',
						checkNameUrl : interfacePrefix + 'PlatformAction.do?method=checkPlatformName',
						data : platformModel,
						gridWidget : grid
					},
					height : 320
				});
			}
		});
		
		var deleteButton=new TSButton({
			buttonName:i18n.getMsg('delete'),
			iconClass:"glyphicon glyphicon-minus-sign",
			click:function(){
                var gridData = grid.selectedItems;
                if (gridData.length === 0) {
                    Dialog.alert(i18n.getMsg('please select a platform to delete'));
                    return;
                }
                if(gridData[0].type==="1"){
                	var id=[{
                		id:gridData[0].id
                	}]
                	 Dialog.confirm(i18n.getMsg('unrecoverable deletion, sure to delete?'), function (bool) {
                         if(bool){
                             $.post(grid.interfacePrefix + 'PlatformAction.do?method=remove',id, function(data){
                                 if(data.flag === '1'){
                                     //因删除平台不是任务所以再这里手动删除
                                     tree.refresh();
                                     Dialog.alert(i18n.getMsg('delSucc'));

                                 }
                             });
                         }
                     });
                	
                }else{
                Dialog.confirm(i18n.getMsg('unrecoverable deletion, sure to delete?'), function (bool) {
                    if(bool){
                        $.post(grid.interfacePrefix + 'PlatformAction.do?method=remove', gridData, function(data){
                            if(data.flag === '1'){
                                //因删除平台不是任务所以再这里手动删除
                                tree.refresh();
                                Dialog.alert(i18n.getMsg('delSucc'));

                            }
                        });
                    }
                });
                }
			}
		});
		
		var exportPlatformData=new TSButton({
			buttonName:i18n.getMsg('exportPlatformData'),
			iconClass:"glyphicon glyphicon-export",
			click:function(){
                var gridData = grid.selectedItems;
                if (gridData.length === 0) {
                    Dialog.alert(i18n.getMsg('Please choose to export the data platform'));
                    return;
                }
                var interfacePrefix=grid.interfacePrefix;
                var platformPcid = gridData[0].platformPcid;
                var url = interfacePrefix + 'PlatformAction.do?method=exportPlatformInfo&platformPcid=' + platformPcid;

                var $iframe = $('<iframe src="'+ url +'" style="display:none; visibility:hidden;"></iframe>');
                $('body').append($iframe);
                setTimeout(function(){
                    $iframe.remove();//请求后就会下载文件，1秒后删除iframe以防内存泄漏
                    $iframe = null;
                }, 1000);
            
			}
		});
		//exportPlatformData.disabled();
		var engineType = EngineService.getEngineType();
		if(engineType == 'AIX') {
			this.actions = [
            	registerHmcButton,
            	registerHostButton,
            	//registerLparButton,
            	//renameButton,
            	//renameButtonTest,
            	deleteButton,
            	exportPlatformData
            ];
		} else {
			this.actions = [
            	registerIvmButton,
            	registerXcatButton,
            	registerHostButton,
            //registerLparButton,
            	//renameButton,
            	//renameButtonTest,
            	deleteButton,
            	exportPlatformData
            ];
		}
	}
	
	ExtendClass(PlatformGrid,TSDataGrid);
	
	SetProperties(PlatformGrid.prototype,DONT_ENUM,[
        "i18n",i18n,
        "template",htm
  	]);
  	InstallFunctions(PlatformGrid.prototype,DONT_ENUM,[
  	    "init",init		
  	]);
  	
  	return PlatformGrid;
});
