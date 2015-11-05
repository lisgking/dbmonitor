define('ts/widgets/DialogForm', [
    'ts/widgets/TSWidget',
    'ts/widgets/Dialog',
	'ts/events/TSChangeEvent',
    'jsm/util/MessageBundle',
	'dojo/text!ts/widgets/htm/DialogForm.htm',
	'dojo/css!ts/widgets/css/DialogForm.css',
	'dojo/nls!ts/widgets/nls/DialogForm.json',
	'jquery'
], function(TSWidget, DialogWidget, TSChangeEvent, MessageBundle, htm, css, json, $){
	'use strict';
    var __super__ = TSWidget.prototype;
	function DialogForm(opts){
        __super__.constructor.call(this);
		init.apply(this, arguments);
	}

	function init(opts){
        var that = this,
            $form = $(this.rootElement);

        $form.on('click', '.save', function(){
            alert('提交成功！3秒后关闭窗口');
            that.closeDialog(3);
        });
	}

    ExtendClass(DialogForm, TSWidget);
    ExtendClass(DialogForm, DialogWidget);

	InstallFunctions(DialogForm.prototype, DONT_ENUM, [

	]);

	SetProperties(DialogForm.prototype, DONT_ENUM, [
		'template', htm,
		'i18n', new MessageBundle(json)
	]);

	SetNativeFlag(DialogForm);
	return DialogForm;
});