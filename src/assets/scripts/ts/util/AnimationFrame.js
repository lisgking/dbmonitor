/**
 * @author Administrator
 */
define([],function(){
	function AnimationFrame(){
		
	}
	/**
	 * 为函数创建一个带帧速控制的代理函数
	 * 包含末尾的细节处理
	 * 注：此函数适用于调用间隔大于1ms的情形
	 * @static
	 * @method getFPSLimitedFunction
	 * @param {Function} accept - 指定的函数
	 * @param {Number} [fps=0] - 每秒最多执行的次数。(设interval为时间间隔毫秒数，该值等效于1000/interval)
	 * @param {Function} [reject=null] - 拒绝执行时的回调。
	 * @returns {Function} agent - 代理函数
	 * @throws {TypeError} called_non_callable - 若accept不是function时则抛出该错误
	 * 
	 * @example demo1 限制事件监听函数调用频率
	 * <pre><code>
	 * //为document添加鼠标移动事件监听，监听每秒最多执行25次
	 * var document_mousemoveHandler=getFPSLimitedFunction(function(event){
	 * 	//TODO 处理鼠标移动
	 * },null,25);
	 * document.addEventListener("mousemove",document_mousemoveHandler);
	 * </code></pre>
	 * 
	 * @example 为查询按钮添加点击事件监听，监听每秒最多执行1次
	 * <pre><code>
	 * var button_clickHandler=getFPSLimitedFunction(function(event){
	 * 	//TODO 查询数据
	 * },null,1);
	 * document.querySelector("#searchButton").addEventListener("click",button_clickHandler);
	 * </code></pre>
	 * 
	 * @example 为document添加鼠标移动事件监听，监听每秒最多执行60次
	 * <pre><code>
	 * function doSomethingWithIntervalAndTimes(something,interval,times){
	 * 	var count=0;
	 * 	var timer=setInterval(function(){
	 * 		count++;
	 * 		if(count>=times){
	 * 			clearTimeout(timer);
	 * 		}
	 * 		something(count,times);
	 * 	},interval);
	 * 	return timer;
	 * }
	 * //1秒最多接受一次
	 * var showMessage=getFPSLimitedFunction(
	 * 	function accept(s){//接受业务
	 * 		console.log("accepted: "+s);
	 * 	},
	 * 	function reject(s){//处理被拒绝
	 * 		console.warn("rejected: "+s);
	 * 	},
	 * 	1
	 * );
	 * //每秒隔100ms一次(10fps)，理论上每秒1次被接受，9次被拒绝
	 * doSomethingWithIntervalAndTimes(function(currentCount,repeatCount){
	 * 	showMessage(currentCount);
	 * },100,100);
	 * </code></pre>
	 */
	function getFPSLimitedFunction(accept,reject,fps){
		if(typeof accept!=="function"){
			throw new TypeError(accept+" is not a function");
		}
		if(typeof reject!=="function"){
			reject=null;
		}
		fps>>>=0;
		var delay=Math.max(0,1000/fps),
			locked=false,
			timer=0,
			rejectedQueue=[],
			lastAcceptedTime=0,
			lastRejectedTime=0;
		var lock=function(){
			locked=true;
		};
		var unlock=function(){
			locked=false;
			clearTimeout(timer);
			timer=setTimeout(checkRejectedCalls,delay);
		};
		var checkRejectedCalls=function(){
			if(lastAcceptedTime<lastRejectedTime){
				var l=rejectedQueue.length,
					i,
					call;
				if(l>0){
					if(typeof reject==="function"){
						for(i=0;i<l-1;i++){
							call=rejectedQueue[i];
							try{
								reject.apply(call[0],call[1]);
							}catch(e){
								setTimeout(function(){throw e;},0);
							}
						}
					}
					call=rejectedQueue[l-1];
					try{
						accept.apply(call[0],call[1]);
					}catch(e){
						setTimeout(function(){throw e;},0);
					}
					
				}
			}
			rejectedQueue.length=0;
		};
		var handleRejectedCalls=function(){
			if(typeof reject==="function"){
				var l=rejectedQueue.length,
					i,
					call;
				for(i=0;i<l;i++){
					call=rejectedQueue[i];
					try{
						reject.apply(call[0],call[1]);
					}catch(e){
						setTimeout(function(){throw e;},0);
					}
				}
			}
			rejectedQueue.length=0;
		};
		var agent=function(){
			if(locked){
				lastRejectedTime=Date.now();
				rejectedQueue.push([this,arguments]);
				return;
			}
			clearTimeout(timer);
			handleRejectedCalls();
			lock();
			lastAcceptedTime=Date.now();
			accept.apply(this,arguments);
			setTimeout(unlock,delay);
		};
		agent.toString=function(){return accept.toString();};
		if(accept.toSource){
			agent.toSource=function(){return accept.toSource();};
		}
		return agent;
	}
	InstallFunctions(AnimationFrame,DONT_ENUM,[
		"getFPSLimitedFunction",getFPSLimitedFunction
	]);
	return AnimationFrame;
});
