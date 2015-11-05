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
	/*~~~~~~~~~~~year~~~~~~~~*/
	/*$('select.year_options').each(function(index,select){
		var options=select.options,i=new Date().getFullYear(),l=i+10,label,value;
		options.length=0;
		for(;i<l;i++){
			value=i,label=i;
			options.add(new Option(label,value));
		}
	});
	$("p.year_options").each(function(index,p){
		var i=new Date().getFullYear(),l=i+10,label,name="year.item",value;
		p.innerHTML="";
		for(;i<l;i++){
			value=i,label=i;
			p.appendChild(new Labelbox(label,name,value));
		}
	});
	$('select[name="year.interval"]').each(function(index,select){
		var options=select.options,i,label,value;
		options.length=0;
		for(i=0;i<10;i++){
			value=i+1,label=i+1;
			options.add(new Option(label,value));
		}
	});*/
	/*~~~~~~~~~~~month~~~~~~~~*/
	$('select.month_options').each(function(index,select){
		var options=select.options,l=monthAbbrs.length,i,label,value;
		options.length=0;
		for(i=0;i<l;i++){
			value=i+1,label=monthAbbrs[i];
			options.add(new Option(label,value));
		}
	});
	$("p.month_options").each(function(index,p){
		var l=monthAbbrs.length,i,label,name="month.item",value;
		p.innerHTML="";
		for(i=0;i<l;i++){
			value=i+1,label=monthAbbrs[i];
			p.appendChild(new Labelbox(label,name,value));
		}
	});
	$('select[name="month.interval"]').each(function(index,select){
		var options=select.options,i,label,value;
		options.length=0;
		for(i=0;i<12;i++){
			value=i+1,label=value;
			options.add(new Option(label,value));
		}
	});
	/*~~~~~~~~~~~day of week~~~~~~~~*/
	$("select.day_options").each(function(index,select){
		var options=select.options,l=dayAbbrs.length,i,label,value;
		options.length=0;
		for(i=0;i<l;i++){
			value=i+1,label=dayAbbrs[i];
			options.add(new Option(label,value));
		}
	});
	$("p.day_options").each(function(index,p){
		var l=dayAbbrs.length,i,label,name="day.item",value;
		p.innerHTML="";
		for(i=0;i<l;i++){
			value=i+1,label=dayAbbrs[i];
			p.appendChild(new Labelbox(label,name,value));
		}
	});
	$('select[name="day.interval"]').each(function(index,select){
		var options=select.options,i,label,value;
		options.length=0;
		for(i=0;i<7;i++){
			value=i+1,label=i+1;
			options.add(new Option(label,value));
		}
	});
	/*~~~~~~~~~~~day of month~~~~~~~~*/
	$("select.date_options").each(function(index,select){
		var options=select.options,l=dateAbbrs.length,i,label,value;
		options.length=0;
		for(i=0;i<l;i++){
			value=i+1,label=dateAbbrs[i];
			options.add(new Option(label,value));
		}
	});
	$("select.date_options[name='date.to']").each(function(index,select){
		var options=select.options,label="L",title="The last day of the month",value="L";
		var option=new Option(label,value);
		option.title=title;
		options.add(option);
	});
	$("p.date_options").each(function(index,p){
		var l=dateAbbrs.length,i,label,value;
		p.innerHTML="";
		for(i=0;i<l;i++){
			value=i+1,label=dateAbbrs[i];
			p.appendChild(new Labelbox(label,"date.item",value));
		}
	});
	$('select[name="date.interval"]').each(function(index,select){
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
	$("select.hours_options").each(function(index,select){
		var options=select.options,l=24,i,label,value;
		options.length=0;
		for(i=0;i<l;i++){
			value=i,label=p0(i)+":00";
			options.add(new Option(label,value));
		}
	});
	$("p.hours_options").each(function(index,p){
		var l=24,i,label,value;
		p.innerHTML="";
		for(i=0;i<l;i++){
			value=i,label=p0(i)+":00";
			p.appendChild(new Labelbox(label,"hours.item",value));
		}
	});
	$('select[name="hours.interval"]').each(function(index,select){
		var options=select.options,l=24,i,label,value;
		options.length=0;
		for(i=0;i<l;i++){
			value=i+1,label=i+1;
			options.add(new Option(label,value));
		}
	});
	/*~~~~~~~~~~~minutes~~~~~~~~*/
	$("select.minutes_options").each(function(index,select){
		var options=select.options,l=60,i,label,value;
		options.length=0;
		for(i=0;i<l;i++){
			value=i,label=p0(i);
			options.add(new Option(label,value));
		}
	});
	$("p.minutes_options").each(function(index,p){
		var l=60,i,label,value;
		p.innerHTML="";
		for(i=0;i<l;i++){
			value=i,label=p0(i);
			p.appendChild(new Labelbox(label,"minutes.item",value));
		}
	});
	$('select[name="minutes.interval"]').each(function(index,select){
		var options=select.options,l=60,i,label,value;
		options.length=0;
		for(i=0;i<l;i++){
			value=i+1,label=i+1;
			options.add(new Option(label,value));
		}
	});
	/*~~~~~~~~~~~seconds~~~~~~~~*/
	$("select.seconds_options").each(function(index,select){
		var options=select.options,l=60,i,label,value;
		options.length=0;
		for(i=0;i<l;i++){
			value=i,label=p0(i);
			options.add(new Option(label,value));
		}
	});
	$("p.seconds_options").each(function(index,p){
		var l=60,i,label,value;
		p.innerHTML="";
		for(i=0;i<l;i++){
			value=i,label=p0(i);
			p.appendChild(new Labelbox(label,"seconds.item",value));
		}
	});
	$('select[name="seconds.interval"]').each(function(index,select){
		var options=select.options,l=60,i,label,value;
		options.length=0;
		for(i=0;i<l;i++){
			value=i+1,label=i+1;
			options.add(new Option(label,value));
		}
	});
	/*~~~~~~~~~~~default cron expression~~~~~~~~*/
	//$("#cronexp").prop("value","0 15 10 * * ?");
});
