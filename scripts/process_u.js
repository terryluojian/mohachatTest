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

var counter = 0;
var queCounter = 0;
var threshold = 200;
var sleepLength = 10;
var proc = false;
var procCount = 0;
var password = "0123456789abcdef";
var scrollAuto = true;
var regExp = /\\'/g;
var regExp1 = /\\/g;
var killCount = null;
var setTitleCount = new Array();
var lastNotification = new Array();
var logPad = document.getElementById("log");
var outConn = 0;
var succConn = 0;
var connStatWin = false;

// action handing

//this.onfocus = focusMessage;
window.onload = winLoaded;

function chk_enter(e, obj) {
	evnt = new Evnt(e);

	if (evnt.shiftPressed) return false;

	if(e && e.which){
		e = e;
		characterCode = e.which;
	} else {
		characterCode = e.keyCode;
	}

	if(characterCode == 13) {
		stopEvent(e);
		messageObj.addMessageToQue(obj);
	}
}

function chkArrow(e, obj) {
	to = obj.title;
	if(e && e.which){
		e = e;
		characterCode = e.which;
	} else {
		characterCode = e.keyCode;
	}

	if(characterCode == 38) {
		messageArchiveObj.moveToPrev(to);
	}

	if(characterCode == 40) {
		messageArchiveObj.moveToNext(to);
	}
}

function stopEvent(e){
	return new Evnt(e).destroy();
}

function scroll2Bottom(objDiv) {
	if (scrollAuto) {
		objDiv.scrollTop = objDiv.scrollHeight;
		//focusMessage(form);
	}
}

function ref() {
	window.refresh;
}

function enablePost(obj) {
	to = obj.title;
	form = document.getElementById(to);

	chars = form.message.value;

	if (chars.length > 0) {
		form.enter.disabled = '';
	} else {
		form.enter.disabled = 'true';
	}
}

function msgLoading() {
	obj = $('transmissionStat');
	obj.src = 'images/transmit.png';
	obj.title = 'Contacting...';
	//document.getElementById('status').style.visibility = 'visible';
	procCount++;

	//killCount = setTimeout('killXajax()', 20000);
}

function msgLoadingDone() {
	obj = $('transmissionStat');
	obj.src = 'images/transmit_blue.png';
	obj.title = 'Idle';
	//document.getElementById('status').style.visibility = 'hidden';
	procCount--;

	if (procCount < 0) {
		procCount = 0;
	}

	clearTimeout(killCount);
}

function killXajax() {
	xajax.abort();

	msgLoadingDone();
}

function addLiveTitle(i) {
	setTitle(lastNotification[i]);
}

function notify(from, message) {

	lastNotification[0] = from.replace(regExp1, "")+" says ";
	lastNotification[1] = enhanceObj.enhanceTitle(message.replace(regExp1, ""));

	addTween(lastNotification[0]+lastNotification[1]);

	if (cookieObj.readCookie("muteStatus") != "mute") {
		soundManager.play('notify');
	}
}

function setTitle(text) {

	if (text) {
		document.title = unescape(text)+' - '+docTitle;
	} else {
		document.title = docTitle;
	}
}

function focusMessage(form) {
	form.message.focus();
}

function require_once(fileName) {
	d = new Date();
	if (!loadedScripts[fileName]) {
		create(document.body, 'script', 'dynamicallyLoadedScript'+d.getTime, false, false, {type:'text/javascript', src:fileName})
		//document.write('<script type="text/javascript" src="'+fileName+'"></script>');
	}
}

function winLoaded() {
	enableThemes();

	$('userTable').style.display = 'none';

	soundManagerInit();
	$('status').style.visibility = 'hidden';
	$('status').innerHTML = ' Contacting...';

	setTitle(false);

	form = $('pageBody');

	form.style.visibility = 'visible';

	call = xajax_chat_start();

	muteIni();

	setTimeout("messageObj.processQue()", 500);

	freshUserTable = new YAHOO.util.DD('userTable');
	freshUserTable.setHandleElId('userTableHead');

	require_once(plugInObj.path);
}

function unSetAutoScrolling() {
	scrollAuto = false;
}

function setAutoScrolling() {
	scrollAuto = true;
}

updateProgress("scripts/process.js");

require_once('scripts/plugins.js');