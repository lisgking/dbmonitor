var all=document.querySelectorAll("span");
var printNodeName=function (n){console.log(n.nodeName);};

var boundForEach=Function.prototype.call.bind(Array.prototype.forEach);
var agentForEach=function (a,c,r){Array.prototype.forEach.call(a,c,r);};
var customForEach=function (a,c,r){
	if(a===null||a===void 0){throw new TypeError("Array.prototype.forEach called on null or undefined");}
	if(typeof c!=="function"){try{c+="";}catch(e){c="#<object>";}throw new TypeError(c+" is not a function");}
	if(r===null||r===void 0){r=null;}else if(!(r instanceof Object)){r=Object(r);}
	for(var i=0,l=a.length>>>0;i<l;i++){if(i in a){c.call(r,a[i],i,a);}}
};

boundForEach(all,printNodeName);

agentForEach(all,printNodeName);

customForEach(all,printNodeName);
