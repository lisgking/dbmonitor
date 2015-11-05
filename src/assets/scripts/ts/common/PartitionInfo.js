define('ts/common/PartitionInfo', [
    'ts/widgets/TSWidget',
    'ts/common/PartitionDisk',
    'dojo/text!ts/common/PartitionInfo.htm',
	'dojo/css!ts/common/PartitionInfo.css',
	'dojo/nls!ts/common/dataCenter.json'
], function(TSWidget,PartitionDisk, html, css, json){
	
	'use strict';
	
	var i18n=TSWidget.prototype.i18n.createBranch(json);
	function PartitionInfo(opts){
        TSWidget.call(this);
        initialize.call(this, opts);
	}
	function initialize(opts){
		var that = this;
		var fileSystemPartition,
		mountDirectory,
		diskSize,
		isFixed;
		this.roles.get("save").addEventListener("click",function(){
			if(that.validation()){
				fileSystemPartition = that.roles.get('fileSystemPartition').value;
				mountDirectory = that.roles.get('mountDirectory').value;
				diskSize = that.roles.get('diskSize').value;
				isFixed = $("input:checked",that.rootElement).val();
				if(isFixed === '0'){
					diskSize = '';
				}
				if(fileSystemPartition==="PPC PReP Boot"){
					if(isFixed ==='0'){
						Dialog.alert(i18n.getMessage("PPC PReP Boot cannot choose select all unused space"));
						return;
					}
					if(diskSize > 6144){
						that.showError("partSize",i18n.getMsg('No more than 6144 MB system partition space'));
						return;
					}
					
				}else if(fileSystemPartition === 'ext4'){
					var rows = opts.grid.dataProvider.rows;
					if(rows && rows.length>0){
						var isExit = false;
						rows.forEach(function(row){
							if(row.mountDir === mountDirectory){
								isExit = true;
							}
						});
						if(isExit){
							that.showError("mountDir",i18n.getMsg('Mount the directory already exists'));
							return;
						}
					}
				}
				if(mountDirectory ==='/boot'){
					if(isFixed === '0'){
						Dialog.alert(i18n.getMessage("The boot cannot choose select all unused space"));
						return;
					}
					if(diskSize > 500 || isFixed ==='0'){
						that.showError("partSize",i18n.getMsg('Boot directory partition space should not exceed 500 MB'));
						return;
					}
				}
				opts.grid.addRow({fileSystem:fileSystemPartition,mountDir:mountDirectory,partSize:diskSize,isFixed:isFixed});
				that.closeDialog();
			}
		});
		that.roles.get('fileSystemPartition').addEventListener("change",function(){
			fileSystemPartition = that.roles.get('fileSystemPartition').value;
			if(fileSystemPartition==='PPC PReP Boot' || fileSystemPartition === 'swap'){
				that.roles.get('mountDirectory').disabled = true;
				that.roles.get('mountDirectory').value='';
			}else{
				that.roles.get('mountDirectory').disabled = false;
			}
		});
		$(this.rootElement).on("click","input[type=radio]",function(e){
			isFixed = this.value;
			if(isFixed === '0'){
				that.roles.get('diskSize').disabled = true;
			}else{
				that.roles.get('diskSize').disabled = false;
			}
		});
	}
	function loadData(data){
		
	}
	function validation(){
		var flag = true;
		var mountDir = this.roles.get('mountDirectory').value;
		var partSize = this.roles.get('diskSize').value;
		var fileSystem = this.roles.get('fileSystemPartition').value;
		var isFixed = $("input:checked",this.rootElement).val();
		
		if(fileSystem && fileSystem !==""){
			this.hiddenError("fileSystem");
		}else{
			this.showError("fileSystem",i18n.getMsg('Please enter the partition file system'));
			flag = false;
		}
		if(fileSystem === 'PPC PReP Boot' || fileSystem === 'swap'){
			this.hiddenError("mountDir");
		}else{
			if(mountDir && mountDir !==""){
				this.hiddenError("mountDir");
			}else{
				this.showError("mountDir",i18n.getMsg('please enter the mount Directory'));
				flag = false;
			}
		}
		if(isFixed==='1'){
			if(partSize && partSize !==""){
				var rex = /^\d+\.\d$|^\d+$/;
				if(!rex.test(partSize)){
					flag = false;
					this.showError("partSize",i18n.getMsg('please input the correct partition size format'));
				}else{
					this.hiddenError("partSize");
				}
			}else{
				this.showError("partSize",i18n.getMsg('Please enter the partition size'));
				flag = false;
			}
		}else{
			this.hiddenError("partSize");
		}
		if(!isFixed){
			Dialog.alert(i18n.getMsg('please choose the size of the disk'));
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
    ExtendClass(PartitionInfo, TSWidget);
    InstallFunctions(PartitionInfo.prototype, DONT_ENUM,[ "initialize",initialize,"loadData",loadData,"validation",validation,"showError",showError,"hiddenError",hiddenError]);
    SetProperties(PartitionInfo.prototype, DONT_ENUM, [ "template",
                                                          html, "i18n", i18n ]);
	return PartitionInfo;
});