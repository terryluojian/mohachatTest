PlugIns=Class.create();
PlugIns.prototype={list:new Array(),path:"plugins/",depPath:"dependencies/",url:"plugins/process.php",plugIn:null,initialize:function(){
},loadScripts:function(){
for(i=0;i<this.list.length;i++){
require_once(this.path+this.list[i]+"/"+this.list[i]+".js");
}
},brokerRequest:function(_1,_2,_3){
sUrl=this.url+"?broker="+_1;
for(key in _2){
sUrl+="&"+key+"="+_2[key];
}
this.plugIn=_3;
this.plugIn.connecting.apply(this.plugIn);
this.request=importXML(sUrl,{success:this.brokerSuccessHandler,failure:this.brokerFailureHandler,scope:this});
},askRequest:function(_4,_5,_6){
sUrl=this.url+"?ask="+_4;
for(key in _5){
sUrl+="&"+key+"="+escape(_5[key]);
}
this.plugIn=_6;
_6.connecting.apply(this.plugIn);
this.request=importXML(sUrl,{success:this.brokerSuccessHandlerAsk,failure:this.brokerFailureHandlerAsk,scope:this});
},brokerSuccessHandler:function(o){
this.plugIn.doneConn.apply(this.plugIn);
try{
this.plugIn.remoteContent(o);
}
catch(e){
this.brokerFailureHandler();
}
},brokerFailureHandler:function(){
this.plugIn.doneConn.apply(this.plugIn);
this.plugIn.remoteContent(false);
},brokerSuccessHandlerAsk:function(o){
this.plugIn.doneConn.apply(this.plugIn);
try{
this.plugIn.remoteContentAsk(o);
}
catch(e){
this.brokerFailureHandlerAsk();
}
},brokerFailureHandlerAsk:function(){
this.plugIn.doneConn.apply(this.plugIn);
this.plugIn.remoteContentAsk(false);
}};
function importXML(_9,_a){
if(document.implementation&&document.implementation.createDocument){
xmlDoc=document.implementation.createDocument("","",null);
xmlDoc.onload=function(){
_a.success.apply(_a.scope,[xmlDoc]);
};
}else{
if(window.ActiveXObject){
xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
xmlDoc.onreadystatechange=function(){
if(xmlDoc.readyState==4){
_a.success.apply(_a.scope,[xmlDoc]);
}
};
}else{
alert("Your browser can't handle this script");
return;
}
}
xmlDoc.load(_9);
return xmlDoc;
}
plugInObj=new PlugIns();
loadedFile("scripts/plugins.js");

