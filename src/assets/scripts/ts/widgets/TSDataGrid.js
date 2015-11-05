define("ts/widgets/TSDataGrid",[
    "ts/widgets/TSWidget",
    "ts/events/TSEvent",
    "jsm/events/MozKeys",
    "ts/widgets/TSGridColumn",
    "ts/widgets/TSGridPagination",
    "ts/widgets/TSButton",
    "ts/util/DOMUtils",
    "ts/util/ItemList",
    "ts/util/Format",
    "ts/util/EventUtil",
    "ts/util/CascadingCheckboxGroup",
    "dojo/text!./htm/TSDataGrid.htm",
    "dojo/css!./css/TSDataGrid.css",
    "dojo/css!./css/TSMenu.css",
    "dojo/nls!./nls/widgets.json",
    "jquery",
    "jquery/selector"
],function(TSWidget,TSEvent,Keys,TSGridColumn,TSGridPagination,
    TSButton,DOMUtils,ItemList,Format,EventUtil,CascadingCheckboxGroup,
    htm,css,menucss,json,$){
    "use strict";
    var createElement=DOMUtils.createElement;
    //--------------------------------
    // RowCollection
    //--------------------------------
    function RowCollection(rows){
        ItemList.call(this,rows);
    }
    ExtendClass(RowCollection,ItemList);
    //--------------------------------
    // TSDataGrid
    //--------------------------------
    /**
     * @namespace ts.widgets
     * @class TSDataGrid
     * @extends ts.widgets.TSWidget
     * @constructor
     * @param {String} id
     * @param {Objet} [initParams]
     * @example <pre><code>var grid=new TSDataGrid();
     * grid.placeAt(document.body,"beforeEnd");
     * grid.addEventListener("load",function(event){
     *   console.log(event.data);
     * });
     * grid.addEventListener("error",function(event){
     *   console.log(event.error);
     * });
     * grid.addEventListener("clear",function(event){
     * 
     * });
     * grid.load("services/datarows.json");
     * </code></pre>
     */
    "constructor";
    function TSDataGrid(id,initParams){
        TSWidget.call(this,id,initParams);
        init.call(this);
    }
    "private";
    var i18n=TSWidget.prototype.i18n.createBranch(json,"TSDataGrid");
    function init(){
        defineProperties.call(this);
        addEventListeners.call(this);
    }
    function defineProperties(){
        this.localSorting=false;
        this.__data__.selectionMode="singleRow";
        InstallGetterSetter(this,"selectionMode",
            function getDataSource(){
                return this.__data__.selectionMode;
            },
            function setDataSource(v){
                if(typeof v!=="string"){
                    throw new TypeError(v+" is not a string");
                }
                this.__data__.selectionMode=v;
            }
        );
        /**
         * @attribute dataSource
         * @type String
         */
        this.__data__.dataSource="";
        InstallGetterSetter(this,"dataSource",
            function getDataSource(){
                return this.__data__.dataSource;
            },
            function setDataSource(v){
                if(typeof v!=="string"){
                    throw new TypeError(v+" is not a string");
                }
                this.__data__.dataSource=v;
                this.load(v);
            }
        );
        /**
         * @attribute searchString
         * @type String
         * @readOnly
         */
        this.__data__.searchString="";
        InstallGetter(this,"searchString",
            function getSearchString(){
                return $(this.roles.get("fieldset")).serialize();
            }
        );
        /**
         * @attribute dataType
         * @type String
         * @default "json"
         * @writeOnce
         */
        this.__data__.dataType="json";
        InstallGetterSetter(this,"dataType",
            function getDataType(){
                return this.__data__.dataType;
            },
            function setDataType(v){
                this.__data__.dataType=v;
            }
        );
        /**
         * @attribute dataProvider
         * @type Object
         */
        this.__data__.dataProvider={
            "pageNo": 1,
            "pageSize": 20,
            "rp": 1000,
            "sortorder": "",
            "startRow": 0,
            "endRow": 0,
            "totalPages": 1,
            "totalRows": 0,
            "condition":{},
            "rows":[]
        };
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
                clearRows.call(this);
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
                if(this.__data__.height === 0)
                	this.dispatchEvent(new TSEvent("resizeGrid"));
            }
        );
        /**
         * @attribute dataRows
         * @type RowCollection
         * @readOnly
         */
        this.__data__.dataRows=new RowCollection();
        InstallGetter(this,"dataRows",
            function getDataRows(){
                var dataRows=this.__data__.dataRows;
                dataRows.__data__=this.dataProvider.rows;
                return dataRows;
            }
        );
        function namedItem(name){
            return this.find(function(item){
                return item.dataField===name;
            });
        };
        /**
         * @attribute columns
         * @type Array
         * @writeOnce
         */
        this.__data__.columns=[];
        InstallGetterSetter(this,"columns",
            function getColumns(){
                return this.__data__.columns;
            },
            function setColumns(v){
                if(v instanceof Array&&v.every(function(col){return col instanceof TSGridColumn;})){
                    this.__data__.columns=v;
                    v.namedItem=namedItem;
                    createHeaders.call(this);
                }else{
                    throw new TypeError("columns must be a TSGridColumn array");
                }
            }
        );
        /**
         * @attribute actions
         * @type Array
         * @writeOnce
         */
        this.__data__.actions=[];
        InstallGetterSetter(this,"actions",
            function getActions(){
                return this.__data__.actions;
            },
            function setActions(v){
                if(v instanceof Array&&v.every(function(action){return action instanceof TSButton;})){
                    this.__data__.actions=v;
                    createActions.call(this);
                }else{
                    throw new TypeError("actions must be a TSGridArray array");
                }
            }
        );
        /**
         * @attribute actions
         * @type ts.widgets.TSGridPagination
         * @writeOnce
         */
        this.__data__.footer=new TSGridPagination();
        InstallGetterSetter(this,"footer",
            function getFooter() {
                return this.__data__.footer;
            },
            function setFooter(v) {
                if(v instanceof TSGridPagination) {
                    this.__data__.footer=v;
                    // update Pagination TODO
                } else {
                    throw new TypeError("footer must be a TSGridPagination Object");
                }
            }
        );
        /**
         * @attribute width
         * @type Number
         */
        this.__data__.width=0;
        InstallGetterSetter(this,"width",
            function getWidth(){
                return $(this.rootElement).width();
            },
            function setWidth(v){
                return $(this.rootElement).width(v);
            }
        );
        /**
         * @attribute height
         * @type Number
         */
        this.__data__.height=0;
        InstallGetterSetter(this,"height",
            function getHeight(){
                return this.__data__.height;
            },
            function setHeight(v){
            	if(v>0){
            		v>>>=0;
            		this.__data__.height=v;
            		adjustHeight.call(this);
            	}
            	else {
            		this.__data__.height= $(parent.window.document).height() + v;
            		adjustHeight.call(this);
            	}
            }
        );
        /**
         * @attribute cellPadding
         * @type Number
         * @readOnly
         */
        this.__data__.cellPadding=4;
        InstallGetter(this,"cellPadding",
            function getCellPadding(){
                return this.__data__.cellPadding;
            }
        );
        /**
         * @attribute usePager
         * @type Boolean
         */
        this.__data__.usePager=false;
        InstallGetterSetter(this,"usePager",
            function getUsePager(){
                return this.__data__.usePager||false;
            },
            function setUsePager(v){
                v=!!v;
                if(!this.usePager&&v){
                    this.__data__.usePager=v;
                    createPagination.call(this);
                }
            }
        );
        /**
         * @attribute checkable
         * @type Boolean
         * @writeOnce
         */
        this.__data__.checkable=false;
        InstallGetterSetter(this,"checkable",
            function getUsePager(){
                return this.__data__.checkable;
            },
            function setUsePager(v){
                v=!!v;
                if(v){
                    buildCascadingCheckbox.call(this);
                }
            }
        );
        /**
         * @attribute selectedItemFunction
         * @type Function
         */
        this.selectedItemFunction=null;
        /**
         * @attribute selectedItems
         * @type Array
         * @example
         * grid.selectedItemFunction=function(row,index,rows){
         *  var tr=this;
         *  console.log(tr,row,index,rows);
         *  row.textContent=tr.innerText;
         *  return row;
         * }
         * var sItems=grid.selectedItems;
         */
        InstallGetter(this,"selectedItems",
            function getCheckedItems(){
                var trs=Array.prototype.slice.call(this.role("tbody").rows);
                var rows=this.dataProvider.rows;
                var itemFunction=this.selectedItemFunction;
                var items=trs.reduce(function(sItems,tr,index){
                    var input=tr.querySelector('td:first-child input:checked');
                    if(input){
                        var item=rows[index];
                        if(typeof itemFunction==="function"){
                            item=itemFunction.call(tr,item,index,rows);
                        }
                        sItems.push(item);
                    }
                    return sItems;
                },[]);
                return items;
            }
        );
        /**
         * @attribute showTitle
         * @type Boolean
         */
        InstallGetterSetter(this,"showTitle",
            function(){
                return !!this.roles.get("gcaption") && !this.roles.get("gcaption").hidden;
            },
            function(v){
                this.roles.get("gcaption").hidden=!v;
                adjustHeight.call(this);
            }
        );
        /**
         * @attribute showToolbar
         * @type Boolean
         */
        InstallGetterSetter(this,"showToolbar",
            function(){
                return !!this.roles.get("gtoolbar") && this.roles.get("gtoolbar").hidden;
            },
            function(v){
                this.roles.get("gtoolbar").hidden=!v;
                adjustHeight.call(this);
            }
        );
        /**
         * @attribute rowClickFlag
         * @type Boolean
         */
        InstallGetterSetter(this,"rowClickFlag",
            function(){
                return this.__data__.rowClickFlag;
            },
            function(v){
            	var tbody=this.role("tbody");
                if(v){
                	EventUtil.addHandler(tbody,"click",addRowClickEvent);
                }else{
                	EventUtil.removeHandler(tbody,"click",addRowClickEvent);
                }
            }
        );
        this.rowClickFlag=true;
        /**
         * @attribute showFooter
         * @type Boolean
         */
        InstallGetterSetter(this,"showFooter",
            function(){
                return !this.footer.roles.get("tfoot").hidden;
            },
            function(v){
                this.footer.roles.get("tfoot").hidden=!v;
                adjustHeight.call(this);
            }
        );
    }
    function addEventListeners(){
        var that=this;
        //scroll
        var gheadTable=this.roles.get("ghead").querySelector(".-ts-ghead-table"),
            gbody=this.roles.get("gbody"),
            leftCache=-gbody.scrollLeft;
        gbody.addEventListener("scroll",function(event){
            var left=-this.scrollLeft;
            if(leftCache!==left){
                gheadTable.style.left=left+"px";
                leftCache=left;
            }
        });
        //reload
        this.footer.roles.get("reload").addEventListener("click",function(event){
            that.reload();
        });
        
        this.addEventListener("resizeGrid",function(e){
    		var grid = $(this.rootElement);
    		grid.find('.-ts-gbody').height($(window).height() - grid.find('.-ts-gbody').offset().top - 60);
        });
        
    }
    /**
	 * 表格行点击事件
	 */
    function addRowClickEvent(event){
		event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
		if(target instanceof HTMLInputElement ||
				target instanceof HTMLSelectElement){
			return;
		}
        var rows=this.rows;
        var index=0;
        var flag=Array.prototype.some.call(rows,function(tr,i){
        	var arr=$(tr).find(target);
        	index=i;
        	return arr && arr.length>0;
        });
        if(flag){
        	var tr=rows[index];
    		var cells=tr.cells;
    		if(cells && cells.length>0){
    			var inputs=$(cells[0]).find("input");
				var input=null;
				if(inputs && inputs.length>0){
					input=inputs[0];
				}else{
					return;
				}
				if(input.disabled){
					event.preventDefault();
					return;
				}
				if(input.readonly){
					event.preventDefault();
					return;
				}
				var type=input.type;
				if(type==="radio" || type==="checkbox"){
					var clickEvent=EventUtil.getClickEvent();
					input.dispatchEvent(clickEvent);
				}
				console.log(input);
    		}
        }
    }
    
    function adjustHeight(){
        var height=this.__data__.height;
        var offset=this.roles.get("ghead").offsetHeight;
        if(this.showTitle){offset+=this.roles.get("gcaption").offsetHeight;}
        if(this.showToolbar){offset+=this.roles.get("gtoolbar").offsetHeight;}
        if(this.showFooter){offset+=this.footer.roles.get("gfoot").offsetHeight;}
        var bodyHeight=this.__data__.height-offset-3;
        if(bodyHeight>=0){
            var gbody=this.roles.get("gbody");
            gbody.style.height=bodyHeight+"px";
            var actual=parseFloat(getComputedStyle(this.rootElement).height);
            if(actual-height){
                gbody.style.height=bodyHeight-(actual-height)+"px";
            }
        }
    }
    function addRows(){
        var that=this;
        var cellPadding=this.cellPadding;
        var tbody=this.roles.get("tbody");
        tbody.innerHTML="";
        this.dataRows.toArray().forEach(function(item){
            var row=createElement("tr",null,tbody);
            this.columns.forEach(function(column){
                var cell=createElement("td",null,row);
                if(column.className){
                	cell.classList.add(column.className);
                }
                cell.headers=column.dataField;
                var cellInner=createElement("span",null,cell);
                //width
                cellInner.style.width=column.width+"px";
                cellInner.style.textAlign=column.textAlign;
                //content
                var content=column.itemToLabel(item);
                if(column.dataType==="html"){
                    cellInner.innerHTML=content;
                }else if(column.dataType==="element"){
                    cellInner.appendChild(content);
                }else if(column.dataType==="widget"){
                	content.placeAt(cellInner,"afterBegin");
                }else if(column.dataType==="text"||true){//"text" or any other types
                    cellInner.textContent=content;
                    //title
                    if(column.title){
                    	cellInner.title=content;
                    }
                }
                //tip
                if(column.showDataTips){
                    cell.title=column.itemToDataTip(item);
                }
                //visible
                if(!column.visible){
                    cell.hidden=true;
                }
            },this);
            createElement("td",{className:"spacer"},row);
        },this);
        this.dispatchEvent(new TSEvent("rowsAdded"));
    }
    function addBehavious(){
        
    }
    function precentDefault(e){
        e.preventDefault();
    }
    function writeColumnSettings(){
        localStorage.setItem(this.widgetName+".columns",JSON.stringify(this.columns,["width","visible"]));
    }
    function readColumnSettings(){
        var text=localStorage.getItem(this.widgetName+".columns");
        var cols=null;
        try{
            if(!text){return;}
            cols=JSON.parse(text);
            if(!Array.isArray(cols)){return;}
        }catch(e){
            return;
        }
        cols.forEach(function(col,i){
            var column=this.columns[i];
            if(column){
                column.width=col.width;
                column.visible=col.visible;
            }
        },this);
    }
    function clearColumnsSettings(){
        localStorage.setItem(this.widgetName+".columns");
    }
    function hideColumnByField(field){
        var column=this.columns.namedItem(field);
        if(column){
            column.visible=false;
            $('th[abbr="'+field+'"]',this.role("thead")).prop("hidden",true);
            $('td[headers="'+field+'"]',this.role("tbody")).prop("hidden",true);
        }
    }
    function showColumnByField(field){
        var column=this.columns.namedItem(field);
        if(column){
            column.visible=true;
            $('th[abbr="'+field+'"]',this.role("thead")).prop("hidden",false);
            $('td[headers="'+field+'"]',this.role("tbody")).prop("hidden",false);
        }
    }
    function showColumnsAll(){
        this.columns.forEach(function(column){
            if(!column.visible){
                showColumnByField.call(this,column.dataField);
            }
        },this);
        writeColumnSettings.call(this);
        $('input[name="dataField"]',this.role("colmenu")).prop("checked",true);
    }
    function resetColumns(){
        showColumnsAll.call(this);
        clearColumnsSettings.call(this);
    }
    function createHeaders(){
        var that=this;
        var cellPadding=this.cellPadding;
        var thead=this.roles.get("thead");
        var tr=thead.querySelector("tr");
        var placeholder=thead.querySelector("tr>th.spacer");
        //第二次加载清除所有头文件
        if(tr.children.length>1){
            while (tr.firstChild) {
                tr.removeChild(tr.firstChild);
            }
            tr.appendChild(placeholder);
        }
        
        //resize column horizontally
        var e;
        var doDrag=function(event){
            var endWidth=e.startWidth+(event.clientX-e.startX);
            if(endWidth===e.endWidth){
                return;
            }
            e.endWidth=endWidth;
            $(e.elements).width(endWidth);
        };
        var stopDrag=function(event){
            window.removeEventListener("mouseup",stopDrag);
            window.removeEventListener("mousemove",doDrag);
            document.removeEventListener("selectstart",precentDefault);
            document.body.classList.remove("ts-resize-horizontal");
            var width=e.endWidth;
            if(width>=0){
                that.columns[e.colIndex].width=$(e.span).outerWidth();
                writeColumnSettings.call(that);
            }
        };
        var startDrag=function(event){
            var th=this.parentNode;
            var colIndex=th.cellIndex;
            var span=$(th.firstElementChild);
            var spans=that.role("tbody").querySelectorAll("td:nth-child("+(colIndex+1)+")>span");
            spans=$.merge(span,spans);
            e={
                cell:th,
                colIndex:colIndex,
                resizer:this,
                startX:event.clientX,
                span:span,
                startWidth:span.width(),
                endWidth:NaN,
                elements:spans
            };
            window.addEventListener("mouseup",stopDrag);
            window.addEventListener("mousemove",doDrag);
            document.addEventListener("selectstart",precentDefault);
            document.body.classList.add("ts-resize-horizontal");
        };
        
        var hideContextMenu=function(event){
            var menu=that.role("colmenu");
            menu.hidden=true;
            window.removeEventListener("keydown",hideContextMenuOnEsc);
            document.removeEventListener("click",hideContextMenuOnFocusOut,true);
            document.addEventListener("contextmenu",hideContextMenu,true);
        };
        var hideContextMenuOnEsc=function(e){
            if(e.keyCode===Keys.ESCAPE){//if Esc
                hideContextMenu.call(this,e);
            }
        };
        var hideContextMenuOnFocusOut=function(e){
            if(!$(e.target).closest(".-ts-menu").length){
                //e.stopPropagation();这个会终止后续其他监听操作
                e.preventDefault();//终止当前事件的继续操作
                hideContextMenu.call(this,e);
            }
        };
        var showContextMenu=function(event){
            var menu=that.role("colmenu");
            event.preventDefault();
            var $menu=$(menu).css({left:event.pageX+"px",top:event.pageY+"px"});
            menu.hidden=false;
            window.addEventListener("keydown",hideContextMenuOnEsc);
            document.addEventListener("click",hideContextMenuOnFocusOut,true);
            document.addEventListener("contextmenu",hideContextMenu,true);
        };
        var toggleColumnVisible=function(e){
            var dataField=this.value;
            if(this.checked){
                showColumnByField.call(that,dataField);
            }else{
                hideColumnByField.call(that,dataField);
            }
            hideContextMenu.call(this,e);
            writeColumnSettings.call(that);
        };
        function headerRenderer(column){
            var th=createElement("th",null,placeholder,"beforeBegin");
            var cellInner=createElement("span",null,th);
            //width
            cellInner.style.width=column.width+"px";
            //field
            th.abbr=column.dataField;
            //content
            if(column.headerElement){
                cellInner.appendChild(column.headerElement);
            }else if(column.headerHTML){
                cellInner.appendChild(DOMUtils.parseHTML(column.headerHTML));
            }else if(column.headerText){
                cellInner.appendChild(document.createTextNode(column.headerText));
            }
            //resize
            if(column.resizable){
                th.setAttribute("data-resizable",true);
                var resizer=createElement("div",null,th);
                resizer.className="-ts-col-resizer";
                resizer.textContent=" ";
                resizer.addEventListener("mousedown",startDrag);
            }
            //visible
            if(!column.visible){
                th.hidden=true;
            }
        }
        readColumnSettings.call(that);
        this.columns.forEach(headerRenderer,this);
        
        //createColMenu
        function createColMenu(){
            var menu=this.role("colmenu");
            function defaultItemsRenderer(){
                //show all columns
                var li0=DOMUtils.parseHTML(processTemplate(this.menuitemTemplate,{
                    id:this.widgetName+"_command_"+Math.random().toFixed(18).substr(2),
                    name:"command",
                    value:"ShowColumnsAll",
                    label:that.i18n.getMessage("ShowColumnsAll")
                }));
                menu.appendChild(li0);
                var input0=li0.querySelector("input[type=checkbox]");
                input0.hidden=true;
                input0.addEventListener("click",function(e){
                    e.preventDefault();
                    showColumnsAll.call(that);
                    hideContextMenu.call(this,e);
                });
                //separator
                DOMUtils.createElement("li",{className:"separator"},menu);
            }
            defaultItemsRenderer.call(this);
            var headers=$("th",this.role("thead"));
            function menuitemRenderer(column,index){
                var label=headers[index].textContent.trim();
                if(!label){return;}
                var html=processTemplate(this.menuitemTemplate,{
                    id:this.widgetName+"_"+column.dataField+"_"+Math.random().toFixed(18).substr(2),
                    name:"dataField",
                    value:column.dataField,
                    label:label
                });
                var li=DOMUtils.parseHTML(html);
                menu.appendChild(li);
                var checkbox=li.querySelector("input[type=checkbox]");
                if(index===0){
                    checkbox.disabled=true;
                };
                checkbox.checked=column.visible;
                checkbox.addEventListener("click",toggleColumnVisible);
            }
            this.columns.forEach(menuitemRenderer,this);
        }
        createColMenu.call(that);
        var headerRow=that.role("thead").querySelector("tr");
        headerRow.addEventListener("contextmenu",showContextMenu);
        that.addEventListener("removeShowContextMenu",function(){
            headerRow.removeEventListener("contextmenu",showContextMenu);
        });
    }
    function createPagination(){
        var pagination = this.footer;
        var gFoot = this.roles.get("gfoot");
        if(gFoot) {
            pagination.placeAt(gFoot);
        } else {
            pagination.placeAt(this.rootElement.getElementsByClassName("-ts-core-wrap")[0], "afterEnd");
        }
        addPaginationEventListener.call(this);
    }
    function addPaginationEventListener(){
        var that=this,
            tfoot=this.footer.roles.get('tfoot'),
            sizeSelect=tfoot.querySelector('select[name="rp"]'),
            indexSelect=tfoot.querySelector('select[name="page"]'),
            buttonHome=this.footer.roles.get("home"),
            buttonPrev=this.footer.roles.get("prev"),
            buttonNext=this.footer.roles.get("next");
        buttonHome.disabled=true;
        buttonPrev.disabled=true;
        indexSelect.addEventListener("change",function(){
            if(this.selectedIndex===0){
                buttonHome.disabled=true;
                buttonPrev.disabled=true;
            }else{
                buttonHome.disabled=false;
                buttonPrev.disabled=false;
            }
            if(this.selectedIndex===this.length-1){
                buttonNext.disabled=true;
            }else{
                buttonNext.disabled=false;
            }
            that.dataProvider.pageNo=this.value;
            that.reload();
        });
        sizeSelect.addEventListener("change",function(){
            that.dataProvider.pageSize= this.value;
            that.dataProvider.pageNo = 0;
            resetPagination.call(that);
            that.reload();
        });
        buttonPrev.addEventListener("click",function(){
            var page=indexSelect.value>>>0;
            if(page>1){
                indexSelect.value=--page;
                indexSelect.dispatchEvent(new Event("change"),{bubbles:false,cancelable:false});
            }
        });
        buttonNext.addEventListener("click",function(){
            var page=indexSelect.value>>>0,
                length=indexSelect.length;
            if(page<length){
                indexSelect.value=++page;
                indexSelect.dispatchEvent(new Event("change"),{bubbles:false,cancelable:false});
            }
        });
        buttonHome.addEventListener("click",function(){
            indexSelect.value=1;
            indexSelect.dispatchEvent(new Event("change"),{bubbles:false,cancelable:false});
        });
    }
    function resetPagination(){
        var tfoot=this.footer.roles.get('tfoot'),
        indexSelect=tfoot.querySelector('select[name="page"]'),
        buttonHome=this.footer.roles.get("home"),
        buttonPrev=this.footer.roles.get("prev"),
        buttonNext=this.footer.roles.get("next");
        buttonPrev.disabled=true;
        buttonNext.disabled=false;
        buttonHome.disabled=true;
        indexSelect.options[0].selected = true;
        //page info
        this.footer.role("tfoot").querySelector(".page-info").textContent=i18n.getMessage("PageInfo",{
            startRow:0,
            endRow:0,
            totalRows:0
        });
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
    function createSearchGroup(){
        var that=this;
        var options=this.roles.get("searchBy").options;
        this.columns.forEach(function(column){
            if(column.searchable){
                options.add(new Option(column.headerText,column.dataField));
            }
        });
        this.role("search").addEventListener("keydown",function(e){
            if(e.keyCode===Keys.ENTER&&this.value.trim()&&!this.classList.contains("busy")){
                that.reload();
                this.classList.add("busy");
                setTimeout(function(that){that.classList.remove("busy");},1000,this);
            }
        });
    }
    function createSortControls(){
        var that=this,
            thead=this.roles.get("thead"),
            tfoot=this.roles.get("tfoot"),
            headers=Array.from(thead.rows[0].cells),
            sortBy=this.roles.get("sortBy"),
            sortAsceding=tfoot.querySelector('[name="sortorder"][value="asc"]'),
            sortDesceding=tfoot.querySelector('[name="sortorder"][value="desc"]');
        function header_sortChangeHandler(){
            var span=this,
                header=span.parentNode,
                data=header.dataset;
            var lastSortField=sortBy.value;
            sortBy.value=data.sortField;
            if(data.sorted!=="true"){
                var sorted=thead.querySelector('th[data-sorted="true"]');
                if(sorted){sorted.setAttribute("data-sorted",false);}
                header.setAttribute("data-sorted",true);
            }
            if(data.sortDescending==="true"){
                header.setAttribute("data-sort-descending",false);
                sortAsceding.checked=true;
            }else{
                header.setAttribute("data-sort-descending",true);
                sortDesceding.checked=true;
            }
            var column=that.columns.namedItem(sortBy.value);
            if(!column){throw new Error("Internal Script Error");}
            column.sortDescending=sortDesceding.checked;
            if(that.localSorting){
                var rows=that.dataRows.toArray();
                if(rows.length===0){return;}
                if(lastSortField===data.sortField){
                    rows.reverse();
                }else{
                    if(typeof column.compareFunction==="function"){
                        rows.sort(column.compareFunction);
                    }else{
                        var sortField=column.sortField;
                        switch(TypeNameOf(rows[0][sortField])){
                            case "String":
                                rows.sort(function(a,b){
                                    return a[sortField].localeCompare(b[sortField]);
                                });
                                break;
                            case "Number":
                            case "Boolean":
                            default:
                                rows.sort(function(a,b){
                                    return a[sortField]-b[sortField];
                                });
                                break;
                        }
                        
                    }
                    if(column.sortDescending){
                        rows.sort();
                    }
                }
                var dp=that.dataProvider;
                dp.rows=rows;
                that.dataProvider=dp;
            }else{
                that.reload();
            }
        }
        function sortOrder_changeHandler(){
            that.reload();
        }
        function sortBy_changeHandler(){
            that.reload();
        }
        function submit_clickHandler(){
            that.reload();
        }
        sortBy.selectedIndex=-1;
        sortBy.options.add(new Option("--none--",""));
        sortBy.addEventListener("change",sortBy_changeHandler);
        function headerRenderer(column,index){
            if(column.sortable){
                sortBy.options.add(new Option(column.headerText,column.dataField));
                var header=headers[index];
                header.setAttribute("data-sortable",true);
                header.setAttribute("data-sort-field",column.sortField);
                header.setAttribute("data-sort-descending",column.sortDescending);
                header.firstElementChild.addEventListener("click",header_sortChangeHandler);
            }
        }
        this.columns.forEach(headerRenderer,this);
        sortAsceding.addEventListener("change",sortOrder_changeHandler);
        sortDesceding.addEventListener("change",sortOrder_changeHandler);
        this.roles.get("submit").addEventListener("click",submit_clickHandler);
    }
    function createActions(){
    	var that = this;
    	var actions = this.__data__.actions;
    	that.roles.get("gtoolbar").innerHTML="";
    	actions.forEach(function(action){
    		action.placeAt(that.roles.get("gtoolbar"),"beforeEnd");
    	});
    }
    function buildCascadingCheckbox(){
        var slave_keydownHandler=function(e){
            var target;
            if(e.keyCode===Keys.UP){
                target=$(this).closest("tr").prev("tr").find("td:first-child input")[0];
                if(target){
                    target.focus();
                }
            }else if(e.keyCode===Keys.DOWM){
                target=$(this).closest("tr").next("tr").find("td:first-child input")[0];
                if(target){
                    target.focus();
                }
            }
        };
        this.addEventListener("rowsAdded",function(){
            var master=this.roles.get("thead").querySelector('th:first-child input[type="checkbox"]');
            var group=new CascadingCheckboxGroup(master,[]);
            var slaves=Array.from(this.roles.get("tbody").querySelectorAll('td:first-child input[type="checkbox"]'));
            group.master.checked=false;
            group.master.indeterminate=false;
            group.slaves=slaves;
            this.checkboxGroup=group;
            if(slaves.length){
                switch(slaves[0].type){
                    case "radio":
                        master.hidden=true;
                        break;
                    case "checkbox":
                        slaves.forEach(function(slave){
                            slave.addEventListener("keydown",slave_keydownHandler);
                        });
                        break;
                }
            }
        });
    }
    function resetRows(){
        var tbody=this.roles.get("tbody");
        tbody.appendChild(DOMUtils.parseHTML("<tr><td><span>&#160;</span></td></tr>"));
    }
    function clearRows(){
        var tbody=this.roles.get("tbody");
        while(tbody.hasChildNodes()){
            tbody.removeChild(tbody.firstChild);
        }
        this.dispatchEvent(new TSEvent("clear"));
    }
    function buildJsonData(obj){
        var jsonData = {data: ''};
        if(obj != null){
            jsonData.data = JSON.stringify(obj);
        }
        return jsonData;
    }
    "public";
    function setRows(data){
        if(!Array.isArray(data)){return;}
        var d=this.dataProvider;
        d.rows=data;
        d.pageNo=0;
        d.startRow=1;
        d.pageSize=9999;
        d.totalPages=1;
        d.endRow=d.startRow+data.length-1;
        d.totalRows=data.length;
        this.dataProvider=d;
    }

    function load(url){
        if(this.readyState===this.LOADING){
            return;
        }
        this.__data__.dataSource=""+url;
        var jqXHR;
        try{
            this.readyState=this.LOADING;
            this.rootElement.classList.add("loading");
            var that = this;
            jqXHR=$.ajax(this.dataSource,{
                type:"post",
                dataType:this.dataType,
                data:buildJsonData({
                    pageNo:this.dataProvider.pageNo,
                    pageSize:this.dataProvider.pageSize,
                    params:this.dataProvider.params,
                    condition:this.dataProvider.condition}),
                success: function(data){
                    if(Array.isArray(data)){
                        setRows.call(that,data);
                    }else{
                    	that.dataProvider=data;
                    }
                    that.readyState=that.LOADED;
                    that.rootElement.classList.remove("loading");
                    var e=new TSEvent("done");
                    e.data=data;
                    that.dispatchEvent(e);
                }
            }).fail(function(jqXHR,textStatus,error){
            		that.readyState=that.LOADED;
                var e=new TSEvent("fail");
                e.status=jqXHR.status;
                e.textStatus=textStatus;
                e.reason=error;
                that.dispatchEvent(e);
                that.rootElement.classList.remove("loading");
            });
            this.__data__.jqXHR=jqXHR;
        }catch(e){
            this.readyState=this.LOADED;
            var event=new TSEvent("error");
            event.error=e;
            this.dispatchEvent(event);
            this.rootElement.classList.remove("loading");
        }
    }

    function abort(){
        if(this.readyState===this.LOADING){
            try{this.__data__.jqXHR.abort();}catch(e){}
        }
    }
    function reload(){
        this.load(this.dataSource);
    }
    function processTemplate(tpl,obj){
        return tpl.replace(/\$\{([\$\w+]+)\}/g,function(el,key){
            return key in obj?obj[key]:el;
        });
    }
    ExtendClass(TSDataGrid,TSWidget);
    InstallFunctions(TSDataGrid.prototype,DONT_DELETE,[
        "abort",abort,
        "load",load,
        "reload",reload,
        "setRows",setRows,
        "clearRows",clearRows
    ]);
    SetProperties(TSDataGrid.prototype,DONT_ENUM,[
        "template",htm,
        "menuitemTemplate",'<li role="menuitem" class="unselectable"><input type="checkbox" id="${id}" name="${name}" value="${value}" /><label for="${id}" class="nowrap">${label}</label></li>',
        "i18n",i18n
    ]);
    SetNativeFlag(TSDataGrid);
    return TSDataGrid;
});
