define("ts/widgets/TSGridPagination",[
    "ts/widgets/TSWidget",
	"ts/util/TSEventTarget",
	"ts/util/Format",
	"ts/events/TSEvent",
    "dojo/text!./htm/TSGridPagination.htm",
    "dojo/css!./css/TSGridPagination.css",
    "dojo/nls!./nls/widgets.json",
    "jquery",
    "jquery/selector"
],function(TSWidget,TSEventTarget,Format,TSEvent,htm,css,json,$){
	"use strict";
	//--------------------------------
	// TSGridPagination
	//--------------------------------
	/**
	 * @namespace ts.widgets
	 * @class TSGridPagination
	 * @extends ts.widgets.TSWidget
	 * @constructor
	 * @param props
	 */
    function TSGridPagination(id,initParams){
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
    }
    function addEventListeners(){
    }
	"public";
	/**
	 * @method itemToLabel
	 * @param {Object} item
	 * @return {String}
	 */
	function itemToLabel(item){
	}
	ExtendClass(TSGridPagination,TSWidget);
	SetProperties(TSGridPagination.prototype,NONE,[
        "template",htm,
        "i18n",i18n
	]);
	InstallFunctions(TSGridPagination.prototype,NONE,[
		"itemToLabel",itemToLabel
	]);
	return TSGridPagination;
});
