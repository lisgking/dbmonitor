require.config({
	shim:{
		"fileupload/Uploader":{
			exports:"Stream"
		}
	}
});
define("ts/widgets/TSFileUpload",[
	"ts/widgets/TSWidget",
	"fileupload/Uploader",
	"dojo/text!./htm/TSFileUpload.htm",
	"dojo/css!./css/TSFileUpload.css",
	"dojo/nls!fileupload/nls/Uploader.json"
],function(TSWidget,Stream,htm,css,json){
	"use strict";
	var i18n=TSWidget.prototype.i18n.createBranch(json);
	function TSFileUpload(id,initParams){
		TSWidget.call(this,id,initParams);
		defineProperties.call(this);
	}
	function defineProperties(){
		/**
		 * @attribute stream
		 * @type Stream
		 */
		this.__data__.stream=null;
		InstallGetter(this,"stream",function(){
			return this.__data__.stream;
		});
		/**
		 * @attribute constructed
		 * @type Boolean
		 */
		this.__data__.constructed=false;
		InstallGetter(this,"constructed",function(){
			return this.__data__.constructed;
		});
		/**
		 * @attribute config
		 * @type Object
		 */
		this.__data__.config= {
			enabled : true,
			extFilters:[],
			/**
			 * @overwrite
			 */
			multipleFiles : false,
			appendNewFiles : false,
			autoRemoveCompleted : false,
			autoUploading : true,
			dragAndDropArea: "i_select_files",
			/**
			 * @overwrite
			 */
			//dragAndDropTips: '<span>'+i18n.getMessage("dropFileHere")+'</span>',
			fileFieldName : "FileData",
			browseFileId : "i_select_files",
			/**
			 * @overwrite
			 */
			//browseFileBtn : '<button type="button">'+i18n.getMessage("chooseFile")+'</div>',
			filesQueueId : "i_stream_files_queue",
			/**
			 * @overwrite
			 */
			filesQueueHeight : 110,
			messagerId : "i_stream_message_container",
			onSelect : function(list){
				console.log(list);
			},
			onMaxSizeExceed : null,
			onFileCountExceed : null,
			onExtNameMismatch : null,
			onFileNameMisMatch: null,
			onCancel : null,
			onStop : null,
			onCancelAll : null,
			onComplete : null,
			onQueueComplete: null,
			onUploadError: null,
			/**
			 * @overwrite
			 */
			maxSize : 2147483648,
			simLimit : 10000,
			retryCount : 5,
			postVarsPerFile : {},
			/**
			 * @overwrite
			 */
			swfURL : require.toUrl("fileupload/swf/FlashUploader.swf"),
			/**
			 * @overwrite
			 */
			tokenURL : "FileUpLoadAction.do?method=token",
			/**
			 * @overwrite
			 */
			frmUploadURL : "FileUpLoadAction.do?method=fupload;",
			/**
			 * @overwrite
			 */
			uploadURL : "FileUpLoadAction.do?method=upload"
		};
	}
	/**
	 * create stream and initialize UI
	 * please ensure startup call after config call
	 * @method startup
	 */
	function startup(){
		if(this.constructed){return;}
		if(this.rootElement.ownerDocument.contains(this.rootElement)){
			this.__data__.stream=new Stream(this.__data__.config);
			this.__data__.constructed=true;
		}else{
			this.addEventListener("DOMNodeInserted",startup);
		}
	}
	/**
	 * jQuery-like method, config() to get and config({}) to set
	 * @method config
	 * @param {Object} [cfg]
	 * @return {Object|void 0}
	 */
	function config(cfg){
		if(arguments.length===0){
			return this.__data__.config;
		}else{
			ExtendObject(this.__data__.config,cfg);
		}
	}
	function upload(){
		if(this.stream){
			this.stream.upload();
		}
	}
	function stop(){
		if(this.stream){
			this.stream.stop();
		}
	}
	function cancel(){
		if(this.stream){
			this.stream.cancel();
		}
	}
	ExtendClass(TSFileUpload,TSWidget);
	InstallFunctions(TSFileUpload.prototype,NONE,[
		"startup",startup,
		"config",config,
		"upload",upload,
		"stop",stop,
		"cancel",cancel
	]);
	SetProperties(TSFileUpload.prototype,DONT_ENUM,[
		"template",htm
	]);
	return TSFileUpload;
});
