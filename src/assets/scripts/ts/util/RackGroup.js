define([
	"ts/widgets/TSWidget",
	"jsm/events/MozKeys",
	"ts/util/AnimationFrame",
	"dojo/text!./htm/RackGroup.htm",
	"dojo/css!./css/RackGroup.css",
	"jquery"
],function(TSWidget,Keys,AnimationFrame,htm,css,$){
	/*var Keys={
		"LEFT":37,
		"UP":38,
		"RIGHT":39,
		"DOWN":40,
		"ESCAPE":27,
		"ENTER":13,
	};*/
	(function($){
		$.fn.nsOn=function(type,listener,useCapture){
			for(var i=0,l=this.length;i<l;i++){
				this[i].addEventListener(type,listener,useCapture);
			}
			return this;
		};
		$.fn.nsOff=function(type,listener,useCapture){
			for(var i=0,l=this.length;i<l;i++){
				this[i].removeEventListener(type,listener,useCapture);
			}
			return this;
		};
		$.fn.upAndDownKeySupport=function(){
			//if(document.documentMode===9)this.nsOn("selectstart",function(){return false;});
			//this.find(">li").attr("tabindex",0);
			//this.attr("tabindex",0);
			return this.nsOn("keydown",function(e){
				var c=e.keyCode,
					t=null;
				if(c===Keys.UP){
					e.preventDefault();
					t=e.target.previousElementSibling;
					if(t){t.focus();}
				}else if(c===Keys.DOWN){
					e.preventDefault();
					t=e.target.nextElementSibling;
					if(t){t.focus();}
				}
			});
		};
	}($));
	var i18n=TSWidget.prototype.i18n.createBranch({});
	"constructor";
	function RackGroup(id,initParams){
		TSWidget.call(this,id,initParams);
		defineProperties.call(this);
		addEventListeners.call(this);
		init.call(this);
	}
	"private";
	function defineProperties(){
		var table=this.role("table");
		this.typicalHeadCell=table.tHead.rows[0].cells[0].cloneNode(true),
		this.typicalDataCell=table.tBodies[0].rows[0].cells[0].cloneNode(true);
		this.tbody=table.tBodies[0];
		this.numOfRacks=this.rootElement.querySelector('input[name="numOfRacks"]');
		this.numOfFloors=this.rootElement.querySelector('input[name="numOfFloors"]');
		this.roles.append("trash",document.createDocumentFragment());
		//hostNames
		this.__data__.hostNames=[];
		InstallGetterSetter(this,"hostNames",function(){
			return this.__data__.hostNames;
		},function(v){
			if(!Array.isArray(v)){
				throw new TypeError(v+" is not a array.");
			}
			this.__data__.hostNames=v;
			renderHostNames.call(this,v);
		});
		//hostRackMapping
		InstallGetter(this,"hostRackMapping",function(){
			var mapping={};
			$("td:not([hidden])>input",this.tbody).filter(function(index,input){
				return input.value!=="";
			}).map(function(index,input){
				mapping[input.value]=input.placeholder;
			});
			return mapping;
		});
	}
	function clearHostNames(){
		this.role("list").innerHTML="";
		$("input",this.role("tbody")).prop("value","");
	}
	function renderHostNames(data){
		clearHostNames.call(this);
		var ul=this.role("list");
		data.forEach(function(name){
			var li=document.createElement("li");
			li.setAttribute("data-value",name);
			li.textContent=name;
			processListItem(li);
			ul.appendChild(li);
		});
	}
	var item_dragstartHandler=function(e){
		e.dataTransfer.effectAllowed="copy";
		e.dataTransfer.setData("Text", "data: "+this.dataset.value);
		console.log(e);
	};
	var item_dragenterHandler=function(e){
		return false;
	};
	var preventDefault=function(e){
		e.preventDefault();
	};
	/**
	 * 处理新建的列表项
	 * @param {HTMLLIElement} li
	 */
	function processListItem(li){
		li.setAttribute("draggable",true);
		li.addEventListener("dragstart",item_dragstartHandler);
		//li.onselectstart=preventDefault;
	}
	function addEventListeners(){
		var that=this;
		//drag drop
		var input_dragoverHandler=function(e){
			//this.classList.add("hover");
			e.preventDefault();
			e.dataTransfer.dropEffect="copy";
		};
		var input_dropHandler=function(e){
			e.stopPropagation();
			if(this.value){return;}
			var data=e.dataTransfer.getData('Text');
			if(!data.startsWith("data: ")){
				return;
			}
			var oldId=this.value;
			if(oldId){
				that.restoreListItemFromTrash(oldId);
			}
			var newId=data.substring(6);
			that.moveListItemToTrash(newId);
			this.value=newId;
		};
		var input_dragleaveHandler=function(e){
			//this.classList.remove("hover");
		};
		var input_returnHandler=function(e){
			var id=this.value;
			if(id){
				that.restoreListItemFromTrash(id);
				this.value="";
			}
		};
		var input_keydownHandler=function(e){
			if((e.keyCode===Keys.ESCAPE||e.keyCode===Keys.ENTER)&&this.value){
				input_returnHandler.call(this,e);
			}
		};

		//number change
		var num_inputHandler=AnimationFrame.getFPSLimitedFunction(function(e){
			if(that.numOfRacks.checkValidity()&&that.numOfFloors.checkValidity()){
				var racks=+that.numOfRacks.value;
				var floors=+that.numOfFloors.value;
				if((1<=racks&&racks<=255)&&(1<=floors&&floors<=255)){
					drawTable.call(that,table,racks,floors);
				}
			}
		},1);
		/**
		 * 确保表头行拥有指定数量的单元格数
		 * @param {HTMLTableRowElement} tr
		 * @param {Number} length
		 */
		function ensureCapacityOfHeadCells(tr,length){
			var n=tr.cells.length,
				node;
			if(n<length){
				for(var i=n;i<length;i++){
					node=that.typicalHeadCell.cloneNode(true);
					tr.appendChild(node);
				}
			}
		}
		/**
		 * 处理新建的单元格
		 * @param {HTMLTableCellElement} td
		 */
		function processDataCell(td){
			var input=td.querySelector("input");
			input.addEventListener("dragenter",item_dragenterHandler);
			input.addEventListener("dragover",input_dragoverHandler);
			input.addEventListener("drop",input_dropHandler);
			input.addEventListener("dragleave",input_dragleaveHandler);
			input.addEventListener("keydown",input_keydownHandler);
			input.addEventListener("dblclick",input_returnHandler);
		}
		/**
		 * 确保数据行拥有指定数量的单元格数
		 * @param {HTMLTableRowElement} tr
		 * @param {Number} length
		 */
		function ensureCapacityOfDataCells(tr,length){
			var n=tr.cells.length,
				td;
			for(var i=n;i<length;i++){
				td=that.typicalDataCell.cloneNode(true);
				processDataCell(td);
				tr.appendChild(td);
			}
		}
		/**
		 * 设置行中可视的单元格数
		 * @param {HTMLTableRowElement} tr
		 * @param {Number} length
		 */
		function setLengthOfCells(tr,length){
			var cells=tr.cells,
				n=cells.length,
				i;
			for(i=0;i<length;i++){
				cells[i].hidden=false;
			}
			for(i=length;i<n;i++){
				cells[i].hidden=true;
			}
		}
		/**
		 * 确保tbody拥有指定数量的行数
		 * @param {HTMLTableRowElement|HTMLTableSectionElement} tr
		 * @param {Number} length
		 */
		function ensureCapacityOfBodyRows(table,length){
			var n=table.rows.length;
			if(n<length){
				for(var i=n;i<length;i++){
					table.insertRow(i);
				}
			}
		}
		/**
		 * 设置表格中可视的行数
		 * @param {HTMLTableRowElement|HTMLTableSectionElement} table
		 * @param {Number} length
		 */
		function setLengthOfRows(table,length){
			var rows=table.rows,
				n=rows.length,
				i;
			for(i=0;i<length;i++){
				rows[i].hidden=false;
			}
			for(i=length;i<n;i++){
				rows[i].hidden=true;
			}
		}
		/**
		 * 设置表格中可视的行数和列数
		 * @param {HTMLTableRowElement|HTMLTableSectionElement} table
		 * @param {Number} length
		 */
		function setLengthOfColsAndRows(table,cols,rows){
			var i,j;
			for(i=0;i<rows;i++){
				for(j=0;j<cols;j++){
					table.rows[i].cells[j].querySelector("input").placeholder=(j+1)+"_"+(rows-i);
				}
			}
			//选出隐藏的输入框
			$('td[hidden]>input[name="hostName"]',table).filter(function(index,input){
				//筛选出非空的
				return input.value!=="";
			}).map(function(index,input){
				//返回输入框的值并清空输入框的值
				var value=input.value;
				input.value="";
				return value;
			}).each(function(index,id){
				//将每个值移回列表
				that.restoreListItemFromTrash(id);
			});
			
		}
		/**
		 * 绘制指定行数和列数的表格,并综合其他业务调度
		 * @param {HTMLTableRowElement|HTMLTableSectionElement} table
		 * @param {Number} length
		 */
		function drawTable(table,cols,rows){
			var thead=table.tHead,
				tbody=table.tBodies[0];
			//table
			table.dataset.cols=cols;
			table.dataset.rows=rows;
			//thead
			ensureCapacityOfHeadCells(thead.rows[0],cols);
			setLengthOfCells(thead.rows[0],cols);
			//tbody
			ensureCapacityOfBodyRows(tbody,rows);
			setLengthOfRows(tbody,rows);
			Array.prototype.forEach.call(tbody.rows,function(tr){
				ensureCapacityOfDataCells(tr,cols);
				setLengthOfCells(tr,cols);
			});
			setLengthOfColsAndRows(tbody,cols,rows);
		}
		var list=this.role("list");
		var table=this.role("table");
		
		//$(list).upAndDownKeySupport();
		$("tbody td",table).each(function(index,td){
			processDataCell(td);
		});
		this.numOfRacks.addEventListener("input",num_inputHandler);
		this.numOfFloors.addEventListener("input",num_inputHandler);
		
		drawTable.call(this,table,2,8);
		this.addEventListener("listlengthchange",function(e){
			//TODO what you want
		});
	}
	function init(){
		
	}
	"public";
	/**
	 * 将列表项移至回收站
	 * @param {String} id
	 */
	function moveListItemToTrash(id){
		var li=this.role("list").querySelector('li[data-value="'+id+'"]');
		if(li){
			this.role("trash").appendChild(li);
			this.dispatchEvent(new Event("listlengthchange"));
		}
	}
	/**
	 * 从回收站还原列表项
	 * @param {String} id
	 */
	function restoreListItemFromTrash(id){
		var li=this.role("trash").querySelector('li[data-value="'+id+'"]');
		if(li){
			this.role("list").appendChild(li);
			this.dispatchEvent(new Event("listlengthchange"));
		}
	}
	function moveListItemToRack(id,postion,resolve,reject){
		var tbody=this.role("tbody");
		var source=this.role("trash").querySelector('li[data-value="'+id+'"]');
		var target=tbody.querySelector('input[placeholder="'+postion+'"]');
	}
	ExtendClass(RackGroup,TSWidget);
	InstallFunctions(RackGroup.prototype,DONT_ENUM,[
		"moveListItemToTrash",moveListItemToTrash,
		"restoreListItemFromTrash",restoreListItemFromTrash
	]);
	SetProperties(RackGroup.prototype,DONT_ENUM,[
		"template",htm,
		"i18n",i18n
	]);
	return RackGroup;
});
