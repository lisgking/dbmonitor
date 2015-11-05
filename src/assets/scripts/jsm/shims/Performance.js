define(function(){
	var window=this;
	//----------------------------------------------------------------
	// [IE 9] normalize performance
	//----------------------------------------------------------------
	if(TypeNameOf(window.performance)==="Performance"){
		if(!window.Performance.prototype.now){
			InstallFunctions(window.Performance.prototype,[
				"now",function now(){
					return Date.now()-this.timing.navigationStart+Math.random().toFixed(10)/10;
				}
			]);
		}
		return window.Performance;
	}
	/**
	 * @namespace jsm.shims
	 * @class Performance
	 * @constructor
	 */
	function Performance(){
		SetProperties(this,READ_ONLY,[
			/**
			 * @attribute timing
			 * @type PerformanceTiming
			 */
			"timing",new PerformanceTiming(),
			/**
			 * @attribute navigation
			 * @type PerformanceNavigation
			 */
			"navigation",new PerformanceNavigation(),
		]);
	}
	InstallFunctions(Performance.prototype,DONT_DELETE,[
		"getEntries",function getEntries(){
			
		},
		"getEntriesByType",function getEntriesByType(type){
			
		},
		"getEntriesByName",function getEntriesByName(name){
			
		},
		"mark",function mark(){
			
		},
		"measure",function measure(){
			
		},
		"clearMarks",function clearMarks(){
			
		},
		"clearMeasures",function clearMeasures(){
			
		},
		/**
		 * @method now
		 * @return {Number}
		 */
		"now",function now(){
			return Date.now()-this.timing.navigationStart+Math.random().toFixed(10)/10;
		}
	]);
	function PerformanceTiming(){
		SetProperties(this,READ_ONLY,[
			"navigationStart",Date.now(),
			"unloadEventStart",1392256760337,
			"unloadEventEnd",1392256760337,
			"redirectStart",0,
			"redirectEnd",0,
			"fetchStart",1392256760337,
			"domainLookupStart",1392256760337,
			"domainLookupEnd",1392256760337,
			"connectStart",1392256760337,
			"connectEnd",1392256760337,
			"secureConnectionStart",1392256760337,
			"requestStart",1392256760337,
			"responseStart",1392256760337,
			"responseEnd",1392256760337,
			"domLoading",1392256760337,
			"domInteractive",1392256760337,
			"domContentLoadedEventStart",1392256760337,
			"domContentLoadedEventEnd",1392256760337,
			"domComplete",1392256760337,
			"loadEventStart",1392256760337,
			"loadEventEnd",1392256760337
		]);
	}
	function PerformanceNavigation(){
		SetProperties(this,READ_ONLY,[
			"redirectCount",0,
			"type",0
		]);
	}
	SetProperties(PerformanceNavigation.prototype,READ_ONLY|DONT_ENUM|DONT_DELETE,[
		"TYPE_NAVIGATE",0,
		"TYPE_RELOAD",1,
		"TYPE_BACK_FORWARD",2,
		"TYPE_RESERVED",255
	]);
	function PerformanceEntry(){
		
	}
	function PerformanceMark(){
		
	}
	function PerformanceMeasure(){
		
	}
	function PerformanceResourceTiming(){
		SetProperties(this,READ_ONLY,[
			"connectEnd",0,
			"connectStart",0,
			"domainLookupEnd",0,
			"domainLookupStart",0,
			"duration",43.00000000012005,
			"entryType","resource",
			"fetchStart",1201.0000000000218,
			"initiatorType","link",
			"name","https://www.w3.org/StyleSheets/TR/W3C-ED.css",
			"redirectEnd",0,
			"redirectStart",0,
			"requestStart",0,
			"responseEnd",1244.0000000001419,
			"responseStart",0,
			"secureConnectionStart",0,
			"startTime",1201.0000000000218
		]);
	}
	InstallFunctions(PerformanceResourceTiming.prototype=Object.create(PerformanceEntry.prototype),DONT_ENUM,[
		"constructor",PerformanceResourceTiming
	]);
	SetProperties(window,DONT_ENUM,[
		"performace",new Performance()
	]);
	return Performance;
});