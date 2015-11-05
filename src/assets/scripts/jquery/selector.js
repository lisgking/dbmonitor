(function($){
	$.extend($.expr.pseudos,{
		"overflow":function(e){
			return e.scrollWidth>e.clientWidth||e.scrollHeight>e.clientHeight;
		},
		"overflow-x":function(e){
			return e.scrollWidth>e.clientWidth;
		},
		"overflow-y":function(e){
			return e.scrollHeight>e.clientHeight;
		}
	});
	if(typeof define==="function"&&define.amd){
		define(function(){return $;});
	}
}(jQuery));
