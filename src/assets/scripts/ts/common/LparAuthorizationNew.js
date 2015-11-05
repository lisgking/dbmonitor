define('ts/common/LparAuthorizationNew', [
    'ts/widgets/TSFormTest',
    'ts/common/PartitionDisk',
    'ts/widgets/TSButton',
    'ts/util/Cryption!',
    'dojo/text!ts/common/LparAuthorization.html',
	'dojo/css!ts/common/LparAuthorization.css',
	'dojo/nls!ts/common/dataCenter.json'
], function(TSFormTest,PartitionDisk,TSButton,Cryption,html, css, json){
	
	'use strict';
	
	var i18n=TSFormTest.prototype.i18n.createBranch(json);
	function LparAuthorizationNew(opts){
        TSFormTest.call(this);
        defineProperties.call(this);
        this.initialize.apply(this, opts);
	}
	
	function defineProperties(){
		var hostPassword,
			lparPassword,
			installDisk,
			partitionDisks;
		/**
		 * 主机密码
		 */
		hostPassword=this.get("hostPassword");
		InstallGetter(this,"hostPassword",function(){
			return hostPassword.getValue();
		});
		
		/**
		 * lpar密码
		 */
		lparPassword=this.get("lparPassword");
		InstallGetter(this,"lparPassword",
			function(){
				return lparPassword.getValue();
		});
		
		/**
		 * 安装磁盘名称
		 */
		installDisk=this.get("installDisk");
		InstallGetter(this,"installDisk",
			function(){
				return installDisk.getValue();
		});
		
		/**
		 * 磁盘集合
		 */
		partitionDisks=[];
		InstallGetterSetter(this,"partitionDisks",
			function(){
				return partitionDisks;
		},function(v){
			partitionDisks=v;
		});
		
		
	}
	
	function initialize(opts){
		var that = this;
		//this.partitionDisks = [];
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
		data.installDisk = this.get('installDisk').getValue();
		data.hostPassword = Cryption.encryptKey(this.get('hostPassword').getValue());
		data.lparPassword = Cryption.encryptKey(this.get('lparPassword').getValue());
		return data;
	}
	function validate(){
		var flag = true;
		
		if(!this.isValid()){
			return false;
		}
		
		var installDisk=this.installDisk;
		
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
    ExtendClass(LparAuthorizationNew, TSFormTest);
    InstallFunctions(LparAuthorizationNew.prototype, DONT_ENUM,[ 
          "initialize",initialize,
          "loadData",loadData,
          "getData",getData,
          "validate",validate,
          "showError",showError,
          "hiddenError",hiddenError
    ]);
    SetProperties(LparAuthorizationNew.prototype, DONT_ENUM, [ 
          "template",html,
          "i18n", i18n 
    ]);
	return LparAuthorizationNew;
});