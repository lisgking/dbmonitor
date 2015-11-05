define('ts/common/InstallOSForm', 
		['ts/widgets/TSFormTest',
		'ts/widgets/TSButton', 
		'ts/common/PartitionDisk',
		'ts/widgets/GenericWizard', 
		'dojo/text!ts/common/InstallOSForm.html',
		'dojo/css!ts/common/InstallOSForm.css',
		'dojo/nls!ts/common/dataCenter.json'], 
	function (TSFormTest, TSButton, PartitionDisk, GenericWizard, html, css, json) {

	var i18n = TSFormTest.prototype.i18n.createBranch(json);
	function InstallOSForm(opts) {
		TSFormTest.call(this);
		i18n = this.i18n;
		this.container = null;

		addEventListener.call(this);
		init.call(this, opts);
	}

	function init(opts) {

		var that = this;
		this.opts = $.extend({}, opts);

		//initButton.call(this);
		loadOS.call(this);
	}

	function loadOS() {

		var that = this;

		var selectOS = this.get('imageId');
		var url = "hmc/HMCLparAction.do?method=getImageList";
		$.post(url, {
			"pageNo" : 1,
			"pageSize" : 20,
			"condition" : {}
		}, function (data) {
			selectOS.load(data.rows);
		});
	}
 
	function initButton(opts) {
		var that = this;

		var diskPartition = new TSButton({
			buttonName : i18n.getMsg('diskPartition'),
			iconClass : "glyphicon glyphicon-plus",
			click : function () {
				var partitionDisk = new PartitionDisk({
						callback : function (parDisk) {
							var newArray = [];
							if (that.partitionDisks
								 && that.partitionDisks.length > 0) {
								that.partitionDisks
								.forEach(function (pDisk) {
									if (pDisk.id !== parDisk.id) {
										newArray.push(pDisk);
									}
								});
								that.partitionDisks = newArray;
							}
						}
					});
				partitionDisk.placeAt(that.roles.get("partition"), "beforeEnd");
				that.partitionDisks.push(partitionDisk);
			}
		});
		diskPartition.placeAt(that.roles.get("tsButton"), "replaceInner");
	}

	function addEventListener() {
		var that = this;
		var submit = this.roles.get('submit');
		$(submit).on('click', function () {
			if (!that.isValid()) {
				return;
			}
			
			var lpar = that.getFormData4EncryptPassword();
			lpar.lparPcid = that.opts.data[0].lparPcid;
			
			var platformPcid = that.opts.data[0].platformPcid; 
			var hostPcid = that.opts.data[0].hostPcid; 
			
			var reqData = {
				platformPcid : platformPcid,
				hostList : [{
						hostPcid : hostPcid,
						lparArrayInfo : [lpar]
					}
				]
			};
			
			$.post("hmc/HMCLparAction.do?method=batchInstallOS", reqData, function(data) {
				if(data.flag == 1) {
					Dialog.alert(i18n.getMessage('Installation system operation is successful, please pay attention to the task list'));
					Dialog.close();
					tree.refresh();
				} else {
					Dialog.alert(data.msg);
				}
			});
		});

		var cancel = this.roles.get('cancel');
		$(cancel).on('click', function () {
			Dialog.close();
		});
	}

	ExtendClass(InstallOSForm, TSFormTest);
	InstallFunctions(InstallOSForm.prototype, DONT_ENUM, GenericUtil.obj2Arr({}));

	SetProperties(InstallOSForm.prototype, DONT_ENUM, ["i18n", i18n,
			"template", html]);

	return InstallOSForm;
});
