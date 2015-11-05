define("ts/widgets/Tabs",
	["ts/widgets/TSWidget",
	 "ts/events/TSEvent",
	 "jsm/util/UUID",
	 "dojo/text!./htm/Tabs.htm",
	 "dojo/css!./css/Tabs.css",
	 "dojo/nls!./nls/Tabs.json",
	 "jquery"],
	function(TSWidget,TSEvent,UUID,htm,css,json){
	"use strict";
	var i18n=TSWidget.prototype.i18n.createBranch(json);
	
	function Tabs(){
		TSWidget.call(this);
		defineProperties.call(this);
		addEventListeners.call(this);
		this.tabId=UUID.randomUUID();
	}
	
	function defineProperties(){
		this.__data__.tablist=[];
		InstallGetterSetter(this,"tablist",
			function(){
				return this.__data__.tablist;
			},
			function(tablist){
				//TODO 先赋值页面渲染出错会有问题吗？
				this.__data__.tablist=tablist;
				addTabs.call(this);
			}
		);
		/**
		 * 当前选中下标
		 * @attribute index
		 */
		this.__data__.index=0;
		InstallGetterSetter(this,"index",
			function(){
				return this.__data__.index;
			},
			function(index){
				this.__data__.index=index;
			}
		);
		this.__data__.tabId="";
		InstallGetterSetter(this,"tabId",
			function(){
				return this.__data__.tabId;
			},
			function(tabId){
				var tablist=this.role("tablist");
				tablist.id=tabId;
				this.__data__.tabId=tabId;
			}
		);
		
	}
	
	function addEventListeners(){
		var that=this;
		this.addEventListener("DOMNodeInserted",function(){
			that.init();
		});
	}
	
	"private mothed";
	function addTabs(){
		var that=this;
		this.tablist.forEach(function(tab,index){
			addTab.call(that,tab);
		});
	}
	
	"public mothed";
	function addTab(tab){
		var that=this;
		var ul=this.role("tablist");
		ul.id=this.tabId;
		if(!tab.tabId){
			tab.tabId=UUID.randomUUID();
		}
		var id=tab.tabId;
		var name=tab.name;
		var li=document.createElement("li");
		var a=document.createElement("a");
		
		a.href="#"+id;
		a.innerHTML=name;
		a.setAttribute("data-role","tab");
		a.setAttribute("role","tab");
		a.addEventListener("click", function (e) {
			e.preventDefault();
			var tabPanel = tab.panel;
			that.index = $(li).index();
			tabPanel.dispatchEvent(new TSEvent("refreshData"));
			that.dispatchEvent(new TSEvent("tabchange"));
			that.show($(this));
		});

		li.appendChild(a);
		ul.appendChild(li);
		
		var tabContent=this.role("tab-content");
		var panel=document.createElement("div");
		panel.id=id;
		panel.setAttribute("data-role",id);
		panel.classList.add("tab-pane");
		if(typeof tab.panel==="string"){
			panel.innerHTML=tab.panel;
		}else if(typeof tab.panel==="object"){
			var tabPanel=tab.panel;
			tabPanel.placeAt(panel,"afterBegin");
		}else{
			console.warn(tab.name+"不是一个widget");
		}
		tabContent.appendChild(panel);
		this.tablist.push(tab);
	}
	
	function show(first){
		var $this    = first;//this.element;
	    var $ul      = $this.closest('ul:not(.dropdown-menu)');
	    var selector = $this.data('target');

	    if (!selector) {
	      selector = $this.attr('href');
	      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
	    }

	    if ($this.parent('li').hasClass('active')) return

	    var previous = $ul.find('.active:last a')[0];
	    var e        = $.Event('show.bs.tab', {
	      relatedTarget: previous
	    });

	    $this.trigger(e);

	    if (e.isDefaultPrevented()) return

	    var $target = $(selector,this.rootElement);

	    this.activate($this.parent('li'), $ul);
	    this.activate($target, $target.parent(), function () {
	      $this.trigger({
	        type: 'shown.bs.tab'
	      , relatedTarget: previous
	      });
	    });
	}
	
	function activate(element, container, callback){
		var $active    = container.find('> .active');
	    var transition = callback
	      && $.support.transition
	      && $active.hasClass('fade');

	    function next() {
	      $active
	        .removeClass('active')
	        .find('> .dropdown-menu > .active')
	        .removeClass('active');

	      element.addClass('active');

	      if (transition) {
	        element[0].offsetWidth; // reflow for transition
	        element.addClass('in');
	      } else {
	        element.removeClass('fade');
	      }

	      if (element.parent('.dropdown-menu')) {
	        element.closest('li.dropdown').addClass('active');
	      }

	      callback && callback();
	    }

	    transition ?
	      $active
	        .one($.support.transition.end, next)
	        .emulateTransitionEnd(150) :
	      next();

	    $active.removeClass('in');
	}
	
	function init(index){
		if (!Number.isInteger) {
			Number.isInteger = function isInteger(nVal) {
				return typeof nVal === 'number' && isFinite(nVal)
						&& nVal > -9007199254740992
						&& nVal < 9007199254740992
						&& Math.floor(nVal) === nVal;
			};
		}
		index=Number.isInteger(index)?index:0;
		var $a=$("ul",this.rootElement).find("li:eq("+index+") a");
		this.show($a);
	}
	
	ExtendClass(Tabs,TSWidget);
	
	SetProperties(Tabs.prototype,DONT_ENUM,[
 	    "i18n",i18n,
 	    "template",htm
 	]);
 	
 	InstallFunctions(Tabs.prototype,DONT_DELETE,[
 	    "init",init,
 	    "show",show,
 	    "activate",activate,
 	    "addTab",addTab                                                 
 	]);
	
	return Tabs;
});