
Math.nextInt=function(m,n){
	var l=arguments.length;
	if(l==0){
		return Math.floor(Math.random()*0x80000000);
	}else if(l==1){
		return Math.floor(Math.random()*m);
	}else if(l==2){
		return Math.floor(Math.random()*(n-m+1)+m);
	}
};
var AlertColor=(function(){
	function Color(value){
		this.value=value||0;
	}
	function AlertColor(value){
		var l=arguments.length;
		if(l==1){
			this.value=value||0;
		}else if(l==3){
			this.setThreshold.apply(this,arguments);
		}
	}
	var p0=function(s,l){
		s=s.toString(16),l=isFinite(l)?l:2;
		var z=l-s.length;
		return z>0?Array(z+1).join("0")+s:z==0?s:s.substr(z);
	};
	Color.prototype={
		constructor:Color,
		toRGB:function(){
			var v=this.value,r=v>>16&0xff,g=v>>8&0xff,b=v&0xff;
			return "rgb("+r+", "+g+", "+b+")";
		},
		toRevert:function(){
			var v=this.value,r=v>>16&0xff,g=v>>8&0xff,b=v&0xff;
			r=0xff-r,g=0xff-g,b=0xff-b,v=(r<<16)+(g<<8)+b;
			return new (this.constructor)(v);
		},
		lighten:function(ratio){
			
		},
		darken:function(ratio){
			
		},
		toHex:function(){
			return "#"+p0(this.value,6);
		},
		toHSL:function(){
			var v=this.value,r=v>>16&0xff,g=v>>8&0xff,b=v&0xff;
			r/=0xff,g/=0xff,b/=0xff;
			var max=Math.max(r,g,b),min=Math.min(r,g,b),h,s,l=(max+min)/2,d;
			if(max==min){
				h=s=0;
			}else{
				d=max-min;
				s=l>0.5?d/(2-max-min):d/(max+min);
				switch(max){
					case r:h=(g-b)/d+(g<b?6:0); break;
					case g:h=(b-r)/d+2; break;
					case b:h=(r-g)/d+4; break;
				}
				h/=6;
			}
			h=h*360|0;
			s=(s*100|0)+"%";
			l=(l*100|0)+"%";
			return "hsl("+h+", "+s+", "+l+")";
		},
		toString:function(){
			return "0x"+p0(this.value,6);
		},
		valueOf:function(){
			return this.value;
		},
		setRed:function(red){
			var v=this.value,r=v>>16&0xff,g=v>>8&0xff,b=v&0xff;
			r=red&0xff;
			this.value=(r<<16)+(g<<8)+b;
		},
		setGreen:function(green){
			var v=this.value,r=v>>16&0xff,g=v>>8&0xff,b=v&0xff;
			g=green&0xff;
			this.value=(r<<16)+(g<<8)+b;
		},
		setBlue:function(blue){
			var v=this.value,r=v>>16&0xff,g=v>>8&0xff,b=v&0xff;
			b=blue&0xff;
			this.value=(r<<16)+(g<<8)+b;
		},
		getRed:function(){
			return this.value>>16&0xff;
		},
		getGreen:function(){
			return this.value>>8&0xff;
		},
		getBlue:function(){
			return this.value&0xff;
		}
	};
	AlertColor.prototype=new Color();
	$.extend(AlertColor.prototype,{
		constructor:AlertColor,
		setThreshold:function(warning,critical,maxCritical){
			this.warning=warning;
			this.critical=critical;
			this.maxCritical=maxCritical;
		},
		getColorByUsage:function(usage){
			var c,warning=this.warning,critical=this.critical,maxCritical=this.maxCritical||1;
			if(usage<warning){
				c=AlertColor.NORMAL;
				c.setRed(Math.floor(usage/warning*0xff));
			}else if(usage<critical){
				c=AlertColor.WARNING;
				c.setGreen(0xff-Math.floor((usage-warning)/(critical-warning)*0x7f));
			}else if(usage<=maxCritical){
				c=AlertColor.CRITICAL;
				c.setRed(0xff-Math.floor((usage-critical)/(maxCritical-critical)*0x7f));
			}else{
				throw new RangeError("Invalid threshold, value should be between 0 and "+maxCritical);
			}
			return c;
		}
	});
	AlertColor.NORMAL=new Color(0x00ff00);
	AlertColor.WARNING=new Color(0xffff00);
	AlertColor.CRITICAL=new Color(0xff0000);
	return AlertColor;
}());

