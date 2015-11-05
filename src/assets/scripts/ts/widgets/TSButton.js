define("ts/widgets/TSButton", [ 
        "ts/widgets/TSWidget",
        "dojo/text!./htm/TSButton.htm",
		"dojo/css!./css/TSButton.css"
        ], function(TSWidget,htm, css) {
	"use strict";
	function TSButton(props) {
		TSWidget.call(this);
		SetProperties(this, NONE, [
		/**
		 * @attribute name
		 * @type String
		 */
		"name", "",                           
		/**
		 * @attribute btnName
		 * @type String
		 */
		"buttonName", "",
		/**
		 * @attribute icon
		 * @type String
		 */
		"iconClass", null,
		/**
		 * @attribute click
		 * @type function
		 */
		"click", null

		]);
		ExtendObject(this, props);
		this.init();
	}
	function init(){
		var that = this;
		if(this.click && typeof this.click ==="function"){
			this.roles.get("ts-button").addEventListener("click",function(){
				that.click.call(that,this);
    		});
    	}
		this.roles.get("ts-icon").className = this.iconClass;
		this.roles.get("ts-span").innerText = this.buttonName;
	}
	function disabled(){
		this.roles.get("ts-button").disabled = true;
	}
	function enabled(){
		this.roles.get("ts-button").disabled = false;
	}
	function setVisiable(flag){
		if(flag){
			this.roles.get("ts-button").style.display="inline-block";
		}else{
			this.roles.get("ts-button").style.display="none";
		}
	}
	InstallFunctions(TSButton.prototype,DONT_DELETE,[
           "init",init,
           "disabled",disabled,
           "enabled",enabled,
           "setVisiable",setVisiable
       ]);
	ExtendClass(TSButton,TSWidget);
	SetProperties(TSButton.prototype,DONT_ENUM,[
          "template",htm
      ]);
	return TSButton;
});