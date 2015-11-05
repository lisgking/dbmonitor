define('ts/widgets/CommonFileUpload', [
    'ts/widgets/TSWidget',
    'ts/events/TSChangeEvent',
    'jsm/util/MessageBundle',
    'dojo/text!ts/widgets/htm/CommonFileUpload.htm',
    'dojo/css!ts/widgets/css/CommonFileUpload.css',
    'dojo/nls!ts/widgets/nls/CommonFileUpload.json',
    'jquery',
    'fileupload/Uploader',
], function(TSWidget, TSChangeEvent, MessageBundle, htm, css, json, $, Stream){
    'use strict';
    var __super__ = TSWidget.prototype;
    function CommonFileUpload(opts){
        __super__.constructor.call(this);
        this.opts = null;
        this.container = null;
        this.initialize.apply(this, arguments);
    }

    var methods = {
        initialize: function(opts){
            var that = this;

            this.config = {
                browseFileId : "i_select_files", /** 选择文件的ID, 默认: i_select_files */
                browseFileBtn : "<div>请选择文件</div>", /** 显示选择文件的样式, 默认: `<div>请选择文件</div>` */
                dragAndDropArea: "i_select_files", /** 拖拽上传区域，Id（字符类型"i_select_files"）或者DOM对象, 默认: `i_select_files` */
                dragAndDropTips: "<span>把文件(文件夹)拖拽到这里</span>", /** 拖拽提示, 默认: `<span>把文件(文件夹)拖拽到这里</span>` */
                filesQueueId : "i_stream_files_queue", /** 文件上传容器的ID, 默认: i_stream_files_queue */
                filesQueueHeight : 200, /** 文件上传容器的高度（px）, 默认: 450 */
                messagerId : "i_stream_message_container", /** 消息显示容器的ID, 默认: i_stream_message_container */
                autoUploading: false, /** 选择文件后是否自动上传, 默认: true */
                maxSize: 10485760000,//, /** 单个文件的最大大小，默认:2G */
                retryCount : 2, /** HTML5上传失败的重试次数 */
                swfURL : "./swf/FlashUploader.swf", /** SWF文件的位置 */
                tokenURL : "/FileUpLoadAction.do?method=token", /** 根据文件名、大小等信息获取Token的URI（用于生成断点续传、跨域的令牌） */
                frmUploadURL : "/FileUpLoadAction.do?method=fupload;", /** Flash上传的URI */
                uploadURL : "/FileUpLoadAction.do?method=upload", /** HTML5上传的URI */
                simLimit: 1, /** 单次最大上传文件个数 */
                extFilters: [".zip"],
                multipleFiles: true, /** 多个文件一起上传, 默认: false */
                onComplete: function(file) {
                    if(that.complateCB){
                        that.complateCB(file);
                    }
                }
            };

            $.extend(this.config, opts);

            function ViewModel(){

                self.startUpload = function(){
                    that.startUpload();
                }

                self.stopUpload = function(){
                    that.stopUpload();
                }

                self.cancelUpload = function(){
                    that.cancelUpload();
                }

            }


            this.vm = new ViewModel();

        },
        create: function(){
            this.upload = new Stream(this.config);
        },
        startUpload: function(complateCB){
            this.complateCB = complateCB;
            this.upload.upload();
        },

        stopUpload: function(){
            this.upload.stop();
        },

        cancelUpload: function(){
            this.upload.cancel();
        },
    }

    function obj2Arr(obj){
        var arr = [];
        for(var key in obj){
            arr.push(key);
            arr.push(obj[key]);
        }
        return arr;
    }

    ExtendClass(CommonFileUpload, TSWidget);
    InstallFunctions(CommonFileUpload.prototype, DONT_ENUM, obj2Arr(methods));

    SetProperties(CommonFileUpload.prototype, DONT_ENUM, [
        'template', htm,
        'i18n', new MessageBundle(json)
    ]);

    SetNativeFlag(CommonFileUpload);
    return CommonFileUpload;
});