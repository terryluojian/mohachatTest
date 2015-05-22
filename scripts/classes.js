String.prototype.wordWrap=function(m,b,c){
var i,j,s,r=this.split("\n");
if(m>0){
for(i in r){
for(s=r[i],r[i]="";s.length>m;j=c?m:(j=s.substr(0,m).match(/\s*$/)).input.length-j[0].length||m,r[i]+=s.substr(0,j)+((s=s.substr(j)).length?b:"")){
r[i]+=s;
}
}
}
return r.join("\n");
};
String.prototype.trim=function(){
regExp=/^\s+|\s+$/g;
str=this;
return str.replace(regExp,"");
};
String.prototype.truncate=function(_8){
txt=this;
if(txt.length>_8){
txt=txt.substr(0,_8)+"...";
}
return txt;
};
Info=function(){
};
Info.prototype={loading:false,show:function(_9){
$("infoPane").innerHTML="<div id=\"infoPaneHead\" class=\"chatBoardHead\"><img src=\"images/tiny-closetool.gif\" alt=\"Close\" title=\"Close\" width=\"20\" height=\"20\" onclick=\"infoObj.hide();\" onmouseover=\"mouseOver('close', this)\" onmouseout=\"mouseOut('close', this)\" /><span id=\"chatBordHead\"><img id=\"infoIco\" src=\"images/"+_9.icon+"\" align=\"top\"/>"+_9.title+"</span></div><div class=\"innerPane\">"+unescape(_9.content)+"</div>";
new Effect.Opacity("infoPane",{from:0.5,to:1});
},hide:function(_a){
if(!_a){
_a="infoPane";
}
new Effect.BlindUp(_a);
},displayInfo:function(_b){
obj=$("infoPane");
if(!obj){
obj=create($("leftBottom"),"div","infoPane");
}
obj.innerHTML="<div id=\"infoPaneHead\" class=\"chatBoardHead\"><img src=\"images/tiny-closetool.gif\" alt=\"Close\" title=\"Close\" width=\"20\" height=\"20\" onclick=\"infoObj.hide();\" onmouseover=\"mouseOver('close', this)\" onmouseout=\"mouseOut('close', this)\" /><span id=\"chatBordHead\"><img id=\"infoIco\" src=\"images/loading.gif\" align=\"top\"/>Loading</span></div>";
obj.style.display="block";
if(!eval("info_"+_b)){
obj=$("info_js");
if(!obj){
obj=create(document.body,"script","info_js");
}
obj.src="lib/enhance/enhance.php";
if(!this.loading){
setTimeout("infoObj.displayInfo(info_"+_b+");",200);
this.loading=true;
}
}else{
this.show(eval("info_"+_b));
}
},unableToConnect:function(){
$("connIco").src=disconnIco;
popPanel($("systemMessagesPane"));
$("iconImg"+$("from").value).src=offlineIconS;
},connected:function(){
$("connIco").src=connIco;
$("iconImg"+$("from").value).src=activeIconS;
this.hide("systemMessagesPane");
},connecting:function(){
$("connIco").src=connIco;
}};
Enhance=function(){
};
Enhance.prototype={plugIns:{message:new Array(),title:new Array()},registerPlugIn:function(_c,_d){
this.plugIns[_d][this.plugIns[_d].length]=_c;
return true;
},enhanceMessage:function(_e){
this.txt=_e;
for(j=0;j<this.plugIns.message.length;j++){
eval(this.plugIns.message[j]+"(this)");
}
this._addLinks();
_e=this.txt;
this.txt=null;
return _e;
},enhanceTitle:function(_f){
this.txt=_f;
for(j=0;j<this.plugIns.title.length;j++){
eval(this.plugIns.title[j]+"(this)");
}
_f=this.txt;
this.txt=null;
return _f;
},_addLinks:function(){
text=this.txt;
var _10=/(([a-zA-Z0-9])+([\.a-zA-Z0-9_-])*@([a-zA-Z0-9])+(\.[a-zA-Z0-9_-]+)+)/g;
var _11="<a href=\"mailto:$1\" target=\"_blank\"><img src=\"images/email.png\" border=\"0\" align=\"top\" class=\"ico\" />$1</a>";
var _12=/((http(s)*:\/\/)+(([a-zA-Z0-9])+(\.[a-zA-Z0-9_-]+)+)(\S*))/g;
var _13="<a href=\"http$3://$4$7\" target=\"_blank\"><img src=\"images/link.png\" border=\"0\" align=\"top\" class=\"ico\" />$1</a>";
formatted=text.replace(_12,_13);
formatted=formatted.replace(_10,_11);
this.txt=formatted;
}};
MessageArchive=function(){
};
MessageArchive.prototype={prevMessages:new Array(),messagePointer:0,addToPrevMessages:function(_14,to){
this.prevMessages[this.messagePointer]=EncipherText(_14,password);
this.messagePointer++;
},moveToPrev:function(to){
objMessage=$(to).message;
if((this.messagePointer>0)&&this.okToChange(objMessage)){
this.messagePointer--;
this.putMessageInText(this.prevMessages[this.messagePointer],objMessage);
}
},moveToNext:function(to){
objMessage=$(to).message;
i=this.prevMessages.length-1;
if((this.messagePointer<i)&&this.okToChange(objMessage)){
this.messagePointer++;
this.putMessageInText(this.prevMessages[this.messagePointer],objMessage);
}
},putMessageInText:function(_18,_19){
_19.value=DecipherText(_18,password);
_19.focus();
_19.select();
},okToChange:function(_1a){
evalText=_1a.value;
evalTextEncrypted=EncipherText(evalText,password);
if(isEmpty(evalText)||(evalTextEncrypted==this.prevMessages[this.messagePointer])){
return true;
}
return false;
}};
Delivery=function(){
};
Delivery.prototype={deliveryColors:{0:"#FF5E5E",1:"#0066FF"},markDelivery:function(_1b){
for(timex in _1b){
$("message["+timex+"]").style.color=this.deliveryColors[_1b[timex]];
}
if(cookieObj.readCookie("muteStatus")!="mute"){
soundManager.play("delivery");
}
}};
Console=function(){
};
Console.prototype={removeTimers:new Array(),effects:new Array(),summary:new Array(),buttonList:new Array(),registerButton:function(_1c,_1d){
this.buttonList[_1c]=_1d;
},addButtons:function(_1e){
objParent=$("imageControl"+_1e);
for(idPrefix in this.buttonList){
atributes=this.buttonList[idPrefix];
if(typeof (atributes)=="object"){
obj=create(objParent,"img",idPrefix+_1e,null,false,atributes);
}
}
},addConsole:function(_1f){
if(this.effects[_1f]){
this.effects[_1f].cancel;
}
if(!(console=$(_1f))){
objParent=$("consoleArea");
form=create(objParent,"form",_1f,"",false);
form.innerHTML="<div class=\"chatTable\" id=\"chatTable"+_1f+"\"><div class=\"chatBoardHead\" id=\"chatBoardHead"+_1f+"\"><img src=\"images/tiny-closetool.gif\" alt=\"Close\" title=\"Close\" width=\"20\" height=\"20\" onclick=\"consoleObj.closeChatConsole('"+_1f+"')\" onmouseover=\"mouseOver('close', this)\" onmouseout=\"mouseOut('close', this)\" /><img src=\"images/tiny-minimize.gif\" alt=\"Minimize\" title=\"Minimize\" width=\"20\" height=\"20\" id=\"min"+_1f+"\"/><span id=\"chatBordHead\"><img id=\"consoleIconImg"+_1f+"\" src=\""+offlineIconS+"\"/>"+_1f+"</span></div><div id=\"chatBoard"+_1f+"\" class=\"chatBoard\" onclick=\"scroll2Bottom(this);\"></div><div class=\"flashMessages\" id=\"flash"+_1f+"\" ></div><div class=\"imageControl\" id=\"imageControl"+_1f+"\"></div><div class=\"chatControls\" id=\"chatControls"+_1f+"\"><textarea name=\"message\" id=\"message\" class=\"message\" cols=\"12\" rows=\"2\" onkeypress=\"chk_enter(event, this);\" onkeyup=\"enablePost(this); chkArrow(event, this);\" onchange=\"enablePost(this);\" onfocus=\"enablePost(this);\" title=\""+_1f+"\"></textarea>\n<input type=\"button\" name=\"enter\" id=\"enter\" class=\"enter\" value=\"<-\" onclick=\"messageObj.addMessageToQue(this);\" disabled=\"disabled\" title=\""+_1f+"\"/></div></div>";
this.addButtons(_1f);
btnMinmimize=$("min"+_1f);
btnMinmimize.onclick=this.minimizeChatConsole;
btnMinmimize.onmouseover=this.minimizeMouseOver;
btnMinmimize.onmouseout=this.minimizeMouseOut;
freshConsole=new YAHOO.util.DD("chatTable"+_1f);
freshConsole.setHandleElId("chatBoardHead"+_1f);
this.appear(_1f);
}else{
if(this.removeTimers[_1f]){
clearTimeout(this.removeTimers[_1f]);
this.appear(_1f);
}
console.focus();
}
},appear:function(_20){
},closeChatConsole:function(_21){
if(this.effects[_21]){
this.effects[_21].cancel;
}
this.effects[_21]=new Effect.Fade(_21);
this.removeTimers[_21]=setTimeout("remove('"+_21+"')",300);
consoleObj.summary[_21]=null;
},minimizeMouseOut:function(e){
var _23=/min/;
obj=getEventSrc(e);
objId=obj.id;
name=objId.replace(_23,"");
if(name==objId){
obj.src=restoreIcon;
}else{
obj.src=minIcon;
}
},minimizeMouseOver:function(e){
var _25=/min/;
obj=getEventSrc(e);
objId=obj.id;
name=objId.replace(_25,"");
if(name==objId){
obj.src=restoreIconMO;
}else{
obj.src=minIconMO;
}
},minimizeChatConsole:function(e){
var _27=/min/;
obj=getEventSrc(e);
objId=obj.id;
name=objId.replace(_27,"");
obj.title="Restore";
obj.alt="restore";
obj.src=restoreIconMO;
obj.id="max"+name;
obj.onclick=restoreChatConsole;
resMinConsole("none",name,false);
looseTweenConsoleCommon(name);
if(e){
stopEvent(e);
}
},restoreChatConsole:function(e){
var _29=/max/;
obj=getEventSrc(e);
objId=obj.id;
name=objId.replace(_29,"");
obj.title="Minimize";
obj.alt="Minimize";
obj.src=minIconMO;
obj.id="min"+name;
obj.onclick=minimizeChatConsole;
resMinConsole("block",name,false);
looseTweenConsoleCommon(name);
if(e){
stopEvent(e);
}
},resMinConsole:function(_2a,_2b,_2c){
$("chatBoard"+_2b).style.display=_2a;
if(_2c==false){
$("chatControls"+_2b).style.display=_2a;
$("imageControl"+_2b).style.display=_2a;
}
},tweenConsole:function(_2d){
this.looseTweenConsoleCommon(_2d);
obj=$("chatBoard"+_2d);
obj.onfocus=this.looseTweenConsole;
obj.onclick=this.looseTweenConsole;
obj=$(_2d).message;
obj.onfocus=this.looseTweenConsoleMessage;
obj.onkeydown=this.looseTweenConsoleMessage;
obj=$("chatBoardHead"+_2d);
obj.onfocus=this.looseTweenConsole;
obj.onclick=this.looseTweenConsole;
obj.className="chatBoardHeadTween";
},looseTweenConsole:function(e){
var _2f=/^chatBoard(Head){0,1}/;
obj=getEventSrc(e);
objId=obj.id;
name=objId.replace(_2f,"");
if(name){
looseTweenConsoleCommon(name);
}
},looseTweenConsoleMessage:function(e){
obj=getEventSrc(e);
name=obj.title;
if(name){
looseTweenConsoleCommon(name);
}
},looseTweenConsoleCommon:function(_31){
looseTween();
obj=$("chatBoardHead"+_31);
if(!obj){
return false;
}
obj.className="chatBoardHead";
obj.onfocus=null;
obj.onclick=null;
obj=$("chatBoard"+_31);
obj.onfocus=null;
obj.onclick=null;
obj=$(_31).message;
obj.onfocus=null;
obj.onkeydown=null;
}};
Cookies=function(){
};
Cookies.prototype={createCookie:function(_32,_33,_34){
if(_34){
var _35=new Date();
_35.setTime(_35.getTime()+(_34*24*60*60*1000));
var _36="; expires="+_35.toGMTString();
}else{
var _36="";
}
document.cookie=_32+"="+_33+_36+"; path=/";
},readCookie:function(_37){
var _38=_37+"=";
var ca=document.cookie.split(";");
for(var i=0;i<ca.length;i++){
var c=ca[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
if(c.indexOf(_38)==0){
return c.substring(_38.length,c.length);
}
}
return null;
},eraseCookie:function(_3c){
this.createCookie(_3c,"",-1);
}};
Message=function(){
};
Message.prototype={counter:0,queCounter:0,threshold:200,sleepLength:10,procCount:0,submitQue:function(mes){
xajax_chat_process(xajax.getFormValues("que"));
if(mes){
clearQue("timeQue[]");
clearQue("messageQue[]");
clearQue("toQue[]");
}
clearQue("buddyRequest[]");
clearQue("buddyApprove[]");
clearQue("buddyReject[]");
clearQue("buddyRemove[]");
clearQue("buddyDelete[]");
clearQue("buddyDeleteReq[]");
clearQue("buddyStatusMes[]");
},processQue:function(){
if(((this.queCounter>0)||(this.counter>=threshold))&&(this.procCount<=0)){
this.counter=0;
if(this.queCounter>0){
submitQue(true);
this.queCounter=0;
}else{
submitQue();
}
}else{
this.counter++;
}
setTimeout("messageObj.processQue()",this.sleepLength);
},clearQue:function(sId){
queCounter=this.queCounter;
while($(sId)){
remove(sId);
this.queCounter--;
}
},addMessageToQue:function(obj){
to=obj.title;
form=$(to);
d=new Date();
time=d.getTime();
message=form.message.value;
create(document.que,"input","timeQue[]",time,true);
create(document.que,"input","messageQue[]",hex2b64(EncipherText(escape(message),password)),true);
create(document.que,"input","toQue[]",to,true);
this.queCounter++;
this.addLocMesToBoard(time,message,to);
form.message.value="";
form.message.focus();
messageArchiveObj.addToPrevMessages(message,to);
return true;
},addMessagesToBoard:function(_40){
$("processing").style.visibility="visible";
for(time in _40){
for(kfrom in _40[time]){
break;
}
if(_40[time].fl){
message=_40[time][kfrom];
}else{
message=unescape(DecipherText(b64tohex(unescape(_40[time][kfrom])),password));
}
if(!(chatBoard=$("chatBoard"+kfrom))){
consoleObj.addConsole(kfrom);
chatBoard=$("chatBoard"+kfrom);
}
create(chatBoard,"label","message["+kfrom+time+"]","",false);
if((consoleObj.summary[kfrom]&&(consoleObj.summary[kfrom]!=1))||!consoleObj.summary[kfrom]){
$("message["+kfrom+time+"]").innerHTML="<b>"+kfrom.replace(regExp,"'")+" :</b> ";
}
$("message["+kfrom+time+"]").innerHTML+=this.wrap(enhanceObj.enhanceMessage(message.replace(regExp,"'"))+"<br/>");
chatBor=$("chatBoard"+kfrom);
chatTable=$("chatTable"+kfrom);
consoleObj.summary[kfrom]=1;
resMinConsole("block",kfrom,true);
scroll2Bottom(chatBor);
consoleObj.tweenConsole(kfrom);
}
$("processing").style.visibility="hidden";
notify(kfrom,message);
},addLocMesToBoard:function(_41,_42,to){
form=$(to);
if(proc==false){
chatBoard=$("chatBoard"+to);
create(chatBoard,"label","message["+_41+"]","",false);
messageElement=$("message["+_41+"]");
if(consoleObj.summary[to]!=0){
messageElement.innerHTML="<b>"+document.que.from.value+" :</b> ";
}
messageElement.innerHTML+=this.wrap(enhanceObj.enhanceMessage(_42)+"<br/>");
messageElement.style.color="#A9A9A9";
form.reset();
chatBor=$("chatBoard"+to);
consoleObj.summary[to]=0;
scroll2Bottom(chatBor);
form.message.disabled="";
form.message.focus();
}else{
setTimeout("addLocMesToBoard("+_41+", "+_42+", "+to+")",500);
}
},wrap:function(txt){
regExp=/\n/g;
return txt.replace(regExp,"<br>");
}};
Themes=function(){
};
Themes.prototype={detectChange:function(e){
obj=getEventSrc(e);
name=obj.id;
themesObj._changeCommon(name);
},_changeCommon:function(_46){
$("styleChat").href="themes/backgrounds/"+_46+"/css/chat.css";
$("styleUsers").href="themes/backgrounds/"+_46+"/css/users.css";
$("styleContainer").href="themes/backgrounds/"+_46+"/css/container.css";
cookieObj.createCookie("theme",_46,false);
theme=_46+"/";
themeColor="themes/backgrounds/"+theme+"images/consoleHead.gif";
YAHOO.widget.Module.IMG_ROOT="themes/icons/"+theme;
}};
Buddy=function(){
};
Buddy.prototype={defaultText:"Buddy's Username",clear:function(obj){
if(obj.value==this.defaultText){
obj.value="";
$("btnAddBuddy").disabled=false;
}
},revert:function(obj){
if(obj.value.trim()==""){
obj.value=this.defaultText;
$("btnAddBuddy").disabled=true;
}
},allow:function(){
create(document.que,"input","buddyApprove[]",this.buddy,true);
this.hide();
remove("simpledialogBuddyApprove["+this.buddy+"]");
},block:function(){
create(document.que,"input","buddyReject[]",this.buddy,true);
this.hide();
remove("simpledialogBuddyApprove["+this.buddy+"]");
},remove:function(_49){
create(document.que,"input","buddyRemove[]",_49,true);
},del:function(_4a){
create(document.que,"input","buddyDelete[]",_4a,true);
},delReq:function(_4b){
create(document.que,"input","buddyDeleteReq[]",_4b,true);
},addBuddyRequest:function(){
obj=$("buddyId");
value=obj.value.trim();
if((value==this.defaultText)||(value=="")){
return false;
}
create(document.que,"input","buddyRequest[]",value,true);
obj.value="";
this.revert(obj);
},approveBuddy:function(_4c){
if($("simpledialogBuddyApprove["+_4c+"]")){
return false;
}
title=docTitle+" - New Buddy";
txt=_4c+" wants to add you as a buddy.";
d=new Date();
time=d.getTime();
YAHOO.MOHA.Dialog.approve=new YAHOO.widget.SimpleDialog("simpledialogBuddyApprove["+_4c+"]",{fixedcenter:true,visible:false,close:false,draggable:true,text:txt,icon:YAHOO.widget.SimpleDialog.ICON_INFO,constraintoviewport:false,buttons:[{text:"Allow",handler:this.allow,isDefault:true},{text:"Block",handler:this.block}]});
YAHOO.MOHA.Dialog.approve.setHeader(title);
YAHOO.MOHA.Dialog.approve.buddy=_4c;
YAHOO.MOHA.Dialog.approve.render(document.body);
YAHOO.MOHA.Dialog.approve.show();
},approveBuddyQue:function(_4d){
for(i=0;i<_4d.length;i++){
this.approveBuddy(_4d[i]);
}
}};
Evnt=Class.create();
Evnt.prototype={ctrlPressed:false,altPressed:false,shiftPressed:false,initialize:function(evt){
if(!evt){
var evt=window.event;
}
this.evt=evt;
this.modifierKeys();
},getEventSrc:function(){
e=this.evt;
if(e.srcElement){
return e.srcElement;
}
return e.target;
},getXY:function(){
e=this.evt;
posx=0;
posy=0;
if(e.pageX||e.pageY){
posx=e.pageX;
posy=e.pageY;
}else{
if(e.clientX||e.clientY){
posx=e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft;
posy=e.clientY+document.body.scrollTop+document.documentElement.scrollTop;
}
}
coords=[posx,posy];
return coords;
},rightClick:function(){
e=this.evt;
if(e.which){
rightclick=(e.which==3);
}else{
if(e.button){
rightclick=(e.button==2);
}
}
return rightclick;
},modifierKeys:function(){
e=this.evt;
if(parseInt(navigator.appVersion)>3){
evt=navigator.appName=="Netscape"?e:event;
if(navigator.appName=="Netscape"&&parseInt(navigator.appVersion)==4){
mString=(e.modifiers+32).toString(2).substring(3,6);
this.shiftPressed=(mString.charAt(0)=="1");
this.ctrlPressed=(mString.charAt(1)=="1");
this.altPressed=(mString.charAt(2)=="1");
}else{
this.shiftPressed=evt.shiftKey;
this.altPressed=evt.altKey;
this.ctrlPressed=evt.ctrlKey;
}
}
},destroy:function(){
evt=this.evt;
if(evt&&evt.stopPropagation&&(evt.stopPropagation!=null)){
evt.stopPropagation();
evt.preventDefault();
}else{
if(typeof evt.cancelBubble!="undefined"){
evt.cancelBubble=true;
evt.returnValue=false;
}
}
return false;
}};
UserOptions=Class.create();
UserOptions.prototype={recoverName:new Array(),name:false,timer:null,panel:$("userOptionPane"),panelHTML:$("userOptionPane"),chatButton:$("userOptionChat"),removeButton:$("userOptionRemove"),initialize:function(){
this.recoverName[0]=/^userDet/;
this.recoverName[1]=/^iconImg/;
this.recoverName[2]=/^stuserDet/;
this.panel=new YAHOO.widget.Overlay(this.panel,{constraintoviewport:true,effect:{effect:YAHOO.widget.ContainerEffect.FADE,duration:0.25}});
YAHOO.util.Event.addListener(this.panelHTML,"mouseover",this.panelMouseOver,this,true);
YAHOO.util.Event.addListener(this.panelHTML,"mouseout",this.panelMouseOut,this,true);
YAHOO.util.Event.addListener(this.chatButton,"click",this.chat,this,true);
YAHOO.util.Event.addListener(this.removeButton,"click",this.remove,this,true);
updateEvent.subscribe(this.updateInfo,this,true);
},recoverUser:function(id){
for(i=0;i<this.recoverName.length;i++){
if(this.recoverName[i].test(id)){
return id.replace(this.recoverName[i],"");
}
}
return false;
},lableMouseOver:function(e){
evt=new Evnt(e);
srcObj=evt.getEventSrc();
this.name=this.recoverUser(srcObj.id).toLowerCase();
$("userOptionPaneStatus").style.display="none";
this.chatButton.disabled=true;
this.removeButton.disabled=true;
$("userOptionPaneName").innerHTML=this.name;
this.updateInfo();
this.clearTimer();
},updateInfo:function(){
if(!this.name){
return;
}
this.chatButton.disabled=true;
this.removeButton.disabled=true;
if(userListArr2[this.name][1]){
$("userOptionPaneStatus").innerHTML=userListArr2[this.name][1];
$("userOptionPaneStatus").style.display="block";
}
if(userListArr2[this.name][0]&&((userListArr2[this.name][0]==1)||(userListArr2[this.name][0]==2))&&(!$(userListArr[this.name]))){
this.chatButton.disabled=false;
}
if(userListArr2[this.name][0]&&(userListArr2[this.name][0]!=4)){
this.removeButton.disabled=false;
}
},lableMouseOut:function(){
this.startTimer();
},panelMouseOver:function(){
this.clearTimer();
},panelMouseOut:function(){
this.startTimer();
},startTimer:function(){
this.timer=setTimeout("oUserOpt.hidePanel()",500);
},clearTimer:function(){
if(this.timer){
clearTimeout(this.timer);
}
this.showPanel();
},hidePanel:function(){
this.name=false;
oUserOpt.panel.hide();
},showPanel:function(){
pos=YAHOO.util.Dom.getXY("userDet"+this.name);
pos[0]-=208;
pos[1]+=3;
this.panel.moveTo(pos[0],pos[1]);
this.panel.show();
},chat:function(){
consoleObj.addConsole(userListArr[this.name]);
},remove:function(){
buddyObj.delReq(this.name);
this.hidePanel();
}};
CustomSelect=Class.create();
CustomSelect.prototype={panel:$("statusList"),panelHTML:$("statusList"),timer:null,selectBtn:$("statusSelectBtn"),inputBox:$("statusSelectInput"),defaultMessages:["Available","Busy","Offline"],statusNames:["Active","Away","Inactive"],recoverName:new Array(),itemId:false,state:false,locked:false,initialize:function(){
this.recoverName[0]=/^st/;
this.panel=new YAHOO.widget.Overlay(this.panel,{constraintoviewport:true,effect:{effect:YAHOO.widget.ContainerEffect.FADE,duration:0.25}});
this.panel.hide();
items=document.getElementsByClassName("stActive");
if(items){
for(i=0;i<items.length;i++){
this.itemId=items[i];
}
}
this.panel.hideEvent.subscribe(this.clearHide,this,true);
this.panel.showEvent.subscribe(this.clearTimer,this,true);
YAHOO.util.Event.addListener(this.panelHTML,"mouseout",this.hide,this,true);
YAHOO.util.Event.addListener(this.panelHTML,"mouseover",this.clearTimer,this,true);
YAHOO.util.Event.addListener(this.panelHTML,"click",this.clickEvent,this,true);
YAHOO.util.Event.addListener(this.selectBtn,"click",this.show,this,true);
YAHOO.util.Event.addListener(this.inputBox,"blur",this.specialMes,this,true);
YAHOO.util.Event.addListener(this.inputBox,"focus",this.lock,this,true);
},lock:function(){
this.locked=true;
},recoverStatus:function(id){
for(i=0;i<this.recoverName.length;i++){
if(this.recoverName[i].test(id)){
return id.replace(this.recoverName[i],"");
}
}
return false;
},recoverStatusCode:function(_52){
for(i=0;i<this.statusNames.length;i++){
if(this.statusNames[i]==_52){
return i+1;
}
}
return false;
},clickEvent:function(e){
evnt=new Evnt(e);
obj=evnt.getEventSrc();
value=obj.innerHTML;
this.inputBox.value=value;
if(!this.isDefault(value)){
this.inputBox.focus();
this.inputBox.select();
this.itemId=obj;
}
name=this.recoverStatus(obj.className);
this.state=this.recoverStatusCode(name);
this.panel.hide();
this.status(this.state,false,obj);
},specialMes:function(_54){
if(!this.itemId){
return;
}
if(!this.locked){
this.inputBox.value=_54;
}
if(!_54||(typeof (_54)!="string")||(_54=="")){
_54=this.inputBox.value;
this.locked=false;
}
this.status(this.state,_54,this.itemId);
},status:function(_55,_56,obj){
if(!_55&&!_56&&(_55!==0)){
this.hide();
return false;
}
args=new Array();
args[0]=selfState[0];
args[1]="";
if(this.name){
args[1]=this.name;
}
if(_55||(_55===0)){
args[0]=_55;
}else{
_55=args[0];
}
if(_56){
args[2]=_56;
obj.innerHTML=_56;
cookieObj.createCookie("custStatusMes",_56,false);
}
create(document.que,"input","buddyStatusMes[]",args.toString(),true);
if(this.name){
aBuddyView[this.name.toLowerCase()][0]=_55;
}else{
selfState[0]=_55;
}
this.hide();
},isDefault:function(_58){
for(i=0;i<this.defaultMessages.length;i++){
if(this.defaultMessages[i]==_58){
return true;
}
}
return false;
},show:function(){
YAHOO.util.Event.addListener(this.selectBtn,"mouseout",this.hide,this,true);
YAHOO.util.Event.addListener(this.selectBtn,"mouseover",this.clearTimer,this,true);
this.panel.show();
},clearTimer:function(){
if(this.timer){
clearTimeout(this.timer);
}
},clearHide:function(){
YAHOO.util.Event.removeListener(this.selectBtn,"mouseout");
YAHOO.util.Event.removeListener(this.selectBtn,"mouseover");
},hide:function(){
this.timer=setTimeout("custSel.panel.hide()",500);
}};
function TextTween(obj,_5a,txt,_5c,_5d){
var _5e=false;
instance=1;
this.play=function(){
_5e=setTimeout("animate();",_5d*1000);
};
this.stop=function(){
if(_5e){
clearTimeout(_5e);
}
revert();
};
animate=function(){
instance=1-instance;
switch(instance){
default:
case 0:
revert();
break;
case 1:
change();
break;
}
_5e=setTimeout("animate();",_5d*1000);
};
change=function(){
obj[_5a]=unescape(txt);
};
revert=function(){
obj[_5a]=unescape(_5c);
};
}
YAHOO.namespace("MOHA.Dialog");
window.alert=function(txt,_60){
if(!_60){
_60=docTitle;
}else{
_60=docTitle+" - "+_60;
}
var _61=function(){
this.hide();
};
d=new Date();
time=d.getTime();
YAHOO.MOHA.Dialog.alert=new YAHOO.widget.SimpleDialog("simpledialogAlert["+time+"]",{fixedcenter:true,visible:false,draggable:true,text:txt,modal:true,icon:YAHOO.widget.SimpleDialog.ICON_ALARM,constraintoviewport:false,buttons:[{text:"OK",handler:_61,isDefault:true}]});
YAHOO.MOHA.Dialog.alert.setHeader(_60);
kl=new YAHOO.util.KeyListener(document,{keys:27},{fn:YAHOO.MOHA.Dialog.alert.hide,scope:YAHOO.MOHA.Dialog.alert,correctScope:true});
YAHOO.MOHA.Dialog.alert.cfg.queueProperty("keylisteners",kl);
YAHOO.MOHA.Dialog.alert.render(document.body);
YAHOO.MOHA.Dialog.alert.show();
};
updateProgress("scripts/classes.js");

