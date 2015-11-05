var CronExp=(function(){
	function CronExp(){
		this.length=0;
		Array.prototype.push.apply(this,["*","*","*","*","*","*"]);
		Array.prototype.forEach.call(arguments,function(v,i){this[i]=v;},this);
		this.clean();
	}
	
	Object.defineProperties(CronExp.prototype,{
		clean:{value:function(){Array.prototype.splice.call(this,6,this.length-6);}},
		toString:{value:function(){this.clean();return Array.prototype.join.call(this," ");}},
		toLocaleString:function(){},
		setSeconds:{value:function(v){this[0]=v;}},
		setMinutes:{value:function(v){this[1]=v;}},
		setHours:{value:function(v){this[2]=v;}},
		setDate:{value:function(v){this[3]=v;}},
		setMonth:{value:function(v){this[4]=v;}},
		setDay:{value:function(v){this[5]=v;}}
	});
	Object.defineProperties(CronExp,{
		EVERY:{value:"*"},
		INTERVAL:{value:"/"},
		RANGE:{value:"-"},
		VALUES:{value:","}
	});
	return CronExp;
}());
(function(CronExp){
	var monthNames=",January,Februry,March,April,May,June,July,August,September,October,November,December".split(","),
		monthAbbrs=[],
		monthIndexs={};
	monthNames.forEach(function(v,i,a){
		if(i==0){return;}
		v=v.substr(0,3);
		monthIndexs[v.toUpperCase()]=i;
		monthIndexs[i]=i;
		monthAbbrs[i]=v;
		monthAbbrs[v.toUpperCase()]=v;
	});
	function toClassCase(s){return s.substr(0,1).toUpperCase()+s.substr(1).toLowerCase();}
	function toUpperCase(s){return s.toUpperCase();}
	function format(str,args){
		args=(args instanceof Object)?args:Array.prototype.slice.call(arguments,1);
		return String(str).replace(/\{(\w+)\}/g,function(exp,key){return key in args?args[key]:exp;});
	}
	function translateMonthName(s){return monthAbbrs[s.toUpperCase()];}
	function translatMonth(s,msg){
		var items,last;
		if(s=="*"){
			return "every month";
		}else if(s.indexOf("-")>0){
			items=s.split("-").map(translateMonthName);
			return format("month from {0} to {1}",items);
		}else if(s.indexOf("/")>0){
			items=s.split("/");
			items[0]=translateMonthName(items[0]);
			return format("every {1} month(s) start from {0}",items);
		}else if(s.indexOf(",")>0){
			items=s.split(",").map(toUpperCase);
			items.sort(function(a,b){return monthIndexs[a]>monthIndexs[b]?1:-1;});
			items=items.map(translateMonthName);
			last=items.pop();
			last=items.join(" ")+" or "+last;
			return format("months at {0}",last);
		}else if(s.match(/^\w+$/)){
			return translateMonthName(s);
		}
		return "unknown month";
	}
	return translatMonth;
}(CronExp));
