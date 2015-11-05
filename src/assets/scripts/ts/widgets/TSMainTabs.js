define("ts/widgets/TSMainTabs",[
	"ts/widgets/TSTabs",
	"ts/events/TSChangeEvent",
	"jsm/util/MessageBundle",
	"dojo/text!ts/widgets/htm/TSMainTabs.htm",
	"dojo/css!ts/widgets/css/TSMainTabs.css",
	"dojo/nls!ts/widgets/nls/TSMainTabs.json",
	"jquery"
],function(TSTabs,TSChangeEvent,MessageBundle,htm,css,json,$){
	"use strict";
	//----------------------------------------------------------------
	// TSMainTabs
	//----------------------------------------------------------------
	var __super__=TSTabs.prototype;
	function TSMainTabs(id,initParams){
		__super__.constructor.call(this,id,initParams);
		init.call(this);
	}
	
	function init(){
		//1. 安装预设句柄  ["change","beforechange"]
		InstallEvents(this,["beforechange","change"]);
		//2. 设置selectedIndex属性
		InstallGetterSetter(this,"selectedIndex",
			function get(){                              //2.1. get selectedIndex
				return this.__data__.selectedIndex; 
			},
			function set(v){                            //2.2. set selectedIndex
				var index=v>>>0;                                 //2.2.1让v等于ToUint32(v);
				var tabs=this.roles.getAll("tab");
				if(index<tabs.length&&index!==this.selectedIndex){//2.2.2. 若index有效且不是selectedIndex
					tabs[index].click();                     //2.2.2.1选中目标tab
				}
			}
		);
		InstallGetter(this,"tree",function get(){//set tree as a property of the tabs
			return this.getWidgetsByName("TSResNavTree").item(0);
		});
		InstallGetter(this,"tabs",
			function get(){                              //2.2.3. get tabs 返回所有tab元素
				return this.roles.getAll("tab");
			}
		);
		this.__data__.selectedIndex=0;                //2.3. 根据实际情况设置默认的selectedIndex
		var that=this,
			tabs=this.roles.getAll("tab"),
			panels=this.roles.getAll("tabpanel");
		tabs.forEach(function(tab,index,tabs){
			tabs[index].controls=panels[index];
		});                                        //2.4.? 为每个tab与其对应的tabpanel建立关联
		//3. 为每个tab(或其相关元素)添加click事件监听
		function tab_clickHandler(event){
			event.preventDefault();            //3.1. 阻止默认行为
			var tab=this;
			var oldIndex=that.selectedIndex,   //3.2. 获得 oldIndex
				newIndex=tabs.indexOf(tab);    //3.3. 获得 newIndex
			if(oldIndex===newIndex){return;}   //3.4. 若新旧index相同，返回
			var returnValue=that.dispatchEvent(new TSChangeEvent("beforechange",{
				cancelable:true,
				oldIndex:oldIndex,
				newIndex:newIndex
			}));                                //3.5. 分发beforechange事件
			if(returnValue===false){return;}    //3.6. 若事件被取消，返回
			that.__data__.selectedIndex=newIndex;//3.7. 让private selectedIndex等于newIndex
			tabs[oldIndex].setAttribute("aria-selected",false);         //3.8. 取消旧标签页的选中
			tabs[oldIndex].controls.setAttribute("aria-hidden",true);   //3.9. 隐藏旧标签页对应的内容
			tab.setAttribute("aria-selected",true);                     //3.10. 选中新标签页
			tab.controls.setAttribute("aria-hidden",false);             //3.11. 显示新标签页对应的内容
			that.dispatchEvent(new TSChangeEvent("change",{
				oldIndex:oldIndex,
				newIndex:newIndex
			}));                                //3.12. 分发change事件
		}
		tabs.forEach(function(tab){
			tab.addEventListener("click",tab_clickHandler);
		});
	}
	function back(){
		
	}
	function forward(){
		
	}
	ExtendClass(TSMainTabs,TSTabs);
	InstallFunctions(TSMainTabs.prototype,DONT_ENUM,[
		
	]);
	SetProperties(TSMainTabs.prototype,DONT_ENUM,[
		"template",htm,
		"i18n",new MessageBundle(json,__super__.i18n)
	]);
	SetNativeFlag(TSMainTabs);
	return TSMainTabs;
});