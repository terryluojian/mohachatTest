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

listOfFields = ['dbX',
				'dbHost',
				'databaseName',
				'createDatabase',
				'tablePrefix',
				'dbUsername',
				'createDBUser',
				'dbPassword',
				'notPrivileged',
				'privilegedUsername',
				'privilegedPassword',
				'noUsertable',
				'userTable',
				'userNameField',
				'passwordField'];

EvntX =  function() {
   this.initialize.apply(this, arguments);
}

EvntX.prototype = {
	ctrlPressed:false,
 	altPressed:false,
 	shiftPressed:false,

	initialize : function (evt) {
		if (!evt) var evt = window.event;

		this.evt = evt;

		this.modifierKeys();
	},

	getEventSrc : function () {
		e = this.evt;
		if (e.srcElement) {
			return e.srcElement;
		}

		return e.target;
	},

	getXY : function () {
		e = this.evt;
		posx = 0;
		posy = 0;

		if (e.pageX || e.pageY) {
			posx = e.pageX;
			posy = e.pageY;
		} else if (e.clientX || e.clientY) 	{
			posx = e.clientX + document.body.scrollLeft
				+ document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop
				+ document.documentElement.scrollTop;
		}
		coords = [posx, posy];
		return coords;
	},

	rightClick : function () {
		e = this.evt;
		if (e.which) {
			rightclick = (e.which == 3);
		} else if (e.button) {
			rightclick = (e.button == 2);
		}

		return rightclick;
	},

	modifierKeys : function () {
		e = this.evt;
		if (parseInt(navigator.appVersion)>3) {
			evt = navigator.appName=="Netscape" ? e:event;
			if (navigator.appName=="Netscape" && parseInt(navigator.appVersion)==4) {
				// NETSCAPE 4 CODE
				mString =(e.modifiers+32).toString(2).substring(3,6);
				this.shiftPressed=(mString.charAt(0)=="1");
				this.ctrlPressed =(mString.charAt(1)=="1");
				this.altPressed  =(mString.charAt(2)=="1");
			} else {
				// NEWER BROWSERS [CROSS-PLATFORM]
				this.shiftPressed=evt.shiftKey;
				this.altPressed  =evt.altKey;
				this.ctrlPressed =evt.ctrlKey;
			}
	 	}
	},

	destroy : function () {
		evt = this.evt;
		if (evt && evt.stopPropagation && (evt.stopPropagation != null)){
			evt.stopPropagation();
			evt.preventDefault();
		}else if(typeof evt.cancelBubble != "undefined"){
			evt.cancelBubble = true;
			evt.returnValue = false;
		}
		return false;
	}
}

function checkBoxChk (e) {
	evnt = new EvntX(e);

	if ($('createDBUser').checked || $('createDatabase').checked) {
		state = true;
	} else {
		state = false;
	}

	privileged = $('notPrivileged').checked;
	userTable = $('noUsertable').checked;

	switch (evnt.getEventSrc().id) {
		case 'createDatabase':
		case 'createDBUser'	 :
								$('notPrivileged').checked = false;
								$('notPrivileged').disabled = state;
		case 'notPrivileged' :  $('privilegedUsername').disabled = privileged;
								$('privilegedPassword').disabled = privileged;
								break;
		case 'noUsertable' 	 :  $('userTable').disabled = userTable;
								$('userNameField').disabled = userTable;
								$('passwordField').disabled = userTable;
								break;
	}

	finishTest ();

}

function loadedFrame (docObj) {
	try {
		root = docObj.responseXML.documentElement;
		parseResponse(root);
	} catch (e) {
		alert('Invalid response from the server');
		finishTest();
	}
}

function parseResponse(root) {
	passed = true;
	connection = root.getElementsByTagName('connection')[0];

	if (connection.firstChild.nodeValue != 'done') {
		passed = false;
		typeOfConn = connection.getAttributeNode('authType').nodeValue;

		if (typeOfConn == 'privileged') {
			$('privErr').innerHTML += unescape(connection.firstChild.nodeValue)+"<br/>";
			setColor('privErr', '#DA0000');
		}

		if (typeOfConn == 'db') {
			$('dbErr').innerHTML += unescape(connection.firstChild.nodeValue)+"<br/>";
			setColor('dbErr', '#DA0000');
		}

		if (typeOfConn == 'blank') {
			$('dbInfoErr').innerHTML += unescape(connection.firstChild.nodeValue)+"<br/>";
			setColor('dbInfoErr', '#DA0000');
		}

	}

	database = root.getElementsByTagName('database')[0];

	if (database.firstChild.nodeValue != 'done') {
		passed = false;
		$('dbInfoErr').innerHTML += unescape(database.firstChild.nodeValue)+"<br/>";
		setColor('dbInfoErr', '#DA0000');
	} else {
		modifyDb = database.getAttributeNode('modify').nodeValue;

		if (modifyDb == 'create') {
			$('createDatabase').checked = true;
			$('dbInfoErr').innerHTML += "Need create the database<br/>";
			setColor('dbInfoErr', '#DA0000');
		}
	}


	users = root.getElementsByTagName('users')[0];

	if (users.firstChild.nodeValue != 'done') {
		passed = false;
		$('dbErr').innerHTML += unescape(users.firstChild.nodeValue)+"<br/>";
		setColor('dbErr', '#DA0000');
	} else {
		modifyUser = users.getAttributeNode('modify').nodeValue;

		if (modifyUser == 'create') {
			$('createDBUser').checked = true;
			$('dbErr').innerHTML += "Need create the user<br/>";
			setColor('dbErr', '#DA0000');
		}
	}

	tables = root.getElementsByTagName('tables')[0];

	if (tables.firstChild.nodeValue != 'done') {
		passed = false;
		$('dbInfoErr').innerHTML += unescape(tables.firstChild.nodeValue)+"<br/>";
		setColor('dbInfoErr', '#DA0000');
	}

	if (passed) {
		$('next').disabled = false;
		$('response').target = "_self";
		$('response').action = '';
		$('loading').style.display = 'none';
	} else {
		finishTest();
	}
}

function setColor(cls, color) {
	element = $(cls);
	element.style.color = color;
}

function finishTest () {
	$('testDB').disabled = false;
	$('cancelTest').disabled = true;

	$('next').disabled = true;

	for (i=0; i<listOfFields.length; i++) {
		$(listOfFields[i]).onfocus = null;
	}

	$('response').target = "_self";
	$('response').action = '';
	$('loading').style.display = 'none';
}

function test() {
	$('privErr').innerHTML = "";
	$('dbErr').innerHTML = "";
	$('dbInfoErr').innerHTML = "";

	if (($('dbUsername').value == "") || ($('dbPassword').value == "")) {
		alert('Database user information is required');

		return false;
	}

	postData = "";

	for (i=0; i<listOfFields.length; i++) {
		$(listOfFields[i]).onfocus = function () {this.blur()};

		if ($(listOfFields[i]).disabled == false) {
			if ($(listOfFields[i]).type != 'checkbox' || $(listOfFields[i]).checked) {
				postData += $(listOfFields[i]).id+"="+$(listOfFields[i]).value+"&";
			}
		}
	}

	postData = postData.substr(0, postData.length-1);

	$('testDB').disabled = true;
	$('cancelTest').disabled = false;

	var request = YAHOO.util.Connect.asyncRequest('POST', 'process/database.php', {success:loadedFrame, failure:finishTest}, postData);

	$('loading').style.display = 'block';
}

function inProgress() {
	alert('hi');
}
