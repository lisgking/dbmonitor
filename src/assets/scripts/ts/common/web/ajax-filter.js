require(["jquery"],function($,UserLogin){
	//Thanks @madpilot rants
	//See http://myles.eftos.id.au/blog/2011/11/30/how-to-re-play-an-ajax-request-in-jquery-after-an-authentication-error/#.U-iHifmSx8E
	var isDialogShown=false;
	var ajaxQueue=[];
	jQuery.ajaxQueue=ajaxQueue;
	jQuery.ajaxSetup({
		statusCode:{
			//未登录或session失效时，服务端会返回状态码203
			403:function(){
				//加入队列
				ajaxQueue.push(this);
				//若未显示对话框，显示对话框
				if(!isDialogShown){
					isDialogShown=true;
					require(["infrastructure/user/UserLogin"],function(UserLogin){
						UserLogin.showLoginDialog(function onFullfilled(data){
							//登陆成功后，关闭对话框
							UserLogin.closeLoginDialog();
							isDialogShown=false;
							//执行堆积的ajax队列（使用Array#pop()似乎更合理，但效率较低）
							ajaxQueue.forEach(function(context){
								$.ajax(context);
							});
							ajaxQueue.length=0;
						},function(data){
							alert(data.msg);
						});
					});
				}
			}
		}
	});
	/*
	//keep session
	if(request.onLine){
		$.ajax("LoginAction.do?method=getMaxInactiveInterval").done(function(seconds){
			seconds=+seconds||30*60;
			setInterval(function(){
				$.ajax("LoginAction.do?method=currentTimeMillis");
			},seconds*1000);
		});
	}*/
});