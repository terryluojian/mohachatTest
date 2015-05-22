var activeIcon="images/status_online.png";
var inactiveIcon="images/status_away.png";
var offlineIcon="images/status_offline.png";
var activeIconS="images/Active.gif";
var inactiveIconS="images/Away.gif";
var offlineIconS="images/Inactive.gif";
var pendingIconS="images/Pending.gif";
var userListArr=new Array();
var userListArr2=new Array();
var selfState=[1,false];
function setUserStates(_1){
label=new Array();
userListArr1=new Array();
for(user in _1){
state=_1[user][0];
newUser=false;
if($("userDet"+user.toLowerCase())){
currStatus=$("userDet"+user.toLowerCase()).title;
}else{
currStatus="Offline";
newUser=true;
}
userListArr[user.toLowerCase()]=user;
if(user&&_1[user]&&userListArr2[user.toLowerCase()]&&(_1[user][1]!=userListArr2[user.toLowerCase()][1])){
newUser=true;
}
userListArr2[user.toLowerCase()]=_1[user];
label={className:"userDet",innerHTML:user};
switch(state){
case 1:
label.title="Active";
label.onclick=chatClick;
label.img={id:"iconImg"+user.toLowerCase(),atributes:{src:"images/Active.gif",width:"13",height:"5"}};
if(_1[user][1]){
label.statusMes=_1[user][1].truncate(24);
userListArr2[user.toLowerCase()][1]=_1[user][1];
}else{
userListArr2[user.toLowerCase()][1]="Available";
}
parentx="userListActive";
imgIco=activeIconS;
signOut=false;
signIn=unEqual("Active",currStatus);
break;
case 2:
label.title="Inactive";
label.onclick=chatClick;
label.img={id:"iconImg"+user.toLowerCase(),atributes:{src:"images/Away.gif",width:"13",height:"5"}};
if(_1[user][1]){
label.statusMes=_1[user][1].truncate(24);
userListArr2[user.toLowerCase()][1]=_1[user][1];
}else{
userListArr2[user.toLowerCase()][1]="Inactive";
}
parentx="userListInactive";
imgIco=inactiveIconS;
signOut=false;
signIn=false;
break;
case 3:
label.title="Offline";
label.onclick=function(e){
chatAlert(e," is offline!");
};
label.img={id:"iconImg"+user.toLowerCase(),atributes:{src:"images/Inactive.gif",width:"13",height:"5"}};
if(_1[user][1]){
label.statusMes=_1[user][1].truncate(24);
userListArr2[user.toLowerCase()][1]=_1[user][1];
}else{
userListArr2[user.toLowerCase()][1]="Offline";
}
parentx="userListOffline";
imgIco=offlineIconS;
signOut=unEqual("Offline",currStatus);
signIn=false;
break;
case 0:
buddyObj.remove(user);
label=false;
signOut=true;
signIn=false;
break;
case 4:
label.title="Pending";
label.onclick=function(e){
chatAlert(e," is yet to approve you!");
};
label.img={id:"iconImg"+user.toLowerCase(),atributes:{src:"images/Pending.gif",width:"13",height:"5"}};
if(_1[user][1]){
label.statusMes=_1[user][1].truncate(24);
userListArr2[user.toLowerCase()][1]=_1[user][1];
}else{
userListArr2[user.toLowerCase()][1]="Pending";
}
parentx="userListOffline";
imgIco=offlineIconS;
signOut=false;
signIn=false;
break;
default:
buddyObj.del(user);
label=false;
signOut=true;
signIn=false;
break;
}
consoleImg=$("consoleIconImg"+user);
if(consoleImg){
consoleImg.src=imgIco;
}
if(signIn||signOut||newUser){
remove("userDet"+user.toLowerCase());
if(label){
parseUserLabel(parentx,"userDet"+user.toLowerCase(),label);
}
playUserStat(signIn,signOut);
}
user=false;
}
setSelfStatus();
updateEvent.fire();
}
function chatClick(e){
obj=getEventSrc(e);
objId=obj.id;
name=oUserOpt.recoverUser(objId);
consoleObj.addConsole(userListArr[name]);
}
function chatAlert(e,_6){
obj=getEventSrc(e);
objId=obj.id;
name=oUserOpt.recoverUser(objId);
alert(name+_6);
}
function parseUserLabel(_7,id,_9){
img=_9.img;
iHTML=_9.innerHTML;
sMes=false;
if(_9.statusMes){
sMes={atributes:{className:"statusMessage",innerHTML:_9.statusMes}};
_9.statusMes=null;
}
_9.img=null;
_9.innerHTML=null;
userLabelLi=create($(_7),"li",id,false,false,_9);
userLabelImg=create(userLabelLi,"img",img.id,false,false,img.atributes);
userLabelLi.innerHTML+=iHTML;
if(sMes){
userLabelStatusMes=create(userLabelLi,"div","st"+id,false,false,sMes.atributes);
}
YAHOO.util.Event.addListener(userLabelLi,"mouseover",oUserOpt.lableMouseOver,oUserOpt,true);
YAHOO.util.Event.addListener(userLabelLi,"mouseout",oUserOpt.lableMouseOut,oUserOpt,true);
}
function setSelfStatus(){
custSel.state=selfState[0];
switch(selfState[0]){
case 1:
labelT="Active";
imgIco=activeIconS;
break;
case 2:
labelT="Inactive";
imgIco=inactiveIconS;
break;
case 3:
labelT="Offline";
imgIco=offlineIconS;
break;
}
userLabelLi=$("userDet"+document.que.from.value);
userLabelLi.title=labelT;
$("iconImg"+document.que.from.value).src=imgIco;
if(selfState[1]){
custSel.specialMes(selfState[1]);
}
}
function minimizeUserList(){
objActive=$("userListActive");
objInactive=$("userListInactive");
objOffline=$("userListOffline");
objBuddyAdd=$("addBuddy");
objActive.style.display="none";
objInactive.style.display="none";
objOffline.style.display="none";
objBuddyAdd.style.display="none";
objMin=$("userMin");
objMin.title="Restore";
objMin.alt="restore";
objMin.src=restoreIconMO;
objMin.onclick=restoreUserList;
objMin.onmouseover=userListRestoreMouseOver;
objMin.onmouseout=userListRestoreMouseOut;
}
function restoreUserList(){
objActive=$("userListActive");
objInactive=$("userListInactive");
objOffline=$("userListOffline");
objBuddyAdd=$("addBuddy");
objActive.style.display="block";
objInactive.style.display="block";
objOffline.style.display="block";
objBuddyAdd.style.display="block";
objMin=$("userMin");
objMin.title="Minimize";
objMin.alt="Minimize";
objMin.src=minIconMO;
objMin.onclick=minimizeUserList;
objMin.onmouseover=userListMinMouseOver;
objMin.onmouseout=userListMinMouseOut;
}
function userListRestoreMouseOver(){
objMin=$("userMin");
mouseOver("restore",objMin);
}
function userListRestoreMouseOut(){
objMin=$("userMin");
mouseOut("restore",objMin);
}
function userListMinMouseOver(){
objMin=$("userMin");
mouseOver("minimize",objMin);
}
function userListMinMouseOut(){
objMin=$("userMin");
mouseOut("minimize",objMin);
}
function signout(_a){
if(_a||(confirm("Do you want to sign out?","Sign Out"))){
xajax_signout();
}
}
function playUserStat(_b,_c){
if((cookieObj.readCookie("muteStatus")!="mute")&&_b){
soundManager.play("signedin");
return;
}
if((cookieObj.readCookie("muteStatus")!="mute")&&_c){
soundManager.play("signedoff");
return;
}
}
updateProgress("scripts/user.js");

