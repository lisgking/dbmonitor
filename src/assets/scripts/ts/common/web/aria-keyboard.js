define(["jsm/events/MozKeys"],function(Keys){
	function selectNthTab(n){
		top.$(".tasks>li:nth-child("+n+")>a").trigger("click");
	}
	function closeCurrentTab(n){
		top.$(".tasks>.active .close").trigger("click");
	}
	window.addEventListener("keydown",function(e){
		var code=e.keyCode;
		//prevent history from backing on BACK_SPACE pressed
		if(code===Keys.BACK_SPACE&&e.target===document.body){
			return false;
		}
		//Alt + {n}
		if(e.altKey&&code!==Keys.Alt){
			var n=-1;
			if(Keys.NUMPAD1<=code&&code<=Keys.NUMPAD9){
				n=code-96;
			}else if(Keys["1"]<=code && code<=Keys["9"]){
				n=code-48;
			}
			if(n>0){
				//Alt + {n} (1<=n<=9)
				selectNthTab(n);
			}else if(code===Keys.W){
				//Alt + W
				closeCurrentTab();
			}
		}
	});
});