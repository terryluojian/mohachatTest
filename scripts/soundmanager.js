var isIE=navigator.appName.toLowerCase().indexOf("internet explorer")+1;
var isMac=navigator.appVersion.toLowerCase().indexOf("mac")+1;
function SoundManager(_1){
var _2=this;
this.movies=[];
this.container=_1;
this.unsupported=0;
this.defaultName="default";
this.FlashObject=function(_3){
var me=this;
this.o=null;
this.loaded=false;
this.isLoaded=function(){
if(me.loaded){
return true;
}
if(!me.o){
return false;
}
me.loaded=((typeof (me.o.readyState)!="undefined"&&me.o.readyState==4)||(typeof (me.o.PercentLoaded)!="undefined"&&me.o.PercentLoaded()==100));
return me.loaded;
};
this.mC=document.createElement("div");
this.mC.className="movieContainer";
with(this.mC.style){
position="absolute";
left="-256px";
width="64px";
height="64px";
}
var _5=["<object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" codebase=\"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0\"><param name=\"movie\" value=\""+_3+"\"><param name=\"quality\" value=\"high\"></object>","<embed src=\""+_3+"\" width=\"1\" height=\"1\" quality=\"high\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" type=\"application/x-shockwave-flash\"></embed>"];
if(navigator.appName.toLowerCase().indexOf("microsoft")+1){
this.mC.innerHTML=_5[0];
this.o=this.mC.getElementsByTagName("object")[0];
}else{
this.mC.innerHTML=_5[1];
this.o=this.mC.getElementsByTagName("embed")[0];
}
document.getElementsByTagName("div")[0].appendChild(this.mC);
};
this.addMovie=function(_6,_7){
_2.movies[_6]=new _2.FlashObject(_7);
};
this.checkMovie=function(_8){
_8=_8||_2.defaultName;
if(!_2.movies[_8]){
_2.errorHandler("checkMovie","Exception: Could not find movie",arguments);
return false;
}else{
return (_2.movies[_8].isLoaded())?_2.movies[_8]:false;
}
};
this.errorHandler=function(_9,_a,_b,e){
writeDebug("<div class=\"error\">soundManager."+_9+"("+_2.getArgs(_b)+"): "+_a+(e?" ("+e.name+" - "+(e.message||e.description||"no description"):"")+"."+(e?")":"")+"</div>");
};
this.play=function(_d,_e,_f,_10){
if(_2.unsupported){
return false;
}
movie=_2.checkMovie(_10);
if(!movie){
return false;
}
if(typeof (movie.o.TCallLabel)!="undefined"){
try{
_2.setVariable(_d,"loopCount",_e||1,movie);
movie.o.TCallLabel("/"+_d,"start");
if(!_f){
writeDebug("soundManager.play("+_2.getArgs(arguments)+")");
}
}
catch(e){
_2.errorHandler("play","Failed: Flash unsupported / undefined sound ID (check XML)",arguments,e);
}
}
};
this.stop=function(_11,_12){
if(_2.unsupported){
return false;
}
movie=_2.checkMovie(_12);
if(!movie){
return false;
}
try{
movie.o.TCallLabel("/"+_11,"stop");
writeDebug("soundManager.stop("+_2.getArgs(arguments)+")");
}
catch(e){
_2.errorHandler("stop","Failed: Flash unsupported / undefined sound ID (check XML)",arguments,e);
}
};
this.getArgs=function(_13){
var x=_13?_13.length:0;
if(!x){
return "";
}
var _15="";
for(var i=0;i<x;i++){
_15+=(i&&i<x?", ":"")+(_13[i].toString().toLowerCase().indexOf("object")+1?typeof (_13[i]):_13[i]);
}
return _15;
};
this.setVariable=function(_17,_18,_19,_1a){
if(!_1a){
return false;
}
try{
_1a.o.SetVariable("/"+_17+":"+_18,_19);
}
catch(e){
_2.errorHandler("setVariable","Failed",arguments,e);
}
};
this.setVariableExec=function(_1b,_1c,_1d){
try{
_1d.o.TCallLabel("/"+_1b,"setVariable");
}
catch(e){
_2.errorHandler(_1c||"undefined","Failed",arguments,e);
}
};
this.callMethodExec=function(_1e,_1f,_20){
try{
_20.o.TCallLabel("/"+_1e,"callMethod");
}
catch(e){
_2.errorHandler(_1f||"undefined","Failed",arguments,e);
}
};
this.callMethod=function(_21,_22,_23,_24){
movie=_2.checkMovie(_24||_2.defaultName);
if(!movie){
return false;
}
_2.setVariable(_21,"jsProperty",_22,movie);
_2.setVariable(_21,"jsPropertyValue",_23,movie);
_2.callMethodExec(_21,_22,movie);
};
this.setPan=function(_25,pan,_27){
_2.callMethod(_25,"setPan",pan,_27);
};
this.setVolume=function(_28,_29,_2a){
_2.callMethod(_28,"setVolume",_29,_2a);
};
if(isIE&&isMac){
this.unsupported=1;
}
if(!this.unsupported){
this.addMovie(this.defaultName,"soundcontroller.swf");
}
}
function SoundManagerNull(){
this.movies=[];
this.container=null;
this.unsupported=1;
this.FlashObject=function(url){
};
this.addMovie=function(_2c,url){
};
this.play=function(_2e,_2f){
return false;
};
this.defaultName="default";
}
function writeDebug(msg){
var o=document.getElementById("debugContainer");
if(!o){
return false;
}
var d=document.createElement("div");
d.innerHTML=msg;
o.appendChild(d);
}
var soundManager=null;
function soundManagerInit(){
soundManager=new SoundManager();
}
updateProgress("scripts/soundmanager.js");
