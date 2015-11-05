define("ts/util/NsdFieldGroup",[
	"ts/widgets/TSWidget",
	"ts/widgets/TSField",
	"ts/util/Format",
	"dojo/text!./htm/NsdFieldGroup.htm",
	"dojo/css!./css/NsdInputGroup.css",
	"dojo/nls!./nls/NsdInputGroup.json",
	"jquery"
],function(TSWidget,TSField,Format,htm,css,json,$){
	var isArray=Array.isArray,
		isField=function(field){
			return field instanceof TSField;
		};
	var i18n=TSWidget.prototype.i18n.createBranch(json);
	function NsdInputGroup(id,initParams){
		TSWidget.call(this,id,initParams);
		defineProperties.call(this);
		addEventListeners.call(this);
		init.call(this);
	}
	"private";
	function defineProperties(){
		/**
		 * @attribute elements
		 * @type Array
		 */
		this.__data__.elements=[];
		InstallGetterSetter(this,"elements",function(){
			return this.__data__.elements;
		},function(elements){
			if(!Array.isArray(elements)||!elements.every(isField)){
				throw new TypeError("Invalid argument. elements may only be a TSField array");
			}
			this.__data__.elements=elements;
			//group inputs
			var that=this;
			this.elements.forEach(function(field){
				field.setReadOnly(true);
				field.el[0].dataset.originalValue = field.getValue();
				field.on("focus",function(){
					that.moveToElement(this);
					that.show();
				});
			});
		});
		/**
		 * @attribute currentElement
		 * @type HTMLInputElement
		 */
		this.__data__.currentElement=[];
		InstallGetterSetter(this,"currentElement",function(){
			return this.__data__.currentElement;
		},function(input){
			
		});
		/**
		 * @attribute currentIndex
		 * @type Number
		 */
		InstallGetter(this,"currentIndex",function(){
			return this.elements.indexOf(this.currentElement);
		});
		/**
		 * @attribute currentSetting
		 * @type Object
		 */
		InstallGetter(this,"currentSetting",function(){
			var field=this.currentElement;
			if(!field){return null;}
			var form=this.roles.get("form");
			if(!form.checkValidity()){return null;}
			var detail=$(form).serializeArray().reduce(function(data,param,index){
				data[param.name]=param.value;
				return data;
			},{});
			detail.start=+detail.start;
			detail.end=+detail.end;
			return detail;
		});
	}
	function addEventListeners(){
		var that=this;
		//form inputs
		var num_inputHandler=function(e){
			var v=this.value;
			if(/\D/g.test(v)){
				this.value=v.replace(/\D/g,"");
			}
		};
		this.role("start").addEventListener("keypress",num_inputHandler);
		this.role("end").addEventListener("keypress",num_inputHandler);
		this.role("form").addEventListener("submit",function(){
			if(!this.checkValidity()){return false;}
			fillElements(false);
			that.hide();
			that.dispatchEvent(new Event("fill"));
			return false;
		});
		
		this.roles.get('fill').addEventListener('click', function() {
			fillElements.call(that);;
			that.hide();
		});
		
		this.role("close").addEventListener("click",function(){
			//cancelPreview();
			that.hide();
		});
		this.role("preview").addEventListener("change",function(){
			if(this.checked){
				enablePreview();
			}else{
				disablePreview();
			}
		});
		this.role("reset").addEventListener("click",function(){
			that.resetElements();
		});
		this.addEventListener("mouseScroll",mouseScroll)
		//internal APIs
		function mouseScroll(){
			this.addEventListenerTo(document,'mousewheel',scrollFunc,false);
			this.addEventListenerTo(document,'wheel',scrollFunc,false);
		}
		
		function scrollFunc(e){
			cancelPreview();
			that.hide();
			that.dispatchEvent(new Event("scrollMuose"));
		}
		function enablePreview(){
			that.role("pattern").addEventListener("input",requestPreview);
			that.role("start").addEventListener("input",requestPreview);
			that.role("end").addEventListener("input",requestPreview);
			that.role("preview").checked=true;
			requestPreview();
		}
		function disablePreview(){
			that.role("pattern").removeEventListener("input",requestPreview);
			that.role("start").removeEventListener("input",requestPreview);
			that.role("end").removeEventListener("input",requestPreview);
			that.role("preview").checked=false;
			cancelPreview();
		}
		function requestPreview(e){
			fillElements(true);
		}
		function cancelPreview(){
			that.elements.forEach(function(field){
				var input = field.el[0];
				//if(input.dataset.value) {
					field.setValue(input.dataset.value);
					delete input.dataset.value;
				//}
			});
		}
		function fillElements(backup){
			cancelPreview();
			var detail=that.currentSetting;
			if(!detail){return;}
			var from=detail.start,
				to=detail.end,
				len=to-from+1,
				pattern=detail.pattern;
			if(len!==len||len<=0){
				return;
			}
			var curr=that.currentIndex;
			that.elements.slice(curr,curr+len).forEach(function(field,index){
				var input = field.el[0];
				if (backup) {
					input.dataset.value = field.getValue();
				}
				field.setValue(pattern.replace(/#+/,function(num){
					return Format.padLeft(from+index,num.length,"0");
				}));
				//field.setValue('fdafdafds')
			});
		}
	}
	function init(){
		this.visible=false;
		this.dispatchEvent(new Event("mouseScroll"));
	}
	"public";
	function show(){
		if(this.visible){return;}
		this.visible=true;
		this.dispatchEvent(new Event("show"));
	}
	function hide(){
		if(!this.visible){return;}
		this.visible=false;
		this.dispatchEvent(new Event("hide"));
		this.__data__.currentElement=null;
	}
	function moveToElement(field){
		
		var input = field.el[0];
		
		var jqInput=$(input.parentNode.parentNode);
		var pos=jqInput.position();
		pos.left+=jqInput.outerWidth()-1;
		$(this.role("form")).css({
			left:pos.left+25+"px",
			top:pos.top+"px"
		});
		$(this.role("leftarrow")).css({
			top:24+"px"
		});
		this.role("pattern").value = field.getValue();
		this.role("start").value=1;
		this.role("end").value=1;
		this.__data__.currentElement=field;
		this.addEventListener("scrollMuose",function(){
			input.blur();
		})
	}
	function resetElements(){
		this.elements.forEach(function(field,index){
			delete field.el[0].dataset.value;
			field.setValue(field.el[0].dataset.originalValue);
		});
	}
	ExtendClass(NsdInputGroup,TSWidget);
	SetNativeFlag(NsdInputGroup);
	InstallFunctions(NsdInputGroup.prototype,DONT_ENUM,[
		"show",show,
		"hide",hide,
		"moveToElement",moveToElement,
		"resetElements",resetElements
	]);
	SetProperties(NsdInputGroup.prototype,DONT_ENUM,[
		"template",htm,
		"i18n",i18n
	]);
	return NsdInputGroup;
});
