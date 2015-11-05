define('ts/widgets/CommonTree', [
    'ts/widgets/CommonWidget',
    'dojo/text!ts/widgets/htm/CommonTree.html',
    'dojo/css!ts/widgets/css/CommonTree.css'
], function(CommonWidget, html, css){
	'use strict';

	function CommonTree(opts){
        CommonWidget.call(this, {html: html, css: css, json: null});
        this.container = null;
        this._treeData = null;
        this._arrData = null;
        this._mapData = null;
        this._events = {};
        this.initialize.apply(this, arguments);
        window.tabs = this;
	}

    var methods = {
        initialize: function(opts){
            var that = this;
            this.opts = $.extend({}, opts);
            this.container = $(this.rootElement);

            function ViewModel(){
                var self = this;

                self.nodeList = ko.observableArray([]);
                self.prevSelectNode = {elem: null, data: null};

                self.switchClsName = function(itemData, e){
                    var clsName = 'button level0 switch ';
                    // clsName += itemData.open() ? 'bottom_open' : 'bottom_close'
                    clsName += itemData.open() ? 'noline_open' : 'noline_close';
                    return clsName;
                }

                self.iconClsName = function(itemData, e){
                    var clsName = 'button default-icon ';
                    // clsName += !itemData.parent() ? 'ico_docu' : 
                    //     itemData.open() ? 'ico_open' : 'ico_close';
                    clsName += itemData.type;
                    return clsName;
                }

                self.nodeClsName = function(itemData, e){
                    var clsName = '';
                    clsName += itemData.selected() ? 'curSelectedNode' : ''; 
                    return clsName;
                }

                self.switchNode = function(itemData, e){
                    itemData.open(!itemData.open());
                    if(itemData.open()){
                        self.expand(itemData, e);
                    }else{
                        self.collapse(itemData, e);
                    }
                    that.switchNode(itemData, e);
                }

                self.clickNode = function(itemData, e){
                    if(itemData.selected()) return ;
                    self.selectedNode(itemData, e);
                    that.clickNode(itemData, e);
                }

                self.selectedNode = function(itemData, e){
                    if(!itemData.selected()){
                        if(self.prevSelectNode.data){
                            self.prevSelectNode.data.selected(false);
                        }
                        self.prevSelectNode.data = itemData;
                        itemData.selected(true);
                    }else{
                        itemData.selected(false);
                    }

                }

                self.dblclickNode = function(itemData, e){
                    self.switchNode(itemData, e);
                }

                self.collapse = function(itemData, e){
                    that.collapse(itemData, e);
                }

                self.expand = function(itemData, e){
                    that.expand(itemData, e);
                }

                self.selectNode = function(itemData, e){
                   that.selectNode(itemData, e); 
                }
                return self;
            }

            this.vm = new ViewModel();

            this.addEventListener("DOMNodeInserted",function(){
                that.createCompleteCallback();
                that.reqData();
            });

        },

        createCompleteCallback: function(){
            ko.applyBindings(this.vm, this.container[0]);
        },
        reqData: function(url, type, pid){
            var that = this;
            var url = url || this.opts.url;

            url += type ? '&type=' + type : '';
            url += pid ? '&pid=' + pid : '';

            $.post(url, {}, function(data){
                that.loadData(data, pid);
            });
        },
        loadData: function(data, pid){
            var that = this;
            this.addDefaultProp(data, [
                {key: 'selected', val: false, isObservable: true},
                {key: 'open', val: false, isObservable: true},
                {
                    key: 'parent', 
                    isObservable: true, 
                    val: function(item){
                        return item.parent !== false;
                    }
                },
                {
                    key: 'pid', 
                    val: function(item, pid){
                        if(item.id == 0){
                            return '';
                        }else{
                            return item.pid = pid || 0;
                        }
                    }
                },
                {
                    key: 'iconClsName',
                    isObservable: true,
                    val: function(item){
                        if(that.opts.iconCB){
                            return that.opts.iconCB.call(that, item);
                        }
                        return item.type;
                    }
                },
                {key: 'name', val: '', isObservable: true},
                {key: 'children', val: [], isObservable: true},
            ], pid);

            if(!pid && !this.firstRun){
                this.firstRun = true;
                this.vm.nodeList(data);
            }else{
                var parentNode = this.getNode(pid);
                if(!parentNode){
                    parentNode = this.firstNode();
                    data = data[0].children();
                }
                this.updateData(parentNode, data);
                // parentNode.children(data);
                // Array.prototype.push.apply(parentNode.children, data);
            }
            this.dataHandle(this.vm.nodeList, pid);
            if(this.vm.prevSelectNode.data == null){
                var firstNode = this.firstNode();
                // firstNode.selected(true);
                firstNode.open(true);
                this.vm.clickNode(firstNode);
            }

            // if(!pid){
            //     var firstNode = this.firstNode();
            //     firstNode.selected(true);
            //     firstNode.open(true);
            // }
        },
        reloadData: function(){

        },
        getData: function(){

        },
        addData: function(data){

        },
        updateData: function(node, newData){//newData为新节点
            var that = this;
            var currData = node.children();//当前所以节点
            var removeDataArr = [];//要删除的节点
            var addDataArr = [];//要新增的节点
            var updateDataArr = [];//要更新的节点
            var currDataMap = this.transformToMap(currData);
            var newDataMap = this.transformToMap(newData);
            var noUpdateProp = ['open', 'children'];
            var typeNameSpace = '';

            that.triggerCB(0, 'reloadData', node);//根节点都会触发（执行注册到根节点上的reloadData回调函数）

            // that.triggerCB(node.id, 'reloadData', node);//触发重新加载数据

            if(!currData.length){//如果currData,newData全部为新增的节点
                node.children(newData);
                addDataArr = newData;
                addDataArr.forEach(function(item){
                    item.open(true);
                });
                addDataArr.forEach(function(item){
                    that.triggerCB(item.id, 'addData', item);//触发添加
                });
            }else{
                currData.forEach(function(item){//获取要删除的节点
                    if(!newDataMap[item.id]){
                        removeDataArr.push(item);
                    }
                });

                newData.forEach(function(item){
                    if(!currDataMap[item.id]){//获取新增的节点
                        addDataArr.push(item);
                    }else{//其它为要删除的节点
                        updateDataArr.push(item);
                    }
                });

                //删除节点并执行注册到此节点上的删除回调
                removeDataArr.forEach(function(item){
                    GUtil.arrayRemoveItem(node.children(), 'id', item.id);
                    that.triggerCB(item.id, 'removeData', item);//触发删除
                });
                
                //新添加的默认展开，让用户看到新添加了             
                addDataArr.forEach(function(item){
                    item.open(true);
                });

                //添加节点并执行注册到此节点上的添加回调
                node.children.push.apply(node.children, addDataArr);
                addDataArr.forEach(function(item){
                    that.triggerCB(item.id, 'addData', item);//触发添加
                });

                //更新节点并执行注册到此节点上的更新回调
                updateDataArr.forEach(function(item){
                    var currNode = currDataMap[item.id];
                    var oldNode = $.extend(true, {}, currNode);
                    var val = '';
                    for(var prop in currNode){
                        if(GUtil.array.indexOf(noUpdateProp, prop) >= 0) continue;
                        // if(prop === 'open') continue;
                        val = currNode[prop];
                        if(typeof currNode[prop] === 'function'){
                            if(typeof item[prop] === 'function'){
                                val(item[prop]());
                            }else{
                                val(item[prop]);
                            }
                        }else{
                            if(typeof item[prop] === 'function'){
                                currNode[prop] = item[prop]();
                            }else{
                                currNode[prop] = item[prop];
                            }
                        }
                    }
                    that.triggerCB(item.id, 'updateData', item, oldNode);//触发更新
                    that.triggerCB(item.id, 'reloadData', item);//触发重新加载数据
                });

            }
        },
        removeData: function(data){

        },
        refreshData: function(data){

        },
        req: function(){

        },
        refresh: function(data){

        },
        addDefaultProp: function(data, props, pid){
            var that = this;
             if(data && data.length){
                data.forEach(function(item){
                    props.forEach(function(prop){
                        var val = prop.val;
                        if(typeof val === 'function'){
                            val = val(item, pid);
                        }
                        if(prop.isObservable){
                            if(Array.isArray(item[prop.key]) || Array.isArray(val)){
                                item[prop.key] = ko.observableArray(item[prop.key] || val);
                            }else{
                                item[prop.key] = ko.observable(item[prop.key] || val);
                            }
                        }else{
                            item[prop.key] = item[prop.key] || val;
                        }
                    });
                    if(item.children){
                        that.addDefaultProp(item.children(), props, item.id);
                    }
                });
            }
        },
        setIcon: function(itemData){
            var iconClsName = itemData.type || '';
            if(this.opts.iconCB){
                iconClsName = this.opts.iconCB.call(this, itemData);
            }

            itemData.iconClsName(iconClsName);
        },
        switchNode: function(itemData, e){
            if(itemData.open()){
                if(!itemData.children().length){
                    this.reqData('', itemData.type, itemData.id);
                }
            }
            // if(this.opts.clickNodeCB){
                
            // }
        },
        clickNode: function(itemData, e){
            if(this.opts.selectNodeCB){
                this.opts.selectNodeCB.call(this, itemData, this.vm.nodeList);
            }
            if(this.opts.clickNodeCB){

            }
        },
        dblclickNode: function(itemData){
            if(this.opts.clickNodeCB){
                
            }
        },
        selectNode: function(itemData){
            if(this.opts.selectNodeCB){
                this.opts.selectNodeCB(itemData);
            }
        },
        collapse: function(itemData){

        },
        expand: function(itemData){

        },
        dataHandle: function(data, id){
            var treeData = data();
            var arrData = this.transformToArray(treeData);
            var mapData = this.transformToMap(arrData);

            //（后期优化）目前每次请求数据，都重新计算_treeData、_arrData、_mapData
            this._treeData = data;
            this._arrData = arrData;
            this._mapData = mapData;

            // if(!id){
            //     this._treeData = data;
            //     this._arrData = arrData;
            //     this._mapData = mapData;
            // }else{
            //     this.getNode(id).children = treeData;
            //     Array.prototype.push.apply(this._arrData, arrData);
            //     $.extend(this._mapData, mapData);
            // }
        },
        transformToTreeNodes: function(itemData){

        },
        transformToArray: function(treeData){
            var that = this;
            var arrData = [];
            treeData.forEach(function(item){
                arrData.push(item);
                if(item.children()){
                    Array.prototype.push.apply(arrData, that.transformToArray(item.children()));
                    // arrData.concat(that.transformToArray(item.children));
                }
            });
            return arrData;
        },
        transformToMap: function(arrData){
            var that = this;
            var mapData = {};
            arrData.forEach(function(item){
                mapData[item.id] = item;
            });
            return mapData;
        },
        firstNode: function(){
            return this._treeData()[0];
        },
        getNode: function(id){
            return this._mapData[id] || null;
        },
        getParentNode: function(id){
            var node = this.getNode(id);
            if(!node) return null;
            var pid = node.pid;
            return this._mapData[pid] || null;
        },
        addNode: function(data){

        },
        updateNode: function(data){

        },
        removeNode: function(data){

        },
        refreshNode: function(id, pid, nodeType){//根据父节点刷新子节点
            var parentNode = null;

            if(!id && !pid){//如果没有当前节点，也没有父节点刷新根节点
                this.reqData();
                return ;
            }

            if(id){
                parentNode = this.getParentNode(id);
            }

            if(!parentNode && pid){
                parentNode = this.getNode(pid);
            }

            if(!parentNode){
                console.error('刷新节点时 父节点时为空！', 'id:' + id, 'pid:' + pid);
                this.reqData();
            }else{
                this.reqData('', parentNode.type, parentNode.id);
            }

            if(parentNode){//刷新节点时 展开父节点，以便让用户看增删改
                parentNode.open(true);
            }
            

        },
        registerCB: function(id, type, CB){
            var node = this.getNode(id);
            var events = this.events[node.id] = this.events[node.id] || {};
            var CBs = events[type] = events[type] || [];
            CBs.push(CB);
        },
        triggerCB: function(id, type, data, oldNode){
            var that = this;
            var node = this.getNode(id);
            if(!node && type == 'addData' && data.pid !== ''){
                node = this.getNode(data.pid);
            }
            if(!node) return ;

            var typeNameSpace = type;
            if(data.type === 'xcatPlatform' || data.type === 'ivmPlatform'){
                typeNameSpace += '.platform';
            }else if(data.type === 'xcatPlatformHost' || data.type === 'ivmPlatformHost'){
                typeNameSpace += '.host';
            }else if(data.type === 'xcatPlatformHostLpart' || data.type === 'ivmPlatformHostLpart'){
                typeNameSpace += '.lpar';
            }

            var events = this.events[node.id] = this.events[node.id] || {};
            var CBs = events[typeNameSpace] = events[typeNameSpace] || [];
            CBs.forEach(function(CB){
                CB.call(that, data, oldNode, node);
            });
            if(node.pid === '') return ;
            this.triggerCB(node.pid, type, data, oldNode);

        },
        removeCB: function(id, type){
            var node = this.getNode(id);
            if(!node) return ;

            var events = this.events[node.id] = this.events[node.id] || {};
            events[type] = [];
            
        },
        addEvent: function(type, CB){
            this.events = this.events || {};
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
        triggerEvent: function(type, data){

            if(type){
                if(!this.events[type]){
                    return ;
                }
                this.triggerEventByType(type, data);
            }else{
                for(var eventType in this.events){
                    this.triggerEventByType(eventType, data);
                }
            }
        },
        triggerEventByType: function(type, data){
            var typeEvents = this.events[type];
            for(var i= 0,len=typeEvents.length;i<len;i++){
                var CB = typeEvents[i];
                CB.call(this, data);
            }
        },
        trigger: function(type, data){
            this.triggerEvent(type, data);
        },
        loadSimulateData: function(){
            var setting = { };
            var zNodes = [{
                "id": "15c13daa8-eb822c0-48df-8681-844b46841370",
                "pid": null,
                "type": "dataCenter",
                "name": "数据中心",
                "title": "",
                "dataset": {
                  "state": "active"
                },
                "href": "platform.html",
                "target": "_platform",
                "parent": true
            }];

            this.loadData(zNodes);
        }

    };

    function obj2Arr(obj){
        var arr = [];
        for(var key in obj){
            arr.push(key);
            arr.push(obj[key]);
        }
        return arr;
    }

    ExtendClass(CommonTree, CommonWidget);
    InstallFunctions(CommonTree.prototype, DONT_ENUM, obj2Arr(methods));

	return CommonTree;
});