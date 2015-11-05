
define("ts/widgets/MyForm", [
        "ts/widgets/TSFormTest",
        "dojo/css!./css/MyForm.css",
        "dojo/text!./htm/MyForm.htm",
        "jquery"
    ], function (TSFormTest, css, htm, $) {
		"use strict";
		
		var i18n = TSFormTest.prototype.i18n.createBranch({});
		function MyForm(opts) {
			
			TSFormTest.call(this, opts);

			this.el = $('form', $(this.rootElement));
			//init.call(this, opts);
			
			// 初始化配置
			//addEventListener.call(this);
			// 事件处理
		}

		function init() {
			
		}

		function addEventListener() {
			var me = this;
			var el = this.el;
			
			var username = this.get('username');
			console.log(username);
			
		}

		ExtendClass(MyForm, TSFormTest);

	    SetProperties(TSFormTest.prototype, DONT_ENUM, [		// 设置成员变量
	    	"i18n", i18n, 
	    	"template", htm,
	    ]);

    SetNativeFlag(MyForm);
    return MyForm;
});
