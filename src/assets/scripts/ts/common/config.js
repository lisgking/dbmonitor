define([
	"jsm/util/HTMLHttpRequest",
	"dojo/json!./manifest.json",
	"dojo/json!./accept-language.json"
],function(HTMLHttpRequest,manifest,langConfig){
	var request=new HTMLHttpRequest(location);
	//manifest
	request.manifest=manifest;
	//language
	request.acceptLanguages=langConfig.acceptLanguages;
	request.languageConfig=langConfig;
	function normalizeLang(tag){
		var language=tag.substr(0,2);
		var country=tag.substr(3);
		tag=language.toLowerCase();
		if(country){
			tag+="-"+country.toUpperCase();
		}
		return tag;
	}
	function getAcceptLanguage(acceptLanguages){
		var lang=null;
		[
			request.getParameter("lang"),                    //from location, for development(highest priority)
			request.application.getAttribute("lang"),                 //from localStorage, for reloading
			normalizeLang(navigator.language||navigator.userLanguage) //from navigator, for first time access
		].some(function(tag){
			if(tag&&acceptLanguages.indexOf(tag)!==-1){
				lang=normalizeLang(tag);
				return true;
			}
		});
		return lang;
	}
	var lang=getAcceptLanguage(request.acceptLanguages);
	if(lang!==null){
		request.language=lang;
		if(self===top){
			request.application.setAttribute("lang",lang);
		}
		require.config({
			config:{
				"dojo/nls":{
					lang:lang
				}
			}
		});
	}
	//onLine
	if(request.getParameter("onLine")==="false"||location.protocol==="file:"){
		request.onLine=false;
	}else{
		request.onLine=true;
	}
	window.request=request;
	return request;
});