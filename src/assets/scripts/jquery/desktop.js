(function($){
	var Keys={
		ESC:27,
		LEFT:37,
		UP:38,
		RIGHT:39,
		DOWN:40
	};
	function jQueryFire(type,args,options){
		var handler=options["on"+type];
		if(typeof handler==="function"){
			handler.apply(this,args);
		}
	}
	/**
	 * 让列表项做抛物线运动飞走，然后删除
	 * @method jumpByParaCurve
	 * @param {Object} options={
	 *   onbeforejump:null,       //在动画执行之前回调
	 *   onafterjump:null,        //在跳跃动画执行之后，并且在淡出动画执行完回调
	 *   left:window.innerWidth,  //
	 *   top:window.innerHeight,  //
	 *   opacity:0.3,             //
	 *   destination:null         //若传入dest(!!dest===true)将忽略left top 和opacity，反之则然
	 * }
	 * @example <pre><code>
	 * <ul>
	 *   <li><a href=""><img src="icon1.png" alt="" /><span>Foo</span></a></li>
	 *   <li><a href=""><img src="icon2.png" alt="" /><span>Bar</span></a></li>
	 *   <li><a href=""><img src="icon3.png" alt="" /><span>Zoo</span></a></li>
	 * </ul>
	 * $("ul>li:nth-child(2)").jumpByParaCurve()
	 * </code></pre>
	 */
	function jumpByParaCurve(options){
		options=$.extend({
			onbeforejump:null,
			onafterjump:null,
			left:window.innerWidth,
			top:window.innerHeight,
			opacity:0.5,
			duration:1000,
			destination:null
		},options);
		var li=this,
			ufo=li.clone().removeClass("shaking");
		li.css({opacity:0.2}).addClass("removing");
		var origin,destination;
		origin=li.offset();
		origin.position="fixed";
		ufo.css(origin);
		li.after(ufo);
		if(!options.destination){
			options.destination={
				left:options.left,
				top:options.top,
				opacity:options.opacity
			};
		}
		destination=options.destination;
		console.log(options);
		jQueryFire.call(this,"beforejump",[options],options);
		ufo.animate(destination,{
			duration:options.duration,
			specialEasing:{
				left:"linear",
				top:"easeInBack",
				opacity:"easeOutSine"
			},
			complete:function(){
				li.fadeOut({
					duration:200,
					easing:"easeOutSine",
					complete:function(){
						li.remove();
						ufo.remove();
						jQueryFire.call(this,"afterjump",[options],options);
					}
				});
			}
		});
	}
	/**
	 * 使用键盘 上下左右 来转移焦点
	 * @method arrowKeySelect
	 * @param {Object} options={
	 *   typicalItemSelector:">li:first-child",
	 *   linkSelector:">li>a",
	 *   horizontalMargin:0,
	 *   verticalMargin:0,
	 *   minWidth:16,
	 *   minHeight:16
	 * }
	 * @example <pre><code>
	 * <ul>
	 *   <li><a href=""><img src="icon1.png" alt="" /><span>Foo</span></a></li>
	 *   <li><a href=""><img src="icon2.png" alt="" /><span>Bar</span></a></li>
	 *   <li><a href=""><img src="icon3.png" alt="" /><span>Zoo</span></a></li>
	 * </ul>
	 * $("ul").arrowKeySelect();
	 * </code></pre>
	 */
	function arrowKeyLocate(options){
		options=$.extend({
			typicalItemSelector:">li:first-child",    //典型项，用来获取宽度、高度
			linkSelector:">li>a",                     //链接，用来聚焦
			horizontalMargin:0,                       //
			verticalMargin:0,                         //
			minWidth:16,                              //
			minHeight:16                              //
		},options);
		var list=this,
			typicalItem=this.find(options.typicalItemSelector),
			links=list.find(options.linkSelector);
		links.on("keydown",function(e){
			var target;
			switch(e.keyCode){
			case Keys.LEFT:
				target=$(this).parent().prev("li").children("a");
				target.trigger("focus");
				break;
			case Keys.RIGHT:
				target=$(this).parent().next("li").children("a");
				target.trigger("focus");
				break;
			case Keys.UP:
			case Keys.DOWN:
				var itemIndex,cols,rows,
				itemIndex=$(this).parent("li").index();
				cols=(list.width()+options.minWidth)/(typicalItem.outerWidth(true)+options.horizontalMargin)>>>0;
				//rows=(list.height()+options.minHeight)/(typicalItem.outerHeight(true)+options.verticalMargin)>>>0;
				if(e.keyCode===Keys.UP){
					if(itemIndex-cols>=0){
						target=$(list[0].children[itemIndex-cols]).children("a");
						target.trigger("focus");
					}
				}else if(e.keyCode===Keys.DOWN){
					if(itemIndex+cols<links.length){
						target=$(list[0].children[itemIndex+cols]).children("a");
						target.trigger("focus");
					}
				}
				break;
			}
		});
	}
	/**
	 * 当用户在链接聚焦的链接上快速地输入字符时，查找字符序列所匹配的首个链接，并聚焦
	 * @method alphanumericKeyLocate
	 * @param {Object} options={
	 *   linkSelector:">li>a",         //链接元素
	 *   labelSelector:">li>a>span",   //元素用来或取textContent以匹配(为链接本身或链接内的元素)
	 *   keypressInterval:400          //最大输入延迟
	 * }
	 * @example <pre><code>
	 * <ul>
	 *   <li><a href=""><img src="icon1.png" alt="" /><span>Foo</span></a></li>
	 *   <li><a href=""><img src="icon2.png" alt="" /><span>Bar</span></a></li>
	 *   <li><a href=""><img src="icon3.png" alt="" /><span>Zoo</span></a></li>
	 * </ul>
	 * $("ul").alphanumericKeyLocate();
	 * </code></pre>
	 */
	function alphanumericKeyLocate(options){
		options=$.extend({
			linkSelector:">li>a",
			labelSelector:">li>a>span",
			keypressInterval:400
		},options);
		var labelArray=this.find(options.labelSelector).toArray();
		var lastKeypressEvent={
			timeStamp:0,
			keyCodes:[]
		};
		this.find(options.linkSelector).on("keypress",function(event){
			var code,chars,label,keyCodes;
			code=event.keyCode;
			if(0x20<code&&code<0x7f){
				keyCodes=lastKeypressEvent.keyCodes;
				if(event.timeStamp-lastKeypressEvent.timeStamp>options.keypressInterval){
					keyCodes.length=0;
				}
				keyCodes.push(code);
				chars=String.fromCharCode.apply(null,keyCodes);
				label=labelArray.find(function(span){
					return span.textContent.toLowerCase().startsWith(chars);
				});
				if(label){
					$(label).closest("a").focus();
				}
				lastKeypressEvent.timeStamp=event.timeStamp;
			}
		});
		return this;
	}
	function replaceClass(oldCls,newCls){
		this.removeClass(oldCls).addClass(newCls);
	}
	$.fn.jumpByParaCurve=jumpByParaCurve;
	$.fn.arrowKeyLocate=arrowKeyLocate;
	$.fn.alphanumericKeyLocate=alphanumericKeyLocate;
	$.fn.replaceClass=replaceClass;
	if(typeof define==="function"&&define.amd){
		define(function(){return $;});
	}
}(jQuery));