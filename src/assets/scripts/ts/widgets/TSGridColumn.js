define("ts/widgets/TSGridColumn",[
	"ts/util/TSEventTarget",
	"ts/util/Format",
	"ts/events/TSEvent"
],function(TSEventTarget,Format,TSEvent){
	"use strict";
	//--------------------------------
	// TSGridColumn
	//--------------------------------
	var formatters={
		"date":{
			format:function(t){
				return new Date(t).toLocaleDateString(document.documentElement.lang);
			}
		},
		"datetime":{
			format:Format.toDateString
		},
		"number":{
			format:function(n){
				return n===null||n===void 0?"":n.toLocaleString(document.documentElement.lang);
			}
		}
	};
	var renderers={
		"date":{
			render:function(t){
				var input=document.createElement("input");
				input.type="date";
				input.value=new Date(t).toISOString();
				return input;
			}
		}
	};
	/**
	 * @namespace ts.widgets
	 * @class TSGridColumn
	 * @extends ts.util.TSEventTarget
	 * @constructor
	 * @param props
	 */
	function TSGridColumn(props){
		TSEventTarget.call(this);
		/**
		 * @attribute columnIndex
		 * @type Number
		 * @readOnly
		 */
		this.__data__.columnIndex=-1;
		InstallGetter(this,"columnIndex",function(){
			return this.__data__.columnIndex;
		});
		SetProperties(this,NONE,[
			/**
			 * @attribute dataField
			 * @type String
			 */
			"dataField","",
			/**
			 * @attribute labelFunction
			 * @type Function
			 */
			"labelFunction",null,
			/**
			 * input types
			 * @attribute inputType
			 * @type String
			 */
			"inputType","text",
			/**
			 * data type, one of ["text", "html","element"]
			 * @attribute dataType
			 * @type String
			 * @default "text"
			 */
			"dataType","text",
			/**
			 * @attribute textAlign
			 * @type String
			 * @default "left"
			 */
			"textAlign","left",
			/**
			 * @attribute headerText
			 * @type String
			 * @default "\xA0"
			 */
			"headerText","\xA0",
			/**
			 * @attribute headerHTML
			 * @type String
			 */
			"headerHTML","",
			/**
			 * @attribute headerElement
			 * @type Node
			 */
			"headerElement",null,
			/**
			 * @attribute width
			 * @type Number
			 */
			"width",120,
			/**
			 * @attribute minWidth
			 * @type Number
			 */
			"minWidth",0,
			/**
			 * @attribute maxWidth
			 * @type Number
			 */
			"maxWidth",-1&0x7ffff,
			/**
			 * @attribute resizable
			 * @type Boolean
			 */
			"resizable",true,
			/**
			 * @attribute showDataTips
			 * @type Boolean
			 */
			"showDataTips",false,
			/**
			 * @attribute dataTipField
			 * @type String
			 */
			"dataTipField","",
			/**
			 * @attribute dataTipFunction
			 * @type Function
			 */
			"dataTipFunction",null,
			/**
			 * @attribute sortable
			 * @type Boolean
			 */
			"sortable",false,
			/**
			 * @attribute sortField
			 * @type String
			 */
			"sortField","",
			/**
			 * @attribute sortDescending
			 * @type Boolean
			 */
			"sortDescending",true,
			/**
			 * @attribute compareFunction
			 * @type Function
			 */
			"compareFunction",null,
			/**
			 * @attribute visible
			 * @type Boolean
			 */
			"visible",true,
			/**
			 * @attribute searchable
			 * @type Boolean
			 */
			"searchable",false,
			/**
			 * @attribute editable
			 * @type Boolean
			 */
			"editable",false,
			/**
			 * @attribute title
			 * @type Boolean
			 */
			"title",false
		]);
		ExtendObject(this,props);
		if(!props.sortField){
			this.sortField=this.dataField;
		}
		if(!props.dataTipField){
			this.dataTipField=this.dataField;
		}
	}
	function itemToString(item,labelPath,labelFunction,formatter){
		if(!item){
			return TSGridColumn.ERROR_TEXT;
		}
		if(typeof labelFunction==="function"){
			return labelFunction.call(this,item,this);
		}
		var itemString=null,itemData=null;
		try{
			//Now we only support one-level labelPath for performance considerations
			itemData=item[labelPath];//labelPath.reduce(function(name){return item[name];},item);
			if(itemData!==null&&labelPath.length>0)
				itemString=formatter?formatter.format(itemData):itemData.toString();
		}catch(e){}
		return itemString!==null?itemString:TSGridColumn.ERROR_TEXT;
	}
	"public";
	/**
	 * @method itemToDataTip
	 * @param {Object} item
	 * @return {String}
	 */
	function itemToDataTip(item){
		return itemToString.call(this, item, this.dataTipField, this.dataTipFunction);
	}
	/**
	 * @method itemToLabel
	 * @param {Object} item
	 * @return {String}
	 */
	function itemToLabel(item){
		return itemToString.call(this, item, this.dataField, this.labelFunction,formatters[this.inputType]);
	}
	function itemToInput(item){
		if(typeof this.inputFunction!=="function"){return null;}
		return this.inputFunction.call(this,item);
	}
	function valueFunction(input){
		return input.value;
	}
	ExtendClass(TSGridColumn,TSEventTarget);
	SetProperties(TSGridColumn.prototype,NONE,[
		"ERROR_TEXT","\x20",
		"formatters",formatters
	]);
	InstallFunctions(TSGridColumn.prototype,NONE,[
		"itemToDataTip",itemToDataTip,
		"itemToLabel",itemToLabel,
		"itemToInput",itemToInput
	]);
	return TSGridColumn;
});