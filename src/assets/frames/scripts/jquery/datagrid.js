(function($,window){
	"use strict";
	var doc=window.document,
		create=function(tag,attrs,parent){
			var elem=doc.createElement(tag);
			if(attrs instanceof Object)for(var a in attrs)elem.setAttribute(a,attrs[a]);
			if(parent)parent.appendChild(elem);
			return elem;
		};
	function DataGrid(options){
		$.extend(true,this,options);
		var t=this,
			table=t.table,
			thead=table.tHead,
			tbody=table.tBodies[0],
			tfoot=table.tFoot,
			tr,th,td,i,j,column,fn,html,
			size=t.metadata.size,
			columns=t.columns,
			typicalItem=t.typicalItem,
			w;
		//create head
		thead.innerHTML="";
		tr=thead.insertRow(0);
		for(j=0;j<columns.length;j++){
			column=columns[j];
			th=create("th",{abbr:column.dataField},tr);
			w=column.width;
			th.innerHTML=column.headerText;
			th.style.width=isFinite(w)?w+"px":w;
		}
		create("th",null,tr);
		
		//create body
		tbody.innerHTML="";
		for(i=0;i<size;i++){
			tr=tbody.insertRow(i);
			for(j=0;j<columns.length;j++){
				column=columns[j];
				td=tr.insertCell(j);
				td.axis=column.dataField;
				td.innerHTML="&#20;";
				w=column.width;
				td.style.width=isFinite(w)?w+"px":w;
			}
			create("td",null,tr);
		}
		//show typical item
		if(typicalItem){
			tr=tbody.rows[0];
			for(j=0;j<columns.length;j++){
				column=columns[j];
				fn=column.labelFunction;
				html=typicalItem[column.dataField];
				html=fn?fn(html):html;
				tr.cells[j].innerHTML=html;
			}
		}
		if(t.oncreationcomplete){t.oncreationcomplete.call(t);}
	}
	DataGrid.prototype={
		constructor:DataGrid,
		//~~~~~properties~~~~~
		table:null,
		src:"",
		columns:[],
		typicalItem:null,
		metadata:{
			title: "",
			search: "",
			desc: "",
			page: 1,
			size: 10,
			total: 0,
			version: "0.0",
		},
		listdata:[],
		//~~~~~events~~~~~
		oncreationcomplete:null,
		onbeforeload:null,
		onload:null,
		onerror:null,
		//~~~~~listeners~~~~~
		listeners:{},
		addListeners:function(){
			var t=this;
			function headCheckbox_clickHandler(event){
				var input=$(this),
					checked=input.prop("checked"),
					boxes=$("td:first-child input[type=checkbox]",tbody),
					trs=boxes.closest("tr");
				boxes.prop("checked",checked);
				checked?trs.addClass("selected"):trs.removeClass("selected");
			}
			function tbodyCheckbox_clickHandler(event){
				var input=$(this),checked=input.prop("checked"),tr=input.closest("tr"),
					allbox=$("th:first-child input[type=checkbox]",thead),
					boxes=$("td:first-child input[type=checkbox]",tbody),
					count=boxes.filter(":checked").length;
				checked?tr.addClass("selected"):tr.removeClass("selected");
				allbox.prop("checked",count==boxes.length);
			}
			$("th:first-child input[type=checkbox]",thead).on("click",headCheckbox_clickHandler);
			
			t.listeners={
				esc_keydownHandler:esc_keydownHandler
			};
		},
		//~~~~~methods~~~~~
		/**
		 * load(src:String):void;
		 */
		load:function(src){
			var t=this;
			if(t.onbeforeload)t.onbeforeload.apply(t,arguments);
			var xhr=$.ajax({
				url:src,
				success:function(data,status,xhr){
					if(t.onload)t.onload.apply(t,arguments);
					t.meta(data.meta);
					t.list(data.list);
				},error:function(xhr,status,error){
					if(t.onerror)onerror.apply(t,arguments);
				}
			});
		},
		/**
		 * meta():Object
		 * meta(meta:Object):void
		 */
		meta:function(meta){
			if(!meta){return this.metadata;}
			this.metadata=meta;
		},
		/**
		 * list():Array
		 * list(list:Array):void
		 */
		list:function(list){
			if(!(list instanceof Array)){return this.listdata;}
			var t=this,
				tbody=t.table.tBodies[0],
				len=list.length,
				columns=t.columns,
				column,tr,td,fn,html,item,i,j;
			this.listdata=list;
			for(i=0;i<len;i++){
				item=list[i];
				tr=tbody.rows[i];
				for(j=0;j<columns.length;j++){
					column=columns[j];
					td=tr.cells[j],
					fn=column.labelFunction,
					html=item[column.dataField],
					html=fn?fn.call(html):html,
					td.innerHTML=html;
				}
			}
			$("td:first-child input[type=checkbox]",tbody).on("click",t.listeners.tbodyCheckbox_clickHandler);
		},
		destroy: function(){
			$(this.table).removeData("datagrid");
		}
	};
	$.fn.performDataGrid=function(options){
		var api=this.data("datagrid");
		if(this.length<1){console.warn("Cannot perform DataGrid due to empty node list");return this;}
		if(api){console.warn("datagrid already initialized");return this;}
		options.table=this[0],api=new DataGrid(options);
		if(api.hasOwnProperty("src")){api.load(api.src);}
		return this.eq(0).data("datagrid",api);
	};
}(jQuery,window));
