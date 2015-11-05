define("ts/common/SetupLparTrustForm",
	["ts/widgets/TSFormTest",
    "dojo/text!ts/common/SetupLparTrustForm.html",
    "dojo/css!ts/common/SetupLparTrustForm.css",
    "dojo/nls!ts/common/dataCenter.json"],
    function(TSFormTest,html,css,json){
    	
    var i18n=TSFormTest.prototype.i18n.createBranch(json);
    function SetupLparTrustForm(opts){
    	TSFormTest.call(this);
    	this.opts=opts;
    	defineProperties.call(this);
    	addEventListeners.call(this);
    	init.call(this);
    }
    
    function defineProperties(){
    	
    	var adapters=this.get("netCardInfo")
    	InstallGetter(this,"adapters",
            function(){
                return adapters;
            }
        );
    }
    
    function addEventListeners(){
    	var self=this;
    	var opts=this.opts;
    	
    	this.role("submit").addEventListener("click",function(e){
    		if(!self.isValid()){
                return ;
            }
            var currData = self.getFormData4EncryptPassword();
            currData.lparInfo = opts.data;
            $.post(opts.url+'?method=setupTrust', currData, function(data){
                if(data.flag==1){
                    if(opts.gridWidget){
                    	opts.gridWidget.reload();
                    }
                    Dialog.close();
                    Dialog.alert(i18n.getMsg('successfully configured SSH trust relationship between partitions'));
                }
            });
    	});
    	
    	this.role("cancel").addEventListener("click",function(e){
    		Dialog.close();
    	});
    }
    
     function init(){
	   	initAdapterValue.call(this);
    }
    
    function initAdapterValue(){
    	var self=this;
    	var opts=this.opts;
    	var adapters=this.adapters;
    	$.post(opts.url+"?method=getLparNetworkCardList", opts.data, function(data){
            if(data && Array.isArray(data)){
            	var networkCards=[];
                data[0].networkCardPOList.forEach(function(item){
                	networkCards.push({text:item.netCard,value:item});
                });
                adapters.load(networkCards);
            }
        });
    }
    
    ExtendClass(SetupLparTrustForm,TSFormTest);
    
    SetProperties(SetupLparTrustForm.prototype,DONT_ENUM,[
        "template",html,
        "i18n",i18n
    ]);
    
    return SetupLparTrustForm;
		
});
