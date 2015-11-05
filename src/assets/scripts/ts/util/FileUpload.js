define("ts/util/FileUpload",["jsm/lang/Object"],function(NSObject){
	function FileUpload(file){
		if(!(file instanceof HTMLInputElement)||file.type!=="file"){
			throw new TypeError("Failed to construct FileUpload, file input required");
		}
		NSObject.defineDataProperties(this,{
			__data__:{
				eventSourceURL:"",
				eventSource:null,
				file:file
			}
		},DONT_ENUM);
		NSObject.defineAccessorProperties(this,{
			file:{
				get:function(){return this.__data__.file;},
				set:function(v){}
			},
			eventSourceURL:{
				get:function(){return this.__data__.eventSourceURL;},
				set:function(v){
					v+="";
					if(v){this.openEventSource(v);}
					else{this.closeEventSource(v);}
				}
			},
			eventSource:{
				get:function(){return this.__data__.eventSource;},
				set:function(v){
					if(!(v instanceof EventSource)){
						throw new TypeError("Invalid EvnetSource: "+v);
					}
					this.__data__.eventSource=v;
				}
			},
			/*target:{
				get:function(){
					var form=this.file.form;
					return form.target;
				},
				set:function(v){
					var form=this.file.form;
					if(!form.ownerDocument.querySelector('iframe[name="'+form.target+'"]')){
						throw new TypeError("Target frame not exists");
					}
					form.target=v;
				}
			},*/
			targetIFrame:{
				get:function(){
					var form=this.file.form;
					return form.ownerDocument.querySelector('iframe[name="'+form.target+'"]');
				},
				set:function(iframe){
					if(!iframe){
						throw new TypeError("Target frame not exists");
					}else if(!iframe.name){
						throw new TypeError("Target frame shoud have a name property");
					}
					var form=this.file.form;
					form.target=iframe.name;
				}
			}
		},NONE);
	}
	NSObject.defineDataProperties(FileUpload.prototype,{
		openEventSource:function openEventSource(url){
			url+="";
			this.__data__.eventSourceURL=url;
			var stream=new EventSource(url);
			this.eventSource=stream;
		},
		closeEventSource:function closeEventSource(){
			if(this.eventSource){
				this.eventSource.close();
			}
		},
		setTargetIFrame:function setTargetIFrame(iframe){
			if(!(iframe instanceof HTMLIFrameElement)){
				throw new TypeError(iframe+" is not a HTMLIFrameElement");
			}
			var name=iframe.name;
			if(!name){
				throw new TypeError("the 'name' property of the iframe must be set");
			}
			this.file.form.target=name;
		},
		createTargetIFrame:function createTargetIFrame(/*name*/){
			var name=(arguments.length>0)?""+arguments[0]:"_frame"+Math.random().toFixed(20).substr(2);
			var iframe=this.file.ownerDocument.createElement("iframe");
			iframe.name=name;
			iframe.style.disaply="none";
			iframe.setAttribute("hidden",true);
			return iframe;
		}
	},NONE);
	return FileUpload;
});