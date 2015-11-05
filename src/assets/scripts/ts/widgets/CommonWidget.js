define('ts/widgets/CommonWidget',
    ['ts/widgets/TSWidget', 'jsm/util/MessageBundle'], 
function(TSWidget,  MessageBundle){
	'use strict';

    // Make shortcut getMsg --> getMessage
    MessageBundle.prototype.getMsg = MessageBundle.prototype.getMessage;
    
    var __super__ = TSWidget.prototype;
    function CommonWidget(){
        var that = this;
        var opts = arguments[0] || {};
        this.name = this.constructor.name || '';

        this.container = null;
        this.events = {};
        if(opts && typeof opts === 'object'){
            if(opts.json){
                //this.i18n = new MessageBundle(opts.json);
                this.i18n = Object.getPrototypeOf(this).i18n.createBranch(opts.json);
                
                this.json = opts.json;
            }

            if(opts.html){
                this._tempate = opts.html;
                if(this._tempate){
                    this._tempate = CommonWidget.parseTmpl2I18n(this._tempate, this.json, this.name);
                }
                // this.template = this._tempate;
                this.template = opts.html;
                // this.conatiner = $(this._tempate);
            }
        }

        __super__.constructor.call(this);

        // this.i18n = {
        //     _data: opts.json,
        //     getMessage: function(key, obj){
        //         return this.getMsg(key, obj);
        //     },
        //     getMsg: function(key, obj){
        //         return CommonWidget.i18n.getMsg(key, this._data, that.name, obj);
        //     }
        // };
        // this.i18n.getMsg = this.i18n.getMessage;
        // this.rootElement = $(this._tempate || '<div></div>')[0];

        this.initial.apply(this, arguments);
        if(this.name){
            var name = 'A_' + this.name;//A_可以在输入window时头部显示
            window[name] = this;
        }
    }

    CommonWidget.create = function(){
        return new CommonWidget();
    };

    CommonWidget.parseTmpl2I18n = function(tmpl, data, widgetName){
        if(tmpl){
            tmpl = tmpl.replace(/\$\{(.*?)\}/g, function(m, key){
                return CommonWidget.i18n.getMsg(key, data, widgetName);
            });
        }

        return tmpl;
    }

    CommonWidget.i18n = {
        getMsg: function(key, data, widgetName, obj){
            var msg = '';
            if(data){
                var widgetData = data;
                if(widgetName){
                    widgetData = data[widgetName];
                }
                if(widgetData){
                   msg = widgetData[key];
                }
                if(!msg){
                    msg = data[key] || key;
                }
                msg;
            }

            if(msg && obj && $.type(obj) === 'object'){
                // $test 
                msg = msg.replace(/ \$(.*?)\ /g, function(m, key){
                    var msgTmp = '';
                    if(key in obj){
                        if($.type(obj[key]) === 'function'){
                            msgTmp = obj[key].call(obj, msg)
                        }else{
                            msgTmp = obj[key];
                        }
                    }

                    if(msgTmp){
                        return ' ' + msgTmp + ' ';
                    }

                    return m;
                });
            }

            return msg || key;
        }
    }

    CommonWidget.obj2Arr = function(obj){
        var arr = [];
        for(var key in obj){
            arr.push(key);
            arr.push(obj[key]);
        }
        return arr;
    }

    CommonWidget.extend = function(subClass, superClass){
        var that = this;
        var f = function(){};
        f.prototype = superClass.prototype;
        subClass.prototype = new f();
        subClass.constructor = subClass;
        subClass.superClass = superClass;
        // superClass.subClass = subClass;

        subClass.extend = function(methods){
            that.include(subClass.prototype, methods);
        };
        return subClass;
    }

    CommonWidget.include = function(subObj, supperObj){
        for(var prop in supperObj){
            subObj[prop] = supperObj[prop];
        }
        return subObj;
    }

    var methods = {
        initial: function(opts){
            var that = this;
            //初始化操作

        },

        createCompleteCallback: function(){
            ko.applyBindings(this.vm, this.container[0]);
        },
        validate: function(){
            return true;
        },
        loadData: function(data){
            var vm = self.vm;
            var toString = Object.prototype.toString;
            if(toString.call(data) === '[object Array]'){
                for(key in vm){//后期添加是否是监听属性
                    if(toString.call(key) === '[object Array]'){
                        self.vm(data);
                    }
                }
            }
            for(key in self){
                if(key in data){
                    if(typeof vm[key] === 'function'){//后期添加是否是监听属性
                        vm[key](data[key]);
                    }
                }
            }
        },
        reloadData: function(){
            var that = this;
            var dataInterface = {
                real: rootPath + '',
                simulate: 'test.json'
            };
            $.getJSON(GUtil.getInterface(dataInterface)).done(function(data){
                that.loadData(data);
            }).fail(function(){
                console.log('CommonWidgte提示您:重新请求加载数据失败！')
            });
        },
        getData: function(){
            if(this.vm && ko){
                return ko.toJSON(this.vm);
            }
        },
        getSelectedData: function(){

        },
        getRawData: function(){

        },

        addData: function(data){

        },
        removeData: function(data){

        },
        //参数 data  为object
        //参数data 为array 
        //参数 data  为string
        updateData: function(data, key){
            key = key || 'id';
            var type = $.type(data);
            
            if(type === 'object'){//更新某条数据
                this.vm.list().forEach(function(item){
                    if(key in item){
                        for(var prop in data){
                            if(prop in item){
                                type = $.type(item[prop]);
                                //目前未判断object、array
                                if(type === 'function'){
                                    if(item[prop]() !== data[prop]){
                                        item[prop](data[prop]);
                                    }
                                }else{
                                    if(item[prop] !== data[prop]){
                                        item[prop] = data[prop]
                                    }
                                }
                            }
                        }
                    }
                }); 
            }else if(type === 'array'){//更新多条数据
                var that = this;
                data.forEach(function(itemData){
                    that.vm.list().forEach(function(item){
                        if(item[key] === itemData[key]){
                            for(var prop in itemData){
                                type = $.type(item[prop]);
                                //目前未判断object、array
                                if(type === 'function'){
                                    if(item[prop]() !== itemData[prop]){
                                        item[prop](itemData[prop]);
                                    }
                                }else{
                                    if(item[prop] !== itemData[prop]){
                                        item[prop] = itemData[prop]
                                    }
                                }
                            }
                        }
                    }); 
                });
                
            }else{//更新列表属性
                this.vm.list().forEach(function(item){
                    if(key in item){
                        if($.type(item[key]) === 'function'){
                            item[key](data);
                        }else{
                            item[key] = data;
                        }
                    }
                });  
            }
        },
        saveData: function(){
            if(this.validate()){
                var that = this;
                var jsonData = this.getData();
                var dataInterface = {
                    real: rootPath + '/IvmAction.do?method=saveIvm',
                    simulate: 'ivm/host/RegistetIvmPlatform.json'
                };
                this.req(GUtil.getInterface(dataInterface), jsonData, function(data){
                    if(data.flag === '1'){
                        Dialog.close();
                    }else{
                        Dialog.alert(data.msg);
                    }
                });
            };
        },
        reqData: function(){

        },
        req: function(url, jsonData, CB){
            var that = this;
            if(typeof CB === 'undefined'){
                CB = function(){
                    that.defaultReqCB();
                }
            }
            $.post(url, jsonData, function(data){
                if(CB){
                    CB(data);
                }else{
                    that.loadData(data);
                }
            }, 'json');
        },
        defaultReqCB: function(data){
            this.loadData(data);
        },
        loadSimulateData: function(url, callback){
            var that = this;

            if(!url){
                this.reloadData();
                return ;
            }

            $.getJSON(url).done(function(data){
                that.loadData(data);
            }).fail(function(){
                console.log('CommonWidgte提示您:请求数据失败！');
            });
        },
        obj2Arr: function(obj){
            var arr = [];
            for(var key in obj){
                arr.push(key);
                arr.push(obj[key]);
            }
            return arr;
        },
        buildJsonData: function(obj){
            var jsonData = {data: ''};
            if(obj != null){
                jsonData.data = JSON.stringify(obj);
            }

            return jsonData;
        },
        toJS: function(vm){
            vm = vm || this.vm;
            ko.toJS(vm);
        },
        toJSON: function(vm){
            vm = vm || this.vm;
            ko.toJSON(vm);
        },
        //重写
        setI18n: function(json){
            this.i18n = new MessageBundle(json);
        },
        placeAt: function(elem, pos, CB){
            var $elem = $(elem);
            var $container = this.container;
            pos = pos || 'replaceInner';

            pos = pos.toLocaleLowerCase();

            var posMap = {
                before: 'before',
                beforebegin: 'before',
                after: 'after',
                afterend: 'after',
                append: 'append',
                afterbegin: 'prepend',
                prepend: 'prepend',
                beforeend: 'append',
                replaceinner: 'replaceInner',
                replace: 'replace',
            };

            if(pos === 'replace'){
                $elem.replaceWith($container);
            }else if(posMap[pos] === 'before'){
                $elem.before($container);
            }else if(posMap[pos] === 'after'){
                $elem.after($container);
            }else if(posMap[pos] === 'append'){
                $elem.append($container);
            }else if(posMap[pos] === 'prepend'){
                $elem.prepend($container);
            }else if(posMap[pos] === 'replaceInner'){
                $elem.html('');
                $elem.append($container);
            }else if(posMap[pos] === 'replace'){
                $elem.replaceWith($container);
            }
            var that = this;
            setTimeout(function(){
                that.trigger();
                if(typeof CB === 'function'){
                    CB.call(that);
                }
            }, 0);

        },
        addEventListener: function(type, CB){
            this.addEvent(type, CB);
        },
        removeEventListener: function(type, CB){
            this.removeEvent(type, CB);
        },
        dispatchEvent: function(type){
            if(typeof type === 'object'){
                type = type.type || '';
            }
            this.triggerEvent(type);
        },
        addEvent: function(type, CB){
            if(!this.events[type]){
                this.events[type] = [];
            }
            this.events[type].push(CB);
        },
        removeEvent: function(type){
            if(!this.events[type]){
                return ;
            }

            this.events[type].length = 0;
        },
        triggerEvent: function(type){

            if(type){
                if(!this.events[type]){
                    return ;
                }
                this.triggerEventByType(eventType);
            }else{
                for(var eventType in this.events){
                    this.triggerEventByType(eventType);
                }
            }
        },
        triggerEventByType: function(type){
            var typeEvents = this.events[type];
            for(var i= 0,len=typeEvents.length;i<len;i++){
                var CB = typeEvents[i];
                CB.call(this);
            }
        },
        trigger: function(type){
            this.triggerEvent(type);
        },
        on: function(type, CB){
            this.addEvent(type, CB);
        },
        extend: function(subClass, superClass){
            CommonWidget.extend(subClass, superClass);
        },
        include: function(subObj, supperObj){
            CommonWidget.include(subObj, supperObj);
        }
        // xxx: function(subClass, methods){
        //     ExtendClass(subClass, CommonWidget);
        //     InstallFunctions(subClass.prototype, DONT_ENUM, GUtil.obj2Arr(methods));
        // }
    };


    function obj2Arr(obj){
        var arr = [];
        for(var key in obj){
            arr.push(key);
            arr.push(obj[key]);
        }
        return arr;
    }

    ExtendClass(CommonWidget, TSWidget);
    // CommonWidget.prototype = methods;
    InstallFunctions(CommonWidget.prototype, DONT_ENUM, obj2Arr(methods));


	// SetNativeFlag(CommonWidget);
	return CommonWidget;
});