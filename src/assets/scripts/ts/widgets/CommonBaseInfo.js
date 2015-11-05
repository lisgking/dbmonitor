define('ts/widgets/CommonBaseInfo', [
    'ts/widgets/CommonWidget',
    'dojo/text!ts/widgets/htm/CommonBaseInfo.html',
    'dojo/css!ts/widgets/css/CommonBaseInfo.css',
    'dojo/nls!ts/common/dataCenter.json',
], function(CommonWidget, html, css, json){
	'use strict';
    var i18n = null;
	function CommonBaseInfo(opts){
        CommonWidget.call(this, {html: html, css: css, json: json});
        i18n = this.i18n;
        this.container = null;
        this.initialize.apply(this, arguments);
	}

    var methods = {
        initialize: function(opts){
            var that = this;
            this.opts = $.extend({}, opts);
            this.container = $(this.rootElement);

            function ViewModel(){
                var self = this;
                self.list = ko.observableArray([]);
                self.className = ko.observable('col-sm-12');
                self.rows = ko.observable(4);
                self.cols = ko.observable(1);
                self.colsArr = ko.observableArray([]);

                self.className = ko.computed(function(){
                    var className = '';
                    var len = self.list().length;
                    var rows = self.rows();
                    var cols = 1;

                    if(len <= 4){
                        cols = 1;
                    }else if(len <= 8){
                        cols = 2;
                    }else if(len > 8){
                        cols = 3;
                    }

                    self.cols(cols);

                    if(cols == 3 && len > rows * cols){
                        rows = Math.ceil(len / cols);
                        self.rows(rows);
                    }

                    if(cols == 1){
                        className = 'col-sm-12';
                    }else if(cols == 2){
                        className = 'col-sm-6';
                    }else if(cols == 3){
                        className = 'col-sm-4';
                    }
                    var arr = [];
                    for(var i=0;i<cols;i++){
                        arr.push(1);
                    }
                    self.colsArr(arr);

                    return className;
                });

//                self.className = function(){
//
//                }

                return self;
            }

            this.vm = new ViewModel();

            this.addEventListener("DOMNodeInserted",function(){
                that.createCompleteCallback();
            });

        },
        createCompleteCallback: function(){
            ko.applyBindings(this.vm, this.container[0]);
            if(this.opts.url){
                this.reqData(this.opts.url, this.opts.sendData);
            }
//            this.loadSimulateData();
        },
        reqData: function(url, sendData){
            var that = this;
            url = url || this.opts.url;

            $.post(url, sendData, function(data){
                that.loadData(data);
            });
        },
        reloadData: function(url){
            url = url || this.opts.url;
            this.reqData(url, this.opts.sendData);
        },
        updateData: function(data, key){
            key = key || 'id';
            var that = this;
            
            this.vm.list().forEach(function(item){
                var val = '';
                for(var prop in data){
                    if(item.key === prop){
                        if($.type(item.val) === 'function'){
                            if(item.val() !== data[prop]){
                                val = data[prop];
                                if(that.opts.formatterCB){
                                    val = that.opts.formatterCB({key: prop, val: data[prop]});
                                }
                                item.val(val);
                            }
                        }else{
                            val = data[prop];
                            if(that.opts.formatterCB){
                                val = that.opts.formatterCB({key: prop, val: data[prop]});
                            }
                            item.val = val;
                        }
                    }
                }

            });
        },
        loadData: function(data){
            var that = this;
            data && data.forEach(function(item){
                var val = item.val;

                if(that.opts.formatterCB){
                    val = that.opts.formatterCB(item);
                }
               
                item.val = ko.observable(val);
            });
            this.vm.list(data);
        },
        getData: function(){
            ko.toJS(this.vm.list);
        },
        req: function(){

        },
        loadSimulateData: function(){
            
        }

    };

    ExtendClass(CommonBaseInfo, CommonWidget);
    InstallFunctions(CommonBaseInfo.prototype, DONT_ENUM, GUtil.obj2Arr(methods));

	return CommonBaseInfo;
});