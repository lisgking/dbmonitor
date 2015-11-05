require.config({
	shim:{
		"jquery/jquery.jcryption.3.0.1":"jquery"
	}
});
define(["module","jquery","jquery/jquery.jcryption.3.0.1"],function(module,$){
	function Cryption(){}
	function load(name,require,resolve,cfg){
		loadKey(resolve);
	}
	function loadKey(resolve){
		request = typeof request == 'undefined' ? {} : request;
		var keyUrl=request.onLine? "/CommonAction.do?method=getkeys":require.toUrl("ts/common/publicKey.json");
		$.jCryption.getPublicKey(keyUrl,function(){
			if(resolve)resolve($.jCryption);
		});
	}
	Cryption.name="Cryption";
	Cryption.version="0.0.1";
	Cryption.keyURL=Object(module.config()).keyURL;
	Cryption.load=load;
	Cryption.reloadKey=loadKey;
	return Cryption;
});
