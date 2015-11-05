define("jsm/util/UUID",[],function(IMap){
	"use strict";
	/**
	 * @class UUID
	 * @static
	 */
	function UUID(){
		
	}
	/**
	 * Generate a random UUID
	 * @method randomUUID
	 * @return {String} The generated UUID
	 */
	function randomUUID(){
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
			var r=Math.random()*16|0, v=c=='x'?r:(r&0x3|0x8);
			return v.toString(16);
		});
	}
	InstallFunctions(UUID,NONE,[
		"randomUUID",randomUUID
	]);
	return UUID;
});