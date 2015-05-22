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
 
var closeButton = 'images/tiny-closetool.gif';
var closeButtonMO = 'images/tiny-closetool-mo.gif';
var restoreIcon = 'images/tiny-restore.gif';
var restoreIconMO = 'images/tiny-restore-mo.gif';
var minIcon = 'images/tiny-minimize.gif';
var minIconMO = 'images/tiny-minimize-mo.gif';
var connIco = 'images/connect.gif';
var disconnIco = 'images/disconnect.gif';

var listOfSounds = Array('start', 'notify', 'delivery', 'signedoff', 'signedin'); 
var btnMute = document.getElementById("mute");
var icoMute = 'images/unmute.gif';
var icoUnMute = 'images/mute.gif';

var themeColor = "themes/backgrounds/"+theme+"images/consoleHead.gif";
var changeColor = '3399FF';

var tweenList = new Array();

var titleTween = false;

var updateEvent=new YAHOO.util.CustomEvent("updateEvent");

/**
 *	Instantiating the objects
 *
 */
enhanceObj = new Enhance();
deliveryObj = new Delivery();
messageArchiveObj = new MessageArchive();
consoleObj = new Console();
cookieObj = new Cookies();
messageObj = new Message();
infoObj = new Info();
themesObj = new Themes();
buddyObj = new Buddy();
custSel = new CustomSelect();

oUserOpt = new UserOptions();


/**
 *	Public functions
 *	
 */
looseTweenConsoleCommon = consoleObj.looseTweenConsoleCommon;
resMinConsole = consoleObj.resMinConsole;
minimizeChatConsole = consoleObj.minimizeChatConsole;
restoreChatConsole = consoleObj.restoreChatConsole;
processQue = messageObj.processQue;
submitQue = messageObj.submitQue;
clearQue = messageObj.clearQue;

/**
 * Special Events
 *
 */
  
function enableThemes() {
	$('blue').onclick = themesObj.detectChange;
	$('blue').src = 'images/blue_o.gif';
	$('orange').onclick = themesObj.detectChange;
	$('orange').src = 'images/orange_o.gif';
	$('black').onclick = themesObj.detectChange;
	$('black').src = 'images/black_o.gif';
}

function isEmpty(text) {
	if (text == '') {
		return true;
	}
	return false;
}

function create(objParent, sTag, sId, value, hidden, atributes) {	
	
	objElement = document.createElement(sTag);
	objElement.setAttribute('id',sId);
	objElement.setAttribute('name',sId);
	
	if (value) {
		objElement.setAttribute('value',value);
	}
	
	if (hidden) {
		objElement.setAttribute('type','hidden');
	}
	
	if (atributes) {
		setTagAtributes(objElement, atributes)
	}
	
	if (objParent)
		objParent.appendChild(objElement);
		
	return objElement;
}

function setTagAtributes(tag, atributes) {
	for (atribute in atributes) {
		if (atributes[atribute] != null) 
			tag[atribute] = atributes[atribute];		
	}
	
	return true;
}

function remove(sId) {
	
	objElement = $(sId);
	if (objElement && objElement.parentNode && objElement.parentNode.removeChild)
	{
		objElement.parentNode.removeChild(objElement);
	}
}

function mouseOver(button, obj) {
	switch (button) {
		case 'close' 	: obj.src = closeButtonMO;
						break;
		case 'minimize' : obj.src = minIconMO;
						break;
		case 'restore' : obj.src = restoreIconMO;
						break;
	}
}

function mouseOut(button, obj) {
	switch (button) {
		case 'close' 	: obj.src = closeButton;
						break;
		case 'minimize' : obj.src = minIcon;
						break;
		case 'restore' : obj.src = restoreIcon;
						break;
	}
}

function preLoad() {
	if (document.images) {
   		img0 = new Image();
		img1 = new Image();
		img2 = new Image();
		img3 = new Image();
		img4 = new Image();
		
		img5 = new Image();
		img6 = new Image();
		
		img7 = new Image();
		img8 = new Image();
		
		img9 = new Image();
		img10 = new Image();
		
		img11 = new Image();
		img12 = new Image();
		
		img0.src = closeButton;
   		img1.src = closeButtonMO;
		img2.src = activeIcon;
		img3.src = inactiveIcon;
		img4.src = offlineIcon;
		
		img5.src = minIcon;
		img6.src = minIconMO;
		
		img7.src = restoreIcon;
		img8.src = restoreIconMO;
		
		img9.src = icoMute;
		img10.src = icoUnMute;
		
		img11.src = connIco;
		img12.src = disconnIco;		
	}
}

function getEventSrc(e) {	
	return new Evnt(e).getEventSrc();	
}

function mute() {
	for (i=0; i < listOfSounds.length; i++) {
		if (soundManager.setVolume) {
			soundManager.setVolume(listOfSounds[i], 0);
		} else {
			alert('Failure')
		}
	}
	
	btnMute.src = icoUnMute;
	btnMute.title = "Unmute";
	btnMute.alt = "Unmute";
	btnMute.onclick = unmute;
	
	alert("Please note that you have muted sound alerts.");
	cookieObj.createCookie("muteStatus", "mute", false);
}

function unmute() {
	for (i=0; i < listOfSounds.length; i++) {
		if (soundManager.setVolume) {
			soundManager.setVolume(listOfSounds[i], 100);
		} else {
			alert('Failure')
		}
	}
	
	btnMute.src = icoMute;
	btnMute.title = "Mute";
	btnMute.alt = "Mute";
	btnMute.onclick = mute;
	
	cookieObj.createCookie("muteStatus", "unmute", false);
}

function muteIni() {
	if (cookieObj.readCookie("muteStatus") != "mute") {
		unmute();
	} else {
		mute();
	}
}

function startup(txt) {
	password =  txt;
	
	new Effect.BlindDown('userTable');
	
	if (cookieObj.readCookie("muteStatus") != "mute") {
		soundManager.setVolume('start', 50);
		soundManager.play('start');
	}
}

function unEqual(x, y) {
	if (x == y) {
		return false;
	}
	return true;
}

function addTween(message) {
	
	looseTween();
	
	message += ' - '+docTitle;

	titleTween = new TextTween(document, 'title', unescape(message), docTitle, 0.8);
	
	titleTween.play();
	
	onfocus = looseTween;
	
}

function looseTween() {
	if (titleTween) {		
		
		titleTween.stop();
		
		titleTween = false;
	
		onfocus = null;
	}
}

function popPanel(obj) {
	if (obj.style.display != 'block') {
		obj.style.display = 'block';
	
		new Effect.Opacity(obj.id, {from:0, to: 1});
	}
}

function findPos(obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		curleft = obj.offsetLeft
		curtop = obj.offsetTop
		while (obj = obj.offsetParent) {
			curleft += obj.offsetLeft
			curtop += obj.offsetTop
		}
	}
	return [curleft,curtop];
}

preLoad();

updateProgress('scripts/misc.js');
