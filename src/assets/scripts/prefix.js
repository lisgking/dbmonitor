(function(){
	function Prefix(){
		var styles=window.getComputedStyle(document.documentElement,''),
			pre=(Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/)||
					(styles.OLink === '' && ['', 'o']))[1],
			dom=("WebKit|Moz|MS|O").match(new RegExp('('+pre+')', 'i'))[1];
		Object.defineProperties(this,{
			"dom":{value:dom},
			"lowercase":{value:pre},
			"css":{value:'-'+pre+'-'},
			"js":{value:pre.charAt(0).toUpperCase()+pre.substr(1)}
		});
	}
	navigator.prefix=new Prefix();
	if(typeof define==="function"&&define.amd){
		define("prefix",[],function(){return navigator.prefix;});
	}
}());