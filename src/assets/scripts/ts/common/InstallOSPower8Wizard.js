define('ts/common/InstallOSPower8Wizard', [
    'ts/widgets/TSWidget',
    'ts/widgets/GenericWizard',
    'dojo/text!ts/common/InstallOSPower8Wizard.html',
    'dojo/css!ts/common/InstallOSPower8Wizard.css',
    'dojo/nls!ts/common/dataCenter.json'
], function(TSWidget, GenericWizard, html, css, json){
    'use strict';

    var i18n = TSWidget.prototype.i18n.createBranch(json);
    function InstallOSPower8Wizard(opts){
        TSWidget.call(this);
        i18n = this.i18n;
        this.opts = null;
        this.container = null;
        this.currStep = 0;
        this.initialize.apply(this, arguments);
    }

    var methods = {
        initialize: function(opts){
            var that = this;
            var root = this;
            this.opts = $.extend({}, opts);
            this.container = $(this.rootElement);
            var model = {
                LparList: [],
                checkResultList: [],
                LparConfig:{
                    // lparPcid: '',
                    hostPassword: '',
                    lparPassword: '',
                    // ip: '',
                    installDisk: '',
                    imageId: ''
                },
                OSList: []
            };

            model.LparList = opts.data;
            // model.LparConfig.lparPcid = opts.data.lparPcid;

            var widgets = this.widgets = [
                {
                    widgetClass: 'ts/common/LparAuthorizationNewPower8',
                    title: i18n.getMessage('authorization'),
                    showWidgetCallback: function(wt){
                        wt.loadData(model.LparConfig);                    
                    },
                    btns: {
                        next: false,
                        findHost: {
                            text: i18n.getMessage('next'),
                            callback: function(wt){
                                var that = this;
                                var jsonData = {};

                                if(wt.validate() === false){
                                    return ;
                                }

                                var lparConfigData = wt.getData();
                                $.extend(model.LparConfig, {
                            		hostPassword:lparConfigData.hostPassword,
                            		lparPassword:lparConfigData.lparPassword,
                            		installDisk:lparConfigData.installDisk
                                });
                                model.LparList.forEach(function(lpar){
                                	lpar.disks = lparConfigData.disks;
                                })
                                that.jumpStep('next');
                            }
                        }
                    }
                },{
                    widgetClass: 'ts/common/OSGridPower8',
                    title: i18n.getMessage('selectOS'),
                    widgetOpts: {
                        url: root.opts.lparConfigUrl
                    },
                    showWidgetCallback: function(wt){
                         wt.loadData(model.OSList);
                    },
                    btns: {
                        next: false,
                        register: {
                            text: i18n.getMessage('assginIP'),
                            callback: function(wt){
                               var grid=wt.selectedItems;
                               if(grid.length===0){
                            	   Dialog.alert(i18n.getMessage("please choose to associate the operating system"));
                            	   return false;
                               }
                                var lpartData = grid;
                                model.LparConfig.imageId = lpartData[0].imageId;
                                this.jumpStep('next');
                            }
                        }
                    }
                },{
                    widgetClass: 'ts/common/LparAssginIpGridPower8',
                    title: i18n.getMessage('assginIP'),
                    showWidgetCallback: function(wt){
                        wt.loadData(model.LparList);
                    },
                    btns: {
                        next: false,
                        register: {
                            text: i18n.getMessage('install'),
                            callback: function(wt){
                                if(wt.validate() === false){
                                    return ;
                                }

                                var lpartData = wt.getData();
                                var sendData = model.LparConfig;
                                sendData.lparInfo = lpartData;
                                this.req(root.opts.installOSUrl, sendData, function(data){
                                    if(data.flag === '1'){
                                        Dialog.alert(i18n.getMessage('installOSPrevTip'));
                                        that.closeDialog();
                                    }else{
                                        Dialog.alert(data.msg || i18n.getMessage('installOSPrevFailTip'));
                                    }
                                });
                            }
                        }
                    }
                }
            ];

            var opts = $.extend({}, this.opts, {widgets: widgets});
            if(!opts.cancelCB){
                opts.cancelCB = function(){
                    that.closeDialog();
                };
            }
            //一般调用
            var steps = new GenericWizard({
                widgets: widgets,
                cancelCB: function(){
                    that.closeDialog();
                }
            });

            this.container.append(steps.container);
        }
    }

    ExtendClass(InstallOSPower8Wizard, TSWidget);
    InstallFunctions(InstallOSPower8Wizard.prototype, DONT_ENUM, GUtil.obj2Arr(methods));
    SetProperties(InstallOSPower8Wizard.prototype,DONT_ENUM,[
 		"template",html,
 		"i18n",i18n
 	]);
    SetNativeFlag(InstallOSPower8Wizard);
    return InstallOSPower8Wizard;
});