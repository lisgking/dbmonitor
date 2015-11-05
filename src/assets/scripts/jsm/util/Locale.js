define("jsm/util/Locale",[
	"dojo/json!./locales/availableLocales.json",
	"dojo/json!./locales/ISOLanguages.json",
	"dojo/json!./locales/ISOCountries.json"
],function(availableLocales,ISOLanguages,ISOCountries){
	var mappedLocales=Object.create(null);
	var cahcedLocales=null;
	availableLocales.forEach(function(locale){
		mappedLocales[locale.tag]=locale;
	});
	function Locale(language,country){
		this.language=language;
		this.country=country;
		InstallGetter(this,"languageTag",function(){
			if(this.country){
				return this.language+"-"+this.country;
			}else{
				return this.language;
			}
		});
		InstallGetter(this,"displayName",function(){
			var data=mappedLocales[this.languageTag];
			if(!data){return "";}
			return data.name;
		});
		/*InstallGetter(this,"displayCountry",function(){
			var data=mappedLocales[this.languageTag];
			if(!data){return "";}
			return data.country;
		});
		InstallGetter(this,"displayLanguage",function(){
			var data=mappedLocales[this.languageTag];
			if(!data){return "";}
			return data.language;
		});*/
	}
	"public";
	function toString(){
		if(this.country){
			return this.language+"_"+this.country;
		}else{
			return this.language;
		}
	}
	function equals(that){
		if(!(that instanceof Locale)){return false;}
		return this.language===that.language&&
			this.country===that.country;
	}
	function compareTo(that){
		var re=this.language.localeCompare(that.language);
		if(re===0){
			re=this.country.localeCompare(that.country);
		}
		return re;
	}
	function clone(){
		return new Locale(this.language,this.country);
	}
	InstallFunctions(Locale.prototype,DONT_ENUM,[
		"toString",toString,
		"equals",equals,
		"compareTo",compareTo,
		"clone",clone
	]);
	"public static";
	function getAvailableLocales(){
		if(!cahcedLocales){
			cahcedLocales=availableLocales.map(function(data){
				return forLanguageTag(data.tag);
			});
		}
		return cahcedLocales;
	}
	function getISOLanguages(){
		return ISOLanguages;
	}
	function getISOCountries(){
		return ISOCountries;
	}
	function forLanguageTag(tag){
		if(!tag){throw new TypeError("Invalid tag "+tag);}
		if(typeof tag!=="function"){tag=String(tag);}
		var m=tag.match(/^([A-Za-z]+)(-([A-Za-z]+))?$/);
		if(!m){return null;}
		var LANG=1,CTRY=3;
		var language=m[LANG],
			country=m[CTRY]||"";
		return new Locale(language,country);
	}
	InstallFunctions(Locale,DONT_ENUM,[
		"getAvailableLocales",getAvailableLocales,
		"getISOLanguages",getISOLanguages,
		"getISOCountries",getISOCountries,
		"forLanguageTag",forLanguageTag
	]);
	return Locale;
});
