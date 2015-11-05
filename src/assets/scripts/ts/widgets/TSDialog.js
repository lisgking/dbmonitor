define("ts/widgets/TSDialog",[
	"ts/widgets/TSWidget",
	"jsm/widgets/Dialog",
	"jsm/util/MessageBundle",
	"dojo/css!./css/TSDialog.css",
	"dojo/css!./css/TSOverlay.css",
	"jquery"
],function(TSWidget,Dialog,MessageBundle,css,css2,$){
	"use strict";
	var __super__=TSWidget.prototype;
	/**
	 * @namespace ts.widgets
	 * @class TSDialog
	 * @extends ts.widgets.TSWidget
	 */
	function TSDialog(id,initParams){
		__super__.constructor.call(this,id,initParams);
		init.call(this);
	}
	function init(){
		var that=this;
		function closeIfEsc(event){
			if(event.keyCode===27){
				that.close();
			}
		}
		/**
		 * @attribute visible
		 * @type Boolean
		 */
		InstallGetterSetter(this,"visible",
			function get(){
				return !this.rootElement.classList.contains("hidden");
			},
			function set(v){
				this.rootElement.classList[!!v?"remove":"add"]("hidden");
			}
		);
		/**
		 * @attribute owner
		 * @type String
		 */
		InstallGetterSetter(this,"owner",
			function get(){
				return this.getData("owner");
			},
			function set(v){
				return this.setData("owner",v);
			}
		);
		/**
		 * @attribute width
		 * @type Number
		 */
		this.__data__.width=0;
		InstallGetterSetter(this,"width",
			function getWidth(){
				var dialog=$(this.roles.get("dialog"));
				return dialog.outerWidth();
			},
			function setWidth(v){
				var dialog=$(this.roles.get("dialog"));
				var borderWidth=parseInt(dialog.css("border-top-width"))>>>0;
				dialog.css({
					"width":(v-borderWidth*2)+"px",
					"margin-left":(-v/2)+"px"
				});
			}
		);
		/**
		 * @attribute height
		 * @type Number
		 */
		this.__data__.height=0;
		InstallGetterSetter(this,"height",
			function getHeight(){
				var dialog=$(this.roles.get("dialog"));
				return dialog.outerHeight();
			},
			function setHeight(v){
				var dialog=$(this.roles.get("dialog"));
				var borderWidth=parseInt(dialog.css("border-top-width"))>>>0;
				dialog.css({
					"height":(v-borderWidth*2)+"px",
					"margin-top":(-v/2)+"px"
				});
			}
		);
		/**
		 * @attribute closeOnEsc
		 * @type Boolean
		 */
		this.__data__.closeOnEsc=false;
		InstallGetterSetter(this,"closeOnEsc",function(){
			return this.__data__.closeOnEsc;
		},function(v){
			v=!!v;
			this.__data__.closeOnEsc=v;
			if(v){window.addEventListener("keydown",closeIfEsc);}
			else{window.removeEventListener("keydown",closeIfEsc);}
		});
		/**
		 * @attribute destroyOnClose
		 * @type Boolean
		 */
		this.__data__.destroyOnClose=false;
		InstallGetterSetter(this,"destroyOnClose",function(){
			return this.__data__.destroyOnClose;
		},function(v){
			v=!!v;
			this.__data__.destroyOnClose=v;
			if(v){this.addEventListener("close",this.destroy);}
			else{this.removeEventListener("close",this.destroy);}
		});
	}
	/**
	 * @protected
	 * @method show
	 */
	function show(){
		this.visible=true;
	}
	/**
	 * @protected
	 * @method hide
	 */
	function hide(){
		this.visible=false;
	}
	/**
	 * @method open
	 */
	function open(){
		this.show();
	}
	/**
	 * @method close
	 */
	function close(){
		this.hide();
	}
	ExtendClass(TSDialog,TSWidget);
	InstallFunctions(TSDialog.prototype,DONT_DELETE,[
		"show",show,
		"hide",hide,
		"open",open,
		"close",close
	]);
	SetNativeFlag(TSDialog);
	ImplementInterface(TSDialog,Dialog);
	return TSDialog;
});