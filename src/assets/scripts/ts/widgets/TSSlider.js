define("ts/widgets/TSSlider", [
	"ts/widgets/TSWidget",
	"ts/util/Drag",
	"ts/util/GenericUtil",
	"ts/util/EventUtil",
	"dojo/text!./htm/TSSlider.htm",
	"dojo/css!./css/TSSlider.css",
	"dojo/nls!./nls/TSSlider.json",
	"jquery"
], function(TSWidget,Drag,util,EventUtil,htm,css,json,$){
			
	"use strict";
	var i18n=TSWidget.prototype.i18n.createBranch(json);
	
	function TSSlider(){
		TSWidget.call(this);
		//addEvent.call(this);
		init.call(this);
		this.initialize.apply(this, arguments);
	}

	var browser = util.getBrowser();
	
	function init(){
		
	}
	
	/*
	function addEvent(){
		var warnBtn=this.role("warning");
		
		warnBtn.addEventListener("click",function(e){
			e.preventDefault();
			return;
		},false);
		
		warnBtn.addEventListener("drag",function(){
			
		},false);
		
		document.addEventListener("dragstart", function( event ) {
		    warnBtn.style.opacity = .5;
		}, false);
		document.addEventListener("dragend", function( event ) {
		    warnBtn.style.opacity = "";
		}, false);
	}*/
	
	var methods = {
		//容器对象，滑块
		initialize : function (options) {
			var that = this;
			
			this.bars = $('.ui-slider-handle', this.rootElement);
			this.container = this.rootElement;
			
			this._timer = null; //自动滑移的定时器
			this._ondrag = false; //解决ie的click问题
			//是否最小值、最大值、中间值
			this._IsMin = this._IsMax = this._IsMid = false;
			
			//实例化一个拖放对象，并限定范围
			var drags = this.drags = [];
			this.bars.each(function(i, bar) {
				var colorBar = bar.parentNode;
				var drag = new Drag(bar, colorBar, {
					limit : true,
					mxContainer : that.container,
					onStart : function() {
						that.dragStart.call(that, drag);
					},
					onStop : EventUtil.bind(that, that.dragStop),
					onMove : function() {
						that.move.call(that, drag);
					}
				});
				bar.drag = drag;
				drags.push(drag);
			});
			
			this.setOptions(options);

			this.WheelSpeed = Math.max(0, this.options.WheelSpeed);
			this.KeySpeed = Math.max(0, this.options.KeySpeed);

			this.minValue = this.options.minValue;
			this.maxValue = this.options.maxValue;

			this.RunTime = Math.max(1, this.options.RunTime);
			this.RunStep = Math.max(1, this.options.RunStep);

			this.Ease = !!this.options.Ease;
			this.EaseStep = Math.max(1, this.options.EaseStep);

			this.onMin = this.options.onMin;
			this.onMax = this.options.onMax;
			this.onMid = this.options.onMid;

			this.onDragStart = this.options.onDragStart;
			this.onDragStop = this.options.onDragStop;

			this.onMove = this.options.onMove;

			this._horizontal = !!this.options.Horizontal; //一般不允许修改

			//锁定拖放方向
			this.drags.forEach(function(drag, i) {
				drag[that._horizontal ? "lockY" : "lockX"] = true;
			});

			//点击控制
			EventUtil.addHandler(this.container, 'click', EventUtil.bindAsEventListener(that, function (e) {
				if(!that._ondrag) {
					that.clickCtrl(e);
				}
			}));
			
			//取消冒泡，防止跟Container的click冲突
			this.bars.each(function(i, bar) {
				EventUtil.addHandler(bar,'click', EventUtil.bindAsEventListener(that, function (e) {
					e.stopPropagation();
				}));
			})
			

			// 鼠标滚轮控制，方向键控制只在单个滑块时有效
			if(this.bars.length == 1) {
				//设置鼠标滚轮控制
				this.wheelBind(this.container);
				
				//设置方向键控制
				this.keyBind(this.container);
			}
			
			
			//修正获取焦点
			/*var oFocus = browser == 'IE' || browser == 'Chrome' ? (this.keyBind(this.bar), this.bar) : this.container;
			EventUtil.addHandler(this.bar, "mousedown", function () {
				oFocus.focus();
			});*/
			//ie鼠标捕获和ff的取消默认动作都不能获得焦点，所以要手动获取
			//如果ie把focus设置到Container，那么在出现滚动条时ie的focus可能会导致自动滚屏
		},
		//设置默认属性
		setOptions : function (options) {
			this.options = { //默认值
				minValue : 0, //最小值
				maxValue : 100, //最大值
				WheelSpeed : 5, //鼠标滚轮速度,越大越快(0则取消鼠标滚轮控制)
				KeySpeed : 50, //方向键滚动速度,越大越慢(0则取消方向键控制)
				Horizontal : true, //是否水平滑动
				RunTime : 20, //自动滑移的延时时间,越大越慢
				RunStep : 2, //自动滑移每次滑动的百分比
				Ease : false, //是否缓动
				EaseStep : 5, //缓动等级,越大越慢
				onMin : function () {}, //最小值时执行
				onMax : function () {}, //最大值时执行
				onMid : function () {}, //中间值时执行
				onDragStart : function () {}, //拖动开始时执行
				onDragStop : function () {}, //拖动结束时执行
				onMove : function () {}	//滑动时执行	
			};
			$.extend(this.options, options || {});
		},
		
		//开始拖放滑动
		dragStart : function (drag) {
			this.onDragStart();
			this._ondrag = true;
		},
		
		//结束拖放滑动
		dragStop : function () {
			this.onDragStop();
			setTimeout(EventUtil.bind(this, function () {
				this._ondrag = false;
			}), 10);
		},
		
		//滑动中
		move : function (drag) {
			
			var that = this;
			that.bars.each(function(i, bar) {
				bar.drag.range = that.getRange(i);
			});
			
			this.onMove();

			var percent = this.getPercent();
			//最小值判断
			if (percent > 0) {
				this._IsMin = false;
			} else {
				if (!this._IsMin) {
					this.onMin();
					this._IsMin = true;
				}
			}
			//最大值判断
			if (percent < 1) {
				this._IsMax = false;
			} else {
				if (!this._IsMax) {
					this.onMax();
					this._IsMax = true;
				}
			}
			//中间值判断
			if (percent > 0 && percent < 1) {
				if (!this._IsMid) {
					this.onMid();
					this._IsMid = true;
				}
			} else {
				this._IsMid = false;
			}
		},
		//鼠标点击控制
		clickCtrl : function (e) {
			var o = this.container,
			iLeft = o.offsetLeft,
			iTop = o.offsetTop;
			while (o.offsetParent) {
				o = o.offsetParent;
				iLeft += o.offsetLeft;
				iTop += o.offsetTop;
			}
			
			//考虑有滚动条，要用pageX和pageY
			var x = e.pageX - iLeft - this.bars[0].offsetWidth / 2;
			var y = e.pageY - iTop - this.bars[0].offsetHeight / 2;

			// 获取最近的bar
			var nearestBar = this.getNearestBar({
				x: e.pageX - iLeft,
				y: e.pageY - iTop
			});
			
			this.easePos(nearestBar, x, y);
		},
		//鼠标滚轮控制
		wheelCtrl : function (e) {
			var i = this.WheelSpeed * e.step;
			var bar = this.bars[0];
			
			this.setPos(bar.drag, bar.offsetLeft + i, bar.offsetTop + i);
			//防止触发其他滚动条
			e.preventDefault();
		},
		//绑定鼠标滚轮
		wheelBind : function (o) {
			//鼠标滚轮控制
			
			var wheel;
			if(browser != 'Firefox') {
				wheel = 'mousewheel';
			} else {
				wheel = 'DOMMouseScroll';
			}
			
			EventUtil.addHandler(o, wheel, EventUtil.bindAsEventListener(this, this.wheelCtrl));
		},
		//方向键控制(只在单滑块时有效)
		keyCtrl : function (e) {
			if (this.KeySpeed) {
				var bar = this.bar[0];
				var iLeft = bar.offsetLeft,
				iWidth = (this.container.clientWidth - bar.offsetWidth) / this.KeySpeed,
				iTop = bar.offsetTop,
				iHeight = (this.container.clientHeight - bar.offsetHeight) / this.KeySpeed;
				//根据按键设置值
				switch (e.keyCode) {
					case 37: //左
						iLeft -= iWidth;
						break;
					case 38: //上
						iTop -= iHeight;
						break;
					case 39: //右
						iLeft += iWidth;
						break;
					case 40: //下
						iTop += iHeight;
						break;
					default:
					return; //不是方向按键返回
				}
				this.setPos(bar.drag, iLeft, iTop);
				//防止触发其他滚动条
				e.preventDefault();
			}
		},
		//绑定方向键
		keyBind : function (o) {
			EventUtil.addHandler(o, "keydown", EventUtil.bindAsEventListener(this, this.keyCtrl));
			//设置tabIndex使设置对象能支持focus
			o.tabIndex = -1;
			//取消focus时出现的虚线框
			
			if(browser == 'IE') {
				o.style.outline = "none";
			}
		},
		//获取当前值
		getValue : function () {
			//根据最大最小值和滑动百分比取值
			var that = this;
			var v = [];
			this.getPercent().forEach(function(p, i) {
				v.push(that.minValue + that.getPercent()[i] * (that.maxValue - that.minValue))
			});
			//return this.minValue + this.getPercent() * (this.maxValue - this.minValue);
			return v;
		},
		//设置值位置
		setValue : function (arr) {
			var that = this;
			var p = [];
			arr.forEach(function(v, i) {
				p.push((v - that.minValue) / (that.maxValue - that.minValue));
			});
			that.setPercent(p);
			//根据最大最小值和参数值设置滑块位置
		},
		//获取百分比
		getPercent : function () {
			//根据滑动条滑块取百分比
			/*return this._horizontal ? this.bar.offsetLeft / (this.container.clientWidth - this.bar.offsetWidth)
			 : this.bar.offsetTop / (this.container.clientHeight - this.bar.offsetHeight)*/
			
			var that = this;
			var percents = [];
			this.bars.each(function(i, bar) {
				var percent = that._horizontal ? bar.offsetLeft / (that.container.clientWidth - bar.offsetWidth)
						 : bar.offsetTop / (that.container.clientHeight - bar.offsetHeight);
				percents.push(percent);
			});

			return percents;
		},
		//设置百分比位置
		setPercent : function (arr) {
			var that = this;
			arr.forEach(function(v, i) {
				that.easePos(that.bars[i], (that.container.clientWidth - that.bars[i].offsetWidth) * v, (that.container.clientHeight - that.bars[i].offsetHeight) * v);
			});
			//根据百分比设置滑块位置
		},
		
		//自动滑移(是否递增)
		run : function (bIncrease) {
			var that = this;
			this.stop();
			//修正一下bIncrease
			bIncrease = !!bIncrease;
			//根据是否递增来设置值
			var percents = this.getPercent();
			this.bars.each(function(i, bar) {
				var percent = percents[i] + (bIncrease ? 1 : -1) * that.RunStep / 100;
				var drag = bar.drag;
				that.setPos(drag, (that.container.clientWidth - bar.offsetWidth) * percent, (that.container.clientHeight - that.bar.offsetHeight) * percent);
			});
			//如果没有到极限值就继续滑移
			if (!(bIncrease ? this._IsMax : this._IsMin)) {
				this._timer = setTimeout(EventUtil.bind(this, this.run, bIncrease), this.RunTime);
			}
		},
		//停止滑移
		stop : function () {
			clearTimeout(this._timer);
		},
		//缓动滑移
		easePos : function (bar, iLeftT, iTopT) {
			this.stop();
			//必须是整数，否则可能死循环
			iLeftT = Math.round(iLeftT);
			iTopT = Math.round(iTopT);
			
			//如果没有设置缓动
			if (!this.Ease) {
				this.setPos(bar.drag, iLeftT, iTopT);
				return;
			}
			//获取缓动参数
			var iLeftN = bar.offsetLeft,
			iLeftS = this.getStep(iLeftT, iLeftN),
			iTopN = bar.offsetTop,
			iTopS = this.getStep(iTopT, iTopN);
			//如果参数有值
			if (this._horizontal ? iLeftS : iTopS) {
				//设置位置
				this.setPos(bar, iLeftN + iLeftS, iTopN + iTopS);
				//如果没有到极限值则继续缓动
				if (this._IsMid) {
					this._timer = setTimeout(EventUtil.bind(this, this.easePos, bar, iLeftT, iTopT), this.RunTime);
				}
			}
		},

		// 获取距鼠标点击位置最近的bar
		getNearestBar: function(position) {
			var minIndex = 0;
			var min = Math.abs(this.bars[0].offsetLeft - position.x);
			this.bars.each(function(i, bar) {
				if(min > Math.abs(bar.offsetLeft - position.x)) {
					min = bar.offsetLeft;
					minIndex = i;
				}
			});
			return this.bars[minIndex];
		},

		// 获取当前bar的可移动范围
		getRange: function(i) {
			var that = this;
			var start 	= i <= 0 ? 0 : this.bars[i - 1].drag.drag.offsetLeft;
			var end 	= i == this.bars.length - 1 ? null : this.bars[i + 1].drag.drag.offsetLeft;
			return {
				start: start,
				end : end
			}
		},
		
		//获取步长
		getStep : function (iTarget, iNow) {
			var iStep = (iTarget - iNow) / this.EaseStep;
			if (iStep == 0) {
				return 0;
			}
			if (Math.abs(iStep) < 1) {
				return (iStep > 0 ? 1 : -1);
			}
			return iStep;
		},
		//设置滑块位置
		setPos : function (drag, iLeft, iTop) {
			this.stop();
			drag.setPos(iLeft, iTop);
		}
	};
	
	ExtendClass(TSSlider,TSWidget);
	
	InstallFunctions(TSSlider.prototype, DONT_ENUM, util.obj2Arr(methods));
	SetProperties(TSSlider.prototype,DONT_ENUM,[
	     "i18n",i18n,
		 "template",htm
	]);
		 
	return TSSlider;
});
