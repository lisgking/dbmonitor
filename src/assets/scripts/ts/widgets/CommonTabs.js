define('ts/widgets/CommonTabs', [
    'ts/widgets/CommonWidget',
    'dojo/text!ts/widgets/htm/CommonTabs.html',
    'dojo/css!ts/widgets/css/CommonTabs.css'
], function(CommonWidget, html, css){
	'use strict';

	function CommonTabs(opts){
        CommonWidget.call(this, {html: html, css: css, json: null});
        this.container = null;
        this.initialize.apply(this, arguments);
        window.tabs = this;
	}

    var methods = {
        initialize: function(opts){
            var that = this;
            this.container = $(this.rootElement);

            function ViewModel(){
                var self = this;

                self.tabList= ko.observableArray([]);
                self.clickTab = function(itemData, e){
                    self.tabList().forEach(function(tab){
                        tab.isActive(false);
                    });
                    itemData.isActive(true);
                    if(opts && opts.clickTab){
                        opts.clickTab.call(that, ko.mapping.toJS(itemData));
                    }

                }
                return self;
            }

            this.vm = ko.mapping.fromJS({});
            this.vm = ViewModel.call(this.vm);
            
            this.addEventListener("DOMNodeInserted",function(){
            	ko.applyBindings(this.vm, this.container[0]);
            });
            
            this.addEventListener("activeEvent",function(){
            	this.vm.clickTab(this.vm.tabList()[0]);
            });

        },

        createCompleteCallback: function(){
            

//            this.loadSimulateData();
        },
        loadData: function(tabsData){
            var first = true;
            tabsData.forEach(function(tab){
                if(first){
                    first = false;
                    tab.isActive = true;
                }else{
                    tab.isActive = false;
                }
                tab.id = 'tab-' + GUtil.getUUID();

            });

            this.vm = ko.mapping.fromJS({tabList: tabsData}, this.vm);
            if(this.vm.tabList().length > 0){
                this.vm.tabList()[0].isActive(true);
            }
        },
        getData: function(){

        },
        req: function(){

        },
        loadSimulateData: function(){
            this.loadData([
                {title: '基本信息', widgetClass: 'xcat/cluster/Cluster'},
                {title: '平台列表', widgetClass: ''},
                {title: '分区列表', widgetClass: ''},
                {title: '日志', widgetClass: ''},
            ]);
        }

    };

    ExtendClass(CommonTabs, CommonWidget);
    InstallFunctions(CommonTabs.prototype, DONT_ENUM, GUtil.obj2Arr(methods));

	return CommonTabs;
});