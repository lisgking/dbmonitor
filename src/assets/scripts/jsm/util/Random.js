define("jsm/util/Random",[],function(){
	/**
	 * Random Utilities
	 * @namespace jsm.util
	 * @static
	 * @class Random
	 */
	function Random(){
		
	}
	/**
	 * return a random uuid "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
	 * @method uuid
	 * @return {String}
	 */
	function uuid(){
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
			var r=Math.random()*16|0, v=c=='x'?r:(r&0x3|0x8);
			return v.toString(16);
		});
	}
	/**
	 * return a random integer
	 * @method digits
	 * @param {Number} [length=16]
	 * @return {String}
	 * @example digits(16);  //"00884875259362161160"
	 */
	function digits(/*length*/){
		var length=arguments.length>0?arguments[0]>>>0:16;
		var s="",repeat=Math.floor(length/20);
		for(var i=0;i<repeat;i++){
			s+=Math.random().toFixed(20).substr(2);
		}
		s+=Math.random().toFixed(length%20).substr(2);
		return s;
	}
	/**
	 * return a random integer
	 * @method nextInt
	 * @param {Number} [m] start
	 * @param {Number} [n] end
	 * @return {Number}
	 * @example nextInt() [0,2147483648)
	 * @example nextInt(100) [0,100)
	 * @example nextInt(50,100) [50,100)
	 */
	function nextInt(/*m,n*/){
		var l=arguments.length,m,n,r;
		if(l===0){
			r=Math.random()*0x7fffffff;
		}else if(l===1){
			m=arguments[0];
			r=Math.random()*m;
		}else if(l===2){
			m=arguments[0];
			n=arguments[1];
			r=Math.random()*(n-m)+m;
		}
		return Math.floor(r);
	}
	InstallFunctions(Random,DONT_ENUM,[
		"uuid",uuid,
		"digits",digits,
		"nextInt",nextInt
	]);
	SetNativeFlag(Random);
	return Random;
});