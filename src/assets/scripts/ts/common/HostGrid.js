define('ts/common/HostGrid', 
	["ts/widgets/TSDataGrid",
	 "ts/widgets/TSGridColumn",
	 "ts/widgets/TSSearch",
	 "ts/widgets/TSButton",
	 "ts/events/TSEvent",
     'dojo/text!ts/common/HostGrid.html',
  	 'dojo/css!ts/common/HostGrid.css',
  	 'dojo/nls!ts/common/dataCenter.json'],
  	 function(TSDataGrid,TSGridColumn,TSSearch,
  		TSButton,TSEvent,htm,css,json){
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
	
	function HostGrid(){
		TSDataGrid.call(this);
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
		
		this.addEventListener("DOMNodeInserted",function(){
			//this.createCompleteCallback();
		});
		
		this.addEventListener("refreshData",function(){
			var url='/DataCenterAction.do?method=hostList';
			this.load(url);
		});
		
		this.addEventListener("done",function(){		
			/**
			 * radio点击触发事件
			 */
			$("input[type=radio]",this.role("tbody")).on("click",function(e){
				if(e.target.type !== "radio"){
					e.stopPropagation();
					return;
				}
				var hostId=e.target.value;
				
				var hostData=getSelectedHost();
				if(hostData.hostPcid!==hostId){
					throw TypeError("信息不一致");
					e.stopPropagation();
					return;
				}
				
				var type=platformTypeMap[hostData.platformType];
				
				var runningStatus=hostData.runningStatus;
				
				var isExistMgrLpar=hostData.isExistMgrLpar;
				//根据平台类型显示操作按钮
				setActionBtn.call(grid,type);
				
				//根据选择的主机状态设置那些按钮可操作
				setActionBtnStatus.call(grid,runningStatus,isExistMgrLpar);
				
				setInterfacePrefix(type);
				
				e.stopPropagation();
				return;
			});
		});
		
		function getSelectedHost(){
			var dataRows=grid.selectedItems;
			if(dataRows && dataRows.length>0){
				return dataRows[0];
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
			
		}
		
		function setActionBtnStatus(runningStatus,isExistMgrLpar){
			this.actions.forEach(function(btn){
				btn.enabled();
			});
			var actions=this.actions;
			switch(this.runningStatusMap[runningStatus]){//根据运行状态设置禁用用按钮
		        case 'closed':
		            disableActions('name', ['createLpar', 'close', 'restart', 'editIP', 'refresh']);
		            break;
		        case 'running':
		            	var arr = ['start'];
		            if(isExistMgrLpar){
		            	arr.push('close', 'restart');
		            }                
		            disableActions('name', arr);
		            break;
		        case 'unknown':
		            disableActions('name', ['editIP']);
		            break;
		        case 'starting':
		            disableActions('name', ['createLpar', 'start', 'close', 'restart', 'editIP', 'refresh']);
		            break;
		        case 'closing':
		            disableActions('name', ['createLpar', 'start', 'close', 'restart', 'editIP', 'refresh']);
		            break;
		        case 'restarting':
		            disableActions('name', ['createLpar', 'start', 'close', 'restart', 'editIP', 'refresh']);
		            break;
		    }
			
			function disableActions(key,btnNames){
				btnNames.forEach(function(btnName){
					actions.forEach(function(btn){
						if(btnName===btn[key])
							btn.disabled();
					});
				});
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
		
		this.interfacePrefix="";
		
		this.runningStatusMap = {//运行状态
            0: 'closed',
            1: 'running',
            2: 'unknown',
            3: 'starting',
            4: 'closing',
            5: 'restarting',
            9: 'deleting'
        };
		
		var grid=this;
		
		var checkbox,
			nameAliasColumn,
			snNoColumn,
			typeModelColumn,
			platformNameColumn,
			virtualStatusColumn,
			runningStatusColumn,
			registrationStatusColumn;
			
		
		/**
		 * 第一列选择列
		 */
		checkbox=new TSGridColumn({
			dataField:"id",
			headerHTML:'',
			width:32,
			textAlign:"center",
			labelFunction:function(item){
				var dataField="hostPcid";
				var value=item[dataField];
				var type=item["platformName"];
				var element='<input type="radio" name="$1" value="$2" data-type="$3" />';
				return FormatMessage(element,dataField,value,type);
			},
			dataType:"html"
		});
		
		nameAliasColumn=new TSGridColumn({
			dataField:"nameAlias",
			headerElement:searchHostmName(),
			width:100,
			labelFunction:function(item){
				return item["nameAlias"];
			},
			dataType:"text"
		});
		
		snNoColumn=new TSGridColumn({
			dataField:"snNo",
			headerHTML:i18n.getMsg('snNo'),
			width:100,
			labelFunction:function(item){
				return item["snNo"];
			},
			dataType:"text"
		});
		
		typeModelColumn=new TSGridColumn({
			dataField:"typeModel",
			headerHTML:i18n.getMsg('typeModel'),
			width:100,
			labelFunction:function(item){
				return item["typeModel"];
			},
			dataType:"text"
		});
		
		platformNameColumn=new TSGridColumn({
			dataField:"platformName",
			headerHTML:i18n.getMsg('platformName'),
			width:100,
			labelFunction:function(item){
				return item["platformName"];
			},
			dataType:"text"
		});
		
		virtualStatusColumn=new TSGridColumn({
			dataField:"virtualStatus",
			headerHTML:i18n.getMsg('virtualStatus'),
			width:100,
			labelFunction : function(item) {
				return statusFormatter(item["virtualStatus"], [ {
					key : 0,
					text : i18n.getMsg('no virtualization')
				}, {
					key : 1,
					clsName : 'label-success',
					text : i18n.getMsg('virtualization')
				}, ]);
			},
			dataType:"html"
		});
		
		runningStatusColumn=new TSGridColumn({
			dataField:"runningStatus",
			headerHTML:i18n.getMsg('runningStatus'),
			width:100,
			labelFunction : function(item) {
				return statusFormatter(item["runningStatus"], [ {
					key : 0,
					clsName : 'label-danger',
					text : i18n.getMsg('close')
				}, {
					key : 1,
					clsName : 'label-success',
					text : i18n.getMsg('run')
				}, {
					key : 2,
					clsName : 'label-warning',
					text : i18n.getMsg('unknown')
				}, {
					key : 3,
					clsName : 'label-warning',
					text : i18n.getMsg('starting')
				}, {
					key : 4,
					clsName : 'label-warning',
					text : i18n.getMsg('closing')
				}, {
					key : 5,
					clsName : 'label-warning',
					text : i18n.getMsg('restarting')
				}, {
					key : 9,
					clsName : 'label-warning',
					text : i18n.getMsg('deleting')
				}, ]);
			},
			dataType:"html"
		});
		
		registrationStatusColumn=new TSGridColumn({
			dataField:"registrationStatus",
			headerHTML:i18n.getMsg('registrationStatus'),
			width:100,
			labelFunction : function(item) {
				return statusFormatter(item["registrationStatus"], [ {
					key : 0,
					clsName : 'label-warning',
					text : i18n.getMsg('unregistered')
				}, {
					key : 1,
					clsName : 'label-success',
					text : i18n.getMsg('registered')
				}, {
					key : 2,
					clsName : 'label-danger',
					text : i18n.getMsg('logout')
				}, ]);
			},
			dataType:"html"
		});
		
		function searchHostmName(){
			var span=document.createElement("span");
			span.innerHTML=i18n.getMsg('hostName');
			var search=new TSSearch();
			var input=search.role("searchInput");
			input.placeholder="Search host name";
			input.addEventListener("input",function(){
				grid.dataProvider.condition["hostName"]=this.value;
				grid.reload();
			});
			search.placeAt(span,"beforeEnd");
			return span;
		}
		
		this.columns=[checkbox,
		  			nameAliasColumn,
					snNoColumn,
					typeModelColumn,
					platformNameColumn,
					virtualStatusColumn,
					runningStatusColumn,
					registrationStatusColumn];
		
		this.usePager=true;
		this.checkable=false;
		this.showToolbar=true;
		setToolButtons.call(this);
		this.showFooter=true;
	}
	
	function setToolButtons(){
		var grid=this;
		
		var registerLparBtn=new TSButton({
			name:"registerLpar",
			buttonName:i18n.getMsg('registerLpar'),
			iconClass:"glyphicon glyphicon-plus",
			click : function() {
				var gridData = grid.selectedItems;
				if (gridData.length === 0) {
					Dialog.alert(i18n.getMsg('please choose to register the lpar host'));
					return;
				} else if (gridData.length > 1) {
					Dialog.alert(i18n.getMsg('can only select a host at a time'));
					return;
				}
				var hostModel = gridData[0];
				hostModel.hostName = hostModel.hostname;
				hostModel.gridWidget = grid;
				
				var platformType=platformTypeMap[hostModel.platformType];
				
				if(XCAT===platformType){
					Dialog.create({
						title : i18n.getMsg('registerLpar'),
						url : 'xcat/host/RegisterLpartWizard',
						widgetOpts : hostModel,
						width : 1012,
						height : 450
					});
				}else if(IVM===platformType){
					Dialog.loading(i18n.getMsg('please wait for is scanning them information'));
                    $.post('ivm/IVMLparAction.do?method=scanHostIVMLpar',{hostPcid:hostModel.hostPcid},function(data){
                    	Dialog.closeLoading();
                    	Dialog.create({title: i18n.getMsg('registerLpar'),
                    		url: 'ivm/host/RegisterIvmWizard',
                    		widgetOpts: {lparData:data, gridWidget: grid, wizardType: 'lpar'},
                    		width: 1012, height: 460 });
                    });
				}else if(HMC===platformType){
				//	Dialog.loading(i18n.getMsg('please wait for is scanning them information'));
					/*$.post('hmc/HMCLparAction.do?method=scanRegisterLparsAction',{
	            	    "platformPcid": hostModel.platformPcid,//4137691d-3cc8-425b-968d-83e9dabd56d0
	            	    "hosts": [
	            	        {
	            	            "hostPcid": hostModel.hostPcid//"d7454edb-a535-4794-8d28-ace52304f7e6"
	            	        }
	            	    ]
		            	},function(data){
	             //   	Dialog.closeLoading();
	                	if(!!data[0].lparPOList){*/
	                		Dialog.create({title: i18n.getMessage('registerLpar'), url: 'hmc/RegisterHmcWizard', widgetOpts: {
	        				//	lparData:data,
	                			lparData:gridData,
	        					gridWidget: null,
	        					wizardType: 'lpar'
	        				},width: 960, height: 500 });                		
	                /*	}
	                });*/
				}
			}
		});
		
		var createLparBtn=new TSButton({
			name:"createLpar",
			buttonName:i18n.getMsg('createLpar'),
			iconClass:"glyphicon glyphicon-plus",
			click:function(){
                var gridData = grid.selectedItems;
                if(gridData.length === 0){
                    Dialog.alert(i18n.getMsg('please choose to create the lpar host'));
                    return ;
                }else if(gridData.length > 1){
                    Dialog.alert(i18n.getMsg('can only select a host at a time'));
                    return ;
                }
                var hostModel = gridData[0];
                hostModel.hostName = hostModel.hostname;
                hostModel.gridWidget = grid;
            
                Dialog.create({title: i18n.getMsg('createLpar'),
                	url: 'hmc/host/CreateLparWizard',
                	widgetOpts: hostModel, width: 1012, height: 450 });
			}
		});
		
		var createBatchLparBtn=new TSButton({
			name:"createBatchLpar",
			buttonName:i18n.getMsg('createBatchLpar'),
			iconClass:"glyphicon glyphicon-plus",
			click:function(){
                var gridData = grid.selectedItems;
                if(gridData.length === 0){
                    Dialog.alert(i18n.getMsg('please select to edit the record'));
                    return ;
                }
            
                Dialog.create({
                    title: i18n.getMsg('createBatchLpar'),
                    url: 'xcat/host/CreateBatchLpar',
                    widgetOpts: {
                        url: 'xcat/XCATLparAction.do?method=batchCreateLpart',
                        hostList: gridData
                    },
                    width: 960,
                    height: 450
                });
			}
		});
		
		var renameBtn=new TSButton({
			name:"rename",
			buttonName:i18n.getMsg('rename'),
			iconClass:"glyphicon glyphicon-edit",
			click:function(){
                var gridData = grid.selectedItems;
                if(gridData.length === 0){
                    Dialog.alert(i18n.getMsg('please select a host to rename'));
                    return ;
                }else if(gridData.length > 1){
                    Dialog.alert(i18n.getMsg('can only select a host at a time'));
                    return ;
                }

                Dialog.create({
                    title: i18n.getMsg('rename'),
                    url: 'ts/common/EditHost',
                    widgetOpts: {
                        url: grid.interfacePrefix + 'HostAction.do?method=rename',
                        checkNameUrl: grid.interfacePrefix + 'HostAction.do?method=checkHostName',
                        data: gridData[0],
                        gridWidget: grid
                    },
                    height: 320
                });
			}
		});
		
		
		// sun test
		var renameBtnTest = new TSButton({
			name:"rename",
			buttonName:i18n.getMsg('rename'),
			iconClass:"glyphicon glyphicon-edit",
			click:function(){
                var gridData = grid.selectedItems;
                if(gridData.length === 0){
                    Dialog.alert(i18n.getMsg('please select a host to rename'));
                    return ;
                }else if(gridData.length > 1){
                    Dialog.alert(i18n.getMsg('can only select a host at a time'));
                    return ;
                }

                Dialog.create({
                    title: i18n.getMsg('rename'),
                    url: 'ts/common/EditHostTest',
                    widgetOpts: {
                        url: grid.interfacePrefix + 'HostAction.do?method=rename',
                        checkNameUrl: grid.interfacePrefix + 'HostAction.do?method=checkHostName',
                        data: gridData[0],
                        gridWidget: grid
                    },
                    height: 320
                });
			}
		});
		
		var editIpBtn=new TSButton({
			name:"editIP",
			buttonName:i18n.getMsg('editIP'),
			iconClass:"glyphicon glyphicon-edit",
			click:function(){
                var gridData = grid.selectedItems;
                if(gridData.length === 0){
                    Dialog.alert(i18n.getMsg('please select to edit the IP host'));
                    return ;
                }else if(gridData.length > 10){
                    Dialog.alert(i18n.getMsg('can only select a host at a time'));
                    return ;
                }
                Dialog.create({
                    title: i18n.getMsg('editIP'),
                    url: 'ts/common/EditHostIPGrid',
                    widgetOpts: {
                        url: grid.interfacePrefix + 'HostAction.do?method=hostUpdateFspIp',
                        data: gridData,
                        gridWidget: grid
                    },
                    height: 420
                });
			}
		});

		var resAssignInfoBtn=new TSButton({
			name:"resAssignInfo",
			buttonName:i18n.getMsg('resAssignInfo'),
			iconClass:"glyphicon glyphicon-edit",
			click:function(){
                var gridData = grid.selectedItems;
                if(gridData.length === 0){
                    Dialog.alert(i18n.getMsg('please select a host'));
                    return ;
                }else if(gridData.length > 1){
                    Dialog.alert(i18n.getMsg('can only select a host at a time'));
                    return ;
                }
                Dialog.create({
                    title: i18n.getMsg('resAssignInfo'),
                    url: 'ts/common/ResAssignInfo',
                    widgetOpts: {
                        url: grid.interfacePrefix + 'HostAction.do?method=getHostResources',
                        data: gridData[0],
                        gridWidget: grid
                    },
                    height: 320
                });
			}
		});
		

		// sun
		var resAssignInfoBtnTest=new TSButton({
			name:"resAssignInfo",
			buttonName:i18n.getMsg('resAssignInfo'),
			iconClass:"glyphicon glyphicon-edit",
			click:function(){
                var gridData = grid.selectedItems;
                if(gridData.length === 0){
                    Dialog.alert(i18n.getMsg('please select a host'));
                    return ;
                }else if(gridData.length > 1){
                    Dialog.alert(i18n.getMsg('can only select a host at a time'));
                    return ;
                }
                Dialog.create({
                    title: i18n.getMsg('resAssignInfo'),
                    url: 'ts/common/ResAssignInfoTest',
                    widgetOpts: {
                        url: grid.interfacePrefix + 'HostAction.do?method=getHostResources',
                        data: gridData[0],
                        gridWidget: grid
                    },
                    height: 320
                });
			}
		});
		
		var logoutBtn=new TSButton({
			name:"logout",
			buttonName:i18n.getMsg('logout'),
			iconClass:"glyphicon glyphicon-minus-sign",
			click:function(){
                var gridData = grid.selectedItems;
                if (gridData.length === 0) {
                    Dialog.alert(i18n.getMsg('please choose to remove the host'));
                    return;
                }
                if(grid.interfacePrefix === "hmc/HMC"){
                	var params = gridData.reduce(function(arr, it) {
                    	var o = {
                    		hostPcid: it.hostPcid
                    	};
                    	arr.push(o);
                    	return arr;
                    }, []);
                	Dialog.confirm(i18n.getMsg('unrecoverable deletion, sure to delete?'), function (bool) {
                        if(bool){
                            $.post(grid.interfacePrefix + 'HostAction.do?method=remove', params, function(data){
                                if(data.flag === '1'){
                                	tree.refresh();
                                }
                            });
                        }
                    });
		        }else{
                Dialog.confirm(i18n.getMsg('unrecoverable deletion, sure to delete?'), function (bool) {
                    if(bool){
                        $.post(grid.interfacePrefix + 'HostAction.do?method=remove', gridData, function(data){
                            if(data.flag === '1'){
//                                gridData.forEach(function(item){
//                                    item.runningStatus = that.runningStatusMapInversion.deleting;
//                                });
                                //grid.updateData(gridData, 'hostPcid');
                            	tree.refresh();
                                //that.setActionsStatus(grid, that.runningStatusMapInversion.deleting);                                            
                                //TODO that.runningStatusMapInversion.deleting设置按钮状态
                            }
                        });
                    }
                });}
			}
		});
		
		var startBtn=new TSButton({
			name:"start",
			buttonName:i18n.getMsg('start'),
			iconClass:"glyphicon glyphicon-play",
			click:function(){
                var gridData = grid.selectedItems;
                if(gridData.length === 0){
                    Dialog.alert(i18n.getMsg('please choose to start the host'));
                    return ;
                }
                if(grid.interfacePrefix === "hmc/HMC"){
                	var params = gridData.reduce(function(arr, it) {
                    	var o = {
                    		hostPcid: it.hostPcid
                    	};
                    	arr.push(o);
                    	return arr;
                    }, []);
                	   Dialog.confirm(i18n.getMsg('start, sure?'), function (bool) {

                           if(bool){
                               Dialog.loading(i18n.getMsg('start the host...'));
                               $.post(grid.interfacePrefix + 'HostAction.do?method=start', params, function(data){
                                   Dialog.closeLoading();
                                   if(data.flag === '1'){
                                	  tree.refresh();
                                   }
                               });
                               
                           }
                       });
		        }else{
                Dialog.confirm(i18n.getMsg('start, sure?'), function (bool) {

                    if(bool){
                        Dialog.loading(i18n.getMsg('start the host...'));
                        $.post(grid.interfacePrefix + 'HostAction.do?method=start', gridData, function(data){
                            Dialog.closeLoading();
                            if(data.flag === '1'){
//                                gridData.forEach(function(item){
//                                    item.runningStatus = that.runningStatusMapInversion.starting;
//                                });
//                                grid.updateData(gridData, 'hostPcid');
//                                that.setActionsStatus(grid, that.runningStatusMapInversion.starting);
                            	tree.refresh();
                            }
                        });
                        
                    }
                });
                }
			}
		});
		
		var closeBtn=new TSButton({
			name:"close",
			buttonName:i18n.getMsg('close'),
			iconClass:"glyphicon glyphicon-stop",
			click:function(){
                var gridData = grid.selectedItems;
                if(gridData.length === 0){
                    Dialog.alert(i18n.getMsg('please choose to close the host'));
                    return ;
                }
                if(grid.interfacePrefix === "hmc/HMC"){
                	var params = gridData.reduce(function(arr, it) {
                    	var o = {
                    		hostPcid: it.hostPcid
                    	};
                    	arr.push(o);
                    	return arr;
                    }, []);
                	   Dialog.confirm(i18n.getMsg('closed, sure?'), function (bool) {
                           if(bool){
                               Dialog.loading(i18n.getMsg('shut in the host...'));
                               $.post(grid.interfacePrefix + 'HostAction.do?method=shutdown', params, function(data){
                                   Dialog.closeLoading();
                                   if(data.flag === '1'){
                                	  tree.refresh();
                                   }
                               });
                               
                           }
                       });
		        }else{
                Dialog.confirm(i18n.getMsg('closed, sure?'), function (bool) {
                    if(bool){
                        Dialog.loading(i18n.getMsg('shut in the host...'));
                        $.post(grid.interfacePrefix + 'HostAction.do?method=shutdown', gridData, function(data){
                            Dialog.closeLoading();
                            if(data.flag === '1'){
//                                gridData.forEach(function(item){
//                                    item.runningStatus = that.runningStatusMapInversion.closing;
//                                });
//                                grid.updateData(gridData, 'hostPcid');
//                                that.setActionsStatus(grid, that.runningStatusMapInversion.closing);
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
                    Dialog.alert(i18n.getMsg('please choose to restart the host'));
                    return ;
                }else if(gridData.length > 1){
                    Dialog.alert(i18n.getMsg('can only select a host at a time'));
                    return ;
                }

                Dialog.confirm(i18n.getMsg('restart, sure?'), function (bool) {
                    if(bool){
                        Dialog.loading(i18n.getMsg('restart the host...'));
                        $.post(grid.interfacePrefix + 'HostAction.do?method=restart', gridData, function(data){
                            Dialog.closeLoading();
                            if(data.flag === '1'){
//                                gridData.forEach(function(item){
//                                    item.runningStatus = that.runningStatusMapInversion.restarting;
//                                });
//                                grid.updateData(gridData, 'hostPcid');
//                                that.setActionsStatus(grid, that.runningStatusMapInversion.restarting);
                            	tree.refresh();
                            }
                        });
                        
                    }
                });
			}
		});
		
		var setupHostTrustBtn=new TSButton({
			name:"setupHostTrust",
			buttonName:i18n.getMsg('setupHostTrust'),
			iconClass:"glyphicon glyphicon-wrench",
			click:function(){
                var gridData = grid.selectedItems;
                if(gridData.length === 0){
                    Dialog.alert(i18n.getMsg('please select a host to configure SSH trust between hosts'));
                    return ;
                }else if(gridData.length > 1){
                    Dialog.alert(i18n.getMsg('can only select a host at a time'));
                    return ;
                }else{
                	Dialog.create({
                        title: i18n.getMsg('setupHostTrust'),
                        url: 'ts/common/SetupHostTrustTest',
                        widgetOpts: {
                            url: 'ivm/IVMHostAction.do?method=setupTrust',
                            data: gridData[0],
                            gridWidget: grid
                        },
                        height: 320
                    });
                }
			}
		});
		
		var refreshBtn=new TSButton({
			name:"refresh",
			buttonName:i18n.getMsg('refresh'),
			iconClass:"glyphicon glyphicon-refresh",
			click:function(){
                var gridData = grid.selectedItems;
                if(gridData.length === 0){
                    Dialog.alert(i18n.getMsg('please choose to refresh the host'));
                    return ;
                }else if(gridData.length > 1){
                    Dialog.alert(i18n.getMsg('can only select a host at a time'));
                    return ;
                }
                Dialog.loading(i18n.getMsg('refresh the host...'));
                if(grid.interfacePrefix === "hmc/HMC"){
                	var params = gridData.reduce(function(arr, it) {
                    	var o = {
                    		hostPcid: it.hostPcid
                    	};
                    	arr.push(o);
                    	return arr;
                    }, []);
                	   $.post(grid.interfacePrefix + 'HostAction.do?method=refreshHost', params, function(data){
                           if(data.flag === '1'){
                               //grid.updateData(gridData, 'hostPcid');
                        	   tree.refresh();
                               Dialog.closeLoading();
                               Dialog.alert(i18n.getMsg('refresh the host successfully!'));
                           }
                       });
		        }else{
              
                $.post(grid.interfacePrefix + 'HostAction.do?method=refreshHost', gridData, function(data){
                    if(data.flag === '1'){
                        //grid.updateData(gridData, 'hostPcid');
                    	tree.refresh();
                        Dialog.closeLoading();
                        Dialog.alert(i18n.getMsg('refresh the host successfully!'));
                    }
                });
                
		        }
			}
		});
		logoutBtn.disabled();
		startBtn.disabled();
		closeBtn.disabled();
		
		this.xcatActions=[registerLparBtn,
		                  createLparBtn,
		                  //renameBtn,
		                  renameBtnTest,
		                  editIpBtn,
		                  //resAssignInfoBtn,
		                  resAssignInfoBtnTest,
		                  logoutBtn,
		                  startBtn,
		                  restartBtn,
		                  closeBtn,
		                  restartBtn,
		                  refreshBtn
		                  ];
		
		this.ivmActions=[registerLparBtn,
		                 //renameBtn,
		                 renameBtnTest,
		                 logoutBtn,
		                 setupHostTrustBtn,
		                 refreshBtn
		                 ];
		
		this.hmcActions=[registerLparBtn,
		                  createLparBtn,
		                  editIpBtn,
		                  logoutBtn,
		                  startBtn,
		                  restartBtn,
		                  closeBtn,
		                  restartBtn,
		                  refreshBtn
		                  ];
		
		this.hmcActions=[registerLparBtn,
		                 createLparBtn,
		                 //renameBtn,
		                 //renameBtnTest,
		                 logoutBtn,
		                 startBtn,
		                 closeBtn,
		                 //setupHostTrustBtn,
		                 refreshBtn
		                 ];
		
		this.allActions=[registerLparBtn,
			              createLparBtn,
			              //renameBtn,
			              /*renameBtnTest,
			              editIpBtn,
			              //resAssignInfoBtn,
		                  resAssignInfoBtnTest,*/
			              logoutBtn,
			              startBtn,
			              closeBtn,
			              /*restartBtn,
			              setupHostTrustBtn,
			              refreshBtn*/];
		
		this.actions=this.allActions;
	}
	
	function createCompleteCallback(){
		 var that = this;
         var id = '0';
         var dataCenterTree = GUtil.tree.get('dataCenter');

         // if(that.opts.type === 'coreplatform'){
         //     id = '0';
         // }else 
         if(that.opts.type === 'platform'){
             id = that.opts.params.platformPcid;
         }
         // dataCenterTree.removeCB(0, 'reloadData');
         dataCenterTree.removeCB(id, 'updateData.host');//重新XXXSection下的HostList下，删除回调
         dataCenterTree.removeCB(id, 'removeData.host');//同上
         dataCenterTree.removeCB(id, 'addData.host');//同上
         // dataCenterTree.registerCB(id, 'reloadData', function(data){
         //     that.grid.reloadData();
         // });
         //注册更新主机回调
         dataCenterTree.registerCB(id, 'updateData.host', function(data){
             if(!data) return ;
             data.hostPcid = data.hostPcid || data.id;
             that.grid.updateData(data.dataset, 'hostPcid');
             that.setActionsStatus(that.grid, data.dataset.runningStatus);
         });
         //注册删除主机回调，删除主机时执行
         dataCenterTree.registerCB(id, 'removeData.host', function(data){
             if(!data) return ;
             data.hostPcid = data.hostPcid || data.id;
             that.grid.removeData(data.dataset);

         });
         //注册添加主机回调，新增主机时执行
         dataCenterTree.registerCB(id, 'addData.host', function(data){
             if(!data) return ;
             data.hostPcid = data.hostPcid || data.id;
             that.grid.addData(data.dataset);
         });
         //注册更新平台回调，这里主机是更新平台名称时 hostList里的平台名称也要更新
         dataCenterTree.registerCB(id, 'updateData.platform', function(data, oldData){
             if(!data) return ;
             that.grid.updateDataByProp('platformName', oldData.dataset.name, data.dataset.name);
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
	
	ExtendClass(HostGrid,TSDataGrid);
	SetProperties(HostGrid.prototype,DONT_ENUM,[
        "i18n",i18n,
        "template",htm
  	]);
  	InstallFunctions(HostGrid.prototype,DONT_ENUM,[
  	    "init",init,
  	    "createCompleteCallback",createCompleteCallback
  	]);
  	
  	return HostGrid;
});
