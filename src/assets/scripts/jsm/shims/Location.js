define(function(){
	"use strict";
	/**
	 * @namespace jsm.shims
	 * @class Location
	 * @extension Location
	 */
	/**
	 * @attribute origin
	 * @type String
	 */
	if(!location.origin){
		InstallGetter(Location.prototype,"origin",function(){return this.protocol+"//"+this.host;});
	}
	return Location;
});