define('ts/common/PartitionDisk', 
	["ts/widgets/TSFormTest",
	 'ts/common/PartitionDiskGrid',
	 'ts/widgets/TSButton',
	 'dojo/text!ts/common/PartitionDisk.htm',
	 'dojo/text!ts/common/PartitionDisk.css',
  	 'dojo/nls!ts/common/dataCenter.json'],
  	 function(TSFormTest,PartitionDiskGrid,TSButton,htm,css,json){
	"use strict";
	var i18n=TSFormTest.prototype.i18n.createBranch(json);
	function PartitionDisk(opts){
		TSFormTest.call(this);
		defineProperties.call(this,opts);
	}
	
	function defineProperties(opts){
		var that = this;
		//SetProperties(this,NONE,["diskName",null]);
		var diskName=this.get("lparPartitionName");
		InstallGetter(this,"diskName",function(){
//			return that.roles.get('lparPartitionName').value;
			return diskName.getValue();
		});
		var diskGrid = new PartitionDiskGrid({partitionDisk:that});
		diskGrid.placeAt(this.roles.get("diskGrid"),'beforeEnd');
		var removeLparDisk = new TSButton({
			buttonName:i18n.getMsg('removeLparDisk'),
			iconClass:"glyphicon glyphicon-minus-sign",
			click:function(){
				that.rootElement.parentElement.removeChild(that.rootElement);
				opts.callback.call(that,that);
			}
		});
		this.grid = diskGrid;
		removeLparDisk.placeAt(this.roles.get('removeLparDisk'),'replaceInner');
	}
	function validate(){
		var flag = true;
		
		var diskName = this.diskName;
		if(diskName && diskName !==""){
			this.roles.get("error").innerText = "";
			this.roles.get("error").style.display = "none";
		}else{
			this.roles.get("error").innerText = i18n.getMsg('Please enter the partition of disk name');
			this.roles.get("error").style.display = "block";
			return false;
		}
		
		return flag;
	}
	function validation(installDisk){
		var flag = true;
//		if(!validate.call(this)){
//			return false;
//		}
		if(!this.isValid()){
			return false;
		}
		if(this.grid.dataProvider.rows && this.grid.dataProvider.rows.length>0){
			flag = validationPartionGrid.call(this,installDisk);
		}else{
			Dialog.alert(i18n.getMessage("please add the partition of disk",{diskName:this.diskName}));
			return false;
		}
		return flag;
	}
	function validationPartionGrid(installDisk){
		var diskName = this.diskName;
		var flag = true;
		var systemArray = [];
		var bootArray = [];
		var notFixed = [];
		var swapArray = [];
		var rootDir = [];
		var rootDirFixed = true;
		var ext4Array = [];
		this.grid.dataProvider.rows.forEach(function(row){
			if(row.fileSystem === 'PPC PReP Boot'){
				systemArray.push(row);
			}else if(row.fileSystem === 'swap'){
				swapArray.push(row);
			}else{
				if(row.mountDir !== '/boot'){
					ext4Array.push(row);
				}
			}
			if(row.mountDir === '/boot'){
				bootArray.push(row);
			}else if(row.mountDir === '/'){
				rootDirFixed = false;
				rootDir.push(row);
			}
			if(row.isFixed === '0'){
				notFixed.push(row);
			}
		});
		if(diskName===installDisk){
			if(systemArray.length==0 && bootArray.length==0){
				Dialog.alert(i18n.getMessage("must have a boot disk directory or PPC PRep boot",{diskName:this.diskName}));
				return false;
			}
			if(rootDir.length == 0){
				Dialog.alert(i18n.getMessage("must have a root directory",{diskName:this.diskName}));
				return false;
			}else if(rootDir.length>1){
				Dialog.alert(i18n.getMessage("can have only one root directory",{diskName:this.diskName}));
				return false;
			}else{
				if(rootDir[0].isFixed === '0'){
					if(ext4Array.length>1){
						Dialog.alert(i18n.getMessage("Disk root directory was to use all the space",{diskName:this.diskName}));
						return false;
					}
				}
			}
			if(systemArray.length>1){
				Dialog.alert(i18n.getMessage("can only have a PPC PRep Boot disk",{diskName:this.diskName}));
				return false;
			}
			if(bootArray.length>1){
				Dialog.alert(i18n.getMessage("can only have one disk boot directory",{diskName:this.diskName}));
				return false;
			}
			if(swapArray.length>1){
				Dialog.alert(i18n.getMessage("can only have a swap disk",{diskName:this.diskName}));
				return false;
			}
			if(notFixed.length>1){
				Dialog.alert(i18n.getMessage("can only have one disk partition using all space",{diskName:this.diskName}));
				return false;
			}
		}else{
			if(systemArray.length !=0 || bootArray.length !=0 || swapArray.length !=0){
				Dialog.alert(i18n.getMessage("cannot boot directory or PPC PRep boot the system partition or swap partition of the system",{diskName:this.diskName}));
				return false;
			}
			if(rootDir.length >0){
				Dialog.alert(i18n.getMessage("there cannot be a root directory",{diskName:this.diskName}));
				return false;
			}
			if(notFixed.length>1){
				Dialog.alert(i18n.getMessage("can only have one disk partition using all space",{diskName:this.diskName}));
				return false;
			}
		}
		return flag;
	}
	function getData(){
		var data = {};
		var partitionName = this.diskName;
		data.partName = partitionName;
		var partitionDisks = this.grid.dataProvider.rows;
		data.partitionDisks = partitionDisks;
		return data;
	}
	ExtendClass(PartitionDisk,TSFormTest);
	InstallFunctions(PartitionDisk.prototype, DONT_ENUM,[ "validation",validation,"getData",getData,"validate",validate]);
	SetProperties(PartitionDisk.prototype,DONT_ENUM,[
        "i18n",i18n,
        "template",htm
  	]);
  	
  	return PartitionDisk;
});
