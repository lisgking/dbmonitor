define("ts/common/MyGrid", 
	[
		"ts/widgets/TSDataGrid", 
		"ts/widgets/TSGridColumn", 
		"ts/widgets/TSSearch", 
		"ts/widgets/TSButton", 
		"ts/events/TSEvent", 
		"dojo/nls!ts/common/dataCenter.json"], 
	function(TSDataGrid, TSGridColumn, TSSearch, TSButton, TSEvent, json) {
	"use strict";

	var i18n = TSDataGrid.prototype.i18n.createBranch(json);
	function MyGrid() {
		TSDataGrid.call(this);
		defineProperties.call(this);
		this.init();
	}

	function init() {
		addEvent.call(this);
	}

	function addEvent() {
	}

	function defineProperties() {
		var grid = this;
		var checkbox, col1, col2, col3;
		checkbox = new TSGridColumn({
			dataField : "id",
			headerHTML : '<input type="checkbox" />',
			width : 32,
			textAlign : "center",
			labelFunction : function(item) {
				var value = item['id'];
				var element = '<input type="checkbox" name="$1" value="$2" />';
				return FormatMessage(element, 'id', value);
			},
			dataType : "html"
		});

		col1 = new TSGridColumn({
			title: '列1',
			dataField : "col1",
			width : 100,
		});
		col2 = new TSGridColumn({
			title: '列2',
			dataField : "col2",
			width : 100,
		});
		col3 = new TSGridColumn({
			title: '列3',
			dataField : "col3",
			width : 100,
		});

		this.columns = [checkbox, col1, col2, col3];

		this.usePager = true;
		this.checkable = true;
		this.showToolbar = true;
		this.showFooter = true;
		this.height = 150;

		setToolButtons.call(this);
	}

	function setToolButtons() {
		var grid = this;
		var openConsoleBtn = new TSButton({
			buttonName : '按钮',
			click : function() {
				var gridData = grid.selectedItems;
				console.log(grid.selectedItems);
			}
		});

		this.allActions = [openConsoleBtn];
		this.actions = this.allActions;
	}

	ExtendClass(MyGrid, TSDataGrid);

	SetProperties(MyGrid.prototype, DONT_ENUM, ["i18n", i18n]);
	InstallFunctions(MyGrid.prototype, DONT_ENUM, ["init", init]);

	return MyGrid;
});
