/**
 * MOHA Chat 
 * Copyright (C) 2006 S.H.Mohanjith, http://www.mohanjith.net
 *
 * MOHA Chat is free software; you can redistribute it and/or modify it under the terms of
 * the GNU General Public License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * MOHA Chat is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program;
 * if not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
 * Boston, MA  02110-1301, USA
 *
 */

var activeIcon = 'images/status_online.png';
var inactiveIcon = 'images/status_away.png';
var offlineIcon = 'images/status_offline.png';

var activeIconS = 'images/Active.gif';
var inactiveIconS = 'images/Away.gif';
var offlineIconS = 'images/Inactive.gif';
var pendingIconS = 'images/Pending.gif';

var userListArr=new Array();
var userListArr2=new Array();

var selfState=[1,false];

function setUserStates(users) {	
	label = new Array();
	userListArr1 = new Array();
	
	for (user in users) {			
		state = users[user][0];	
		newUser = false;
				
		if ($("userDet"+user.toLowerCase())) {
			currStatus = $("userDet"+user.toLowerCase()).title;
		} else {
			currStatus = 'Offline';
			newUser = true;
		}		
		
		userListArr[user.toLowerCase()]=user;
		
		if (user && users[user] && userListArr2[user.toLowerCase()] && (users[user][1] != userListArr2[user.toLowerCase()][1])) {
			newUser = true;
		}
		
		userListArr2[user.toLowerCase()]=users[user];		
		label = {className:'userDet', innerHTML:user};
		
		switch (state) {			
			case 1 : label.title = 'Active';
					 label.onclick = chatClick;
					 label.img = {id:'iconImg'+user.toLowerCase(), atributes:{ src:"images/Active.gif",
					 														   width:"13", height:"5"}};
					 if (users[user][1]) {
						 label.statusMes=users[user][1].truncate(24);
						 userListArr2[user.toLowerCase()][1]=users[user][1];
					 } else {
						 userListArr2[user.toLowerCase()][1]="Available";
					 }
					 
					 parentx = 'userListActive';
					 imgIco = activeIconS;
					 signOut = false;
					 signIn = unEqual('Active', currStatus);
					 break;
					 
			case 2 : label.title = 'Inactive';
					 label.onclick = chatClick;
					 label.img = {id:'iconImg'+user.toLowerCase(), atributes:{ src:"images/Away.gif",
					 														   width:"13", height:"5"}};	
					 
					 if (users[user][1]) {
						 label.statusMes=users[user][1].truncate(24);
						 userListArr2[user.toLowerCase()][1]=users[user][1];
					 } else {
						 userListArr2[user.toLowerCase()][1]="Inactive";
					 }
					 
					 parentx = 'userListInactive';
					 imgIco = inactiveIconS;
					 signOut = false;
					 signIn = false;
					 break;
					 
			case 3 : label.title = 'Offline';
					 label.onclick = function (e) {chatAlert(e,' is offline!');};
					 label.img = {id:'iconImg'+user.toLowerCase(), atributes:{ src:"images/Inactive.gif",
					 														   width:"13", height:"5"}};
					 
					 if(users[user][1]){
						 label.statusMes=users[user][1].truncate(24);
						 userListArr2[user.toLowerCase()][1]=users[user][1];
					 } else {
						 userListArr2[user.toLowerCase()][1]="Offline";
					 }
					 
					 parentx = 'userListOffline';
					 imgIco = offlineIconS;
					 signOut = unEqual('Offline', currStatus);
					 signIn = false;
					 break;
					 
			case 0 : buddyObj.remove(user);
					 label = false;
					 signOut = true;
					 signIn = false;
					 break;
					 
			case 4 : label.title = 'Pending';
					 label.onclick = function (e) {chatAlert(e,' is yet to approve you!');};
					 label.img = {id:'iconImg'+user.toLowerCase(), atributes:{ src:"images/Pending.gif",
					 														   width:"13", height:"5"}};
					 
					 if (users[user][1]) {
						 label.statusMes=users[user][1].truncate(24);
						 userListArr2[user.toLowerCase()][1]=users[user][1];
					 } else {
						 userListArr2[user.toLowerCase()][1]="Pending";
					 }
					 
					 parentx = 'userListOffline';
					 imgIco = offlineIconS;
					 signOut = false;
					 signIn = false;
					 break;	
					 
			default: buddyObj.del(user);
					 label = false;
					 signOut = true;
					 signIn = false;
					 break;
		}
		
		consoleImg = $('consoleIconImg'+user);
		
		if (consoleImg) {
			consoleImg.src = imgIco;			
		}	
		
		if (signIn || signOut || newUser) {
			remove("userDet"+user.toLowerCase());
		
			if (label) {
				parseUserLabel(parentx, 'userDet'+user.toLowerCase(), label);
			}		
			
			playUserStat(signIn, signOut);	
		}			
				
		user = false;			
	}
	
	setSelfStatus();
	updateEvent.fire();
}

