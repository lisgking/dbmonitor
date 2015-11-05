define("ts/widgets/TSTree",[
	"ts/widgets/TSTreeNode"
],function(TSTreeNode){
	"use strict";
	/**
	 * @namespace ts.widgets
	 * @class TSTree
	 * @extends ts.widgets.TSTreeNode
	 */
	function TSTree(id,initParams){
		TSTreeNode.call(this,id,initParams);
	}
	ExtendClass(TSTree,TSTreeNode);
	SetNativeFlag(TSTree);
	return TSTree;
});