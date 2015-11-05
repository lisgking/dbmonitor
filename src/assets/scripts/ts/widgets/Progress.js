define("ts/widgets/Progress",
	["ts/widgets/TSWidget",
	 "dojo/text!./htm/Progress.htm",
	 "dojo/css!./css/Progress.css",
	 "dojo/nls!./nls/Progress.json"
	],
	function(TSWidget,htm,css,json){
		
	var i18n=TSWidget.prototype.i18n.createBranch(json);
		
	function Progress(name){
		TSWidget.call(this);
		defineProperties.call(this);
		this.setProgressName(name||"");
	}
	
	function defineProperties(){
		//TODO 定义属性
		/*this.__data__.progressValue=0;
		InstallGetterSetter(this,"progressValue",
			function getProgressValue(){
				return this.__data__.progressValue;
			},
			function setProgressValue(v){
				this.__data__.progressValue=v;
			}
		);*/
		
		var progressName="";
		
		var progressValue=0;
		
		this.getProgressValue=function(){
			return progressValue;
		};
		
		this.setProgressValue=function(progressValue){
			var progressbar=this.role("progressbar");
			progressbar.style.width=progressValue+"%";
			progressValue=progressValue;
		};
		
		this.getProgressName=function(){
			return progressName;
		};
		
		this.setProgressName=function(name){
			var progressName=this.role("progressName");
			progressName.innerHTML=name;
			progressName=name;
		};
		
		this.startTime=0;
	}
	
	function refrashProgress(data){
		if(!data)return;
		this.setProgressValue(data);
	}
	
	/**
	 * 
	 * @param {Object} increment (0,100];
	 * @param {Object} refrashTime 1000
	 */
	function start(increment,refrashTime){
		var that=this;
		var increment=increment||1; //
		var endTime=100;
		var refrashTime=refrashTime||1000;
		
		this.count=setInterval(function(){
			if(that.startTime>=endTime){
				clearInterval(that.count);
				that.refrashProgress.call(that,endTime);
				return;
			}
			that.startTime+=increment;
			that.refrashProgress.call(that,that.startTime);
		},refrashTime);
	}
	/**
	 * 
 	 * @param {Object} rate 结束比例
	 */
	function finish(){
		clearInterval(this.count);
		this.setProgressValue(this.startTime);
	}
	
	/**
	 * 
	 * @param {Object} increment
	 * @param {Object} refrashTime
	 */
	function reStart(increment,refrashTime){
		this.startTime=0;
		this.refrashProgress(0);
		clearInterval(this.count);
		this.start(increment,refrashTime);
	}
	
	/**
	 * 
	 * @param {Object} classList
	 */
	function removeAllClass(obj){
		Array.prototype.forEach.call(obj.classList,function(className,index){
			obj.classList.remove(className[index]);
		});
		return obj;
	}
	/**
	 * 
	 * @param {string} color "#d9534f",red
	 */
	function setProgressColor(color){
		var progressbar=this.role("progressbar");
		progressbar.style.backgroundColor=color;
	}
	
	function init(){
		addEventListeners.call(this);
		
	}
	
	function addEventListeners(){
		
	}
	
	ExtendClass(Progress,TSWidget);
	
	SetProperties(Progress.prototype,DONT_ENUM,[
  		"template",htm,
  		"i18n",i18n
  	]);
  	
  	InstallFunctions(Progress.prototype,DONT_DELETE,[
		"init",init,
		"start",start,
		"reStart",reStart,
		"finish",finish,
		"refrashProgress",refrashProgress,
		"setProgressColor",setProgressColor
	]);
  	
  	return Progress;
		
});
