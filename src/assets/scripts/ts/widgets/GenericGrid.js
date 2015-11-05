require.config({
    shim:{
        'koGrid-2.1.1.debug': ['knockout-3.1.0']
    }
});
define('ts/widgets/GenericGrid', [
    'ts/widgets/TSWidget',
    'dojo/text!ts/widgets/htm/GenericGrid.html',
    'dojo/css!ts/widgets/css/GenericGrid.css',
    'dojo/nls!ts/widgets/nls/GenericGrid.json',
    'dojo/css!KoGrid/KoGrid.css'
], function(TSWidget, html, css, json) {
    'use strict';
    require(['KoGrid/koGrid-2.1.1.debug'
             ],function(koGrid) {});
    var i18n=TSWidget.prototype.i18n.createBranch(json);
    function GenericGrid(id, initParams) {
        TSWidget.call(this);
        i18n = this.i18n;
        this.container = null;
        this.initialize.apply(this, arguments);
    }

    var methods = {
        initialize: function(opts) {
            var that = this;
            var defaultOpts = {
                showColumnMenu: false,
                showFilter: false,
                gridSearchCondition: []

            };

            this.opts = $.extend(defaultOpts, opts);
            var url = this.opts.url;

            this.container = $(this.rootElement);

            function PageViewModel() {
                var self = this;

                self.isCustomSearch = ko.observable(false);
                self.gridActions = ko.observableArray([]);
                self.gridSearchCondition = ko.observableArray([]);
                self.search = function(itemData, e) {
                    if(e.keyCode === 13) {
                        self.clickSearchBtnCallback();
                        $(e.currentTarget).blur();
                        return false;
                    }
                    return true;
                }

                self.myData = that.opts.listDataObservable || ko.observableArray([]);

                self.clickActionsItemCallback = function(itemData, e) {
                    if(itemData.clickCB) {
                        itemData.clickCB.call(that, itemData, self.gridActions, e);
                    }
                }

                self.clickSearchBtnCallback = function(e) {
                    self.getPagedDataAsync(self.pagingOptions.pageSize(), self.pagingOptions.currentPage());
                }

                self.filterOptions = {
                    filterText: ko.observable(""),
                    useExternalFilter: true
                };

                self.pagingOptions = {
                    pageSizes: ko.observableArray([10, 20, 50, 100]),
                    pageSize: ko.observable(50),
                    totalServerItems: ko.observable(0),
                    currentPage: ko.observable(1),
                    totalPages: ko.observable(0)
                };

                self.ddCurrentPage = ko.computed(function() {
                    if(self.pagingOptions.currentPage() < 1) {
                        self.pagingOptions.currentPage(1);
                    }
                    if(self.pagingOptions.currentPage() > self.pagingOptions.totalPages() && self.pagingOptions.totalPages() != 0) {
                        self.pagingOptions.currentPage(self.pagingOptions.totalPages());
                    }
                });

                self.setPagingData = function(data, page, pageSize, totalItems, totalPages) {
                    var pagedData = [];
                    pagedData = data;
                    that.setObservableProp(pagedData);

                    self.myData(pagedData);
                    self.pagingOptions.totalServerItems(totalItems);
                    self.pagingOptions.totalPages(totalPages);
                };

                self.getPagedDataAsync = function (pageSize, page, searchText) {
                    if(!url) return;

                    setTimeout(function () {
                        var data;
                        var dataObj = {
                            pageNo: self.pagingOptions.currentPage(),
                            pageSize: self.pagingOptions.pageSize()
                        };

                        dataObj.params = that.opts.params;

                        if(that.opts.gridSearchCondition) {
                            dataObj.condition = self.getConditionMap();
                        }

                        if (searchText) {
                            var ft = searchText.toLowerCase();
                            $.post(url, dataObj, function(largeLoad) {
                                data = largeLoad.rows.filter(function(item) {
                                    return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                                });
                                self.setPagingData(data, page, pageSize, largeLoad.totalRows, largeLoad.totalPages);
                            });
                        } else {
                            $.post(url, dataObj, function(largeLoad) {
                                self.setPagingData(largeLoad.rows, page, pageSize, largeLoad.totalRows, largeLoad.totalPages);
                            });
                        }
                    }, 100);
                };

                self.filterOptions.filterText.subscribe(function (data) {
                    self.getPagedDataAsync(self.pagingOptions.pageSize(), self.pagingOptions.currentPage(), self.filterOptions.filterText());
                });

                self.pagingOptions.pageSizes.subscribe(function (data) {
                    self.getPagedDataAsync(self.pagingOptions.pageSize(), self.pagingOptions.currentPage(), self.filterOptions.filterText());
                });
                self.pagingOptions.pageSize.subscribe(function (data) {
                    self.getPagedDataAsync(self.pagingOptions.pageSize(), self.pagingOptions.currentPage(), self.filterOptions.filterText());
                });
                self.pagingOptions.currentPage.subscribe(function (data) {
                    self.getPagedDataAsync(self.pagingOptions.pageSize(), self.pagingOptions.currentPage(), self.filterOptions.filterText());
                });

                self.getPagedDataAsync(self.pagingOptions.pageSize(), self.pagingOptions.currentPage());

                self.gridOptions = that.opts;
                self.gridOptions.data = self.myData;
                self.gridOptions.enablePaging = that.opts.enablePaging === false ? false : true;
                self.gridOptions.pagingOptions = self.pagingOptions;
                self.gridOptions.filterOptions = self.filterOptions;
                self.gridOptions.footerRowHeight = 35;
                self.gridOptions.rowTemplate = '<div data-bind="attr:{title: $grid.setTitle($data.entity)}, foreach: $grid.visibleColumns, css: { \'ui-widget-content\': $grid.jqueryUITheme }"><div data-bind="attr: { \'class\': cellClass() + \' kgCell col\' + $index(), title: typeof $data.getProperty($parent) !== \'undefined\'? ($data.getProperty($parent) + \'\').replace(/<[^>]+>/g,\'\') : \'\'}, kgCell: $data"></div></div>';;

                self.getConditionMap = function() {
                    var condArr = ko.toJS(self.gridSearchCondition);
                    var condMap = {};
                    var key = '';
                    var val = '';
                    condArr.forEach(function(cond) {
                        if(cond.type === 'select') {
                            if(cond.inputName) {
                                key = cond.selectedOption[0];
                                val = cond[cond.inputName];
                                if(key == -1) {
                                    return 
                                }
                            }else{
                                key = cond.name;
                                val = cond.selectedOption[0];
                                if(val == -1) {
                                    return 
                                }
                            }

                            condMap[key] = val;

                        }else if(cond.type === 'input') {
                            key = cond.name;
                            val = cond[cond.aliasName || key];
                            condMap[key] = val;
                        }else if(cond.type === 'checkbox') {
                            key = cond.name;
                            val = [];
                            cond.data.forEach(function(item) {
                                if(item.checked) {
                                    val.push(item.val);
                                }
                            });
                            condMap[key] = val;
                        }
                        //button
                    });

                    that.opts.gridSearchCondition.forEach(function(cond) {
                        if(cond.type === 'fixed') {
                            condMap[cond.name] = cond.val;
                        }
                    });

                    return condMap;
                };
            };

            this.vm = new PageViewModel();
            if(this.opts.gridActions) {
                this.opts.gridActions.forEach(function(itemData) {
                    itemData.text = ko.observable(itemData.text);
                    itemData.clsName = ko.observable(itemData.clsName || '');
                    itemData.iconClsName = ko.observable(itemData.iconClsName);
                });
                this.vm.gridActions(this.opts.gridActions);
            }


            if(this.opts.gridSearchCondition) {
                var newCondition = [];
                this.opts.gridSearchCondition.forEach(function(cond) {
                    cond.type = cond.type || 'input';
                    cond.clsName = ko.observable(cond.clsName || '');

                    cond.wrapWidth = cond.wrapWidth ? cond.wrapWidth + '' : '50%';

                    if(!/px|%/.test(cond.wrapWidth)) {
                        cond.wrapWidth += 'px';
                    }

                    if(cond.search) {
                        that.vm.isCustomSearch(true);
                        if(cond.search === true) {
                            cond.search = {
                                text: i18n.getMsg('search'),
                                clickCB: function(data) {
                                    return true;
                                }
                            }
                        }

                        var searchClickCB = cond.search.clickCB;
                        cond.search.clickCB = function() {
                            var args = Array.prototype.slice.call(arguments, 0);
                            if(searchClickCB) {
                                if(searchClickCB.apply(that, args)) {
                                    that.vm.clickSearchBtnCallback();
                                }
                            }
                        }

                    }

                    if(cond.type === 'select') {
                        cond.options.unshift({val: '-1', text: i18n.getMsg('select')});
                        if(cond.selectedOptionIndex > 0 && $.type(cond.selectedOption) === 'undefined') {
                            if(cond.options && cond.options.length > cond.selectedOptionIndex) {
                                cond.selectedOption = [cond.options[cond.selectedOptionIndex].val];
                            }
                        }
                        cond.options = ko.observableArray(cond.options);
                        cond.selectedOption = ko.observableArray(cond.selectedOption || ['-1']);
                        cond.inputName = cond.inputName || '';
                        if(cond.inputName) {
                            cond.wrapWidth = '100%';
                            cond[cond.inputName] = ko.observable('');
                        }
                        var changeCB = cond.changeCB;
                        cond.changeCB = function() {
                            var args = Array.prototype.slice.call(arguments, 0);
                            var newArgs = [that, cond.selectedOption()].concat(args);
                            if(changeCB) {
                                if(changeCB.apply(that, newArgs)) {
                                    that.vm.clickSearchBtnCallback();
                                }
                            }
                        }
                    }else if(cond.type === 'input') {
                        cond[cond.aliasName || cond.name] = ko.observable();
                    }else if(cond.type === 'button') {
                        var clickCB = cond.clickCB;
                        cond.clickCB = function() {
                            clickCB.apply(that, arguments);
                        }
                    }else if(cond.type === 'checkbox') {
                        cond.data.forEach(function(item) {
                            item.checked = ko.observable(item.checked || false);
                        });
                        var changeCB = cond.changeCB || function() {return true;};
                        cond.changeCB = function() {
                            var args = Array.prototype.slice.call(arguments, 0);
                            var newArgs = null;
                            var selectedArr = [];

                            cond.data.forEach(function(item) {
                                if(item.checked()) {
                                    selectedArr.push(ko.toJS(item));
                                };
                            });

                            newArgs = args.concat([selectedArr, cond.data]);

                            if(changeCB) {
                                if(changeCB.apply(that, newArgs)) {
                                    if(changeCB.thread) {
                                        clearTimeout(changeCB.thread);
                                        changeCB.thread = null;
                                    }
                                    changeCB.thread = setTimeout(function() {
                                        changeCB.thread = null;
                                        that.vm.clickSearchBtnCallback();
                                    }, 1000);
                                }
                            }
                        }
                    }

                    if(cond.type != 'fixed') {
                        newCondition.push(cond);
                    }

                });
                this.vm.gridSearchCondition(newCondition);
            }

            // tmp
            ko.applyBindings(this.vm, this.container[0]);
            // this.addEventListener("DOMNodeInserted",function() {
            //     that.createCompleteCallback();
            // });
        },
        createCompleteCallback: function() {
            ko.applyBindings(this.vm, this.container[0]);
        },
        updateGridLayout: function() {
            this.container.find('.koGrid').trigger('updateGridLayout');
        },

        //label-default, label-primary, label-success,
        //label-info, label-warning, label-danger,
        statusFormatter: function(data, statusInfo) {
            if($.type(statusInfo) !== 'array') return data;

            var newData = '';
            var clsName = 'label-default';
            var text = '';

            statusInfo.some(function(item) {
                if(data == item.key) {
                    clsName = item.clsName || clsName;
                    text = item.text || text;
                    return true;
                }
            });

            text = text || data;

            newData = '<span class="label '+ clsName +'">'+ text +'</span>';
            return newData;
        },
        setObservableProp: function(data) {
            var observableProp = this.opts.observableProp;

            if(!observableProp || !observableProp.length) {
                return data;
            }

            data.forEach(function(itemData) {
                observableProp.forEach(function(itemProp) {
                    var val = itemData[itemProp]
                    if(val) {
                        if(typeof val === 'string') {
                            itemData[itemProp] = ko.observable(val);
                        }else if(typeof val === 'object') {
                            itemData[itemProp] = ko.observableArray(val);
                        }
                    }
                });
            });
        },
        selectLoadData: function(selectCond, arr) {
            arr.unshift({val: '-1', text: i18n.getMsg('select')});
            selectCond.options(arr);
        },
        getGridSearchCond: function(key, val) {
            var actions = [];
            if(arguments.length === 1) {
                val = key;
                key = 'name';
            }
            if(typeof val === 'undefined') {
                return this.vm.gridSearchCondition();
            }
            this.vm.gridSearchCondition().forEach(function(itemData) {
                if(val === itemData[key]) {
                    actions.push(itemData);
                }
            });

            if(actions.length > 1) {
                return actions;
            }else if(actions.length === 1) {
                return actions[0];
            }
            return null;
        },
        getGridAction: function(key, val) {
            var actions = [];
            if(arguments.length === 1) {
                val = key;
                key = 'name';
            }
            if(typeof val === 'undefined') {
                return this.vm.gridActions();
            }
            this.vm.gridActions().forEach(function(itemData) {
                if(val === itemData[key]) {
                    actions.push(itemData);
                }
            });

            if(actions.length > 1) {
                return actions;
            }else if(actions.length === 1) {
                return actions[0];
            }
            return null;
        },
        disableActions: function(key, arr) {
            var that = this;
            if($.type(arr) === 'string') {
                arr = [arr];
            }

            arr.forEach(function(item) {
                var actions = that.getGridAction(key, item);
                that.addClass(actions, 'disabled');
            });
        },
        enableActions: function(key, arr) {
            var that = this;
            if($.type(arr) === 'string') {
                arr = [arr];
            }

            arr.forEach(function(item) {
                var actions = that.getGridAction(key, item);
                that.removeClass(actions, 'disabled');
            });
        },
        hideActions: function(key, val) {
            var that = this;
            var actions = this.getGridAction(key, val);
            if(actions === null) return ;
            if($.type(actions) === 'object') {
                actions = [actions];
            }
            actions.forEach(function(item) {
                that.addClass(item, 'hide');
            });
        },
        showActions: function(key, val) {
            var that = this;
            var actions = this.getGridAction(key, val);
            if(actions === null) return ;
            if($.type(actions) === 'object') {
                actions = [actions];
            }
            actions.forEach(function(item) {
                that.removeClass(item, 'hide');
            });
        },
        addClass: function(action, clsName) {
            if(!this.hasClass(action, clsName)) {
                var currClsName = action.clsName();
                action.clsName(currClsName + ' ' + clsName);
            }
        },
        removeClass: function(action, clsName) {
             if(this.hasClass(action, clsName)) {
                var currClsName = action.clsName();
                var reg = new RegExp(' '+ clsName +' ', 'g');
                currClsName = $.trim(currClsName);
                currClsName = ' ' + currClsName + ' ';
                currClsName = currClsName.replace(reg, ' ');
                currClsName = currClsName.replace(/(^\s*)|(\s*$)/g,'');
                action.clsName(currClsName);
            }
        },
        hasClass: function(action, clsName) {
            var currClsName = action.clsName();
            currClsName = ' ' + currClsName + ' ';
            return currClsName.indexOf(' ' + clsName + ' ') >= 0;
        },
        setActionsClsName: function(clsName) {
            var action = null;
            this.vm.gridActions().forEach(function(itemData) {
                itemData.clsName(clsName);
                itemData.handling = true;
            });

        },
        loadData: function(data) {
        },
        reloadData: function() {
            this.vm.clickSearchBtnCallback();
        },
        getData: function() {
            return ko.toJS(this.getWrapData());
        },
        getWrapData: function() {
            var data = [];
            data = this.vm.myData().filter(function(item) {
                return item.__kg_selected__;
            });

            return data;
        },
        getDataById: function(data, id) {
            id = id || 'id';
            if(!Array.isArray(data)) {
                data = [data];
            }
            var newData = [];
            newData = this.vm.myData().filter(function(item) {
                return GUtil.array.indexOf(data, item, id) >= 0;
            });

            return newData;
        },
        addData: function(data) {//一般添加数据都是第一页的最上面,以后会扩展算定义添加位置
            var that=this;
            var addCount = 0;
             if($.type(data) === 'array') {
                addCount = data.length;
                data.forEach(function(item) {
                    that.vm.myData.unshift(item);
                 });
             }else{
                addCount = 1;
                that.vm.myData.unshift(data);
             }

            that.vm.pagingOptions.totalServerItems(that.vm.pagingOptions.totalServerItems() + addCount);           
        },
        removeData: function(data, id) {
            data = data ? this.getDataById(data, id) : this.getWrapData();
            if(data) {
                data = data.length ? data : [data];
                this.vm.myData.removeAll(data);
            }else{
                this.vm.myData.removeAll();
            }

        },
        updateData: function(data, id) {
            id = id || 'id';
            data = data || this.getWrapData();
            data = data.length ? data : [data];
            var myData = this.vm.myData();
            var dataMap = {};
            data.forEach(function(item) {
                dataMap[item[id]] = item;
            });

            myData.forEach(function(o) {
                var item = null;
                if(item = dataMap[o[id]]) {
                    for(var key in o) {
                        if(key in item) {
                            if(ko.isObservable(o[key])) {
                                o[key](item[key]);
                            }else{
                                o[key] = item[key];
                            }
                        }
                    }
                }
            });
            var pageOpts = this.vm.pagingOptions;
            var filterOpt = this.vm.filterOptions;

            //ko-grid目前不能设置监听属性，所以重新加载更新过的数据
            this.vm.setPagingData(ko.toJS(myData), pageOpts.currentPage(), pageOpts.pageSize(), pageOpts.totalServerItems(), pageOpts.totalPages());
        },
        updateDataByProp: function(key, val, newVal) {
            var myData = this.vm.myData();
            var pageOpts = this.vm.pagingOptions;
            var filterOpt = this.vm.filterOptions; 

            myData.forEach(function(item) {
                if(key in item && item[key] === val) {
                    item[key] = newVal;
                }
            });

            this.vm.setPagingData(ko.toJS(myData), pageOpts.currentPage(), pageOpts.pageSize(), pageOpts.totalServerItems(), pageOpts.totalPages());

        },
        loadSimulateData: function(url, callback) {
        }
    }

    function obj2Arr(obj) {
        var arr = [];
        for(var key in obj) {
            arr.push(key);
            arr.push(obj[key]);
        }
        return arr;
    }

    ExtendClass(GenericGrid, TSWidget);

    InstallFunctions(GenericGrid.prototype, DONT_ENUM, obj2Arr(methods));
    SetProperties(GenericGrid.prototype, DONT_ENUM, [
        "template", html,
        "i18n", i18n
    ]);

    return GenericGrid;
});
