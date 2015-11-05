define("ts/widgets/TSMenuItem",[
	"ts/util/TSEventTarget",
	"ts/events/TSEvent"
],function(TSEventTarget,TSEvent){
	"use strict";
	//--------------------------------
	// TSMenuItem
	//--------------------------------
	/**
	 * @namespace ts.widgets
	 * @class TSMenuItem
	 * @extends ts.util.TSEventTarget
	 * @constructor
	 * @param props
	 */
	function TSMenuItem(props){
		TSEventTarget.call(this);
		/**
		 * @attribute menuIndex
		 * @type Number
		 * @readOnly
		 */
		this.__data__.menuIndex = -1;
		InstallGetter(this, "menuIndex", function() {
			return this.__data__.menuIndex;
		});
		SetProperties(this,NONE,[
			/**
			 * @attribute dataField
			 * @type String
			 */
			"menuName","",
			/**
			 * @attribute labelFunction
			 * @type Function
			 */
			"callback",null,
			/**
			 * @attribute icon
			 * @type String
			 */
			"icon","",
			/**
			 * @attribute labelFunction
			 * @type Function
			 */
			"lableFunction",null,
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
			"resizable",true
		]);
		ExtendObject(this,props);
	}
	ExtendClass(TSMenuItem,TSEventTarget);
	return TSMenuItem;
});