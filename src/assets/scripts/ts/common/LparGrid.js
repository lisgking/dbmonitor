define("ts/common/LparGrid",
	["ts/widgets/TSDataGrid",
	 "ts/widgets/TSGridColumn",
	 "ts/widgets/TSSearch",
	 "ts/widgets/TSButton",
	 "ts/widgets/TSSelect",
	 "ts/events/TSEvent",
	 "infrastructure/engine/EngineService",
	 "dojo/text!ts/common/LparGrid.html",
	 "dojo/css!ts/common/LparGrid.css",
	 "dojo/nls!ts/common/dataCenter.json"],
	function(TSDataGrid,TSGridColumn,TSSearch,
			TSButton,TSSelect,TSEvent,EngineService,htm,css,json){
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

	function LparGrid(){
		TSDataGrid.call(this);
		
		this.engineType = EngineService.getEngineType();
		
		defineProperties.call(this);
		this.init();
	}
	
	function init(){
		addEvent.call(this);
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
	
	function addEvent(){
		var grid=this;
		this.addEventListener("done",function(){
			/**
			 * radio点击触发事件
			 */
			$("input[type=radio],input[type=checkbox]",this.role("tbody")).on("click",function(e){
				
				if(e.target.checked == false) {
					return;
				}
				
				if(e.target.type !== "checkbox" && e.target.type !== "radio"){
					e.stopPropagation();
					return;
				}
				var lparPcid=e.target.value;
				
				var lparData=getSelectedLpar();
				if(lparData.lparPcid!==lparPcid){
					throw TypeError("信息不一致");
					e.stopPropagation();
					return;
				}
				var type=platformTypeMap[lparData.platformType];
				
				var runningStatus=lparData.runningStatus;
				
				
				//根据平台类型显示操作按钮
				setActionBtn.call(grid,type);
				//根据选择的主机状态设置那些按钮可操作
				setActionBtnStatus.call(grid,runningStatus);
				
				setActionsStatusByMaster.call(grid,lparData);
				
				setInterfacePrefix(type);
				
				return;
			});
			
			function getSelectedLpar(){
				var dataRows=grid.selectedItems;
				if(dataRows && dataRows.length>0){
					return dataRows[0];
				}
			}
			

			function setActionBtnStatus(runningStatus) {
				this.actions.forEach(function(btn){
					btn.enabled();
				});
				var actions=this.actions;
				switch (this.runningStatusMap[runningStatus]) {
					case 'unknown':
						disableActions('name', ['editIP',
								'installOS', 'relevanceOS',
								'setupLparTrust' ],actions);
						break;
					case 'running':
						var btn=[ 'delete', 'start' ];
						if(this.platformType===IVM){
							var delBtn=btn.shift();
						}
						disableActions('name',btn,actions);
						break;
					case 'closed':
						disableActions('name', [ 'close', 'restart',
								'editIP', 'installOS', 'relevanceOS',
								'setupLparTrust' ],actions);
						break;
					case 'unavailable':
						disableActions('name', [ 'delete', 'start',
								'close', 'restart', 'editIP', 'installOS',
								'relevanceOS', 'setupLparTrust' ],actions);
						break;
					case 'starting':
						disableActions('name', [ 'delete', 'start',
								'close', 'restart', 'editIP', 'installOS',
								'relevanceOS', 'setupLparTrust' ],actions);
						break;
					case 'closing':
						disableActions('name', [ 'delete', 'start',
								'close', 'restart', 'editIP', 'installOS',
								'relevanceOS', 'setupLparTrust' ],actions);
						break;
					case 'suspending':
						disableActions('name', [ 'delete', 'start',
								'close', 'restart', 'rename', 'editIP',
								'installOS', 'relevanceOS',
								'setupLparTrust', 'delete' ],actions);
						break;
				}
			}
		});
		
		this.addEventListener("refreshData",function(){
			var url='/DataCenterAction.do?method=lparList';
			this.load(url);
		});
		
		function setInterfacePrefix(type){
			if(XCAT===type){
				grid.projectName=XCAT;
				grid.interfacePrefix="xcat/XCAT";
			}else if(IVM===type){
				grid.projectName=IVM;
				grid.interfacePrefix="ivm/IVM";
			}else if(HMC===type){
				grid.projectName=HMC;
				grid.interfacePrefix="hmc/HMC";
			}else{
				grid.projectName="";
				grid.interfacePrefix="";
			}
		}
		
		function setActionBtn(type){
			if(XCAT===type){
				this.actions=this.xcatActions;
			}else if(IVM===type){
				this.actions=this.ivmActions;
			}else if(HMC===type){
				this.actions=this.hmcActions;
			}else{
				this.actions=[];
			}
			this.platformType=type;
		}
	}
	
	function defineProperties(){
		var grid=this;
		
		this.actions=[];
		
		this.platformType="";
		
		this.xcatActions=[];
		
		this.ivmActions=[];
		
		this.hmcActions=[];
		
		this.projectName="";
		
		this.interfacePrefix="";
		
		this.runningStatusMap = {
            0: 'unknown',
            1: 'running',
            2: 'closed',
            3: 'suspended',
            4: 'unavailable',
            5: 'starting',
            6: 'closing',
            7: 'migrating',
            8: 'deleting',
            9: 'suspending',
            10: 'reconfiguring',
            11: 'openfirmware'
        };
		
		/**
		 * 表格列
		 */
		var checkbox,
			lparNameColumn,
			lparTypeColumn,
			hostNameColumn,
			platformNameColumn,
			runningStatusColumn,
			registrationStatusColumn,
			lparProcColumn;
		/**
		 * 第一列选择列
		 */
		checkbox = new TSGridColumn({
  			dataField : "lparPcid",
  			//headerHTML : '<input type="radio" name="all"/>',
  			headerHTML: '',
  			textAlign : "center",
  			labelFunction : function (item, column) {
  				var value = item[column.dataField];
  				var input = document.createElement("input");
  				input.type = "radio";
  				input.name = column.dataField;
  				input.value = value;
  				return input;
  			},
  			dataType : "element",
  			width:32
  		});
		
		lparNameColumn=new TSGridColumn({
			dataField:"nameAlias",
			headerElement:searchLparName(),
			width:100,
		});
		var lparType=[{value:"0",key:i18n.getMessage("the unknown")},
	           			{value:"1",key:i18n.getMessage("physical partitions")},
	           			{value:"2",key:i18n.getMessage("virtual partitions")},
	           			{value:"5",key:i18n.getMessage("vios partition")}
	           			];
			function lparTypeHeader(){
				var span=document.createElement("span");
				span.innerHTML=i18n.getMessage("type");
				var select=new TSSelect();
				select.init(lparType);
				var selectDom=select.role("searchSelelct");
				selectDom.addEventListener("change",function(){
					if(this.value){
						grid.dataProvider.condition["lparType"]=this.value;
					}else{
						delete grid.dataProvider.condition["lparType"];
					}
					tree.refresh();
				});
				select.placeAt(span,"beforeEnd");
				return span;
			}
			lparTypeColumn=new TSGridColumn({
				dataField:"lparType",
				headerHTML:i18n.getMessage('type'),
				headerElement:lparTypeHeader(),
				width:130,
				labelFunction:function(item){
					var lparTypeMap = {
	                    0: i18n.getMessage('the unknown'),
	                    1: i18n.getMessage('physical partitions'),
	                    2: i18n.getMessage('virtual partitions'),
	                    3: i18n.getMessage('vios partition')
	                };
	                return lparTypeMap[item["lparType"]] || item["lparType"];
				},
				dataType:"html"
			});
		hostNameColumn=new TSGridColumn({
			dataField:"hostName",
			headerHTML:i18n.getMsg('host'),
			width:100
		});
		
		platformNameColumn=new TSGridColumn({
			dataField:"platformName",
			headerHTML:i18n.getMsg('platform'),
			width:100
		});
		
		var status=[{value:"0",key:i18n.getMessage("unknown")},
         			{value:"1",key:i18n.getMessage("running")},
         			{value:"2",key:i18n.getMessage("closed")},
         			{value:"5",key:i18n.getMessage("starting")},
         			{value:"6",key:i18n.getMessage("closing")}
         			];
		function statusHeader(){
			var span=document.createElement("span");
			span.innerHTML=i18n.getMessage("runningStatus");
			var select=new TSSelect();
			select.init(status);
			var selectDom=select.role("searchSelelct");
			selectDom.addEventListener("change",function(){
				if(this.value){
					grid.dataProvider.condition["runningStatus"]=this.value;
				}else{
					delete grid.dataProvider.condition["runningStatus"];
				}
				tree.refresh();
			});
			select.placeAt(span,"beforeEnd");
			return span;
		}
		runningStatusColumn=new TSGridColumn({
			dataField:"runningStatus",
			headerHTML:i18n.getMessage('runningStatus'),
			headerElement:statusHeader(),
			width:130,
			labelFunction:function(item){
				return statusFormatter(item["runningStatus"], [
                    {key: 0, clsName: 'label-warning', text: i18n.getMessage('unknown')},
                    {key: 1, clsName: 'label-success', text: i18n.getMessage('running')},
                    {key: 2, clsName: 'label-danger', text: i18n.getMessage('closed')},
                    {key: 3, clsName: 'label-warning', text: i18n.getMessage('suspended')},
                    {key: 4, clsName: 'label-warning', text: i18n.getMessage('unavailable')},
                    {key: 5, clsName: 'label-warning', text: i18n.getMessage('starting')},
                    {key: 6, clsName: 'label-warning', text: i18n.getMessage('closing')},
                    {key: 7, clsName: 'label-warning', text: i18n.getMessage('migrating')},
                    {key: 8, clsName: 'label-warning', text: i18n.getMessage('deleting')},
                    {key: 9, clsName: 'label-warning', text: i18n.getMessage('suspending')},
                    {key: 10, clsName: 'label-warning', text: i18n.getMessage('reconfiguring')},
                    {key: 11, clsName: 'label-warning', text: i18n.getMessage('openfirmware')}
                ]);
			},
			dataType:"html"
		});
		
		registrationStatusColumn=new TSGridColumn({
			dataField:"registrationStatus",
			headerHTML:i18n.getMsg('registrationStatus'),
			width:100,
			labelFunction:function(item){
				return statusFormatter(item["registrationStatus"], [
	                   {key: 0, clsName: 'label-warning', text: i18n.getMsg('unregistered')},
	                   {key: 1, clsName: 'label-success', text: i18n.getMsg('registered')},
	                   {key: 2, clsName: 'label-danger', text: i18n.getMsg('logout')}
	               ]);
			},
			dataType:"html"
		});
		
		lparProcColumn=new TSGridColumn({
			dataField:"lparProc",
			headerHTML:i18n.getMsg('config'),
			width:100,
			labelFunction:function(item){
				var configStr = '';

                if(item.lparMem && item.lparMem.reqMem){
                    configStr += i18n.getMsg('the available memory') +'('+ Math.floor(item.lparMem.reqMem / 1024)  +'G)';
                }

                if(item.lparProc && item.lparProc.reqProcs){
                	configStr = configStr!=''?',':'';
                    configStr += i18n.getMsg('available CPU') +'('+ item.lparProc.reqProcs +')';
                }

                return configStr;
			},
			dataType:"html"
		});
		
		this.columns=[checkbox,
		  			lparNameColumn,
					lparTypeColumn,
					hostNameColumn,
					platformNameColumn,
					runningStatusColumn,
					registrationStatusColumn,
					lparProcColumn];
		
		this.usePager=true;
		this.checkable=false;
		this.showToolbar=true;
		this.showFooter=true;
		
		setToolButtons.call(this);
		function searchLparName(){
			var span=document.createElement("span");
			span.innerHTML=i18n.getMsg('lparName');
			var search=new TSSearch();
			var input=search.role("searchInput");
			input.placeholder="Search lpar name";
			input.addEventListener("input",function(){
				grid.dataProvider.condition["lparName"]=this.value;
				tree.refresh();
			});
			search.placeAt(span,"beforeEnd");
			return span;
		}
	}
	
	function setToolButtons(){
		var grid=this;
		
		var renameBtn=new TSButton({
			name:"rename",
			buttonName:i18n.getMsg('rename'),
			iconClass:"glyphicon glyphicon-edit",
			click:function(){
                var data = grid.selectedItems;
                if(data.length === 0){
                    Dialog.alert(i18n.getMsg('please select a lpar to rename'));
                    return ;
                }else if(data.length > 1){
                    Dialog.alert(i18n.getMsg('can only select a lpar at a time'));
                    return ;
                }

                Dialog.create({
                    title: i18n.getMsg('rename'),
                    url: 'ts/common/EditLparTest',
                    widgetOpts: {
                        url: grid.interfacePrefix + 'LparAction.do?method=rename',
                        checkNameUrl: grid.interfacePrefix + 'LparAction.do?method=checkLparName',
                        data: data[0],
                        gridWidget: grid
                    },
                    height: 320
                });
			}
		});
		
		var editIPBtn=new TSButton({
			name:"editIP",
			buttonName:i18n.getMsg('editIP'),
			iconClass:"glyphicon glyphicon-edit",
			click:function(){
                var gridData = grid.selectedItems;
                if(gridData.length === 0){
                    Dialog.alert(i18n.getMsg('please select to edit the IP lpar'));
                    return ;
                }else if(gridData.length > 10){
                    Dialog.alert(i18n.getMsg('can only select a lpar at a time'));
                    return ;
                }
                 Dialog.create({
                    title: i18n.getMsg('editIP'),
                    url: 'ts/common/EditLparIpGrid',
                    widgetOpts: {
                        url: grid.interfacePrefix + 'LparAction.do?method=updateIP',
                        netCardUrl: grid.interfacePrefix + 'LparAction.do?method=getLparNetworkCardList',
                        data: gridData,
                        gridWidget: grid,
                    },
                    height: 420,
                    width: 800
                });
			}
		});
		
		var improveInfoBtn=new TSButton({
			name: "improveInfo",
			buttonName:i18n.getMsg('improveInfo'),
			iconClass:"glyphicon glyphicon-edit",
			click:function(){
                var gridData = grid.selectedItems;
                if(gridData.length === 0){
                    Dialog.alert(i18n.getMsg('please select to edit the lpar'));
                    return ;
                }else if(gridData.length > 10){
                    Dialog.alert(i18n.getMsg('can only select a lpar at a time'));
                    return ;
                }
                var data=gridData[0];
                var platformType=platformTypeMap[data.platformType];
                var widget="";
                var url="";
                if(platformType === XCAT) {
                	widget="xcat/host/ConfigLparWizard";
                	/*widget="xcat/host/EditLpar";*/
                } else if(platformType === IVM) {
                	//widget="ivm/host/EditLpar";	// 2015年5月19日更改
                	widget = "ivm/host/ConfigLparWizard";
                } else if(platformType === HMC) {
                	widget = "hmc/host/ConfigLparWizard";
                }
                
                Dialog.create({
                    title: i18n.getMsg('improveInfo'),
                    url: widget,
                    widgetOpts: {
                        ivmUrl: grid.interfacePrefix + 'LparAction.do?method=configIVMLpar',
                        xcatUrl: grid.interfacePrefix + 'LparAction.do?method=registerXCATLparConfigIp',
                        data: gridData,
                        gridWidget: grid,
                        grid : grid
                    },
                    height: 420,
                    width: 800
                });                           
            
			}
		});
		
		var deleteBtn=new TSButton({
			name:"delete",
			buttonName:i18n.getMsg('delete'),
			iconClass:"glyphicon glyphicon-minus-sign",
			click:function(){
                var gridData = grid.selectedItems;
                if(gridData.length === 0){
                    Dialog.alert(i18n.getMsg('please select to delete the lpar'));
                    return ;
                }else if(gridData.length > 10){
                    Dialog.alert(i18n.getMsg('can only select a lpar at a time'));
                    return ;
                }
                
                if(grid.projectName === XCAT){
                    Dialog.create({
                        title: i18n.getMsg('deleteLpar'),
                        //url: 'ts/common/DeleteLpar',
                        url: 'ts/common/DeleteLparTest',
                        widgetOpts: {
                            url: grid.interfacePrefix + 'LparAction.do?method=remove',
                            data: gridData[0],
                            gridWidget: grid,
                            lparListWidget: grid
                        },
                        height: 420
                    });
                }else if(grid.projectName === HMC){
                	var params = 
                    	 {
                    		lparPcid: gridData[0].lparPcid	
                    	};
                	 Dialog.confirm(i18n.getMsg('unrecoverable deletion, sure to delete?'),function(bool){
                         if(bool){
                             $.post(grid.interfacePrefix + 'LparAction.do?method=remove',params,function(data){
                                 if(data.flag==1){
                                	 tree.refresh();
                                 }
                             });
                         }
                     });
                	
                }else{
                    Dialog.confirm(i18n.getMsg('unrecoverable deletion, sure to delete?'),function(bool){
                        if(bool){
                            $.post(grid.interfacePrefix + 'LparAction.do?method=remove',gridData[0],function(data){
                                if(data.flag==1){
                                	tree.refresh();
                                }
                            });
                        }
                    });
                }
			}
		});
		
		var viewConfigBtn=new TSButton({
			name:"viewConfig",
			buttonName:i18n.getMsg('viewConfig'),
			iconClass:"glyphicon glyphicon-edit",
			click:function(){
                var gridData = grid.selectedItems;
                if(gridData.length === 0){
                    Dialog.alert(i18n.getMsg('please choose to view the configuration of the lpar'));
                    return ;
                }else if(gridData.length > 1){
                    Dialog.alert(i18n.getMsg('can only select a lpar at a time'));
                    return ;
                }
                Dialog.create({
                    title: i18n.getMsg('viewConfig'),
                    url: 'ts/common/LparConfigInfoTest',
                    widgetOpts: {
                        url: grid.interfacePrefix + 'HostAction.do?method=getHostResources',
                        data: gridData[0],
                        gridWidget: grid
                    },
                    height: 320
                });
			}
		});
		
		var startBtn=new TSButton({
			name:"start",
			buttonName:i18n.getMsg('start'),
			iconClass:"glyphicon glyphicon-play",
			click:function(){
                var gridData = grid.selectedItems;
                if(gridData.length === 0){
                    Dialog.alert(i18n.getMsg('please select to start the lpar'));
                    return ;
                }
                
                var params = gridData.reduce(function(arr, it) {
                	var o = {
                		lparPcid: it.lparPcid	
                	};
                	arr.push(o);
                	return arr;
                }, [])

                Dialog.confirm(i18n.getMsg('start, sure?'), function (bool) {
                    if(bool){
                        Dialog.loading(i18n.getMsg('in the boot partition...'));
                        $.post(grid.interfacePrefix + 'LparAction.do?method=start', params, function(data){
                            Dialog.closeLoading();
                            if(data.flag === '1'){
                            	tree.refresh();
//                                gridData.forEach(function(item){
//                                    item.runningStatus = that.runningStatusMapInversion.starting;
//                                });
//                                grid.updateData(gridData, 'lparPcid');
//                                that.setActionsStatus(grid, that.runningStatusMapInversion.starting);
//                                that.setActionsStatusByMaster(grid, gridData);
                            }
                        });
                    }
                });
			}
		});
		
		var closeBtn=new TSButton({
			name:"close",
			buttonName:i18n.getMsg('close'),
			iconClass:"glyphicon glyphicon-stop",
			click:function(){
                var gridData = grid.selectedItems;
                if(gridData.length === 0){
                    Dialog.alert(i18n.getMsg('please select to close the lpar'));
                    return ;
                }
                if(grid.projectName === HMC){
                	var params = gridData.reduce(function(arr, it) {
                    	var o = {
                    		lparPcid: it.lparPcid	
                    	};
                    	arr.push(o);
                    	return arr;
                    }, [])
               	 Dialog.confirm(i18n.getMsg('closed, sure?'), function (bool) {
                     if(bool){
                         Dialog.loading(i18n.getMsg('close the partition..'));
                         $.post(grid.interfacePrefix + 'LparAction.do?method=shutdown',params, function(data){
                             Dialog.closeLoading();
                             if(data.flag === '1'){
                             	tree.refresh();
                             }
                         });
                     }
                   });
               	}else
               	{
                   Dialog.confirm(i18n.getMsg('closed, sure?'), function (bool) {
                    if(bool){
                        Dialog.loading(i18n.getMsg('close the partition..'));
                        $.post(grid.interfacePrefix + 'LparAction.do?method=shutdown', gridData, function(data){
                            Dialog.closeLoading();
                            if(data.flag === '1'){
//                                gridData.forEach(function(item){
//                                    item.runningStatus = that.runningStatusMapInversion.closing;
//                                });
//                                grid.updateData(gridData, 'lparPcid');
//                                that.setActionsStatus(grid, that.runningStatusMapInversion.closing);
//                                that.setActionsStatusByMaster(grid, gridData);
                            	tree.refresh();
                            }
                        });
                    }
                  });
                }
			}
		});
		
		var restartBtn=new TSButton({
			name:"restart",
			buttonName:i18n.getMsg('restart'),
			iconClass:"glyphicon glyphicon-refresh",
			click:function(){
                var gridData = grid.selectedItems;
                if(gridData.length === 0){
                    Dialog.alert(i18n.getMsg('please select to restart the lpar'));
                    return ;
                }
                if(grid.projectName === HMC){
                	var params = gridData.reduce(function(arr, it) {
                    	var o = {
                    		lparPcid: it.lparPcid	
                    	};
                    	arr.push(o);
                    	return arr;
                    }, [])
                    Dialog.confirm(i18n.getMessage('restart, sure?'), function (bool) {
                        if(bool){
                        	if(bool){
                        		Dialog.loading(i18n.getMessage('restart partition...'));
                                $.post('hmc/HMCLparAction.do?method=resetLpar',params, function(data){
                                    Dialog.closeLoading();
                                    if(data.flag === '1'){
                                    	tree.refresh();
                                    }
                                });
                                
                            }
                        }
                    });
                  
               }else{
                Dialog.confirm(i18n.getMsg('restart, sure?'), function (bool) {
                    if(bool){
                        Dialog.loading(i18n.getMsg('restart partition... '));
                        $.post(grid.interfacePrefix + 'LparAction.do?method=resetLpar', gridData, function(data){
                            Dialog.closeLoading();
                            if(data.flag === '1'){
                            	tree.refresh();
//                                gridData.forEach(function(item){
//                                    item.runningStatus = that.runningStatusMapInversion.starting;
//                                });
//                                grid.updateData(gridData, 'lparPcid');
//                                that.setActionsStatus(grid, that.runningStatusMapInversion.starting);
//                                that.setActionsStatusByMaster(grid, gridData);
                            }
                        });
                    }
                });}
			}
		});
		
		var installOSBtn=new TSButton({
			name:"installOS",
			buttonName:i18n.getMsg('installOS'),
			iconClass:"glyphicon glyphicon-hdd",
			click:function(){
                var gridData = grid.selectedItems;
                if(gridData.length === 0){
                    Dialog.alert(i18n.getMsg('please select the lpar to install the system'));
                    return ;
                }
                
                if(grid.engineType == 'AIX') {
                	if(gridData.length == 1) {
                		Dialog.create({
                            title: i18n.getMsg('installOS'),
                            url: 'ts/common/InstallOSForm',
                            widgetOpts: {
                                lparEnvCheckUrl: grid.interfacePrefix + 'LparAction.do?method=getLparIPInfo',
                                lparConfigUrl: grid.interfacePrefix + 'LparAction.do?method=getImageList',
                                installOSUrl: grid.interfacePrefix + 'LparAction.do?method=installOS',
                                data: gridData,
                                gridWidget: grid,
                                // projectName: 'xcat'
                            },
                            width: 500,
                            height: 300
                        });
                	} else {
                		Dialog.create({
                            title: i18n.getMsg('installOS'),
                            url: 'ts/common/InstallOSGrid',
                            widgetOpts: {
                                lparEnvCheckUrl: grid.interfacePrefix + 'LparAction.do?method=getLparIPInfo',
                                lparConfigUrl: grid.interfacePrefix + 'LparAction.do?method=getImageList',
                                installOSUrl: grid.interfacePrefix + 'LparAction.do?method=installOS',
                                data: gridData,
                                gridWidget: grid,
                                // projectName: 'xcat'
                            },
                            width: 800,
                            height: 540
                        });
                	}
                } else {
                	Dialog.create({
                        title: i18n.getMsg('installOS'),
                        url: 'ts/common/InstallOSWizard',
                        widgetOpts: {
                            lparEnvCheckUrl: grid.interfacePrefix + 'LparAction.do?method=getLparIPInfo',
                            lparConfigUrl: grid.interfacePrefix + 'LparAction.do?method=getImageList',
                            installOSUrl: grid.interfacePrefix + 'LparAction.do?method=installOS',
                            data: gridData,
                            gridWidget: grid,
                            // projectName: 'xcat'
                        },
                        width: 800,
                        height: 470
                    });
                }
			}
		});
		
		var relevanceOSBtn=new TSButton({
			name:"relevanceOS",
			buttonName:i18n.getMsg('relevanceOS'),
			iconClass:"glyphicon glyphicon-wrench",
			click:function(){
                var gridData = grid.selectedItems;
                if(gridData.length === 0){
                    Dialog.alert(i18n.getMsg('please choose to associate system image of the lpar'));
                    return ;
                }else if(gridData.length > 1){
                    Dialog.alert(i18n.getMsg('can only select a lpar at a time'));
                    return ;
                }
                Dialog.create({
                    title: i18n.getMsg('relevanceOS'),
                    url: 'ts/common/RelevanceOSImageGrid',
                    widgetOpts: {
                        imageUrl: grid.interfacePrefix + 'LparAction.do?method=getImageList&lparPcid='+gridData[0].lparPcid,
                        updateOSUrl: grid.interfacePrefix + 'LparAction.do?method=updateOSInfo',
                        data: gridData[0]
                    },
                    width: 800,
                    height: 450
                });
			}
		});
		
		var setupLparTrustBtn=new TSButton({
			name:"setupLparTrust",
			buttonName:i18n.getMsg('setupLparTrust'),
			iconClass:"glyphicon glyphicon-wrench",
			click:function(){
                var gridData = grid.selectedItems;
                if(gridData.length === 0){
                    Dialog.alert(i18n.getMsg('please select a lpar to configure SSH trust between lpars'));
                    return ;
                }else if(gridData.length > 1){
                    Dialog.alert(i18n.getMsg('can only select a lpar at a time'));
                    return ;
                }
               /* if(grid.projectName === 'xcat'){
                    Dialog.create({
                        title: i18n.getMsg('setupLparTrust'),
                        url: 'ts/common/SetupLparTrust',
                        widgetOpts: {
                            url: grid.interfacePrefix + 'LparAction.do',
                            data: gridData,
                            gridWidget: grid
                        },
                        height: 320
                    });
                }else{
                    Dialog.create({
                        title: i18n.getMsg('setupLparTrust'),
                        url: 'ts/common/SetupLparTrust',
                        widgetOpts: {
                            url: grid.interfacePrefix + 'LparAction.do',
                            data: gridData,
                            gridWidget: grid
                        },
                        height: 320
                    });
                }*/
                
                Dialog.create({
                	title : i18n.getMessage('setupLparTrust'),
                	url : 'ts/common/SetupLparTrustForm',
                	widgetOpts : {
                		url: grid.interfacePrefix + 'LparAction.do',
                		data : gridData,
                		gridWidget : grid
                	},
                	height : 320
                });
			}
		});
		
		var openConsoleBtn=new TSButton({
			name:"openConsole",
			buttonName:i18n.getMsg('openConsole'),
			iconClass:"glyphicon glyphicon-wrench",
			click:function(){
                var gridData = grid.selectedItems;
                if (gridData.length === 0) {
                    Dialog.alert(i18n.getMsg('please select a lpar to open the console'));
                    return;
                }

                Dialog.loading(i18n.getMsg('open the console...'));
                $.post(grid.interfacePrefix + 'LparAction.do?method=openConsole', gridData, function(data){
                    Dialog.closeLoading();
                    if(data.flag == 1){
                        $('body').append('<div style="width:0px; ">' + data.msg + '</div>');
                    }
                });
			}
		});
		
		this.allActions=[/*renameBtn,
		              editIPBtn,*/
		              improveInfoBtn,
		              deleteBtn,
		              viewConfigBtn,
		              startBtn,
		              closeBtn,
		              restartBtn,
		              installOSBtn,
		              relevanceOSBtn,
		              setupLparTrustBtn,
		              openConsoleBtn];
		
		this.xcatActions=[renameBtn,
		                  editIPBtn,
		                  improveInfoBtn,
		                  deleteBtn,
		                  viewConfigBtn,
		                  startBtn,
		                  closeBtn,
		                  restartBtn,
		                  installOSBtn,
		                  relevanceOSBtn,
		                  setupLparTrustBtn,
		                  openConsoleBtn
		                  ];
		
		this.ivmActions=[renameBtn,
		                 editIPBtn,
		                 improveInfoBtn,
		                 deleteBtn,
		                 startBtn,
		                 closeBtn,
		                 restartBtn,
		                 installOSBtn,
		                 relevanceOSBtn,
		                 setupLparTrustBtn,
		                 openConsoleBtn];
		
		this.hmcActions=[improveInfoBtn,
		                 deleteBtn,
		                 startBtn,
		                 closeBtn,
		                 restartBtn,
		                 installOSBtn,
		            //     relevanceOSBtn,
		                 setupLparTrustBtn];
		
		this.actions=this.allActions;
		
		var renameBtn=new TSButton({
			buttonName:null,
			iconClass:"",
			click:function(){
				
			}
		});
	}
	
	function disableActions(key,btnNames,actions){
		btnNames.forEach(function(btnName){
			actions.forEach(function(btn){
				if(btnName===btn[key])
					btn.disabled();
			});
		});
	}
	
	function enableActions(key,btnNames,actions){
		btnNames.forEach(function(btnName){
			actions.forEach(function(btn){
				if(btnName===btn[key])
					btn.enabled();
			});
		});
	}
	
	function setActionsStatusByMaster(data){
		var that = this;
        if($.type(data) === 'object'){
            data = [data];
        }
        data.forEach(function(item){
            if(item.isMaster === '1' && that.projectName === 'xcat'){
                var hideActions = ['close', 'editIP', 'installOS', 'delete'];
                disableActions('name', hideActions,that.actions);
            }else if(that.projectName === 'ivm') {
            	 if(that.runningStatusMap[item.runningStatus] === 'running') {
            		 enableActions('name', ['delete'],that.actions);
                 }else  if(that.runningStatusMap[item.runningStatus] === 'closed') {
                	disableActions('name', ['delete'],that.actions);
                 }
            } 
        });
	}
	
	function statusFormatter(data, statusInfo){
		if($.type(statusInfo) !== 'array') return data;

        var newData = '';
        var clsName = 'label-default';
        var text = '';

        statusInfo.some(function(item){
            if(data == item.key){
                clsName = item.clsName || clsName;
                text = item.text || text;
                return true;
            }
        });

        text = text || data;

        newData = '<span class="label '+ clsName +'">'+ text +'</span>';
        return newData;
	}
	
	ExtendClass(LparGrid,TSDataGrid);
	
	SetProperties(LparGrid.prototype,DONT_ENUM,[
        "i18n",i18n,
        "template",htm
  	]);
  	InstallFunctions(LparGrid.prototype,DONT_ENUM,[
  	    "init",init		
  	]);
  	
  	return LparGrid;
});
