define('ts/widgets/CommonFormField', [
    'ts/widgets/CommonWidget',
    'dojo/text!ts/widgets/htm/CommonFormField.html',
    'dojo/css!ts/widgets/css/CommonFormField.css',
    'dojo/nls!ts/widgets/nls/CommonFormField.json',
    'ts/util/Cryption!',
    'knockout.validation'
], function(CommonWidget, html, css, json,Cryption){
    'use strict';

    var i18n = null;
    function CommonFormField(opts){
        CommonWidget.call(this, {html: html, css: css, json: json});
        i18n = this.i18n;
        this.container = null;
        this.initialize.apply(this, arguments);
    }

    CommonFormField.create = function(opts){
        var $container = $(opts.container);
        var fields = opts.fields;

        var commonFormField = new CommonFormField();
        commonFormField.loadData(fields);
        commonFormField.placeAt($container, opts.pos);
        return commonFormField;
    };

    var methods = {
        initialize: function(opts){
            var that = this;

            this.opts = $.extend(this.opts, opts);
            var url = this.opts.url;

            this.container = $(this.rootElement);

            ko.validation.configure({
                decorateInputElement: true,
                registerExtenders: true,
                messagesOnModified: true,
                insertMessages: false,
                parseInputAttributes: true,
                errorClass: 'has-error'
            });
            ko.validation.configuration.insertMessages=false;
            function FormFieldViewModel(){
                var self = this;
                self.fields = ko.observableArray([]);
                self.submitGroup = ko.observableArray([]);
                self.cancelBtnIsShow = ko.observable(true);
            }

            this.vm = new FormFieldViewModel();

            this.vm.errors = ko.validation.group(this.vm.fields);

            this.addEventListener("DOMNodeInserted",function(){
                that.createCompleteCallback();
            });
        },
        createCompleteCallback: function(){
            ko.applyBindings(this.vm, this.container[0]);
//            this.loadSimulateData();
            // this.loadData();
        },
        loadData: function(data){
            var that = this;
            // data = [{
            //     _text: '平台类型',
            //     _type: 'select',
            //     _name: 'platformType',
            //     _options: [
            //         {val: '0', text: 'IVM'},
            //         {val: '1', text: 'XCAT'},
            //         {val: '2', text: 'HMC'},
            //     ],
            //     _selectedOption: 0,
            // },{
            //     _type: 'input',
            //     _name: 'platFormName',
            //     _text: '平台名称',
            //     _valid: {
            //         required: {
            //             message: "请输入平台名称",
            //             params: true
            //         },
            //         pattern: {
            //             message: '请输入正确的平台名称格式',
            //             params: '^[a-z0-9_-]{3,16}$'
            //         }
            //     }
            // },{
            //     _type: 'textarea',
            //     _name: 'platFormDesc',
            //     _text: '平台描述'
            // },{
            //     _type: 'password',
            //     _name: 'platFormName',
            //     _text: '用户密码'
            // },{
            //     _type: 'checkbox',
            //     _name: 'platFormName',
            //     _text: '记住密码',
            //     _direction: 'h',    //h或horizontal， v或vertical， 默认h
            //     _data: [
            //         {val: '0', text: 'IVM', isChecked: true},
            //         {val: '1', text: 'XCAT'},
            //         {val: '2', text: 'HMC'}
            //     ]
            // },{
            //     _type: 'radio',
            //     _name: 'sex',
            //     _text: '性别',
            //     _direction: 'h',    //h或horizontal， v或vertical, 默认h
            //     _checked: '0',
            //     _data: [
            //         {val: '0', text: '男'},
            //         {val: '1', text: '女'},
            //     ]
            // },{
            //     _isSubmitGroup: true,
            //     _type: 'button',
            //     _name: 'save',
            //     _text: '提交',
            //     _clickCB: function(){
            //         // alert('提交');
            //         that.validate();
            //         $.post('test.do', ko.toJS(that.vm.fields), function(data){
            //             Dialog.close();
            //         });
            //     }
            // },];
            data.forEach(function(field){
                that.processData(field);
            });

            var submitGroup = this.findSubmitGroup(data);

            this.setDefaultSubmitGroup(submitGroup);
            this.vm.fields(data);
            this.vm.submitGroup(submitGroup);
            this.buildVMErrors();


        },
        buildVMErrors: function(){
            var validVM = {};
            this.vm.fields().forEach(function(item){
                if(item._name){
                    validVM[item._name] = item[item._name];
                }
                
            });
            this.vm.errors = ko.validation.group(validVM);
        },
        processData: function(data){
            var that = this;
            data._type = data._type || 'input';
            
            switch(data._type){
                case 'text':
                    data[data._name] = ko.observable(data._val);
                    break;
                case 'select':
                    data._options = ko.observableArray(data._options);
                    data[data._name] = ko.observable(data._selectedOption);
                    if(data._valid){
                        data[data._name].extend(data._valid);
                    }
                    break;
                case 'textarea':
                    data[data._name] = ko.observable(data._val);
                    break;
                case 'password':
                    data[data._name] = ko.observable(data._val);
                    if(data._valid){
                        data[data._name].extend(data._valid);
                    }
                    break;
                case 'checkbox':
                    if(data._data){
                        data._data.forEach(function(o){
                            o.isChecked = ko.observable(o.isChecked || false);
                        });
                    }else{
                        data[data._name] = ko.observable();
                    }

                    break;
                case 'radio':
                    if(data._data){
                        data._checked = ko.observable(data._checked || '0');
                    }else{
                        data[data._name] = ko.observable();
                    }

                    break;
                case 'button':
                    // if(data._isSubmitGroup){
                        var tmpclickCB = data._clickCB || function(){};
                        if(tmpclickCB){
                            data._clickCB = function(){
                                tmpclickCB.apply(that, arguments);
                            }
                        }
                        data['_clsName'] = ko.observable(data['_clsName'] || 'btn-primary');
                    // }

                    break;
                case 'submit':

                    break;
                case 'input':
                default:
                    data[data._name] = ko.observable(data._val);
                    if(data._disable===undefined){
                    	data["_disable"] = ko.observable(true);
                    }else{
                    	data["_disable"] = ko.observable(false);
                    }
                	
                    if(data._valid){
                        data[data._name].extend(data._valid);
                    }
            }

           return data;
        },
        findSubmitGroup: function(data){
            var submitGroup = [];
            data.forEach(function(item){
                if(item._isSubmitGroup){
                    submitGroup.push(item);
                }
            });

            return submitGroup;
        },
        setDefaultSubmitGroup: function(data){
            var cancelBtnIsExsit = false;
            data.forEach(function(item){
                if(item._name === 'cancel'){
                    cancelBtnIsExsit = true;
                }
            });

            if(!cancelBtnIsExsit){
                data.push({
                    _isSubmitGroup: true,
                    _type: 'button',
                    _name: 'cancel',
                    _clsName: ko.observable('btn-default'),
                    _text: i18n.getMsg('cancel'),
                    _clickCB: function(){
                        Dialog.close();
                    }
                });
            }

        },
        getField: function(key, val){
            var actions = [];
            if(arguments.length === 1){
                val = key;
                key = 'name';
            }
            if(typeof val === 'undefined'){
                return this.vm.fields();
            }
            this.vm.fields().forEach(function(itemData){
                if(val === itemData[key]){
                    actions.push(itemData);
                }
            });

            if(actions.length > 1){
                return actions;
            }else if(actions.length === 1){
                return actions[0];
            }
            return null;
        },        
        validate: function(){
            if (this.vm.errors().length == 0) {
                return true;
            } else {
                this.vm.errors.showAllMessages();
                return false;
            }
        },
        getData: function(originData){
            var fields = ko.toJS(this.vm.fields);
            originData = originData || {};
            fields.forEach(function(item){
                var name = item._name;

                if(item._type === 'select'){
                    originData[name] = item[name].val;
                }else if(item._type === 'password'){
                    originData[name] = Cryption.encryptKey(item[name]);
                }else{
                    originData[name] = item[name];
                }
            });

            return originData;
        },
        getWrapData: function(){
           
        },
        addData: function(data){
            
        },
        removeData: function(data){
           
        },
        updateData: function(data){
            
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
                console.log('请求数据失败！');
            });
        }
    }

    ExtendClass(CommonFormField, CommonWidget);
    InstallFunctions(CommonFormField.prototype, DONT_ENUM, GUtil.obj2Arr(methods));

    return CommonFormField;
});