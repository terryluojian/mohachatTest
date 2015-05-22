var xajax={abort:function(){
r=this.getRequestObject();
if(this.readyStateChange()){
return true;
}else{
return false;
}
},callOptions:{method:"post"},workId:"xajaxWork"+new Date().getTime(),depth:0,eventFunctions:{globalRequestDelay:null,globalRequestComplete:null},delayEventTime:400,delayTimer:null,responseErrorsForAlert:["400","401","402","403","404","500","501","502","503"],DebugMessage:function(_1){
if(_1.length>1000){
_1=_1.substr(0,1000)+"...\n[long response]\n...";
}
try{
if(this.debugWindow==undefined||this.debugWindow.closed==true){
this.debugWindow=window.open("about:blank","xajax_debug_"+this.workId,"width=800,height=600,scrollbars=yes,resizable=yes,status=yes");
this.debugWindow.document.write("<html><head><title>xajax debug output</title></head><body><h2>xajax debug output</h2><div id=\"debugTag\"></div></body></html>");
}
_1=_1.replace(/&/g,"&amp;");
_1=_1.replace(/</g,"&lt;");
_1=_1.replace(/>/g,"&gt;");
debugTag=this.debugWindow.document.getElementById("debugTag");
debugTag.innerHTML=("<b>"+(new Date()).toString()+"</b>: "+_1+"<hr/>")+debugTag.innerHTML;
}
catch(e){
alert("xajax Debug:\n "+_1);
}
},isEventFunction:function(_2){
if(_2&&typeof _2=="function"){
return true;
}
return false;
},getRequestObject:function(){
if(xajaxConfig.debug){
this.DebugMessage("Initializing Request Object..");
}
var _3=null;
if(typeof XMLHttpRequest!="undefined"){
_3=new XMLHttpRequest();
}
if(!_3&&typeof ActiveXObject!="undefined"){
try{
_3=new ActiveXObject("Msxml2.XMLHTTP");
}
catch(e){
try{
_3=new ActiveXObject("Microsoft.XMLHTTP");
}
catch(e2){
try{
_3=new ActiveXObject("Msxml2.XMLHTTP.4.0");
}
catch(e3){
_3=null;
}
}
}
}
if(!_3&&window.createRequest){
_3=window.createRequest();
}
if(!_3){
this.DebugMessage("Request Object Instantiation failed.");
}
return _3;
},$:function(_4){
if(!_4){
return null;
}
var _5=document.getElementById(_4);
if(!_5&&document.all){
_5=document.all[_4];
}
if(xajaxConfig.debug&&!_5){
this.DebugMessage("Element with the id \""+_4+"\" not found.");
}
return _5;
},include:function(_6){
var _7=document.getElementsByTagName("head");
var _8=document.createElement("script");
_8.type="text/javascript";
_8.src=_6;
_7[0].appendChild(_8);
},includeOnce:function(_9){
var _a=document.getElementsByTagName("script");
for(var i=0;i<_a.length;i++){
if(_a[i].src&&_a[i].src.indexOf(_9)==0){
return;
}
}
return this.include(_9);
},addCSS:function(_c){
var _d=document.getElementsByTagName("head");
var _e=document.createElement("link");
_e.rel="stylesheet";
_e.type="text/css";
_e.href=_c;
_d[0].appendChild(_e);
},stripOnPrefix:function(_f){
_f=_f.toLowerCase();
if(_f.indexOf("on")==0){
_f=_f.replace(/on/,"");
}
return _f;
},addOnPrefix:function(_10){
_10=_10.toLowerCase();
if(_10.indexOf("on")!=0){
_10="on"+_10;
}
return _10;
},addHandler:function(_11,_12,_13){
if(window.addEventListener){
_12=this.stripOnPrefix(_12);
eval("this.$('"+_11+"').addEventListener('"+_12+"',"+_13+",false);");
}else{
sAltEvent=this.addOnPrefix(_12);
eval("this.$('"+_11+"').attachEvent('"+sAltEvent+"',"+_13+",false);");
}
},removeHandler:function(_14,_15,_16){
if(window.addEventListener){
_15=this.stripOnPrefix(_15);
eval("this.$('"+_14+"').removeEventListener('"+_15+"',"+_16+",false);");
}else{
sAltEvent=this.addOnPrefix(_15);
eval("this.$('"+_14+"').detachEvent('"+sAltEvent+"',"+_16+",false);");
}
},create:function(_17,_18,sId){
var _1a=this.$(_17);
objElement=document.createElement(_18);
objElement.setAttribute("id",sId);
if(_1a){
_1a.appendChild(objElement);
}
},insert:function(_1b,_1c,sId){
var _1e=this.$(_1b);
objElement=document.createElement(_1c);
objElement.setAttribute("id",sId);
_1e.parentNode.insertBefore(objElement,_1e);
},insertAfter:function(_1f,_20,sId){
var _22=this.$(_1f);
objElement=document.createElement(_20);
objElement.setAttribute("id",sId);
_22.parentNode.insertBefore(objElement,_22.nextSibling);
},getInput:function(_23,_24,sId){
var Obj;
if(!window.addEventListener){
Obj=document.createElement("<input type=\""+_23+"\" id=\""+sId+"\" name=\""+_24+"\">");
}else{
Obj=document.createElement("input");
Obj.setAttribute("type",_23);
Obj.setAttribute("name",_24);
Obj.setAttribute("id",sId);
}
return Obj;
},createInput:function(_27,_28,_29,sId){
var _2b=this.$(_27);
var _2c=this.getInput(_28,_29,sId);
if(_2b&&_2c){
_2b.appendChild(_2c);
}
},insertInput:function(_2d,_2e,_2f,sId){
var _31=this.$(_2d);
var _32=this.getInput(_2e,_2f,sId);
if(_32&&_31&&_31.parentNode){
_31.parentNode.insertBefore(_32,_31);
}
},insertInputAfter:function(_33,_34,_35,sId){
var _37=this.$(_33);
var _38=this.getInput(_34,_35,sId);
if(_38&&_37&&_37.parentNode){
_37.parentNode.insertBefore(_38,_37.nextSibling);
}
},remove:function(sId){
objElement=this.$(sId);
if(objElement&&objElement.parentNode&&objElement.parentNode.removeChild){
objElement.parentNode.removeChild(objElement);
}
},replace:function(sId,_3b,_3c,_3d){
var _3e=false;
if(_3b=="innerHTML"){
_3c=this.getBrowserHTML(_3c);
}
eval("var txt=this.$('"+sId+"')."+_3b);
if(typeof txt=="function"){
txt=txt.toString();
_3e=true;
}
if(txt.indexOf(_3c)>-1){
var _3f="";
while(txt.indexOf(_3c)>-1){
x=txt.indexOf(_3c)+_3c.length+1;
_3f+=txt.substr(0,x).replace(_3c,_3d);
txt=txt.substr(x,txt.length-x);
}
_3f+=txt;
if(_3e){
eval("this.$(\""+sId+"\")."+_3b+"=newTxt;");
}else{
if(this.willChange(sId,_3b,_3f)){
eval("this.$(\""+sId+"\")."+_3b+"=newTxt;");
}
}
}
},getFormValues:function(frm){
var _41;
var _42=false;
if(arguments.length>1&&arguments[1]==true){
_42=true;
}
var _43="";
if(arguments.length>2){
_43=arguments[2];
}
if(typeof (frm)=="string"){
_41=this.$(frm);
}else{
_41=frm;
}
var _44="<xjxquery><q>";
if(_41&&_41.tagName&&_41.tagName.toUpperCase()=="FORM"){
var _45=_41.elements;
for(var i=0;i<_45.length;i++){
if(!_45[i].name){
continue;
}
if(_45[i].name.substring(0,_43.length)!=_43){
continue;
}
if(_45[i].type&&(_45[i].type=="radio"||_45[i].type=="checkbox")&&_45[i].checked==false){
continue;
}
if(_45[i].disabled&&_45[i].disabled==true&&_42==false){
continue;
}
var _47=_45[i].name;
if(_47){
if(_44!="<xjxquery><q>"){
_44+="&";
}
if(_45[i].type=="select-multiple"){
if(_47.substr(_47.length-2,2)!="[]"){
_47+="[]";
}
for(var j=0;j<_45[i].length;j++){
if(_45[i].options[j].selected==true){
_44+=_47+"="+encodeURIComponent(_45[i].options[j].value)+"&";
}
}
}else{
_44+=_47+"="+encodeURIComponent(_45[i].value);
}
}
}
}
_44+="</q></xjxquery>";
return _44;
},objectToXML:function(obj){
var _4a="<xjxobj>";
for(i in obj){
try{
if(i=="constructor"){
continue;
}
if(obj[i]&&typeof (obj[i])=="function"){
continue;
}
var key=i;
var _4c=obj[i];
if(_4c&&typeof (_4c)=="object"&&this.depth<=50){
this.depth++;
_4c=this.objectToXML(_4c);
this.depth--;
}
key=key.replace(/]]>/g,"]]]]><![CDATA[>");
_4c=_4c.replace(/]]>/g,"]]]]><![CDATA[>");
_4a+="<e><k><![CDATA["+key+"]]></k><v><![CDATA["+_4c+"]]></v></e>";
}
catch(e){
if(xajaxConfig.debug){
this.DebugMessage(e.name+": "+e.message);
}
}
}
_4a+="</xjxobj>";
return _4a;
},_nodeToObject:function(_4d){
if(_4d.nodeName=="#cdata-section"){
var _4e=_4d.data;
while(_4d=_4d.nextSibling){
_4e+=_4d.data;
}
return _4e;
}else{
if(_4d.nodeName=="xjxobj"){
var _4e=new Array();
for(var j=0;j<_4d.childNodes.length;j++){
var _50=_4d.childNodes[j];
var key;
var _52;
if(_50.nodeName=="e"){
for(var k=0;k<_50.childNodes.length;k++){
if(_50.childNodes[k].nodeName=="k"){
key=_50.childNodes[k].firstChild.data;
}else{
if(_50.childNodes[k].nodeName=="v"){
if(_50.childNodes[k].firstChild==null){
_52="";
}else{
_52=this._nodeToObject(_50.childNodes[k].firstChild);
}
}
}
}
if(key!=null&&_52!=null){
_4e[key]=_52;
key=_52=null;
}
}
}
return _4e;
}
}
},runDelayEvents:function(){
if(this.isEventFunction(this.eventFunctions.globalRequestDelay)){
this.eventFunctions.globalRequestDelay();
}
if(this.isEventFunction(this.callOptions.onRequestDelay)){
this.callOptions.onRequestDelay();
}
},setCallOptions:function(_54){
this.callOptions={URI:"",parameters:null,onRequestDelay:null,beforeResponse:null,onResponse:null};
for(optionKey in _54){
this.callOptions[optionKey]=_54[optionKey];
}
},call:function(_55,_56){
var i,r,_59;
this.setCallOptions(_56);
if(document.body&&xajaxConfig.waitCursor){
document.body.style.cursor="wait";
}
if(xajaxConfig.statusMessages==true){
window.status="Sending Request...";
}
if(xajax.loadingFunction!=undefined){
xajax.eventFunctions.globalRequestDelay=xajax.loadingFunction;
}
if(xajax.doneLoadingFunction!=undefined){
xajax.eventFunctions.globalRequestComplete=xajax.doneLoadingFunction;
}
clearTimeout(this.delayTimer);
this.delayTimer=setTimeout("xajax.runDelayEvents()",this.delayEventTime);
if(xajaxConfig.debug){
this.DebugMessage("Starting xajax...");
}
if(!this.callOptions.method){
var _5a="post";
}else{
var _5a=this.callOptions.method;
if(_5a!=("get"||"post")){
_5a="post";
}
}
if(this.callOptions.URI){
var uri=this.callOptions.URI;
}else{
var uri=xajaxConfig.requestURI;
}
var _5c;
var _5d=this.callOptions.parameters;
_59="xajax="+encodeURIComponent(_55);
_59+="&xajaxr="+new Date().getTime();
if(_5d){
for(i=0;i<_5d.length;i++){
_5c=_5d[i];
if(typeof (_5c)=="object"){
_5c=this.objectToXML(_5c);
}
_59+="&xajaxargs[]="+encodeURIComponent(_5c);
}
}
switch(_5a){
case "get":
var _5e=uri.indexOf("?")==-1?"?":"&";
_5e+=_59;
uri+=_5e;
_59=null;
break;
case "post":
break;
default:
alert("Illegal request type: "+_5a);
return false;
break;
}
r=this.getRequestObject();
if(!r){
return false;
}
r.open(_5a,uri,true);
if(_5a=="post"){
try{
r.setRequestHeader("Method","POST "+uri+" HTTP/1.1");
r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}
catch(e){
delete r;
r=null;
_56.method="get";
return this.call(_55,_56);
}
}else{
r.setRequestHeader("If-Modified-Since","Sat, 1 Jan 2000 00:00:00 GMT");
}
r.onreadystatechange=function(){
if(r.readyState!=4){
return;
}
xajax.readyStateChange(r);
delete r;
r=null;
};
if(xajaxConfig.debug){
this.DebugMessage("Calling "+_55+" uri="+uri+" (post:"+_59+")");
}
r.send(_59);
if(xajaxConfig.statusMessages==true){
window.status="Waiting for data...";
}
delete r;
return true;
},readyStateChange:function(r){
try{
if(r.status==200){
infoObj.connected();
if(xajaxConfig.debug){
xajax.DebugMessage("Received:\n"+r.responseText);
}
if(r.responseXML&&r.responseXML.documentElement){
this.processResponse(r.responseXML);
}else{
if(r.responseText==""){
this.completeResponse();
}else{
var _60="Error: the XML response that was returned from the server is invalid.";
_60+="\nReceived:\n"+r.responseText;
trimmedResponseText=r.responseText.replace(/^\s+/g,"");
if(trimmedResponseText!=r.responseText){
_60+="\nYou have whitespace at the beginning of your response.";
}
trimmedResponseText=r.responseText.replace(/\s+$/g,"");
if(trimmedResponseText!=r.responseText){
_60+="\nYou have whitespace at the end of your response.";
}
alert(_60);
this.completeResponse();
if(xajaxConfig.statusMessages==true){
window.status="Invalid XML response error";
}
}
}
}else{
infoObj.unableToConnect();
if(this.arrayContainsValue(this.responseErrorsForAlert,r.status)&&(r.status>=500)&&(r.status<520)){
var _60="Error: the server returned the following HTTP status: "+r.status;
_60+="\nReceived:\n"+r.responseText;
alert(_60);
}
this.completeResponse();
if(this.statusMessages==true){
window.status="Invalid XML response error";
}
}
}
catch(e){
}
},processResponse:function(xml){
clearTimeout(this.delayTimer);
if(this.isEventFunction(this.eventFunctions.globalRequestComplete)){
this.eventFunctions.globalRequestComplete();
}
if(this.isEventFunction(this.callOptions.beforeResponse)){
var _62=this.callOptions.beforeResponse(xml);
if(_62==false){
this.completeResponse();
return;
}
}
if(xajaxConfig.statusMessages==true){
window.status="Processing...";
}
var _63=null;
xml=xml.documentElement;
if(xml==null){
this.completeResponse();
return;
}
var _64=0;
for(var i=0;i<xml.childNodes.length;i++){
if(_64>0){
_64--;
continue;
}
if(xml.childNodes[i].nodeName=="cmd"){
var cmd;
var id;
var _68;
var _69;
var _6a;
var _6b;
var _6c;
var _6d=null;
for(var j=0;j<xml.childNodes[i].attributes.length;j++){
if(xml.childNodes[i].attributes[j].name=="n"){
cmd=xml.childNodes[i].attributes[j].value;
}else{
if(xml.childNodes[i].attributes[j].name=="t"){
id=xml.childNodes[i].attributes[j].value;
}else{
if(xml.childNodes[i].attributes[j].name=="p"){
_68=xml.childNodes[i].attributes[j].value;
}else{
if(xml.childNodes[i].attributes[j].name=="c"){
_6b=xml.childNodes[i].attributes[j].value;
}
}
}
}
}
if(xml.childNodes[i].childNodes.length>1&&xml.childNodes[i].firstChild.nodeName=="#cdata-section"){
_69="";
for(var j=0;j<xml.childNodes[i].childNodes.length;j++){
_69+=xml.childNodes[i].childNodes[j].data;
}
}else{
if(xml.childNodes[i].firstChild&&xml.childNodes[i].firstChild.nodeName=="xjxobj"){
_69=this._nodeToObject(xml.childNodes[i].firstChild);
}else{
if(xml.childNodes[i].childNodes.length>1){
for(var j=0;j<xml.childNodes[i].childNodes.length;j++){
if(xml.childNodes[i].childNodes[j].childNodes.length>1&&xml.childNodes[i].childNodes[j].firstChild.nodeName=="#cdata-section"){
var _6f="";
for(var k=0;k<xml.childNodes[i].childNodes[j].childNodes.length;k++){
_6f+=xml.childNodes[i].childNodes[j].childNodes[k].nodeValue;
}
}else{
var _6f=xml.childNodes[i].childNodes[j].firstChild.nodeValue;
}
if(xml.childNodes[i].childNodes[j].nodeName=="s"){
_6a=_6f;
}
if(xml.childNodes[i].childNodes[j].nodeName=="r"){
_69=_6f;
}
}
}else{
if(xml.childNodes[i].firstChild){
_69=xml.childNodes[i].firstChild.nodeValue;
}else{
_69="";
}
}
}
}
if(cmd!="jc"){
_6d=this.$(id);
}
var _71;
try{
if(cmd=="cc"){
_71="confirmCommands";
var _72=confirm(_69);
if(!_72){
_64=id;
}
}
if(cmd=="al"){
_71="alert";
alert(_69);
}else{
if(cmd=="jc"){
_71="call";
var scr=id+"(";
if(_69[0]!=null){
scr+="data[0]";
for(var l=1;l<_69.length;l++){
scr+=",data["+l+"]";
}
}
scr+=");";
eval(scr);
}else{
if(cmd=="js"){
_71="script/redirect";
eval(_69);
}else{
if(cmd=="in"){
_71="includeScript";
this.include(_69);
}else{
if(cmd=="ino"){
_71="includeScriptOnce";
this.includeOnce(_69);
}else{
if(cmd=="css"){
_71="includeCSS";
this.addCSS(_69);
}else{
if(cmd=="as"){
_71="assign/clear";
if(this.willChange(id,_68,_69)){
eval("objElement."+_68+"=data;");
}
}else{
if(cmd=="ap"){
_71="append";
eval("objElement."+_68+"+=data;");
}else{
if(cmd=="pp"){
_71="prepend";
eval("objElement."+_68+"=data+objElement."+_68);
}else{
if(cmd=="rp"){
_71="replace";
this.replace(id,_68,_6a,_69);
}else{
if(cmd=="rm"){
_71="remove";
this.remove(id);
}else{
if(cmd=="ce"){
_71="create";
this.create(id,_69,_68);
}else{
if(cmd=="ie"){
_71="insert";
this.insert(id,_69,_68);
}else{
if(cmd=="ia"){
_71="insertAfter";
this.insertAfter(id,_69,_68);
}else{
if(cmd=="ci"){
_71="createInput";
this.createInput(id,_6b,_69,_68);
}else{
if(cmd=="ii"){
_71="insertInput";
this.insertInput(id,_6b,_69,_68);
}else{
if(cmd=="iia"){
_71="insertInputAfter";
this.insertInputAfter(id,_6b,_69,_68);
}else{
if(cmd=="ev"){
_71="addEvent";
_68=this.addOnPrefix(_68);
eval("this.$('"+id+"')."+_68+"= function(){"+_69+";}");
}else{
if(cmd=="ah"){
_71="addHandler";
this.addHandler(id,_68,_69);
}else{
if(cmd=="rh"){
_71="removeHandler";
this.removeHandler(id,_68,_69);
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
catch(e){
if(xajaxConfig.debug){
alert("While trying to '"+_71+"' (command number "+i+"), the following error occured:\n"+e.name+": "+e.message+"\n"+(id&&!_6d?"Object with id='"+id+"' wasn't found.\n":""));
}
}
delete _6d;
delete cmd;
delete _71;
delete id;
delete _68;
delete _6a;
delete _69;
delete _6b;
delete _6c;
delete _6f;
delete j;
delete k;
delete l;
}
}
delete xml;
delete i;
delete _64;
this.completeResponse();
if(this.isEventFunction(this.callOptions.onResponse)){
this.callOptions.onResponse();
}
},completeResponse:function(){
document.body.style.cursor="default";
if(xajaxConfig.statusMessages==true){
window.status="Done";
}
},getBrowserHTML:function(_75){
tmpXajax=document.getElementById(this.workId);
if(!tmpXajax){
tmpXajax=document.createElement("div");
tmpXajax.setAttribute("id",this.workId);
tmpXajax.style.display="none";
tmpXajax.style.visibility="hidden";
document.body.appendChild(tmpXajax);
}
tmpXajax.innerHTML=_75;
var _76=tmpXajax.innerHTML;
tmpXajax.innerHTML="";
return _76;
},willChange:function(_77,_78,_79){
if(!document.body){
return true;
}
if(_78=="innerHTML"){
_79=this.getBrowserHTML(_79);
}
elementObject=this.$(_77);
if(elementObject){
var _7a;
eval("oldData=this.$('"+_77+"')."+_78);
if(_79!==_7a){
return true;
}
}
return false;
},viewSource:function(){
return "<html>"+document.getElementsByTagName("HTML")[0].innerHTML+"</html>";
},arrayContainsValue:function(_7b,_7c){
for(i=0;i<_7b.length;i++){
if(_7b[i]==_7c){
return true;
}
}
return false;
}};
if(xajaxConfig.legacy){
xajax.advancedCall=xajax.call;
xajax.call=function(_7d,_7e,_7f){
var _80={};
if(_7e!=null){
_80["parameters"]=_7e;
}
if(_7f!=null){
_80["method"]=_7f;
}
xajax.advancedCall(_7d,_80);
};
}
xajaxLoaded=true;

