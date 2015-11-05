define('ts/widgets/GenericWizard', [
    'ts/widgets/TSWidget',
    'ts/util/GenericUtil',
    'ts/events/TSMessageEvent',
    'dojo/text!ts/widgets/htm/GenericWizard.htm',
    'dojo/css!ts/widgets/css/GenericWizard.css',
    'dojo/nls!ts/widgets/nls/GenericWizard.json',
], function(TSWidget, GUtil, TSMessageEvent, html, css, json){
	'use strict';

    var i18n = TSWidget.prototype.i18n.createBranch(json);
	function GenericWizard(opts){
		TSWidget.call(this);
        this.opts = null;
        this.container = null;
        
        this.currStep = 0;
        
        this.initialize.apply(this, arguments);
	}

    var methods = {
        initialize: function(opts){
            var that = this,
                $container = this.container = $(this.rootElement),
                $listItems = null;
            this.stepsContainer = this.container.find('.steps');
            this.stepsContentContainer = this.container.find('.step-content');
            this.btnsContainer = this.container.find('.step-btns');

            this.opts = $.extend({}, opts);
            this.widgets = this.opts.widgets;

            var widgets = this.widgets;
            this.buildTab();//根据widget个数创建wizard
            
            setTimeout(function() {
            	that.jumpStep(0);//默认显示第一个widget
            })

            this.container.on('click', '.complete', function(){
                // that.currStep = $(this).index();
                // that.jumpStep(that.currStep);
            });

            //点上一步按钮跳转到上一个widget
            this.container.on('click', '.prev-btn', function(){
                var currStep = that.currStep;
                var widget = that.widgets[currStep];

                if(widget.btns && widget.btns.prev){
                    //回调函数返回true才跳转到下步页面
                    if(widget.btns.prev(widget.widgetObj, currStep, that.widgets) === false){
                        return ;
                    }
                }
                that.jumpStep('prev');
            });
            //点下一步按钮跳转到下一个widget
            this.container.on('click', '.next-btn', function(){
                var currStep = that.currStep;
                var widget = that.widgets[currStep];
                //调用验证
                if(that.validate(widget.widgetObj) === false){
                    console.log('验证未通过！');
                    return ;
                }
                if(widget.btns && widget.btns.next){
                    //回调函数返回true才跳转到下步页面
                    if(widget.btns.next.call(that, widget.widgetObj, currStep, that.widgets) === false){
                        return ;
                    }
                }
                that.jumpStep('next');
            });
            //点取消关闭此向导（目前向导都是嵌套在dialog内的，所以点取消一般是关闭dialog）
            this.container.on('click', '.cancel-btn', function(){
                var currStep = that.currStep;
                var widget = that.widgets[currStep];
                if(widget.btns && widget.btns.cancel){
                    //回调函数返回true才跳转到下步页面
                    if(widget.btns.next.call(that, widget.widgetObj, currStep, that.widgets) === false){
                        return ;
                    }
                }
                if(that.opts.cancelCB){
                    that.opts.cancelCB();
                }
            });
            
            that.addEventListener('over', function(e) {
    			that.refreshTabs(e.no, true);
    		});
        },
        jumpStep: function(num){
            if(num === 'prev'){
                num = --this.currStep;
            }
            if(num === 'next'){
                num = ++this.currStep;
                this.hideLoading();
            }
            if(num < 0){
                num = 0;
                this.currStep = 0;
            }
            if(num > (this.widgets.length - 1)){
                num = this.widgets.length - 1;
                this.currStep = this.widgets.length - 1;
            }
            var that = this;
            var widgets = this.widgets;
            var widget = widgets[num];
            var ConstructorPath = widget.widgetClass;
            var widgetOpts = widget.widgetOpts || {};

            this.stepsContentContainer.find('.step-pane').removeClass('active');
            this.stepsContentContainer.find('.step-pane').eq(this.currStep).addClass('active');
            if(!widget.widgetObj){//如果widget对象已存在不再重复创建
                var type = $.type(ConstructorPath);

                if(type === 'function'){//如果widgetClass是一个widget类
                    widget.widgetObj = new ConstructorPath(widgetOpts);
                    that.widgetObjInit(widget.widgetObj);
                }else if(type === 'object'){//如果widgetClass是一个widget实例
                    widget.widgetObj = ConstructorPath;
                    that.widgetObjInit(widget.widgetObj);
                }else if(type === 'string'){//如果widgetClass是一个widget类路径，重新加载并创建此widget
                    require([
                        ConstructorPath
                    ],function(Constructor){
                        var obj = new Constructor(widgetOpts);
                        that.widgetObjInit(obj);
                    });
                }
            }else{
                if(widget.showWidgetCallback){
                    widget.showWidgetCallback.call(that, widget.widgetObj, that.currStep, widgets);
                }
            }

            this.refreshTabs(this.currStep);//切换当前widget状态
            this.refreshBtns();//切换当前widget操作按钮
        },
        widgetObjInit: function(widgetObj){
            var that = this;
            var widgets = this.widgets;
            var widget = widgets[this.currStep];
            var stepsContentTempl = that.container.find('.step-content-templ').text();
            var content=$(stepsContentTempl)[0];
            widgetObj.placeAt(content,"afterBegin");

            widgetObj.closeDialog = function(){//为每个widget实例添加关闭dialog函数
                that.closeDialog();
            };
            widget.widgetObj = widgetObj;
            that.stepsContentContainer.append(content);
            if(widgetObj.createCompleteCallback){
                widgetObj.createCompleteCallback();
            }
            //创建后添加
            that.stepsContentContainer.find('.step-pane').eq(that.currStep).addClass('active');
            that.buildBtns();
            if(widget.showWidgetCallback){
                widget.showWidgetCallback.call(that, widgetObj, that.currStep, widgets);
            }
        },
        refreshBtns: function(){
            var that = this;
            var widgets = this.widgets;
            var currStep = this.currStep;
            var widget = widgets[currStep];
            var $prevBtn = this.btnsContainer.find('.prev-btn');
            var $nextBtn = this.btnsContainer.find('.next-btn');
            var $cancelBtn = this.btnsContainer.find('.cancel-btn');

            $(widgets.btnArr).hide();
            $(widget.btnArr).show();

            if(widget.btns && widget.btns.prev === false){
                $prevBtn.hide();
            }else{
                $prevBtn.show();
            }

            if(widget.btns && widget.btns.next === false){
                $nextBtn.hide();
            }else{
                $nextBtn.show();
            }

            if(widget.btns && widget.btns.cancel === false){
                $cancelBtn.hide();
            }else{
                $cancelBtn.show();
            }

            $prevBtn.prop('disabled', false);
            $nextBtn.prop('disabled', false);
            if(this.currStep === 0){
                $prevBtn.prop('disabled', true);
            }

            if(this.currStep === this.widgets.length - 1){
                $nextBtn.prop('disabled', true);
            }
        },
        refreshTabs: function(step, isMouseOver){
        	
        	var that = this;
        	
        	var wizard = $('.wizard', $(this.rootElement));	
        	
            var allSteps 		= this.stepsContainer.find('>li');
            var completeSteps 	= allSteps.slice(0, step);
            var currSteps 		= allSteps.eq(step);
            var unCompleteSteps = allSteps.slice(step + 1);
            
            // 如果是鼠标经过,则不设置样式
            isMouseOver || completeSteps.attr('class', 'complete');
            currSteps.attr('class', 'active');
            isMouseOver || unCompleteSteps.attr('class', '');
            isMouseOver || completeSteps.find('.badge').attr('class', 'badge badge-success');
            currSteps.find('.badge').attr('class', 'badge badge-info');
            isMouseOver || unCompleteSteps.find('.badge').attr('class', 'badge');

        	/*
        	 * 将标题全部显示,计算总长度totalWidth,
        	 * 如果总长度小于父容器的宽度,则全部显示,否则显示只显示当前页及当前页前一页和后一页(如果存在)
        	 * 计算当前位置及前后位置的 currentWidth, prevWidth, nextWidth
        	 * 求出其他位置所占的宽度
        	 * otherWidth = （containerWidth - currentWidth - prevWidth - nextWidth） / (n - 3或2)
        	 */
            
            var widthArr = [];
            var containerWidth = wizard.width();
            var totalWidth = 0;
        	$.each(allSteps, function(i, item) {
        		var title = $('span.title', $(item));
        		title.show();
          		allSteps[i].style.width = 'auto';
          		var width = $(allSteps[i]).outerWidth(true);	// 计算出宽度
          		totalWidth += width;
          		widthArr.push(width);
          	});
        	
        	if(totalWidth <= containerWidth) {
        		return;
        	}
        	
        	// 求长度最大的title做来要显示的title长度
        	var currentWidth = Math.max.apply(this, widthArr);
         	
         	var otherCount;
         	if(step == 0 || step == that.widgets.length - 1) {	
         		// 如果当前是第一个或最后一个，则数字节点个数为that.widgets.length - 2，否则为that.widgets.length - 3;
         		otherCount = that.widgets.length - 2;
         	} else {
         		otherCount = that.widgets.length - 3;
         	}

         	var otherWidth = (containerWidth - currentWidth * (that.widgets.length - otherCount)) / otherCount;

         	//console.log('prevWidth: ' + prevWidth + ', currentWidth: ' + currentWidth + ', nextWidth: ' + nextWidth + ', otherWidth: ' + otherWidth);

         	$.each(allSteps, function(i, item) {
         		item.style.display = 'inline-block';
         		item.style.width = otherWidth + 'px';
         		var title = $('span.title', $(item));
         		if(i != step && i != step - 1 && i != step + 1) {
         			$(item).outerWidth(otherWidth);
         			
         			//$(item).width(otherWidth - paddingLeft);
         			
         			title.hide();
         		} else {
         			$(item).outerWidth(currentWidth);

         			//var paddingLeft = parseFloat($(item).css('padding-left').replace('px', ''));
         			title.show();
         		}
         	});
        },
        buildPanel: function(num){

        },
        buildTab: function(){
            var that = this;
            var stepsTempl = this.container.find('.steps-templ').text();
            
            this.widgets.forEach(function(o, index, val){
            	var item = $(stepsTempl.replace(/#{num}/, index + 1).replace(/#{title}/, o.title));
                that.stepsContainer.append(item);
                
                // 监听事件
                item.on({
                	mouseover: function(e) {
                    	var event = new TSMessageEvent('over');
                    	event.no = index;
                    	
                		that.dispatchEvent(event);
                	},
                	mouseout: function(e) {
                		that.refreshTabs(that.currStep);
                	}
                });
            });
        },
        buildBtns: function(){

            var that = this;
            var widgets = this.widgets;
            var currStep = this.currStep;
            var widget = widgets[currStep];
            var stepsBtnTempl = this.container.find('.step-btn-templ').text();
            var $cancelBtn = this.btnsContainer.find('.cancel-btn');

            if(!widget.btns) return ;

            for(name in widget.btns){
                var btn = widget.btns[name];
                if(name !== 'prev' && name !== 'next' && name !== 'cancel'){
                    var $btn = $(stepsBtnTempl.replace(/#{text}/, btn.text));
                    if($cancelBtn.length){
                        $cancelBtn.before($btn);
                    }else{
                        that.btnsContainer.append($btn);
                    }

                    widgets.btnArr = widgets.btnArr || [];
                    widgets.btnArr.push($btn[0]);
                    widget.btnArr = widget.btnArr || [];
                    widget.btnArr.push($btn[0]);
                    (function(btn){
                        $btn.on('click', function(){
                            btn.callback.call(that, widget.widgetObj, currStep, widgets);
                        });
                    })(btn);
                }
            }
        },
        jumpTab: function(){

        },
        createCallback: function(){

        },
        createCompleteCallback: function(){
        },
        getLoadingText: function(){
            var widgets = this.widgets;
            var currStep = this.currStep;
            var widget = widgets[currStep];
            var widgetObj = widget.widgetObj;
            var loadingText = i18n.getMsg('please later in the request');

            if(widgetObj.getLoadingText){
                loadingText = widgetObj.getLoadingText();
            }

            if(widget.loadingText){
                loadingText = widget.loadingText;
            }

            return loadingText;
        },
        showLoading: function(loadingText, innerCall){
            loadingText = loadingText || this.getLoadingText();

            /*if(innerCall === true){
                Dialog.loading(loadingText, '', 50);
            }else{
                Dialog.loading(loadingText, '', 5, true);
            }*/
            
            
            // innerCall为是否内部调用，如果为true则不显示遮罩,false显示遮罩
            if(innerCall == undefined) {
            	Dialog.loading(loadingText, '', 50);
            } else {
            	Dialog.loading(loadingText, '', 5, !!innerCall);
            }
        },
        hideLoading: function(innerCall){
            if(this.loadingThread){
                clearTimeout(this.loadingThread);
            }
            Dialog.closeLoading();
        },
        showLoading2: function(){
            if(!this.loading){
                var loadingTempl = this.container.find('.step-loading-templ').text();
                this.container.find('.step-content').append(loadingTempl);
                this.loading = this.container.find('.setp-loading');
            }

            this.loading.show();
        },
        req: function(url, data, CB){
            var that = this;
            
            //this.showLoading('', false);
            this.showLoading('', true);	// 2015年10月10日改为true
            function myCB(data){
            		setTimeout(function(){
            			that.hideLoading();
            		},500);
                CB(data);                
            }
            myCB.errorCB = function(data){
                that.hideLoading();
            }
            /*var opts={
            		data:data,
            		success:myCB,
            		error:myCB.errorCB,
            		type:"post",
            		dataType:"json"
            }
            $.ajax(url,opts);*/
            
            $.post(url, data, myCB, 'json');
        },
        validate: function(widget){
            if(widget && widget.validate){
                return widget.validate();
            }
        },
        submit: function(widget){
            if(widget && widget.submit){
                return widget.submit();
            }
        },
        load: function(url, callback){
        }
    };

    ExtendClass(GenericWizard, TSWidget);
    
    SetProperties(GenericWizard.prototype,DONT_ENUM,[
		"template",html,
		"i18n",i18n
	]);
    InstallFunctions(GenericWizard.prototype, DONT_ENUM, GUtil.obj2Arr(methods));

	return GenericWizard;
});
