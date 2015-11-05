require([
	"ts/util/HTMLBundleMap",
	"dojo/text!test/ts/util/bundle-fragment.htm"
],function(HTMLBundleMap,htm){
	QUnit.test("HTMLBundleMap",function(assert){
		var bundle=new HTMLBundleMap(htm);
		window.bundle=bundle;
		assert.ok(1+2,3,"1+2===3");
	});
});
