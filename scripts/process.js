var counter=0;
var queCounter=0;
var threshold=200;
var sleepLength=10;
var proc=false;
var procCount=0;
var password="0123456789abcdef";
var scrollAuto=true;
var regExp=/\\'/g;
var regExp1=/\\/g;
var killCount=null;
var setTitleCount=new Array();
var lastNotification=new Array();
var logPad=document.getElementById("log");
var outConn=0;
var succConn=0;
var connStatWin=false;
window.onload=winLoaded;
function chk_enter(e,_2){
evnt=new Evnt(e);
if(evnt.shiftPressed){
return false;
}
if(e&&e.which){
e=e;
characterCode=e.which;
}else{
characterCode=e.keyCode;
}
if(characterCode==13){
stopEvent(e);
messageObj.addMessageToQue(_2);
}
}
function chkArrow(e,_4){
to=_4.title;
if(e&&e.which){
e=e;
characterCode=e.which;
}else{
characterCode=e.keyCode;
}
if(characterCode==38){
messageArchiveObj.moveToPrev(to);
}
if(characterCode==40){
messageArchiveObj.moveToNext(to);
}
}
function stopEvent(e){
return new Evnt(e).destroy();
}
function scroll2Bottom(_6){
if(scrollAuto){
_6.scrollTop=_6.scrollHeight;
}
}
function ref(){
window.refresh;
}
function enablePost(_7){
to=_7.title;
form=document.getElementById(to);
chars=form.message.value;
if(chars.length>0){
form.enter.disabled="";
}else{
form.enter.disabled="true";
}
}
function msgLoading(){
obj=$("transmissionStat");
obj.src="images/transmit.png";
obj.title="Contacting...";
procCount++;
}
function msgLoadingDone(){
obj=$("transmissionStat");
obj.src="images/transmit_blue.png";
obj.title="Idle";
procCount--;
if(procCount<0){
procCount=0;
}
clearTimeout(killCount);
}
function killXajax(){
xajax.abort();
msgLoadingDone();
}
function addLiveTitle(i){
setTitle(lastNotification[i]);
}
function notify(_9,_a){
lastNotification[0]=_9.replace(regExp1,"")+" says ";
lastNotification[1]=enhanceObj.enhanceTitle(_a.replace(regExp1,""));
addTween(lastNotification[0]+lastNotification[1]);
if(cookieObj.readCookie("muteStatus")!="mute"){
soundManager.play("notify");
}
}
function setTitle(_b){
if(_b){
document.title=unescape(_b)+" - "+docTitle;
}else{
document.title=docTitle;
}
}
function focusMessage(_c){
_c.message.focus();
}
function require_once(_d){
d=new Date();
if(!loadedScripts[_d]){
create(document.body,"script","dynamicallyLoadedScript"+d.getTime,false,false,{type:"text/javascript",src:_d});
}
}
function winLoaded(){
enableThemes();
$("userTable").style.display="none";
soundManagerInit();
$("status").style.visibility="hidden";
$("status").innerHTML=" Contacting...";
setTitle(false);
form=$("pageBody");
form.style.visibility="visible";
call=xajax_chat_start();
muteIni();
setTimeout("messageObj.processQue()",500);
freshUserTable=new YAHOO.util.DD("userTable");
freshUserTable.setHandleElId("userTableHead");
require_once(plugInObj.path);
}
function unSetAutoScrolling(){
scrollAuto=false;
}
function setAutoScrolling(){
scrollAuto=true;
}
updateProgress("scripts/process.js");
require_once("scripts/plugins.js");

