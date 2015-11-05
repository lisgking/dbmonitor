define("ts/widgets/TSTreeItem",[
	"ts/widgets/TSTreeNode"
],function(TSTreeNode){
	"use strict";
	//----------------------------------------------------------------
	// TSTreeItem
	//----------------------------------------------------------------
	/**
	 * @namespace ts.widgets
	 * @class TSTreeItem
	 * @extends ts.widgets.TSTreeNode
	 * @constructor
	 * @param {String} id
	 * @param {Object} [initParams]
	 */
	function TSTreeItem(id,initParams){
		TSTreeNode.call(this,id,initParams);
	}
	ExtendClass(TSTreeItem,TSTreeNode);
	SetNativeFlag(TSTreeItem);
	SetProperties(TSTreeItem.prototype,DONT_ENUM,[
		"template",'<li><span data-role="span" class="button switch"></span><a href="" data-role="link"></a></li>'
	]);
	return TSTreeItem;
});
