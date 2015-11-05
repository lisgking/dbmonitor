define([],function(){

	if(!String.prototype.repeat){
		InstallFunctions(String.prototype,DONT_ENUM,[
			"repeat",function repeat(t){
				t=+t;
				if(!t){throw new RangeError("Invalid count value");}
				var s=this,r="";
				while(true) {
					if(t&1)
						r+=s;
					t>>=1;
					if(t===0)
						return r;
					s+=s;
				}
				return s;
			}
		]);
	}
	
	var nore=function(){
		return "";
	};
	var	pad=function(num,len){
		num+="";
		len=len>>>0||2;
		var off=len-num.length;
		return (off>0?"0".repeat(off):"")+num;
	};
	var i18n={
		ampmMarker:["AM","PM"],
		eraDesignator:["BC","AD"],
		shortDayNames:["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		dayNames:["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		shortMonthNames:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		monthNames:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
	};
	var replacers={
		G:function(d,u){return i18n.eraDesignator[((u?d.getUTCFullYear():d.getFullYear())>0)+1];},
		yy:function(d,u){return (u?d.getUTCFullYear():d.getFullYear()).toString().substr(-2);},
		yyyy:function(d,u){return pad(u?d.getUTCFullYear():d.getFullYear(),4);},
		YY:nore,
		YYYY:nore,
		M:function(d,u){return (u?d.getUTCMonth():d.getMonth())+1;},
		MM:function(d,u){return pad((u?d.getUTCMonth():d.getMonth())+1,2);},
		MMM:function(d,u){return i18n.shortMonthNames[u?d.getUTCMonth():d.getMonth()];},
		MMMM:function(d,u){return i18n.monthNames[u?d.getUTCMonth():d.getMonth()];},
		w:nore,
		W:nore,
		D:nore,
		d:function(d,u){return u?d.getUTCDate():d.getDate();},
		dd:function(d,u){return pad(u?d.getUTCDate():d.getDate(),2);},
		ddd:function(d,u){return i18n.shortDayNames[u?d.getUTCDate():d.getDate()];},
		dddd:function(d,u){return i18n.dayNames[u?d.getUTCDate():d.getDate()];},
		F:nore,
		E:function(d,u){return i18n.shortDayNames[u?d.getUTCDay():d.getDay()];},
		u:function(d,u){return (u?d.getUTCDay():d.getDay())+1;},
		a:function(d,u){return i18n.ampmMarker[((u?d.getUTCHours():d.getHours())>11)+0];},
		H:function(d,u){return u?d.getUTCHours():d.getHours();},
		HH:function(d,u){return pad(u?d.getUTCHours():d.getHours(),2);},
		k:function(d,u){var n=(u?d.getUTCHours():d.getHours());if(n===0){n=24;};return n;},
		kk:function(d,u){var n=(u?d.getUTCHours():d.getHours());if(n===0){n=24;};return pad(n,2);},
		K:function(d,u){return (u?d.getUTCHours():d.getHours())%12;},
		KK:function(d,u){return pad((u?d.getUTCHours():d.getHours())%12,2);},
		h:function(d,u){var n=(u?d.getUTCHours():d.getHours());n%=12;if(n===0){n=12;};return n;},
		hh:function(d,u){var n=(u?d.getUTCHours():d.getHours());n%=12;if(n===0){n=12;};return pad(n,2);},
		m:function(d,u){return u?d.getUTCMinutes():d.getMinutes();},
		mm:function(d,u){return pad(u?d.getUTCMinutes():d.getMinutes(),2);},
		s:function(d,u){return u?d.getUTCSeconds():d.getSeconds();},
		ss:function(d,u){return pad(u?d.getUTCSeconds():d.getSeconds(),2);},
		S:function(d,u){return u?d.getUTCMilliseconds():d.getMilliseconds();},
		SS:function(d,u){return pad((u?d.getUTCMilliseconds():d.getMilliseconds())/10>>>0,2);},
		SSS:function(d,u){return pad(u?d.getUTCMilliseconds():d.getMilliseconds(),3);},
		z:function(d,u){
			if(u){return "GMT";}
			var t=-d.getTimezoneOffset()*60*1000,
				off=new Date(t);
			return "GMT"+(t<0?"-":"+")+pad(off.getUTCHours(),2)+":"+pad(off.getUTCMinutes(),2);
		},
		Z:function(d,u){
			var t=-d.getTimezoneOffset()*60*1000,
				off=new Date(t);
			return (t<0?"-":"+")+pad(off.getUTCHours(),2)+pad(off.getUTCMinutes(),2);
		},
		X:nore
	};
	var posibbleValues={
		nu:["arab", "arabext", "bali", "beng", "deva", "fullwide", "gujr", "guru", "hanidec", "khmr", "knda", "laoo",
				"latn", "limb", "mlym", "mong", "mymr", "orya", "tamldec", "telu", "thai", "tibt"],
		ca:["buddhist", "chinese", "coptic", "ethioaa", "ethiopic", "gregory", "hebrew", "indian", "islamic",
				"islamicc", "iso8601", "japanese", "persian", "roc"],
		
		localeMatcher:["lookup","best fit"],
		formatMatcher:["lookup","best fit"],
		timeZone:["UTC"],
		hour12:[true,false],
		
		weekday:["narrow", "short", "long"],
		era:["narrow", "short", "long"],
		year:["numeric", "2-digit"],
		month:["numeric", "2-digit","narrow", "short", "long"],
		day:["numeric", "2-digit"],
		hour:["numeric", "2-digit"],
		minute:["numeric", "2-digit"],
		second:["numeric", "2-digit"],
		timeZoneName:["short", "long"]
	};
	/**
	 * @class DateFormat
	 * @constructor
	 * @param {String} pattern
	 */
	function DateFormat(pattern){
		Object.defineProperties(this,{
			"pattern":{value:pattern}
		});
	}
	Object.defineProperties(DateFormat,{
		"DEFAULT":{value:"yyyy-MM-dd HH:mm:ss"},
		"UTC":{value:"E, dd MMM yyyy HH:mm:ss z"},
		"ISO":{value:"yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"}
	});
	DateFormat.replacers=replacers;
	DateFormat.regex=buildRegExp();
	
	function buildRegExp(){
		var sRegex="('[^']*'|"+Object.keys(DateFormat.replacers).sort(function(a,b){return b.length-a.length;}).join("|")+")";
		return new RegExp(sRegex,"g");
	}
	
	/*function registerReplacer(expr,func){
		if(typeof func!=="function"){
			throw new TypeError(func+" is not a function");
		}
		DateFormat.replacers[expr]=func;
	}
	function registerReplacers(map){
		Object.keys(map).forEach(function(key){
			this[key]=map[key];
		},DateFormat.replacers);
	}
	[
		"registerReplacer",registerReplacer,
		"registerReplacers",registerReplacers
	].forEach(function(v,i,a){
		if(i&1){this[a[i-1]]=v;}
	},DateFormat);*/
	/**
	 * 
	 * @param {Date} date
	 * @param {Object} [options]
	 */
	function format(date,options) {
		if(!(date instanceof Date)){
			throw new TypeError("Invalid date '"+date+"'");
		}
		
		var utc=false;
		if(typeof options==="boolean"){utc=options;}
		else if(typeof object==="boolean"){utc=!!options.utc;}
		var replacers=DateFormat.replacers;
		return this.pattern.replace(DateFormat.regex,function(key,index,input){
			if(key.charAt(0)==="'"){
				return key.slice(1,-1);
			}else if(replacers.hasOwnProperty(key)){
				return replacers[key](date,utc,key);
			}else{
				return key;
			}
		});
	}
	function parse(source) {
		
	}
	[
		"format",format,
		"parse",parse
	].forEach(function(v,i,a){
		if(i&1){this[a[i-1]]=v;}
	},DateFormat.prototype);
	return DateFormat;
});
