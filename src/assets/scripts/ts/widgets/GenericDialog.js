define('ts/widgets/GenericDialog', [
    'ts/widgets/TSWidget',
    'ts/events/TSEvent',
    'ts/widgets/Draggable',
    'dojo/text!ts/widgets/htm/GenericDialog.htm',
    'dojo/css!ts/widgets/css/GenericDialog.css',
    'dojo/nls!ts/widgets/nls/GenericDialog.json',
    'jquery'
], function(TSWidget, TSEvent, Draggable,html, css, json, $){
    'use strict';
    var i18n=TSWidget.prototype.i18n.createBranch(json);
    Draggable('modal-header');
    function GenericDialog(opts){
        TSWidget.call(this);
        this.$dialog = null;
        this.opts = null;
        this.zIndex = 2000;

        this.initialize.apply(this, arguments);
        
    }

    GenericDialog.DEFAULTS = {
        backdrop: true,
        keyboard: true,
        show: true,
        contentType: 'text',
        top: 90
    }

    var dialogList = (function(){
        var dialogDataObj = {};
        var dialogDataArr = [];

        function removeArrItem(arr, item){
            if(arr.length){
                for(var i=0,len=arr.length;i<len;i++){
                    if(arr[i] == item){
                        arr.splice(i, 1);
                    }
                }
            }
            return arr;
        }

        return {
            removeDialog: function(key){
                if(dialogDataObj[key]){
                    dialogDataObj[key] = false;
                    removeArrItem(dialogDataArr, key);
                }
            },

            addDialog: function(key, val){
                dialogDataObj[key] = val;
                dialogDataArr.push(key);
            },

            getDialog:function(key){
                return dialogDataObj[key];
            },

            getAllDialog:function(){
                return dialogDataObj;
            },

            getNextDialog:function(){
                var key = dialogDataArr[dialogDataArr.length - 1];
                return dialogDataObj[key];
            }
        }
    })();


    var methods = {
        initialize: function(id, url, title, width, height, opts){
            var that = this,
                $dialog = null,
                $modalCallback,
                defaultH = 350,
                defaultW = 600,
                zIndex = this.zIndex = getZIndex();

            if($.type(id) === 'object'){
                this.opts = opts = $.extend({}, GenericDialog.DEFAULTS, id);
                id = opts.id = getBuildDialogId(opts.id);
                url = opts.url;
                title = opts.title;
                width = opts.width;
                height = opts.height;

                if(opts.dialogSize){
                    if(opts.dialogSize == 'small'){
                        width = defaultW;
                        height = 200;
                    }else if(opts.dialogSize == 'normal'){
                        width = defaultW;
                        height = defaultH;
                    }else if(opts.dialogSize == 'big'){
                        width = 900;
                        height = 500;
                    }
                }
            }
            if(this.opts.onLoadCB){
                this.onLoadCB = this.opts.onLoadCB;
            }

            //title>参数传入>优先级别语言文件中>默认
            title = title ? title : json && json.title ? json.title : 'Tips';
            width = width || defaultW;

            if(width != 'auto'){
                width = parseInt(width);
            }else{
                width = '';
            }

            if(height != 'auto'){
                height =  parseInt(height);
            }else{
                height = 'auto';
            }

            opts.height = height;
            opts.width = width;

            var $dialog = this.$dialog = $(this.rootElement),
                $closeBtn = $dialog.find('.close, [data-dismiss=modal]'),
                $modalTitle = $dialog.find('.modal-title');

            title && $modalTitle.text(title);
            $dialog.attr('id', id);
            $dialog.css('z-index', zIndex);
            $dialog.show();
            dialogList.addDialog(id, that);
            if(opts.contentType === 'html' || /\/([A-Z]\w*?)$/.test(opts.url)){
                this.appendWidget(opts);
            }else if(opts.contentType === 'text'){
                this.appendText(opts);
            }else if(opts.contentType === 'widget'){
            	 this.appendTSWidget(opts);
            }else if(opts.contentType === 'confirm'){
                this.appendConfirm(opts);
            }else if(opts.contentType === 'prompt'){
                this.appendPrompt(opts);
            }else if(opts.contentType === 'loading'){
                this.appendLoading(opts);
            }else{
                this.appendIframe(opts);
            }

            $closeBtn.on('click', function(){
                that.hide(id);
                that.innerWidget && that.innerWidget.dispatchEvent(new TSEvent("closeDialog"));
            });

            $dialog.on('click', '[data-dismiss=modal]', function(){
                that.hide(id);
            });

            this.show();
            this.addMask();
            if(opts.animat !== false){
                setTimeout(function(){
                    that.$dialog.addClass('in');
                    that.$dialog.next('.modal-backdrop').addClass('in');
                    that.$dialog.focus();
                }, 0);
            }else{
                that.$dialog.addClass('in');
                that.$dialog.next('.modal-backdrop').addClass('in');
                that.$dialog.focus();
            }
            $('body').css({overflow: 'hidden'});
            
            return $dialog;
        },

        appendIframe: function(opts){
            var that = this,
                $dialog = this.$dialog,
                
                $dialogIframe = $('<iframe  frameborder="0" style="width: 100%;"></iframe>');

            $dialog.find('.modal-body').html($dialogIframe);
            $dialogIframe .attr({'id': opts.id + '_iframe', 'src': opts.url});
            $dialogIframe.css('height', opts.height);
            $dialog.find('.modal-content').css({'width': opts.width, 'margin-top': opts.top, 'margin-left': (($(window).width() - opts.width)/2)});
            that.innerWidget = $dialogIframe[0].contentWindow;
            $dialogIframe.load(function() {
                var subWin = this.contentWindow;
                subWin.$('body').on('click', '[data-dismiss=modal]', function(){
                    that.hide();
                });
            });
        },
        appendWidget: function(opts){
            var that = this,
                $dialog = this.$dialog,
                
                $dialogBody = $dialog.find('.modal-body');

            $dialog.find('.modal-content').css({'width': opts.width, 'margin-top': opts.top, 'margin-left': (($(window).width() - opts.width)/2)});
            $dialogBody.css({height: opts.height, position: 'relative'});
            if(opts.padding != null) {
                $dialogBody.css({padding: opts.padding});
            }
            require([
                opts.url
            ],function(Constructor){
                var widgetOpts = opts.widgetOpts || {};
                
                var widget = new Constructor(widgetOpts);

                if(!widget.height) {
                	widget.height = $dialogBody.height() - 48;
                }
                
                that.innerWidget = widget;
                if(typeof that.onLoadCB === 'function' || that.opts.onLoadCB){
                    that.onLoadCB(widget);
                };
                widget.closeDialog = function(num){
                    that.hide(num);
                }
                
                widget.placeAt($dialogBody,"afterBegin");
                //$dialogBody.html(widget.rootElement);
                if(widget.createCompleteCallback){
                    widget.createCompleteCallback();
                }
            });
        },
        appendTSWidget: function(opts){
            var that = this,
                $dialog = this.$dialog,
                $dialogBody = $dialog.find('.modal-body');

            $dialog.find('.modal-content').css({'width': opts.width, 'margin-top': opts.top, 'margin-left': (($(window).width() - opts.width)/2)});
            $dialogBody.css({height: opts.height, position: 'relative'});
            if(opts.padding != null) {
                $dialogBody.css({padding: opts.padding});
            }
            //require([
            //    opts.url
            //],function(Constructor){
                
            var widget = opts.widget;

            if(!widget.height) {
            	widget.height = $dialogBody.height() - 48;
            }
            
            this.innerWidget = widget;
            if(typeof that.onLoadCB === 'function' || that.opts.onLoadCB){
                that.onLoadCB(widget);
            };
            widget.closeDialog = function(num){
                that.hide(num);
            }
            
            widget.placeAt($dialogBody,"afterBegin");
            //$dialogBody.html(widget.rootElement);
            if(widget.createCompleteCallback){
                widget.createCompleteCallback();
            }
            //});
        },
        appendText: function(opts){
            var that = this,
                $dialog = this.$dialog,
                
                $dialogBody = $dialog.find('.modal-body');

            $dialog.find('.modal-content').css({'width': opts.width, 'margin-top': opts.top, 'margin-left': (($(window).width() - opts.width)/2)});
            $dialogBody.css({height: opts.height, position: 'relative', 'overflow-y': 'auto'});
            $dialogBody.html(opts.text);
            $dialogBody.after('\
                <div class="modal-footer my_modal_footer">\
                <button type="button" class="btn btn-primary confirm" data-dismiss="modal">'+ json.confirm +'</button>\
            </div>');

            $dialog.on('click', '.confirm', function(){
                if(opts.confirmCallback){
                    opts.confirmCallback(true);
                }
                GenericDialog.close($dialog[0]);
            });

        },
        appendConfirm: function(opts){
            var that = this,
                $dialog = this.$dialog,
                
                $dialogBody = $dialog.find('.modal-body');

            $dialog.find('.modal-content').css({'width': opts.width, 'margin-top': opts.top, 'margin-left': (($(window).width() - opts.width)/2)});
            $dialogBody.css({height: opts.height, position: 'relative', 'overflow-y': 'auto'});
            $dialogBody.html(opts.text);
            $dialogBody.after('\
                <div class="modal-footer my_modal_footer">\
                <button type="button" class="btn btn-default confirm">'+ json.confirm +'</button>\
                <button type="button" class="btn btn-default cancel">'+ json.cancel +'</button>\
            </div>');

            $dialog.on('click', '.confirm', function(){
                if(opts.confirmCallback){
                    opts.confirmCallback(true);
                }
                GenericDialog.closeConfirm();
            });

            $dialog.on('click', '.cancel', function(){
                if(opts.confirmCallback){
                    opts.confirmCallback(false);
                }
                GenericDialog.closeConfirm();
            });
        },
        appendPrompt: function(opts){
            var that = this,
                $dialog = this.$dialog,
                
                $dialogBody = $dialog.find('.modal-body');

            $dialog.find('.modal-content').css({'width': opts.width, 'margin-top': opts.top, 'margin-left': (($(window).width() - opts.width)/2)});
            $dialogBody.css({height: opts.height, position: 'relative', 'overflow-y': 'auto'});
            $dialogBody.html('<label class="col-sm-12 control-label">'+ opts.text +'</label><div class="col-sm-12"><input class="prompt-value form-control" type="text" value="'+ opts.val +'" /></div>');
            $dialogBody.after('\
                <div class="modal-footer my_modal_footer">\
                <button type="button" class="btn btn-primary confirm">'+ json.confirm +'</button>\
                <button type="button" class="btn btn-default cancel">'+ json.cancel +'</button>\
            </div>');

            $dialog.on('click', '.confirm', function(){
                if(opts.confirmCallback){
                    var promptValue = $dialog.find('.prompt-value').val();
                    opts.confirmCallback(true, promptValue);
                }
                GenericDialog.closePrompt();
            });

            $dialog.on('click', '.cancel', function(){
                if(opts.confirmCallback){
                    opts.confirmCallback(false);
                }
                GenericDialog.closePrompt();
            });
        },
        appendLoading: function(opts){
            var that = this,
                $dialog = this.$dialog,
                
                $dialogBody = $dialog.find('.modal-body'),
                content = '';
            $dialog.find('.modal-content').addClass('modal-transparency');
            $dialog.find('.modal-content').css({'border':'none','box-shadow':'none','background':'none'});
            $dialog.find('.modal-content').css({'width': opts.width, 'margin-top': opts.top, 'margin-left': (($(window).width() - opts.width)/2)});
            $dialogBody.css({height: opts.height, position: 'relative'});
            content += '<div class="text-center"><i class="icon-spinner icon-spin icon-5x"></i></div>';
            content += '<div class="text-center modal-loading-text">'+ opts.text +'</div>';
            $dialogBody.html(content);
            $dialog.find('.modal-header').hide();
        },
        changeContent: function(text){
            this.$dialog.find('.modal-body').html(text);
        },
        addMask: function(){
            if(this.opts.backdrop){
                var $backdrop = $('<div class="modal-backdrop fade"></div>');
                $backdrop.css('z-index', this.zIndex - 1);
                this.$dialog.after($backdrop);
            }
        },
        show: function(){
            if(this.opts && this.opts.show && this.$dialog){
                this.placeAt($('body'),"beforeEnd");
                $('.modal-backdrop').hide();
            }
        },
        hide: function(time){
        	if(this.innerWidget){
        		this.innerWidget.destroy();
        	}
            GenericDialog.close(this.$dialog[0], parseInt(time * 1000));
        },
        close: function(id, time){
            GenericDialog.close(id, time);
        },
        onLoad: function(CB){
            this.onLoadCB = CB;
        },
        getInnerWidget: function(){
            return this.innerWidget || null;
        }
    }

    GenericDialog.create = function(){
        /*var F = function(){};
        F.prototype = GenericDialog.prototype;
        F.prototype.constructor = GenericDialog;

        return GenericDialog.apply(new F(), arguments);*/
    	return new GenericDialog(arguments[0]);
    }

    GenericDialog.alert = function(text, w, h, cb){
        if(typeof w === 'function'){
            var tmp = cb;
            cb = w;
            w = h;
            h = tmp;

        }
        w = w || 480;
        h = h || 220;
        return GenericDialog.create({id: 'ts_alert', text: text, contentType: 'text', width: w, height: h, confirmCallback: cb});
    }

    GenericDialog.closeAlert = function(text){
        GenericDialog.close('ts_alert');
    }

    GenericDialog.hasAlert = function(text){
        return !!$('#ts_alert').length;
    }

    GenericDialog.alertPre = function(text){
        return GenericDialog.create({id: 'ts_alert_pre', text: text, contentType: 'text', width: 480, height: 300});
    }

    GenericDialog.closeAlertPre = function(text){
        GenericDialog.close('ts_alert_pre');
    }

    GenericDialog.confirm = function(text, cb){
        return GenericDialog.create({id: 'ts_confirm', text: text, contentType: 'confirm', width: 540, height: 300, confirmCallback: cb});
    }

    GenericDialog.closeConfirm = function(text){
        GenericDialog.close('ts_confirm');
    }

    GenericDialog.prompt = function(text, val, cb){
        return GenericDialog.create({id: 'ts_prompt', text: text, val: val, contentType: 'prompt', width: 540, height: 300, confirmCallback: cb});
    }

    GenericDialog.closePrompt = function(text){
        GenericDialog.close('ts_prompt');
    }

    function Loading(){
        this.reqId = 0;
        this.url = '';
        this.reqPool = {};
        this.req = {};
        this.reqTmpCollect = {};
    }

    Loading.prototype = {
        constructor: Loading,
        init: function(){
            this.reqId = 0;
            this.url = '';
            this.reqPool = {};
            this.req = {};
            this.reqTmpCollect = {};
            if(this.thread) clearTimeout(this.thread);
            this.thread = false;
        },
        collectReqId: function(reqId){
            this.reqTmpCollect.reqId = reqId;
            this.addReq();
        },
        collectReqUrl: function(reqUrl){
            this.reqTmpCollect.reqUrl = reqUrl;
            this.addReq();
        },
        collectReqText: function(reqText){
            this.reqTmpCollect.reqText = reqText;
            this.addReq();
        },
        collectReqLoadingFun: function(reqLoadingFun){
            //先收集loadingFun和text,
            this.reqTmpCollect.reqId = '';
            this.reqTmpCollect.reqUrl = '';
            this.reqTmpCollect.reqLoadingFun = reqLoadingFun;
            this.addReq();
        },
        execReq: function(reqId, reqUrl){
            var that = this;
            var req = this.reqPool[reqId];
            if(req.reqLoadingFun){
                var thread = req.reqLoadingFun(function(){
                });
                if(thread) req.thread = thread;   
            }
        },
        hasReq: function(reqId){
            if(reqId){
                return !!this.reqPool[reqId];
            }else{
                for(var p in this.reqPool){
                    return true;
                }
                return false;
            }
        },
        removeReq: function(reqId){
            if(reqId in this.reqPool){
                if(this.reqPool[reqId].thread){
                    clearTimeout(this.reqPool[reqId].thread);
                }
                delete this.reqPool[reqId];

                if(!this.hasReq()){
                    this.init();
                }
            }
        },
        addReq: function(reqTmpCollect){
            reqTmpCollect = reqTmpCollect || this.reqTmpCollect;
            var reqId = reqTmpCollect.reqId;
            var reqUrl = reqTmpCollect.reqUrl;
            var reqLoadingFun = reqTmpCollect.reqLoadingFun;

            if(reqUrl && reqId && reqLoadingFun){
                this.reqPool[reqId] = this.reqTmpCollect;
                this.reqTmpCollect = {};
                this.execReq(reqId);
            }
        }

    }

    function CommonLoading(){
        this.reqId = 0;
        this.url = '';
        this.reqPool = {};
        this.req = {};
        this.reqTmpCollect = {};
        this.isExecFun = false;
        this.isExsitFun = false;
        this.reqCommonLoadingFun = false;
        this.thread = false;
    }

    CommonLoading.prototype = {
        constructor: CommonLoading,
        init: function(){
            this.reqId = 0;
            this.url = '';
            this.reqPool = {};
            this.req = {};
            this.reqTmpCollect = {};
            this.isExecFun = false;
            this.isExsitFun = false;
            this.reqCommonLoadingFun = false;
            if(this.thread) clearTimeout(this.thread);
            this.thread = false;
        },
        collectReqId: function(reqId){
            this.reqTmpCollect.reqId = reqId;
            this.addReq();
        },
        collectReqUrl: function(reqUrl){
            this.reqTmpCollect.reqUrl = reqUrl;
            this.addReq();
        },
        collectReqText: function(reqText){
            this.reqTmpCollect.reqText = reqText;
            this.addReq();
        },
        collectReqLoadingFun: function(reqLoadingFun){
            //先收集loadingFun和text,
            this.reqTmpCollect.reqId = '';
            this.reqTmpCollect.reqUrl = '';
            this.reqTmpCollect.reqLoadingFun = function(){};
            if(!this.reqCommonLoadingFun){
                this.reqCommonLoadingFun = reqLoadingFun;
            }
            this.addReq();
        },
        execReq: function(reqId, reqUrl){
            var that = this;
            var req = this.reqPool[reqId];
            if(!this.isExecFun){
                this.isExecFun = true;
                this.thread = this.reqCommonLoadingFun();
            }
        },
        hasReq: function(reqId){
            if(reqId){
                return !!this.reqPool[reqId];
            }else{
                for(var p in this.reqPool){
                    return true;
                }
                return false;
            }
        },
        removeReq: function(reqId){
            if(reqId in this.reqPool){
                if(this.reqPool[reqId].thread){
                    clearTimeout(this.reqPool[reqId].thread);
                }
                delete this.reqPool[reqId];

                if(!this.hasReq()){
                    this.init();
                    Dialog.close('ts_common_loading');
                }
            }
        },
        addReq: function(reqTmpCollect){
            reqTmpCollect = reqTmpCollect || this.reqTmpCollect;
            var reqId = reqTmpCollect.reqId;
            var reqUrl = reqTmpCollect.reqUrl;
            var reqLoadingFun = reqTmpCollect.reqLoadingFun;

            if(reqUrl && reqId && reqLoadingFun){
                this.reqPool[reqId] = this.reqTmpCollect;
                this.reqTmpCollect = {};
                this.execReq(reqId);
            }
        }
    }

    var loading = new Loading();
    var commonLoading = new CommonLoading();
    window.loading = loading;
    window.commonLoading = commonLoading;
    GenericDialog.collectReq = function(reqId, reqUrl){
        if(loading.reqTmpCollect.reqLoadingFun){
            loading.collectReqId(reqId);
            loading.collectReqUrl(reqUrl);
        }else{
            var text = '';
            var time = 50;
            var width = 100;
            var height = 80;

            commonLoading.collectReqLoadingFun(function(){
                var opts = {id: 'ts_common_loading', text: text, title: 'Loading', contentType: 'loading', width: width, height: height, top: 200,  cancelCallback: null, animat: false};
                if(time){
                    return setTimeout(function(){
                       GenericDialog.create(opts);
                    }, 50);
                }
                GenericDialog.create(opts);
                removeCollectReqCB && removeCollectReqCB();
            });
            commonLoading.collectReqId(reqId);
            commonLoading.collectReqUrl(reqUrl);
        }
    }

    GenericDialog.removeCollectReq = function(reqId, reqUrl){
        if(loading.hasReq(reqId)){
            loading.removeReq(reqId);
        }

        if(commonLoading.hasReq(reqId)){
            commonLoading.removeReq(reqId);
        }

        if(!loading.hasReq() && !commonLoading.hasReq() && GenericDialog.hasLoading()){
            Dialog.closeLoading();
        }
    }

    GenericDialog.loading = function(text, cb, time, isReqLoading){
        text = text || '';
        time = time || 1;
        isReqLoading = typeof isReqLoading === 'undefined' ? true : isReqLoading;
        var width = 350;
        var height = 180;
        if(!text){
            width = 100;
            height = 80;
        }

        if(isReqLoading){
            loading.collectReqText(text);
            loading.collectReqLoadingFun(function(removeCollectReqCB){
                var opts = {id: 'ts_loading', text: text, title: 'Loading', contentType: 'loading', width: width, height: height, top: 200,  cancelCallback: cb, animat: false};
                if(time){
                    return setTimeout(function(){
                       GenericDialog.create(opts); 
                    }, time);
                }
                GenericDialog.create(opts);
            });
        }else{
            var opts = {id: 'ts_loading', text: text, title: 'Loading', contentType: 'loading', width: width, height: height, top: 200,  cancelCallback: cb, animat: false};
            if(time){
                return setTimeout(function(){
                   GenericDialog.create(opts); 
                }, time);
            }
            GenericDialog.create(opts);
        }
    }

    GenericDialog.commonLoading = function(text, cb, time, reqId){
        text = text || '';
        var width = 350;
        var height = 180;
        if(!text){
            width = 100;
            height = 80;
        }

        if(GenericDialog.commonLoading.hasReq()){
            if(reqId){
                GenericDialog.commonLoading.addReq(reqId);
            }
            return ;
        }

        if(reqId){
            GenericDialog.commonLoading.addReq(reqId);
        }

        var opts = {id: 'ts_common_loading', text: text, title: 'Loading', contentType: 'loading', width: width, height: height, top: 200,  cancelCallback: cb, animat: false};
        if(time){
            GenericDialog.commonLoading.thread = setTimeout(function(){
                GenericDialog.create(opts);
            }, time);

            return GenericDialog.commonLoading.thread;
        }
        return GenericDialog.create(opts);

    }

    GenericDialog.commonLoading.addReq = function(reqId){
        GenericDialog.commonLoading.currReqId = reqId;
        GenericDialog.commonLoading.reqQueue = GenericDialog.commonLoading.reqQueue || [];
        GenericDialog.commonLoading.reqQueue.push(reqId);
    }

    GenericDialog.commonLoading.removeReq = function(reqId){
        var index = -1;
        var i = -1;
        GenericDialog.commonLoading.reqQueue = GenericDialog.commonLoading.reqQueue || [];
        GenericDialog.commonLoading.reqQueue.forEach(function(item){
            i++;
            if(item === reqId){
                index = i;
            }

        });
        GenericDialog.commonLoading.reqQueue.splice(index, 1);
    }

    GenericDialog.commonLoading.hasReq = function(reqId){
        GenericDialog.commonLoading.reqQueue = GenericDialog.commonLoading.reqQueue || [];
        return !!GenericDialog.commonLoading.reqQueue.length;
    }

    GenericDialog.closeLoading = function(){
        GenericDialog.loading.id = GenericDialog.loading.id-- || 0;
        GenericDialog.close('ts_loading');
    }

    GenericDialog.closeCommonLoading = function(reqId){

        if(reqId){
            GenericDialog.commonLoading.removeReq(reqId);
        }

        if(GenericDialog.commonLoading.hasReq()){
            return ;
        }

        if(GenericDialog.commonLoading.thread){
            clearTimeout(GenericDialog.commonLoading.thread);
            // commonLoading.thread = null;
        }
        GenericDialog.close('ts_common_loading');
    }

    GenericDialog.hasLoading = function(){
        return !!$('#ts_loading').length || !!GenericDialog.loading.id; 
    }
    GenericDialog.delyLoading = function(text,cb){
        text = text || '';
        if(!$('#ts_loading').length){
            return setTimeout(function(){
                 GenericDialog.create({id: 'ts_loading', text: text, title: 'Loading', contentType: 'loading', width: 350, height: 180, top: 200,  cancelCallback: cb, animat: false});
            },50);
        }else{
        }
    }

    GenericDialog.close = function(id, time){
        var $dialog = [];
        id = id || 'ts_dialog';
        if(id && id.nodeType == 1){//dialog DOM对象
            $dialog = $(id);
            id = $dialog.attr('id');
        }

        if(!$dialog.length){
            id = id || 'ts_dialog';
            $dialog = $('#' + id);
        }

        if(!$dialog.length){
            id = id || 'ts_dialog_second';
            $dialog = $('#' + id);
        }

        if(!$dialog.length){
            id = id || 'ts_dialog_third';
            $dialog = $('#' + id);
        }

        if(time){
            setTimeout(function(){
                GenericDialog.close(id);
            }, time);
            return ;
        }else{
            var dialog = dialogList.getDialog(id);
            if(dialog && dialog.opts.animat !== false){
                $dialog.removeClass('in');
                $dialog.next('.modal-backdrop').removeClass('in');
                if(GenericUtil.support.transition){
                    $dialog.one(GenericUtil.support.transition.end, function(){
                        $dialog.next('.modal-backdrop').remove();
                        $dialog.remove();
                        dialogList.removeDialog(id);
                        var nextDialog = dialogList.getNextDialog();
                        if(nextDialog){
                            nextDialog.$dialog.next('.modal-backdrop').show();
                            nextDialog.$dialog.next('.modal-backdrop').addClass('in');
                        }else{
                            $('body').css({overflow: ''});
                        }
                    });
                }else{
                    $dialog.next('.modal-backdrop').remove();
                    $dialog.remove();  
                    dialogList.removeDialog(id);
                    var nextDialog = dialogList.getNextDialog();
                    if(nextDialog){
                        nextDialog.$dialog.next('.modal-backdrop').show();
                        nextDialog.$dialog.next('.modal-backdrop').addClass('in');
                    }else{
                        $('body').css({overflow: ''});
                    }
                }
            }else{
                $dialog.next('.modal-backdrop').remove();
                $dialog.remove();
                dialogList.removeDialog(id);
                var nextDialog = dialogList.getNextDialog();
                if(nextDialog){
                    nextDialog.$dialog.next('.modal-backdrop').show();
                    nextDialog.$dialog.next('.modal-backdrop').addClass('in');
                }else{
                    $('body').css({overflow: ''});
                }
            }
        }
    };(function(){
        function isFunction(v){
            return typeof v==="function";
        }
        function alertAsync(message,resolve,context){
            GenericDialog.alert(message,function(){
                if(isFunction(resolve))
                    resolve.call(context);
            });
        }
        function confirmAsync(message,resolve,context){
            if(arguments.length===1){
                message="";
            }
            var that=this;
            GenericDialog.confirm(message,function(returnValue){
                if(isFunction(resolve))
                    resolve.call(context,returnValue);
            });
        }
        function promptAsync(message,value,resolve,context){
            if(arguments.length===0){
                message="";
                value="";
            }else if(arguments.length===1){
                value="";
            }
            GenericDialog.prompt(message,value,function(flag,returnValue){
                if(flag===false){
                    returnValue=null;
                }
                if(isFunction(resolve))
                    resolve.call(context,returnValue);
            });
        }
        [
            "alertAsync",alertAsync,
            "confirmAsync",confirmAsync,
            "promptAsync",promptAsync
        ].forEach(function(k,i,a){
            if(!(i&1)){this[k]=a[i+1];}
        },GenericDialog);
    }());

    function getBuildDialogId(id){
        id = id || 'ts_dialog';
        if(id === 'ts_dialog' && $('#ts_dialog').length){
            id = 'ts_dialog_second';
        }
        if(id === 'ts_dialog_second' && $('#ts_dialog_second').length){
            id = 'ts_dialog_third';
        }
        return id;
    }

    function getZIndex(){
       var zIndex = 2000;
        getZIndex = (function(){
            return function(){
                return zIndex += 2;
            }
        })();
        return zIndex;
    }

    function obj2Arr(obj){
        var arr = [];
        for(var key in obj){
            arr.push(key);
            arr.push(obj[key]);
        }
        return arr;
    }


    ExtendClass(GenericDialog, TSWidget);
    SetProperties(GenericDialog.prototype,DONT_ENUM,[
        "template",html,
        "i18n",i18n
    ]);
    InstallFunctions(GenericDialog.prototype, DONT_ENUM, obj2Arr(methods));

    return GenericDialog;
});
