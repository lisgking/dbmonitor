(function(){
	var styles={
		title:"color:#0D3349;",
		userAgent:"color:#2B81AF",
		result:"color:#2B81AF;",
		name:"color:#000000;",
		failed:"color:#5E740B;",
		passed:"color:#710909;",
		pass:"color:#3C510C;",
		fail:"color:#710909",
		actual:"color:#EE5757;",
		expected:"color:#008000;",
		diff:{
			del:"color:#374E0C;background:#E0F2BE",
			ins:"color:#550000;background:#FFCACA"
		}
	};
	QUnit.begin(function() {
		//console.log("Running tests..");
		console.log("%c%s",styles.title,document.title);
		console.log("%c%s",styles.userAgent,navigator.userAgent);
	});
	QUnit.log(function(details){
		var message;
		if(details.result){
			message=details.message||"okay";
			console.log("%c[pass] %s",styles.pass,
					message);
		}else{
			message=details.message||"test";
			console.groupCollapsed("%c[fail] %s",styles.fail,message);
			if(details.actual){
				console.log("%cExpected: %s",styles.expected,details.expected);
				console.log("%cResult: %s",styles.actual,details.actual);
				console.log("%cDiff: %c %s %c %s",styles.fail,
						styles.expected,details.expected,
						styles.actual,details.actual);
			}
			if(details.source){
				console.log("%cSource: %s",styles.fail,details.source);
			}
			console.groupEnd();
		}
	});
	QUnit.testStart(function( details ) {
		console.group(details.name);
	});
	QUnit.testDone(function( details ) {
		console.log( "[done] %c\"%s\" (%c%s %c%s,%c%s) %sms",
				styles.name,details.name,
				styles.failed,details.failed,
				styles.passed,details.passed,
				"",details.total,details.runtime);
		console.groupEnd();
	});
	QUnit.done(function( details ) {
		console.log("%cTests completed in %i milliseconds.\n%i assertions of %i passed, %i failed.",
				styles.result,details.runtime, details.passed, details.total, details.failed);
	});
}());