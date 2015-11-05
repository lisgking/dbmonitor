
jQuery(function($){
	var monthNames="January,February,March,April,May,June,July,August,Septempber,October,November,December".split(","),
		dayNames="Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(",");
		monthAbbrs="Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
		dayAbbrs="Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(","),
		dateAbbrs=("1st,2nd,3rd,4th,5th,6th,7th,8th,9th,10th,11th,12th,13th,14th,15th"+
				",16th,17th,18th,19th,20th,21th,22th,23th,24th,25th,26th,27th,28th,29th,30th,31th").split(",");
	
	function Labelbox(label,name,value){
		var doc=document,lbl,box,txt;
		lbl=doc.createElement("label");
		box=doc.createElement("input");
		box.type="checkbox";
		box.name=name;
		box.value=value;
		txt=doc.createTextNode(label);
		lbl.appendChild(box);
		lbl.appendChild(txt);
		return lbl;
	}
	
	function initData(){
		var context=this;
		/*~~~~~~~~~~~year~~~~~~~~*/
		/*$('select.year_options',context).each(function(index,select){
			var options=select.options,i=new Date().getFullYear(),l=i+10,label,value;
			options.length=0;
			for(;i<l;i++){
				value=i,label=i;
				options.add(new Option(label,value));
			}
		});
		$("p.year_options",context).each(function(index,p){
			var i=new Date().getFullYear(),l=i+10,label,name="year.item",value;
			p.innerHTML="";
			for(;i<l;i++){
				value=i,label=i;
				p.appendChild(new Labelbox(label,name,value));
			}
		});
		$('select[name="year.interval"]',context).each(function(index,select){
			var options=select.options,i,label,value;
			options.length=0;
			for(i=0;i<10;i++){
				value=i+1,label=i+1;
				options.add(new Option(label,value));
			}
		});*/
		/*~~~~~~~~~~~month~~~~~~~~*/
		$('select.month_options',context).each(function(index,select){
			var options=select.options,l=monthAbbrs.length,i,label,value;
			options.length=0;
			for(i=0;i<l;i++){
				value=i+1,label=monthAbbrs[i];
				options.add(new Option(label,value));
			}
		});
		$("p.month_options",context).each(function(index,p){
			var l=monthAbbrs.length,i,label,name="month.item",value;
			p.innerHTML="";
			for(i=0;i<l;i++){
				value=i+1,label=monthAbbrs[i];
				p.appendChild(new Labelbox(label,name,value));
			}
		});
		$('select[name="month.interval"]',context).each(function(index,select){
			var options=select.options,i,label,value;
			options.length=0;
			for(i=0;i<12;i++){
				value=i+1,label=value;
				options.add(new Option(label,value));
			}
		});
		/*~~~~~~~~~~~day of week~~~~~~~~*/
		$("select.day_options",context).each(function(index,select){
			var options=select.options,l=dayAbbrs.length,i,label,value;
			options.length=0;
			for(i=0;i<l;i++){
				value=i+1,label=dayAbbrs[i];
				options.add(new Option(label,value));
			}
		});
		$("p.day_options",context).each(function(index,p){
			var l=dayAbbrs.length,i,label,name="day.item",value;
			p.innerHTML="";
			for(i=0;i<l;i++){
				value=i+1,label=dayAbbrs[i];
				p.appendChild(new Labelbox(label,name,value));
			}
		});
		$('select[name="day.interval"]',context).each(function(index,select){
			var options=select.options,i,label,value;
			options.length=0;
			for(i=0;i<7;i++){
				value=i+1,label=i+1;
				options.add(new Option(label,value));
			}
		});
		/*~~~~~~~~~~~day of month~~~~~~~~*/
		$("select.date_options",context).each(function(index,select){
			var options=select.options,l=dateAbbrs.length,i,label,value;
			options.length=0;
			for(i=0;i<l;i++){
				value=i+1,label=dateAbbrs[i];
				options.add(new Option(label,value));
			}
		});
		$("select.date_options[name='date.to']",context).each(function(index,select){
			var options=select.options,label="L",title="The last day of the month",value="L";
			var option=new Option(label,value);
			option.title=title;
			options.add(option);
		});
		$("p.date_options",context).each(function(index,p){
			var l=dateAbbrs.length,i,label,value;
			p.innerHTML="";
			for(i=0;i<l;i++){
				value=i+1,label=dateAbbrs[i];
				p.appendChild(new Labelbox(label,"date.item",value));
			}
		});
		$('select[name="date.interval"]',context).each(function(index,select){
			var options=select.options,i,label,value;
			options.length=0;
			for(i=0;i<30;i++){
				value=i+1,label=i+1;
				options.add(new Option(label,value));
			}
		});
		/*~~~~~~~~~~~hours~~~~~~~~*/
		var p0=function(s,l){
			s=String(s),l=isFinite(l)?l:2;
			var z=l-s.length;
			return z>0?Array(z+1).join("0")+s:z==0?s:s.substr(z);
		};
		$("select.hours_options",context).each(function(index,select){
			var options=select.options,l=24,i,label,value;
			options.length=0;
			for(i=0;i<l;i++){
				value=i,label=p0(i)+":00";
				options.add(new Option(label,value));
			}
		});
		$("p.hours_options",context).each(function(index,p){
			var l=24,i,label,value;
			p.innerHTML="";
			for(i=0;i<l;i++){
				value=i,label=p0(i)+":00";
				p.appendChild(new Labelbox(label,"hours.item",value));
			}
		});
		$('select[name="hours.interval"]',context).each(function(index,select){
			var options=select.options,l=24,i,label,value;
			options.length=0;
			for(i=0;i<l;i++){
				value=i+1,label=i+1;
				options.add(new Option(label,value));
			}
		});
		/*~~~~~~~~~~~minutes~~~~~~~~*/
		$("select.minutes_options",context).each(function(index,select){
			var options=select.options,l=60,i,label,value;
			options.length=0;
			for(i=0;i<l;i++){
				value=i,label=p0(i);
				options.add(new Option(label,value));
			}
		});
		$("p.minutes_options",context).each(function(index,p){
			var l=60,i,label,value;
			p.innerHTML="";
			for(i=0;i<l;i++){
				value=i,label=p0(i);
				p.appendChild(new Labelbox(label,"minutes.item",value));
			}
		});
		$('select[name="minutes.interval"]',context).each(function(index,select){
			var options=select.options,l=60,i,label,value;
			options.length=0;
			for(i=0;i<l;i++){
				value=i+1,label=i+1;
				options.add(new Option(label,value));
			}
		});
		/*~~~~~~~~~~~seconds~~~~~~~~*/
		$("select.seconds_options",context).each(function(index,select){
			var options=select.options,l=60,i,label,value;
			options.length=0;
			for(i=0;i<l;i++){
				value=i,label=p0(i);
				options.add(new Option(label,value));
			}
		});
		$("p.seconds_options",context).each(function(index,p){
			var l=60,i,label,value;
			p.innerHTML="";
			for(i=0;i<l;i++){
				value=i,label=p0(i);
				p.appendChild(new Labelbox(label,"seconds.item",value));
			}
		});
		$('select[name="seconds.interval"]',context).each(function(index,select){
			var options=select.options,l=60,i,label,value;
			options.length=0;
			for(i=0;i<l;i++){
				value=i+1,label=i+1;
				options.add(new Option(label,value));
			}
		});
	}
	
	function initTabs(){
		var context=this;
		/*$('.year_tabs>label').performTabs({
			prevent:false,
			panels:$('.year_panels>div')
		});*/
		$('.month_tabs>label',context).performTabs({
			prevent:false,
			panels:$('.month_panels>div',context)
		});
		$('.dayordate_tabs>label',context).performTabs({
			prevent:false,
			panels:$('.dayordate_panels>div',context)
		});
		$('.day_tabs>label',context).performTabs({
			prevent:false,
			panels:$('.day_panels>div',context)
		});
		$('.date_tabs>label',context).performTabs({
			prevent:false,
			panels:$('.date_panels>div',context)
		});
		$('.hours_tabs>label',context).performTabs({
			prevent:false,
			panels:$('.hours_panels>div',context)
		});
		$('.minutes_tabs>label',context).performTabs({
			prevent:false,
			panels:$('.minutes_panels>div',context)
		});
		/*$('.seconds_tabs>label').performTabs({
			prevent:false,
			panels:$('.seconds_panels>div')
		});*/
	}
	
	function queryCronExp(){
		var context=this;
		var exp=new CronExp("0","*","*","*","*","?");
		var start,interval,from,to,items;
		//~~~~~minutes~~~~~
		switch($('input[name="minutes.format"]:checked',context).attr("value")){
		case CronExp.EVERY:
			exp.setMinutes("*");
			break;
		case CronExp.INTERVAL:
			start=$('select[name="minutes.start"]',context).val();
			interval=$('select[name="minutes.interval"]',context).val();
			exp.setMinutes(start+"/"+interval);
			break;
		case CronExp.RANGE:
			from=$('select[name="minutes.from"]',context).val();
			to=$('select[name="minutes.to"]',context).val();
			exp.setMinutes(from+"-"+to);
			break;
		case CronExp.VALUES:
			items=$('input[name="minutes.item"]:checked',context).toArray()
				.map(function(input,index){return input.value;});
			if(!items.length){
				return alert("Please specify minute(s)");
			}
			exp.setMinutes(items.join(","));
			break;
		}
		//~~~~~hours~~~~~
		switch($('input[name="hours.format"]:checked',context).attr("value")){
		case CronExp.EVERY:
			exp.setHours("*");
			break;
		case CronExp.INTERVAL:
			start=$('select[name="hours.start"]',context).val();
			interval=$('select[name="hours.interval"]',context).val();
			exp.setHours(start+"/"+interval);
			break;
		case CronExp.RANGE:
			from=$('select[name="hours.from"]',context).val();
			to=$('select[name="hours.to"]',context).val();
			exp.setHours(from+"-"+to);
			break;
		case CronExp.VALUES:
			items=$('input[name="hours.item"]:checked',context).toArray()
				.map(function(input,index){return input.value;});
			if(!items.length){
				return alert("Please specify hour(s)");
			}
			exp.setHours(items.join(","));
			break;
		}
		//~~~~~day or date~~~~~
		var dayOrDate=$('input[name="dayordate"]:checked',context).attr("value");
		if(dayOrDate==="day"){
			exp.setDate("?");
			switch($('input[name="day"]:checked',context).attr("value")){
			case CronExp.EVERY:
				exp.setDay("*");
				break;
			case CronExp.INTERVAL:
				start=$('select[name="day.start"]',context).val();
				interval=$('select[name="day.interval"]',context).val();
				exp.setDay(start+"/"+interval);
				break;
			case CronExp.RANGE:
				from=$('select[name="day.from"]',context).val();
				to=$('select[name="day.to"]',context).val();
				exp.setDay(from+"-"+to);
				break;
			case CronExp.VALUES:
				items=$('input[name="day.item"]:checked',context).toArray()
					.map(function(input,index){return input.value;});
				if(!items.length){
					return alert("Please specify day(s)");
				}
				exp.setDay(items.join(","));
				break;
			}
		}else if(dayOrDate==="date"){
			exp.setDay("?");
			switch($('input[name="date.format"]:checked',context).attr("value")){
			case CronExp.EVERY:
				exp.setDate("*");
				break;
			case CronExp.INTERVAL:
				start=$('select[name="date.start"]',context).val();
				interval=$('select[name="date.interval"]',context).val();
				exp.setDate(start+"/"+interval);
				break;
			case CronExp.RANGE:
				from=$('select[name="date.from"]',context).val();
				to=$('select[name="date.to"]',context).val();
				exp.setDate(from+"-"+to);
				break;
			case CronExp.VALUES:
				items=$('input[name="date.item"]:checked',context).toArray()
					.map(function(input,index){return input.value;});
				if(!items.length){
					return alert("Please specify date(s)");
				}
				exp.setDate(items.join(","));
				break;
			}
		}
		//~~~~~month~~~~~
		switch($('input[name="month.format"]:checked',context).attr("value")){
		case CronExp.EVERY:
			exp.setMonth("*");
			break;
		case CronExp.INTERVAL:
			start=$('select[name="month.start"]',context).val();
			interval=$('select[name="month.interval"]',context).val();
			exp.setMonth(start+"/"+interval);
			break;
		case CronExp.RANGE:
			from=$('select[name="month.from"]',context).val();
			to=$('select[name="month.to"]',context).val();
			exp.setMonth(from+"-"+to);
			break;
		case CronExp.VALUES:
			items=$('input[name="month.item"]:checked',context).toArray()
				.map(function(input,index){return input.value;});
			if(!items.length){
				return alert("Please specify month(s)");
			}
			exp.setMonth(items.join(","));
			break;
		}
		if(exp.toString().length>255){
			return alert("Too long expression, please optimize your options");
		}
		return exp;
	}
	
	function CronExpEditor(options){
		$.extend(this,options);
		var context=this.context;
		initData.call(context);
		initTabs.call(context);
	}
	
	CronExpEditor.prototype={
		constructor:CronExpEditor,
		//~~~~~properties~~~~~
		context:null,
		//~~~~~events~~~~~
		oncreationcomplete:null,
		//methods
		setCronExp:function(str){
			console.log("The new cron exp is "+str);
		},
		queryCronExp:function(){
			return queryCronExp.call(this.context);
		},
		//~~~~~listeners~~~~~
		destroy: function(){
			$(this.context).removeData("cronexpeditor");
		}
	};
	$.fn.performCronExpEditor=function(options){
		var api=this.data("cronexpeditor");
		if(this.length==0){console.warn("Cannot perform CronExpEditor due to empty NodeList");return this;}
		if(api){console.warn("CronExpEditor already initialized");return this;}
		options.context=this[0];
		api=new CronExpEditor(options);
		if(api.initCronExp){api.setCronExp(api.initCronExp);}
		return this.eq(0).data("cronexpeditor",api);
	};
});
