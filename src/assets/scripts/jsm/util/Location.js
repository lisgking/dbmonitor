define("jsm/util/Location",[],function(){
	"use strict";
	/**
	 * Location Exntesion
	 * @namespace jsm.util
	 * @class Location
	 * @extension Location
	 */
	var location=window.location,params={};
	location.search.substr(1).split("&").forEach(function(pair){
		if(!pair){return;}
		var eq=pair.indexOf("="),name,value;
		if(eq<0){eq=pair.length;}
		name=decodeURIComponent(pair.substr(0,eq));
		value=decodeURIComponent(pair.substr(eq+1));
		if(!params.hasOwnProperty(name)){params[name]=[];}
		params[name].push(value);
	});
	/**
	 * get first matched parameter value from location.search
	 * @method getParameter
	 * @param {Object} name
	 * @return {String|null} parameter string or null if not exists
	 * @example <pre><code>
	 * //if location.search is "?lang=en-US&referrer=http%3A%2F%2Fexample.com%2Findex.html&%E6%B6%88%E6%81%AF=%E4%BD%A0%E5%93%88"
	 * location.getParameter("lang");//"en-US"
	 * location.getParameter("referrer");//"http://example.com/index.html"
	 * location.getParameter("消息");//"你哈"
	 * </code></pre>
	 */
	function getParameter(name){
		return params.hasOwnProperty(name)?params[name][0]:null;
	}
	/**
	 * get all matched parameter values from location.search
	 * @method getParameterValues
	 * @param {Object} name
	 * @return {Array}
	 * @example <pre><code>
	 * //if location.search is "?indices=0&indices=2&indices=3"
	 * location.getParameterValues("indices");//["0","2","3"]
	 * </code></pre>
	 */
	function getParameterValues(name){
		return params.hasOwnProperty(name)?params[name]:[];
	}
	/**
	 * get all matched parameter names from location.search
	 * @method getParameterNames
	 * @return {Array}
	 * @example <pre><code>
	 * //if location.search is "?lastEventId=1399193189032&timeStamp=1399193195025"
	 * location.getParameterNames();//["lastEventId","timeStamp"]
	 * </code></pre>
	 */
	function getParameterNames(){
		return Object.keys(params);
	}
	/**
	 * get all key-valueArray pairs from location.search
	 * @method getParameterMap
	 * @return {Object}
	 * @example <pre><code>
	 * //if location.search is "?indices=0&indices=2&indices=3&lastEventId=1399193189032&timeStamp=1399193195025"
	 * location.getParameterMap();
	 * //{"indices":["0","2","3"],"lastEventId":["1399193189032"],"timeStamp":["1399193195025"]}
	 * </code></pre>
	 */
	function getParameterMap(){
		return params;
	}
	function Location(){
		
	}
	var functions=[
		"getParameter",getParameter,
		"getParameterValues",getParameterValues,
		"getParameterNames",getParameterNames,
		"getParameterMap",getParameterMap
	];
	InstallFunctions(Location.prototype,NONE,functions);
	if(location instanceof Object){
		InstallFunctions(location,NONE,functions);
	}else{
		functions.forEach(function(key,index,array){
			if(index&1){return;}
			location[key]=array[index+1];
		});
	}
	return Location;
});