(function($){
	function TileView(options){
		$.extend(true,this,options);
		this.alertColor=new AlertColor(options.warningValue,options.criticalValue,options.maxValue);
	}
	TileView.prototype={
		constructor:TileView,
		ul:null,
		warningValue:0,
		criticalValue:0,
		maxValue:0,
		alertColor:null,
		setNodes:function(nodes){
			var doc=document,ul=this.ul,alertColor=this.alertColor;
			nodes.forEach(function(node,index){
				var disks=node.disks,length=disks.length,disk,
					sqare=Math.ceil(Math.sqrt(length)),
					li=doc.createElement("li"),
					table=doc.createElement("table"),
					span,tooltip,color,parIndex=0,maxlength,
					rows=sqare,cols=sqare,tr,span,i,j;
				table.className="tilegrid";
				table.setAttribute("data-sqare",sqare);
				li.appendChild(table);
				ul.appendChild(li);
				for(i=0;i<rows;i+=1){
					tr=table.insertRow(i);
					for(j=0;j<cols;j+=1){
						td=tr.insertCell(j);
						if(parIndex<length){
							disk=disks[parIndex++];
							maxlength=Math.max.apply(null,Object.keys(disk).map(function(name){return name.length;}));
							tooltip=Object.keys(disk).map(function(name,index,array){
								if(name=="usage"){return p0(name,maxlength)+": "+disk[name]+"%";}
								return p0(name,maxlength)+": "+disk[name];
							}).join("\n");
							color=alertColor.getColorByUsage(disk.usage);
							td.title=tooltip;
							td.style.backgroundColor=color.toHex();
							
							span=doc.createElement("span"),td.appendChild(span);
							span.style.color=color.toRevert().toHex();
							span.innerHTML=disk.usage+"%";
							span.className="usage";
						}else{
							if(i==0){td.innerHTML="&nbsp;";}
							td.className="empty";
						}
					}
				}
			});
		}
	};
	function p0(s,l){
		s=String(s),l=isFinite(l)?l:2;
		var z=l-s.length;
		return z>0?s+Array(z+1).join(" "):z==0?s:s.substr(l);
	};
	$.fn.performTileView=function(options){
		var api=this.data("tileview");
		if(this.length!==1){console.warn("Cannot perform Tabs due to empty list or multiple elements");return this;}
		if(api){console.warn("tileview already initialized");return this;}
		options.ul=this[0],api=new TileView(options);
		return this.data("tileview",api);
	};
}(jQuery));

jQuery(function($){
	var nodes=[
		{
			disks:[{"deviceType":"1","partitionName":"sdb1","partitionTypeId":"83","vmPcId":"vm191"},{"deviceType":"1","partitionName":"sdb2","partitionTypeId":"83","physicalDiskName":"","vmPcId":"vm191"},{"deviceType":"1","partitionName":"sdb3","partitionTypeId":"83","physicalDiskName":"","vmPcId":"vm191"},{"deviceType":"1","partitionName":"sdb4","partitionTypeId":"83","physicalDiskName":"","vmPcId":"vm191"},{"deviceType":"1","partitionName":"sdb5","partitionTypeId":"83","physicalDiskName":"","vmPcId":"vm191"}]
		},
		{
			disks:[{"deviceType":"1","partitionName":"sdb1","partitionTypeId":"83","physicalDiskName":"","vmPcId":"vm192"},{"deviceType":"1","partitionName":"sdb2","partitionTypeId":"83","physicalDiskName":"","vmPcId":"vm192"},{"deviceType":"1","partitionName":"sdb3","partitionTypeId":"83","physicalDiskName":"","vmPcId":"vm192"}]
		},
		{
			disks:[{"deviceType":"1","partitionName":"sdb1","partitionTypeId":"83","physicalDiskName":"","vmPcId":"vm193"},{"deviceType":"1","partitionName":"sdb2","partitionTypeId":"83","physicalDiskName":"","vmPcId":"vm193"},{"deviceType":"1","partitionName":"sdb3","partitionTypeId":"83","physicalDiskName":"","vmPcId":"vm193"}]
		}
	];
	nodes.forEach(function(node){
		node.disks.forEach(function(disk){
			disk.usage=Math.nextInt(100);
		});
	});
	var tileview=$("#disk_tileview").performTileView({
		warningValue:50,
		criticalValue:75,
		maxValue:100
	}).data("tileview");
	tileview.setNodes(nodes);
	//pie
	$(".pie[data-percent]").each(function(index,elem){
		this.innerHTML='<span class="before"></span><span class="after"></span>';
		var pie=$(this),
			before=$(".before",pie),
			after=$(".after",pie),
			per=pie.attr("data-percent")|0,
			deg=per*3.6;
		if(per>50){
			pie.addClass("big");
		}
		if(per<50){
			pie.addClass("normal");
		}else if(per<75){
			pie.addClass("warning");
		}else if(per<=100){
			pie.addClass("critical");
		}
		before.css("transform","rotate("+(deg)+"deg)");
	});
});
