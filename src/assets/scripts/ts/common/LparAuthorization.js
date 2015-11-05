define('ts/common/LparAuthorization', [
    'ts/widgets/TSWidget',
    'ts/common/PartitionDisk',
    'ts/widgets/TSButton',
    'ts/util/Cryption!',
    'dojo/text!ts/common/LparAuthorization.html',
	'dojo/css!ts/common/LparAuthorization.css',
	'dojo/nls!ts/common/dataCenter.json'
], function(TSWidget,PartitionDisk,TSButton,Cryption,html, css, json){
	
	'use strict';
	
	var i18n=TSWidget.prototype.i18n.createBranch(json);
	function LparAuthorization(opts){
        TSWidget.call(this);
        this.initialize.apply(this, opts);
	}
	function initialize(opts){
		var that = this;
		this.partitionDisks = [];
		var diskPartition = new TSButton({
			buttonName:i18n.getMsg('diskPartition'),
			iconClass:"glyphicon glyphicon-plus",
			click:function(){
				var partitionDisk = new PartitionDisk({
					callback:function(parDisk){
						var newArray = [];
						if(that.partitionDisks && that.partitionDisks.length>0){
							that.partitionDisks.forEach(function(pDisk){
								if(pDisk.id!==parDisk.id){
									newArray.push(pDisk);
								}
							});
							that.partitionDisks = newArray;
						}
					}
				});
				partitionDisk.placeAt(that.roles.get("partition"),"beforeEnd");
				that.partitionDisks.push(partitionDisk);
			}
		});
		diskPartition.placeAt(that.roles.get("tsButton"),"replaceInner");
	}
	function loadData(data){
		
	}
	function getData(){
		var data={};
		var partitionDisks = [];
		var partitionDisksWidgets = this.partitionDisks;
		if(partitionDisksWidgets && partitionDisksWidgets.length>0){
			partitionDisksWidgets.forEach(function(partitionDisk){
				partitionDisks.push(partitionDisk.getData());
			});
		}
		data.disks = partitionDisks;
		data.installDisk = this.roles.get('installDisk').value;
		data.hostPassword = Cryption.encryptKey(this.roles.get('hostPassword').value);
		data.lparPassword = Cryption.encryptKey(this.roles.get('lparPassword').value);
		return data;
	}
	function validate(){
		var flag = true;
		var installDisk = this.roles.get('installDisk').value;
		if(!installDisk || installDisk===""){
			this.showError("installDisk",i18n.getMsg('please enter os install disk'));
			flag = false;
		}else{
			this.hiddenError("installDisk");
		}
		
		var hostPassword = this.roles.get('hostPassword').value;
		if(!hostPassword || hostPassword===""){
			this.showError("hostPassword",i18n.getMsg('please enter the host password'));
			flag = false;
		}else{
//			var rex = /^[\\w-]{3,}$/;
//			if(!rex.test(hostPassword)){
//				flag = false;
//				this.showError("hostPassword",i18n.getMsg('please input the correct host password format'));
//			}else{
				this.hiddenError("hostPassword");
//			}
		}
		var lparPassword = this.roles.get('lparPassword').value;
		if(!lparPassword || lparPassword===""){
			this.showError("lparPassword",i18n.getMsg('please enter the lpar password'));
			flag = false;
		}else{
//			var rex = /^[\\w-]{3,}$/;
//			if(!rex.test(lparPassword)){
//				flag = false;
//				this.showError("lparPassword",i18n.getMsg('please input the correct lpar password format'));
//			}else{
				this.hiddenError("lparPassword");
//			}
		}
		var partitionDisksWidgets = this.partitionDisks;
		var diskNameArray = [];
		if(partitionDisksWidgets && partitionDisksWidgets.length>0){
			partitionDisksWidgets.forEach(function(partitionDisk){
				diskNameArray.push(partitionDisk.diskName);
			});
			if(diskNameArray.length>1 && flag){
				var length = diskNameArray.length;
				for(var i=0;i<length;i++){
					for(var j=length-1;j>i;j--){
						if(diskNameArray[i] === diskNameArray[j]){
							Dialog.alert(i18n.getMessage("Disk can't multiple partitions",{diskName:diskNameArray[i]}));
							return false;
						}
					}
				}
			}
			partitionDisksWidgets.forEach(function(partitionDisk){
				if(flag && !partitionDisk.validation(installDisk)){
					flag = false;
				}
			});
		}
		return flag;
	}
	function showError(key,msg){
		this.roles.get(key+"Error").innerText = msg;
		this.roles.get(key+"Error").style.display = "block";
	}
	function hiddenError(key){
		this.roles.get(key+"Error").innerText = "";
		this.roles.get(key+"Error").style.display = "none";
	}
    ExtendClass(LparAuthorization, TSWidget);
    InstallFunctions(LparAuthorization.prototype, DONT_ENUM,[ 
          "initialize",initialize,
          "loadData",loadData,
          "getData",getData,
          "validate",validate,
          "showError",showError,
          "hiddenError",hiddenError
    ]);
    SetProperties(LparAuthorization.prototype, DONT_ENUM, [ 
          "template",html,
          "i18n", i18n 
    ]);
	return LparAuthorization;
});