function chatClick(e) {
	
	obj = getEventSrc(e);
	objId = obj.id;
			
	name = oUserOpt.recoverUser(objId);
	
	consoleObj.addConsole(userListArr[name]);
}

function chatAlert(e, message) {
	
	obj = getEventSrc(e);
	objId = obj.id;
		
	name = oUserOpt.recoverUser(objId);
	
	alert(name+message);
}

function parseUserLabel(parentx, id, label) {	
	img = label.img;
	iHTML = label.innerHTML;
	sMes = false;
		
	if (label.statusMes) {
		sMes = {atributes : {className:'statusMessage', innerHTML:label.statusMes}};
		label.statusMes = null;	
	}
	
	label.img = null;
	label.innerHTML = null;	
	
	userLabelLi = create($(parentx), "li", id, false, false, label);
	userLabelImg = create(userLabelLi, "img", img.id, false, false, img.atributes);
	userLabelLi.innerHTML +=iHTML;
	
	if (sMes) {
		userLabelStatusMes = create(userLabelLi, "div", "st"+id, false, false, sMes.atributes);
	}
	
	YAHOO.util.Event.addListener(userLabelLi,"mouseover",oUserOpt.lableMouseOver,oUserOpt,true);
	YAHOO.util.Event.addListener(userLabelLi,"mouseout",oUserOpt.lableMouseOut,oUserOpt,true);
}

function setSelfStatus() {
	custSel.state=selfState[0];
	
	switch(selfState[0]){
		case 1: labelT="Active";
				imgIco=activeIconS;
				break;
		case 2: labelT="Inactive";
				imgIco=inactiveIconS;
				break;
		case 3: labelT="Offline";
				imgIco=offlineIconS;
				break;
	}
	
	userLabelLi=$("userDet"+document.que.from.value);
	userLabelLi.title=labelT;$("iconImg"+document.que.from.value).src=imgIco;
	
	if(selfState[1]){
		custSel.specialMes(selfState[1]);
	}
}

function minimizeUserList() {
	objActive = $('userListActive');
	objInactive = $('userListInactive');
	objOffline = $('userListOffline');
	objBuddyAdd = $('addBuddy');
	
	objActive.style.display = 'none';
	objInactive.style.display = 'none';
	objOffline.style.display = 'none';
	objBuddyAdd.style.display = 'none';
	
	objMin = $('userMin');
	
	objMin.title = 'Restore';
	objMin.alt = 'restore';
	objMin.src = restoreIconMO;
	
	objMin.onclick = restoreUserList;
	objMin.onmouseover = userListRestoreMouseOver;
	objMin.onmouseout = userListRestoreMouseOut;
}

function restoreUserList() {
	objActive = $('userListActive');
	objInactive = $('userListInactive');
	objOffline = $('userListOffline');
	objBuddyAdd = $('addBuddy');
	
	objActive.style.display = 'block';
	objInactive.style.display = 'block';
	objOffline.style.display = 'block';
	objBuddyAdd.style.display = 'block';
	
	objMin = $('userMin');
	
	objMin.title = 'Minimize';
	objMin.alt = 'Minimize';
	objMin.src = minIconMO;
	
	objMin.onclick = minimizeUserList;
	objMin.onmouseover = userListMinMouseOver;
	objMin.onmouseout = userListMinMouseOut;
}

function userListRestoreMouseOver() {
	objMin = $('userMin');
	mouseOver('restore', objMin);
}

function userListRestoreMouseOut() {

	objMin = $('userMin');
	mouseOut('restore', objMin);
}

function userListMinMouseOver() {
	objMin = $('userMin');
	mouseOver('minimize', objMin);
}

function userListMinMouseOut() {
	objMin = $('userMin');
	mouseOut('minimize', objMin);
}

function signout(confirmed) {

	
	if (confirmed || (confirm('Do you want to sign out?', 'Sign Out'))) {
		xajax_signout();
	}
}

function playUserStat(signIn, signOut) {
	if ((cookieObj.readCookie("muteStatus") != "mute") && signIn) {
		soundManager.play('signedin');
		
		return;
	}
	
	if ((cookieObj.readCookie("muteStatus") != "mute") && signOut) {
		soundManager.play('signedoff');
		
		return;
	}
}

updateProgress("scripts/user.js");