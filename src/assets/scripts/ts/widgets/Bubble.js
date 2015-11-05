/**
Bubble组件


 */

define('ts/widgets/Bubble',
	[
		"ts/widgets/TSWidget",
		"dojo/css!./css/Bubble.css",
		"jquery"],
	function (TSWidget, css, $) {
		"use strict";
		var el = $(['<div class="bubbleBorder">',
				'<div class="bubble">',
					'<ul></ul>',
					'<div style="line-height:0px;padding-left: 10px; position: absolute; bottom: 0px;">',
					//'<img src="assets/images/bubble-arrowy.png" />',
					'</div>',
				'</div>',
			'</div>'].join(''));
	
		el.hide();
	
		$(document.body).append(el);
		
		var bubble;
		function Bubble() {
			TSWidget.call(this);
			var me = this;

			this.addEventListenerTo(document, 'mousewheel', scrollFunc, false);
			this.addEventListenerTo(document, 'wheel', scrollFunc, false);
			
			function scrollFunc() {
				me.dispatchEvent(new Event("scrollMouse"));
			}
			
			this.addEventListener("scrollMouse",function(){
				el.hide();
			})
		};
	
		Bubble.getEl = function () {
			return el;
		}
		Bubble.show = function () {
			bubble = bubble || new Bubble();
			el.fadeIn(100);
		}
	
		Bubble.hide = function () {
			el.fadeOut(100);
		}
	
		Bubble.bind = function (dom) {
			var me = this;
	
			locate();
	
			$(window).unbind('resize');
			$(window).on('resize', function () {
				locate();
			});
	
			function locate() {
				var position = dom.offset();
				el.css({
					left : position.left + 'px',
					top : position.top + 'px'
				});
			}
		}
	
		ExtendClass(Bubble, TSWidget);
	
		return Bubble;
	}
);
