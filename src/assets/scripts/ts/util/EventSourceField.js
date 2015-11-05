define([],function(){
	function Field(line){
		var colon=line.indexOf(": ");
		if(colon<0){colon=line.length;}
		this.name=line.substring(0,colon);
		var value=line.substring(colon+2);
		switch(this.name){
			case "CMD":
			case "RETURN_CODE":
				try{
					this.value=JSON.parse(value);
				}catch(e){
					this.value="";
				}
			case "OUTPUT":
			case "ERR_OUTPUT":
				this.value=JSON.parse(value);
				break;
			default:
				this.value=value;
				break;
		}
	}
	return Field;
});