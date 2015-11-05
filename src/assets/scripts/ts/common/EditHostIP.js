define('ts/common/EditHostIP', [
    'ts/widgets/CommonWidget',
    'ts/widgets/CommonFormField',
    'dojo/text!ts/common/EditHostIP.html',
    'dojo/css!ts/common/EditHostIP.css',
    'dojo/nls!ts/common/dataCenter.json'
], function(CommonWidget, CommonFormField, html, css, json){
    'use strict';

    var i18n = null;
    function EditHostIP(opts){
        CommonWidget.call(this, {html: html, css: css, json: json});
        i18n = this.i18n;
        this.opts = null;
        this.container = null;
        this.initialize.apply(this, arguments);
    }

    var methods = {
        initialize: function(opts){
            var that = this,
                $container = this.container = $(this.rootElement),
                $listItems = null;

            this.opts = $.extend({}, opts);

            ko.validation.configure({
                decorateInputElement: true,
                registerExtenders: true,
                messagesOnModified: true,
                insertMessages: false,
                parseInputAttributes: true,
                errorClass: 'has-error'
//                errorMessageClass: 'error-message'
            });

            ko.validation.configuration.insertMessages = false;


            function ViewModel(){
                var self = this;
//                self.checkedAllBtn = ko.observable(false);
                self.hostList = ko.observableArray([]);
//                self.hostList = ko.mapping.fromJS(data);

                self.checkedAll = ko.observable(false);
                self.isItem = ko.observable(true);

                self.selectedCount = function(){
                    var node = self.hostList();
                    var selectedCount = 0;
                    var totalCount = node.length;

                    node.forEach(function(o){
                        if(o.checked() === true){
                            selectedCount++;
                        }
                    });
                    return '(' + selectedCount + '/'+ totalCount + ')';
                };
                self.allCheck = ko.computed(function(){
                    var flag = self.checkedAll();

                    if(self.isItem()){
                        return ;
                    }
                    self.hostList().forEach(function(o){
                        o.checked(flag);
                    });
                });
                self.itemCheck = ko.computed(function(){
                    var result = true;

                    self.hostList().forEach(function(o){
                        if(o.checked() === false){
                            result = false;
                            return ;
                        }
                    });

                    self.checkedAll(result);
                });

                self.clickAll = function(){
                    self.isItem(false);
                };

                self.clickItem = function(itemData){
                    self.isItem(true);
                };

                self.save = function(){
                    that.req();
                }

                return self;
            }

//            this.vm = new ViewModel();

            this.vm = ko.mapping.fromJS({});
            this.vm = ViewModel.call(this.vm);

            window.vm = this.vm;
//            window.vmRL = vm;

            $container.on('blur', 'input.ip', function(e){
                var $this = $(this);
                var val = $this.val();
                var reg = /((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)/;
                if(!reg.test(val)){
                    $this.addClass('has-error');
                    Dialog.alert(i18n.getMsg('please enter the IP the correct format'));
//                    $this.focus();
                }else{
                    $this.removeClass('has-error');
                }
            });

        },

        validate: function(){
            var result = false;
            var reg = /((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)/;

            ko.mapping.toJS(this.vm).hostList.forEach(function(host){
                if(host.checked === true){
                    result = true;
                    return false;
                }
            });

            if(result === false){
                Dialog.alert(i18n.getMsg('please select to edit the host'));
                return false;
            }

            //ip验证
            result && this.container.find('input.ip').each(function(){
                var $this = $(this);
                if(!reg.test(this.value)){
                    result = false;
                    $this.addClass('has-error');
                }else{
                    $this.removeClass('has-error');
                }
            });

            if(result === false){
               Dialog.alert(i18n.getMsg('please enter the IP the correct format'));
                return false;
            }

            return result;
        },
        createCompleteCallback: function(){
            var originData = this.opts.data;
            ko.applyBindings(this.vm, this.container[0]);

            this.loadData(originData);
        },

        loadData: function(data){
            if($.type(data) === 'array'){
                data.forEach(function(node){
                    node.checked = true;
                });
                ko.mapping.fromJS({hostList: data}, this.vm);

            }else{
                this.vm.hostList.push(data);
            }
        },
        getData: function(){
            var data = [];
            data = ko.mapping.toJS(this.vm).hostList.filter(function(host){
                return host.checked;
            });

            return data;
        },
        load: function(url, callback){

        },
        req: function(){
            var that = this;
            var jsonData = this.getData();

            if(!this.validate()) return ;

            $.post(that.opts.url, jsonData, function(data){
                if(data.flag === '1'){
                    Dialog.close();
                    Dialog.alert(i18n.getMsg('editHostIPSucc'));
                }else{
                    Dialog.alert(data.msg);
                }
            });
        }
    }

    ExtendClass(EditHostIP, CommonWidget);
    InstallFunctions(EditHostIP.prototype, DONT_ENUM, GUtil.obj2Arr(methods));

    return EditHostIP;
});