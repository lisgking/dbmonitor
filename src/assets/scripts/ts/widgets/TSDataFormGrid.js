define("ts/widgets/TSDataFormGrid",[
	"ts/widgets/TSDataGrid",
    "ts/widgets/TSTextField",
    "ts/events/TSEvent",
    "ts/widgets/TSGridColumn",
    "ts/widgets/TSFormTest",
    "ts/widgets/TSGridPagination",
    "ts/util/DOMUtils",
    "ts/util/CascadingCheckboxGroup",
    "dojo/nls!./nls/widgets.json",
],function(TSDataGrid,TSTextField,TSEvent,TSGridColumn,TSFormTest,TSGridPagination,DOMUtils,CascadingCheckboxGroup,json){
	"use strict";
	
	var i18n = TSDataGrid.prototype.i18n.createBranch(json,"TSDataGrid");
	function TSDataFormGrid(id,initParams){
		TSDataGrid.call(this,id,initParams);
		init.call(this);
	}
	
	function init(){
		this.form = new TSFormTest();
        defineProperties.call(this);
        addEventListeners.call(this);
    }
	
	function addEventListeners() {
		
	}
	
	function addBehavious(){
        
    }

	function addRows() {
		var me = this;
		var cellPadding = this.cellPadding;
		var tbody = this.roles.get("tbody");
		tbody.innerHTML = "";
		
		var formItemsTemp = [];
		this.dataRows.toArray().forEach(function (item, rowIndex) {
			
			var row = DOMUtils.createElement("tr", null, tbody);
			
			this.columns.forEach(function (column) {
				var cell = DOMUtils.createElement("td", null, row);
				if (column.className) {
					cell.classList.add(column.className);
				}
				cell.headers = column.dataField;
				var cellInner = DOMUtils.createElement("span", null, cell);
				//width
				cellInner.style.width = column.width + "px";
				cellInner.style.textAlign = column.textAlign;
				
				//content
				var content = column.itemToLabel(item);
				
				if (column.dataType === "html") {
					cellInner.innerHTML = content;
				} else if (column.dataType === "element") {

					if (content instanceof HTMLInputElement && (content.type == 'text' || content == 'password')) {

						if(item.hasOwnProperty(column.dataField)) {
							content.value = item[column.dataField];
						}
						
						var regex = content.pattern;
						if (typeof regex == 'string') {
							regex = eval('/' + regex + '/');
						}

						var field = new TSTextField({
							name : column.dataField,
							type : content.type,
							value : content.value,
							vtype : content.vtype,
							cls : content.className,
							width : content.width,
							height : content.height,
							readOnly : content.readonly || content.readOnly,
							regex : regex,
							validateText : content.validateText,
							validateFunText : content.validateFunText,
							allowBlank : allowBlank,
							renderTo : $(fieldEl),
							listeners : {
								input : function () {
									if(item.hasOwnProperty(column.dataField)) {
										item[column.dataField] = this.getValue();
									}
								}
							}
						});

						/*// 判断第一列是否设置了disabled，如果没有设置，就push进form
						var checkEl = cell.parentNode.firstChild.firstChild.firstChild;
						
						if($(checkEl).attr('disabled') == 'disabled') {
							// 将表单子组件填充TSForm
							me.form.add(content);
						}*/
						formItemsTemp.push({
							rowIndex: i,
							field: content
						});
					}

					cellInner.appendChild(content);
				} else if (column.dataType === "widget") {
					
					if (!content instanceof TSTextField) {
						throw new TypeError("暂不支持的widget");
					}
					
					if(item.hasOwnProperty(column.dataField)) {
						content.setValue(item[column.dataField]);
					}
					
					// 如果子类注册了input事件，就覆盖父类赋值操作
					if(!content.listeners['input'] && item.hasOwnProperty(column.dataField)) {
						content.on('input', function () {
							console.log('父类input');
							item[column.dataField] = this.getValue();
						});
					}

					content.setName(column.dataField);

					content.placeAt(cellInner, "afterBegin");
					/*
					// 判断第一列是否设置了disabled，如果没有设置，就push进form
					var checkEl = cell.parentNode.firstChild.firstChild.firstChild;
					
					if($(checkEl).attr('disabled') == 'disabled') {
						me.form.add(content);
					}*/
					formItemsTemp.push({
						rowIndex: rowIndex,
						field: content
					});
				} else if (column.dataType === "text" || true) { //"text" or any other types
					
					cellInner.textContent = content;
					//title
					if (column.title) {
						cellInner.title = content;
					}
				}
				//tip
				if (column.showDataTips) {
					cell.title = column.itemToDataTip(item);
				}
				//visible
				if (!column.visible) {
					cell.hidden = true;
					cellInner.style.display = 'none';
				}
			}, this);
			
			DOMUtils.createElement("td", {
				className : "spacer"
			}, row);
		}, this);

		this.dispatchEvent(new TSEvent("rowsAdded"));
		
		if(this.checkboxGroup) {	// 如果第一列是checkbox列
			var slaves = this.checkboxGroup.slaves;
			slaves.forEach(function(s, i) {
				s.addEventListener('click', function() {
					initForm.call(me, slaves, formItemsTemp);
				})
			})
		} else {
			formItemsTemp.forEach(function (item, rowIndex) {
				me.form.items.push(item.field);
			}, this);
		}
	}

	function initForm(slaves, formItemsTemp) {
		var me = this;
		me.form.items = [];
		
		slaves.forEach(function(s, i) {
			if(s.checked == true) {
				formItemsTemp.forEach(function (item) {
					if(i == item.rowIndex) {
						me.form.items.push(item.field);
					}
				});
			}
		});
	}
	
    function readColumnSettings() {
		var text = localStorage.getItem(this.widgetName + ".columns");
		var cols = null;
		try {
			if (!text) {
				return;
			}
			cols = JSON.parse(text);
			if (!Array.isArray(cols)) {
				return;
			}
		} catch (e) {
			return;
		}
		cols.forEach(function(col, i) {
			var column = this.columns[i];
			if (column) {
				column.width = col.width;
				column.visible = col.visible;
			}
		}, this);
	}
    
    function updatePagination(){
        var meta=this.dataProvider,
            rowsLength=this.dataProvider.rows.length;
        //page numbers
        var totalPages=meta.totalPages,
            options=this.footer.roles.get("page").options,
            length=options.length;
        if(length>totalPages){
            options.length=totalPages;
        }else{
            for(var i=length+1;i<=totalPages;i++){
                options.add(new Option(i,i));
            }
        }
        //page info
        this.footer.role("tfoot").querySelector(".page-info").textContent=i18n.getMessage("PageInfo",{
            startRow:meta.startRow+1,
            endRow:meta.startRow+rowsLength,
            totalRows:meta.totalRows
        });
    }
    
    function resetRows(){
        var tbody=this.roles.get("tbody");
        tbody.appendChild(DOMUtils.parseHTML("<tr><td><span>&#160;</span></td></tr>"));
    }
	
    function defineProperties(){
    	
    	InstallGetterSetter(this,"dataProvider",
            function getDataProvider(){
                return this.__data__.dataProvider;
            },
            function setDataProvider(v){
                if(!v||!Array.isArray(v.rows)){
                    throw new TypeError("Invalid dataProvider");
                }
                v.condition = this.dataProvider.condition;
                v.params = this.dataProvider.params;
                this.__data__.dataProvider=v;
                this.__data__.dataRows.__data__=v.rows;
                this.dispatchEvent(new Event("updateddata"));
                this.clearRows.call(this);
                if(v.rows.length>0){
                    readColumnSettings.call(this);
                    addRows.call(this);
                    addBehavious.call(this);
                }else{
                    resetRows.call(this);
                }
                if(this.usePager){
                    updatePagination.call(this);
                }
            }
        );
    }
	
    InstallFunctions(TSDataFormGrid.prototype,DONT_DELETE,[
		"serializeObject",function(){
			if(this.checkboxGroup && this.checkboxGroup.slaves.length > 0) {
				return this.selectedItems;
			} else {
				return this.dataRows.toArray();
			}
		}
	]);

    ExtendClass(TSDataFormGrid, TSDataGrid);
	SetNativeFlag(TSDataFormGrid);
	
	return TSDataFormGrid;
});