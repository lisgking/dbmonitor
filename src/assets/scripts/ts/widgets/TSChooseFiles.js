define("ts/widgets/TSChooseFiles",
	["ts/widgets/TSWidget",
	 "ts/events/TSEvent",
	 "dojo/text!./htm/TSChooseFiles.htm",
	 "dojo/css!./css/TSChooseFiles.css",
	 "dojo/nls!./nls/TSChooseFiles.json",],
	function(TSWidget,TSEvent,htm,css,json){
	
	var i18n=TSWidget.prototype.i18n.createBranch(json);
	function TSChooseFiles(){
		TSWidget.call(this);
		init.call(this);
	}
	
	function init(){
		var self=this;
		var inputs = this.rootElement.querySelectorAll(".inputfile");
		Array.prototype.forEach.call( inputs, function( input ){
			var label	 = input.nextElementSibling,
				labelVal = label.innerHTML;

			input.addEventListener( 'change', function( e ){
				var fileName = '';
				if( this.files && this.files.length > 1 )
					fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
				else
					fileName = e.target.value.split( '\\' ).pop();

				if( fileName )
					label.querySelector( 'span' ).innerHTML = fileName;
				else
					label.innerHTML = labelVal;
			});

			// Firefox bug fix
			input.addEventListener( 'focus', function(){ input.classList.add( 'has-focus' ); });
			input.addEventListener( 'blur', function(){ input.classList.remove( 'has-focus' ); });
			
			
		});
	}
	
	ExtendClass(TSChooseFiles,TSWidget);
	
	SetProperties(TSChooseFiles.prototype,DONT_ENUM,
		["i18n",i18n,
		 "template",htm]);
	
	return TSChooseFiles;
});