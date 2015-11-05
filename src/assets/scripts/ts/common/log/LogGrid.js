define("ts/common/log/LogGrid",
    ["ts/widgets/TSDataGrid",
     "ts/widgets/TSGridColumn",
     "ts/widgets/TSSearch",
     "ts/widgets/TSSelect",
     "ts/events/TSEvent",
     "ts/util/Format",
 	 "./LogService",
	 "./operators!",
	 "dojo/json!./entity-actions-mapping.json",
     "dojo/text!./htm/LogGrid.htm",
     "dojo/nls!./nls/Log.json"],
    function(TSDataGrid,TSGridColumn,TSSearch,TSSelect,TSEvent,Format,LogService,usersPage,
    		mapping,htm,json){
    'use strict';
    var i18n=TSDataGrid.prototype.i18n.createBranch(json,"LogList"),
        ajax_errorHandler=function(error){Dialog.alertAsync(i18n.getMessage("AJAX_ERROR",error));},
        rest_errorHandler=function(error){Dialog.alertAsync(i18n.getMessage("REST_ERROR",error));};
    
    function LogGrid(opts){
    	this.opts=opts;
        TSDataGrid.call(this);
        defineProperties.call(this);
        addEventListeners.call(this);
    }
    
  //users
	function getUserOptionsByPage(page){
		return page.rows.map(function(account){
			return {value:account.userId,key:account.userName+" ("+account.userId+")"};
		});
	}
	//typed actions
	function getActionOptionsByType(type){
		if(!mapping.hasOwnProperty(type)){
			return [];
		}
		
		return mapping[type].map(function(action){
			return {value:action,key:i18n.getMessage(type+"#"+action)};
		});
	}
	
	//entity types
	function getEntityTypeOptions(type){
		var specificMapping=null;
		if(Array.isArray(type)){
			specificMapping={};
			type.forEach(function(type){
				specificMapping[type]=mapping[type];
			});
		}else{
			specificMapping=mapping;
		}
		return Object.keys(specificMapping).map(function(type){
			return {value:type,key:i18n.getMessage(type)};
		});
	}
    
    function defineProperties(){
    	$.post("/CommonAction.do?method=getMessages",function(data){
    		i18n.mixin(data);
		});
        var that=this;
        var userName,
            operationType,
            entityType,
            entityName,
            operationResult,
            operationTime;
        
        function userNameHeader(){
    		var span=document.createElement("span");
    		span.innerHTML=i18n.getMessage("userName");
    		var options=getUserOptionsByPage(usersPage);
    		var select=new TSSelect();
    	    select.init(options);
    		var selectDom=select.role("searchSelelct");
    		selectDom.addEventListener("change",function(){
    			if(this.value){
    				that.dataProvider.condition["userId"]=this.value;
    			}else{
    				delete that.dataProvider.condition["userId"];
    			}
    			that.reload();
    		});
    		select.placeAt(span,"beforeEnd");
    		return span;
    	}
        
        function operationTypeHeader(){
    		var span=document.createElement("span");
    		span.innerHTML=i18n.getMessage("operationType");
    		var options=getActionOptionsByType(that.opts.entityType);
    		var select=new TSSelect();
    		select.init(options);
    		var selectDom=select.role("searchSelelct");
    		selectDom.addEventListener("change",function(){
    			if(this.value){
    				that.dataProvider.condition["operationType"]=this.value;
    			}else{
    				delete that.dataProvider.condition["operationType"];
    			}
    			that.reload();
    		});
    		select.placeAt(span,"beforeEnd");
    		return span;
    	}
        
        function entityTypeHeader(){
    		var span=document.createElement("span");
    		span.innerHTML=i18n.getMessage("entityType");
    		if(that.opts.entityType)return span;
    		var options=getEntityTypeOptions(that.opts.entityType);
    		var select=new TSSelect();
    		select.init(options);
    		var selectDom=select.role("searchSelelct");
    		selectDom.addEventListener("change",function(){
    			if(this.value){
    				that.dataProvider.condition["entityType"]=this.value;
    			}else{
    				delete that.dataProvider.condition["entityType"];
    			}
    			that.reload();
    		});
    		select.placeAt(span,"beforeEnd");
    		return span;
    	}
        
        var options=[{value:"0",key:i18n.getMessage("UNKNOWN")},
         			{value:"1",key:i18n.getMessage("DONE")},
         			{value:"2",key:i18n.getMessage("FAIL")}];
        
        function opertionResultHeader(){
    		var span=document.createElement("span");
    		span.innerHTML=i18n.getMessage("operationResult");
    		var select=new TSSelect();
    		select.init(options);
    		var selectDom=select.role("searchSelelct");
    		selectDom.addEventListener("change",function(){
    			if(this.value){
    				that.dataProvider.condition["operationResult"]=this.value;
    			}else{
    				delete that.dataProvider.condition["operationResult"];
    			}
    			that.reload();
    		});
    		select.placeAt(span,"beforeEnd");
    		return span;
    	}
  
        userName=new TSGridColumn({
            dataField:"userName",
            headerElement:userNameHeader(),
            labelFunction:function(value){
			return value.userName?value.userName+" ("+value.userId+")":"";
			},
            width:250
        });
        operationType=new TSGridColumn({
            dataField:"operationType",
           /* headerElement:operationTypeHeader(),*/
            headerText:i18n.getMessage("operationType"),
            labelFunction:function(value){
				var key=value.entityType+"#"+value.operationType;
				var val=i18n.getMessage(key);
				if(val===key){
					val=i18n.getMessage(value.operationType);
				}
				return val;
			},
            width:130
        });
      //typed logs
	
        entityType=new TSGridColumn({
              dataField:"entityType",
              headerElement:entityTypeHeader(),
              labelFunction:function(value){
			      return i18n.getMessage(value.entityType);
			  },
            width:130
         });
		
       entityName=new TSGridColumn({
              dataField:"entityName",
              headerText:i18n.getMessage("entityName"),
              labelFunction:function(value){
                  return i18n.getMessage(value.entityName);
              },
              width:230
        });
        operationResult=new TSGridColumn({
            dataField:"operationResult",
            headerElement:opertionResultHeader(),
            labelFunction:function(value){
				return i18n.getMessage(value.operationResult?options[value.operationResult].key:"UNKNOWN");
			},
            width:130
        });
        operationTime=new TSGridColumn({
            dataField:"operationTime",
            headerText:i18n.getMessage("operationTime"),
            labelFunction:function(value){
				return Format.toDateString(value.operationTime);
			},
            width:230
        });
        this.columns=[userName,
                      operationType,
                      entityType,
                      entityName,
                      operationResult,
                      operationTime];
        this.usePager=true;
        this.checkable=false;
        this.showToolbar=false;
        this.showFooter=true;
        this.showSearchRow=false;
        this.dispatchEvent(new TSEvent("removeShowContextMenu"));
    }
    function addEventListeners() {
        var that=this;
        this.addEventListener("refreshData",function(e){
            that.loadData();
        });
        this.addEventListener("DOMNodeInserted",function(e){
         	that.loadData();
        })
    }
  
    function loadData() {
        var url=this.opts.url?this.opts.url:request.concatParameters(request.getResourceURL("GET/log-list"),{method:"list"});
        this.dataProvider.condition={entityType:this.opts.entityType};
        this.dataProvider.params = this.opts.params;
        this.load(url);
    }

    ExtendClass(LogGrid,TSDataGrid);

    SetProperties(LogGrid.prototype,DONT_ENUM,[
        "i18n",i18n,
        "template",htm
    ]);
    InstallFunctions(LogGrid.prototype,NONE,[
        "loadData",loadData,
    ]);

      return LogGrid;
});
