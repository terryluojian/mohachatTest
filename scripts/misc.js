var closeButton="images/tiny-closetool.gif";
var closeButtonMO="images/tiny-closetool-mo.gif";
var restoreIcon="images/tiny-restore.gif";
var restoreIconMO="images/tiny-restore-mo.gif";
var minIcon="images/tiny-minimize.gif";
var minIconMO="images/tiny-minimize-mo.gif";
var connIco="images/connect.gif";
var disconnIco="images/disconnect.gif";
var listOfSounds=Array("start","notify","delivery","signedoff","signedin");
var btnMute=document.getElementById("mute");
var icoMute="images/unmute.gif";
var icoUnMute="images/mute.gif";
var themeColor="themes/backgrounds/"+theme+"images/consoleHead.gif";
var changeColor="3399FF";
var tweenList=new Array();
var titleTween=false;
var updateEvent=new YAHOO.util.CustomEvent("updateEvent");
enhanceObj=new Enhance();
deliveryObj=new Delivery();
messageArchiveObj=new MessageArchive();
consoleObj=new Console();
cookieObj=new Cookies();
messageObj=new Message();
infoObj=new Info();
themesObj=new Themes();
buddyObj=new Buddy();
custSel=new CustomSelect();
oUserOpt=new UserOptions();
looseTweenConsoleCommon=consoleObj.looseTweenConsoleCommon;
resMinConsole=consoleObj.resMinConsole;
minimizeChatConsole=consoleObj.minimizeChatConsole;
restoreChatConsole=consoleObj.restoreChatConsole;
processQue=messageObj.processQue;
submitQue=messageObj.submitQue;
clearQue=messageObj.clearQue;
function enableThemes(){
$("blue").onclick=themesObj.detectChange;
$("blue").src="images/blue_o.gif";
$("orange").onclick=themesObj.detectChange;
$("orange").src="images/orange_o.gif";
$("black").onclick=themesObj.detectChange;
$("black").src="images/black_o.gif";
}
function isEmpty(_1){
if(_1==""){
return true;
}
return false;
}
function create(_2,_3,_4,_5,_6,_7){
objElement=document.createElement(_3);
objElement.setAttribute("id",_4);
objElement.setAttribute("name",_4);
if(_5){
objElement.setAttribute("value",_5);
}
if(_6){
objElement.setAttribute("type","hidden");
}
if(_7){
setTagAtributes(objElement,_7);
}
if(_2){
_2.appendChild(objElement);
}
return objElement;
}
function setTagAtributes(_8,_9){
for(atribute in _9){
if(_9[atribute]!=null){
_8[atribute]=_9[atribute];
}
}
return true;
}
function remove(_a){
objElement=$(_a);
if(objElement&&objElement.parentNode&&objElement.parentNode.removeChild){
objElement.parentNode.removeChild(objElement);
}
}
function mouseOver(_b,_c){
switch(_b){
case "close":
_c.src=closeButtonMO;
break;
case "minimize":
_c.src=minIconMO;
break;
case "restore":
_c.src=restoreIconMO;
break;
}
}
function mouseOut(_d,_e){
switch(_d){
case "close":
_e.src=closeButton;
break;
case "minimize":
_e.src=minIcon;
break;
case "restore":
_e.src=restoreIcon;
break;
}
}
function preLoad(){
if(document.images){
img0=new Image();
img1=new Image();
img2=new Image();
img3=new Image();
img4=new Image();
img5=new Image();
img6=new Image();
img7=new Image();
img8=new Image();
img9=new Image();
img10=new Image();
img11=new Image();
img12=new Image();
img0.src=closeButton;
img1.src=closeButtonMO;
img2.src=activeIcon;
img3.src=inactiveIcon;
img4.src=offlineIcon;
img5.src=minIcon;
img6.src=minIconMO;
img7.src=restoreIcon;
img8.src=restoreIconMO;
img9.src=icoMute;
img10.src=icoUnMute;
img11.src=connIco;
img12.src=disconnIco;
}
}
function getEventSrc(e){
return new Evnt(e).getEventSrc();
}
function mute(){
for(i=0;i<listOfSounds.length;i++){
if(soundManager.setVolume){
soundManager.setVolume(listOfSounds[i],0);
}else{
alert("Failure");
}
}
btnMute.src=icoUnMute;
btnMute.title="Unmute";
btnMute.alt="Unmute";
btnMute.onclick=unmute;
alert("Please note that you have muted sound alerts.");
cookieObj.createCookie("muteStatus","mute",false);
}
function unmute(){
for(i=0;i<listOfSounds.length;i++){
if(soundManager.setVolume){
soundManager.setVolume(listOfSounds[i],100);
}else{
alert("Failure");
}
}
btnMute.src=icoMute;
btnMute.title="Mute";
btnMute.alt="Mute";
btnMute.onclick=mute;
cookieObj.createCookie("muteStatus","unmute",false);
}
function muteIni(){
if(cookieObj.readCookie("muteStatus")!="mute"){
unmute();
}else{
mute();
}
}
function startup(txt){
password=txt;
new Effect.BlindDown("userTable");
if(cookieObj.readCookie("muteStatus")!="mute"){
soundManager.setVolume("start",50);
soundManager.play("start");
}
}
function unEqual(x,y){
if(x==y){
return false;
}
return true;
}
function addTween(_13){
looseTween();
_13+=" - "+docTitle;
titleTween=new TextTween(document,"title",unescape(_13),docTitle,0.8);
titleTween.play();
onfocus=looseTween;
}
function looseTween(){
if(titleTween){
titleTween.stop();
titleTween=false;
onfocus=null;
}
}
function popPanel(obj){
if(obj.style.display!="block"){
obj.style.display="block";
new Effect.Opacity(obj.id,{from:0,to:1});
}
}
function findPos(obj){
var _16=curtop=0;
if(obj.offsetParent){
_16=obj.offsetLeft;
curtop=obj.offsetTop;
while(obj=obj.offsetParent){
_16+=obj.offsetLeft;
curtop+=obj.offsetTop;
}
}
return [_16,curtop];
}
preLoad();
updateProgress("scripts/misc.js");

