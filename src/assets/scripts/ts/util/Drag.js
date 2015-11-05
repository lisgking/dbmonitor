/**
 * @module ts.util
 */
define("ts/util/Drag",  [
	"ts/util/GenericUtil",
	"ts/widgets/TSWidget",
	"ts/util/EventUtil",
	"jquery"
], function(util,TSWidget,EventUtil,$) {
	"use strict";
	/**
	 * @namespace ts.util
	 * @static
	 * @class DOMUtils
	 */
	
	function Drag() {
		this.initialize.apply(this, arguments);
	}

	var browser = util.getBrowser();
	var methods = {
		//拖放对象
		initialize : function(drag, colorBar, options) {
			this.drag = drag;
			this.colorBar = colorBar;
			//拖放对象
			this._x = this._y = 0;
			//记录鼠标相对拖放对象的位置
			this._marginLeft = this._marginTop = 0;
			//记录margin
			//事件对象(用于绑定移除事件)
			this._fM = EventUtil.bindAsEventListener(this, this.move);
			this._fS = EventUtil.bind(this, this.stop);

			this.setOptions(options);

			this.limit = !!this.options.limit;
			this.mxLeft = parseInt(this.options.mxLeft);
			this.mxRight = parseInt(this.options.mxRight);
			this.mxTop = parseInt(this.options.mxTop);
			this.mxBottom = parseInt(this.options.mxBottom);

			this.lockX = !!this.options.lockX;
			this.lockY = !!this.options.lockY;
			
			this.lock = !!this.options.lock;

			this.onStart = this.options.onStart;
			this.onMove = this.options.onMove;
			this.onStop = this.options.onStop;
			
			this.range = {};

			this._Handle = $(this.options.Handle)[0] || this.drag;
			this._mxContainer = $(this.options.mxContainer)[0] || null;

			this.drag.style.position = "absolute";
			
			//透明
			if(browser == 'IE' && !!this.options.transparent) {
				var div = this._Handle.appendChild(document.createElement("div"));
				$.extend(div.style, {
					width: '100%',
					height: '100%',
					backgroundColor: '#fff',
					filter:'alpha(opacity:0)',
					fontSize: 0
				})
			}
			
			/*if (isIE && !!this.options.transparent) {
				//填充拖放对象
				with (this._Handle.appendChild(document.createElement("div")).style) {
					width = height = "100%";
					backgroundColor = "#fff";
					filter = "alpha(opacity:0)";
					fontSize = 0;
				}
			}*/
			//修正范围
			this.repair();
			EventUtil.addHandler(this._Handle, "mousedown", EventUtil.bindAsEventListener(this, this.start));
		},
		
		//设置默认属性
		setOptions : function(options) {
			this.options = {//默认值
				handle : "", //设置触发对象（不设置则使用拖放对象）
				limit : false, //是否设置范围限制(为true时下面参数有用,可以是负数)
				mxLeft : 0, //左边限制
				mxRight : 9999, //右边限制
				mxTop : 0, //上边限制
				mxBottom : 9999, //下边限制
				mxContainer : "", //指定限制在容器内
				lockX : false, //是否锁定水平方向拖放
				lockY : false, //是否锁定垂直方向拖放
				lock : false, //是否锁定
				transparent : false, //是否透明
				onStart : function() {//开始移动时执行
				}, 
				onMove : function() { //移动时执行
				},
				onStop : function() {//结束移动时执行
				}
			};
			ExtendObject(this.options, options || {});
		},
		
		//准备拖动
		start : function(oEvent) {
			var that = this;
			if (this.lock) {
				return;
			}
			this.repair();
			//记录鼠标相对拖放对象的位置
			this._x = oEvent.clientX - this.drag.offsetLeft;
			this._y = oEvent.clientY - this.drag.offsetTop;
			
			//记录margin
			this._marginLeft = parseInt(currentStyle(this.drag).marginLeft) || 0;
			this._marginTop = parseInt(currentStyle(this.drag).marginTop) || 0;
			//mousemove时移动 mouseup时停止
			EventUtil.addHandler(document, "mousemove", this._fM);
			EventUtil.addHandler(document, "mouseup", this._fS);
			
			if (browser == 'IE') {
				//焦点丢失
				EventUtil.addHandler(this._Handle, "losecapture", this._fS);
				//设置鼠标捕获
				this._Handle.setCapture();
			} else {
				//焦点丢失
				EventUtil.addHandler(window, "blur", this._fS);
				//阻止默认动作
				oEvent.preventDefault();
			};
			//附加程序
			this.onStart();
		},
		
		//修正范围
		repair : function() {
			if (this.limit) {
				//修正错误范围参数
				this.mxRight = Math.max(this.mxRight, this.mxLeft + this.drag.offsetWidth);
				this.mxBottom = Math.max(this.mxBottom, this.mxTop + this.drag.offsetHeight);
				//如果有容器必须设置position为relative来相对定位，并在获取offset之前设置
				!this._mxContainer || currentStyle(this._mxContainer).position == "relative" || currentStyle(this._mxContainer).position == "absolute" || (this._mxContainer.style.position = "relative");
			}
		},
		
		//拖动
		move : function(oEvent) {
			var that = this;
			//判断是否锁定
			if (this.lock) {
				this.stop();
				return;
			};

			//清除选择
			window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
			//设置移动参数
			var left 	= oEvent.clientX - this._x;
			var top 	= oEvent.clientY - this._y;
			
			this.setPos(left, top);
		},
		
		//设置位置
		setPos : function(iLeft, iTop) {
			
			//设置范围限制
			if (this.limit) {
				//设置范围参数
				var mxLeft = this.mxLeft, mxRight = this.mxRight, mxTop = this.mxTop, mxBottom = this.mxBottom;
				//如果设置了容器，再修正范围参数
				if (!!this._mxContainer) {
					mxLeft = Math.max(mxLeft, 0);
					mxTop = Math.max(mxTop, 0);
					mxRight = Math.min(mxRight, this._mxContainer.clientWidth);
					mxBottom = Math.min(mxBottom, this._mxContainer.clientHeight);
				};
				
				var rangeStart 	= this.range.start || 0;								// 自定义的临界开始值,默认0
				var rangeEnd 	= this.range.end || mxRight - this.drag.offsetWidth;	// 自定义的临界结束值,默认mxRight - this.drag.offsetWidth
				
				//console.log('iLeft: ' + iLeft + ',' + (mxRight - this.drag.offsetWidth));
				//修正移动参数
				iLeft = Math.max(rangeStart, Math.min(iLeft, rangeEnd, mxRight - this.drag.offsetWidth), mxLeft);
				iTop = Math.max(Math.min(iTop, mxBottom - this.drag.offsetHeight), mxTop);
			}
			
			//设置位置，并修正margin
			if (!this.lockX) {
				this.drag.style.left = iLeft - this._marginLeft + "px";
				this.colorBar.style.width = iLeft - this._marginLeft + 9 + "px";	// 9为滑块的半径
			}
			
			if (!this.lockY) {
				this.drag.style.top = iTop - this._marginTop + "px";
				this.colorBar.style.height = iTop - this._marginTop + "px";
			}
			//附加程序
			this.onMove();
		},
		
		//停止拖动
		stop : function() {
			//移除事件
			EventUtil.removeHandler(document, "mousemove", this._fM);
			EventUtil.removeHandler(document, "mouseup", this._fS);
			if (browser == 'IE') {
				EventUtil.removeHandler(this._Handle, "losecapture", this._fS);
				this._Handle.releaseCapture();
			} else {
				EventUtil.removeHandler(window, "blur", this._fS);
			};
			//附加程序
			this.onStop();
		}
	};

	function currentStyle(element) {
		return element.currentStyle || document.defaultView.getComputedStyle(element, null);
	}
	
	InstallFunctions(Drag.prototype,DONT_ENUM,util.obj2Arr(methods));

	return Drag;
}); 