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

String.prototype.wordWrap = function(m, b, c){
    var i, j, s, r = this.split("\n");
    if(m > 0) {
		
		for(i in r){
	        for(s = r[i], r[i] = ""; s.length > m;
	            j = c ? m : (j = s.substr(0, m).match(/\s*$/)).input.length - j[0].length
	            || m,
	            r[i] += s.substr(0, j) + ((s = s.substr(j)).length ? b : "")
	        ) {
	        r[i] += s;
			}
	    }
	}
    return r.join("\n");
}

String.prototype.trim = function () {
	regExp = /^\s+|\s+$/g;
	str = this;
	
	return str.replace(regExp, "");
}

String.prototype.truncate = function (length) {
	txt = this;
	
	if (txt.length > length) {
		txt = txt.substr(0, length)+"...";
	}
	
	return txt;
}

Info = function () {
}

Info.prototype = {	
	loading : false,
	show : function(contObj) {
		
		$('infoPane').innerHTML = '<div id="infoPaneHead" class="chatBoardHead"><img src="images/tiny-closetool.gif" alt="Close" title="Close" width="20" height="20" onclick="infoObj.hide();" onmouseover="mouseOver(\'close\', this)" onmouseout="mouseOut(\'close\', this)" /><span id="chatBordHead"><img id="infoIco" src="images/'+contObj.icon+'" align="top"/>'+contObj.title+'</span></div><div class="innerPane">'+unescape(contObj.content)+'</div>';		
				
		new Effect.Opacity('infoPane', {from:0.50, to: 1});
	},
	
	hide : function (pane) {
		if (!pane) pane = 'infoPane';
		new Effect.BlindUp(pane);		
	},
	
	displayInfo : function (page) {
		
		obj = $('infoPane');
		
		if (!obj) {
			obj = create($('leftBottom'), 'div', 'infoPane');
		}
		
		obj.innerHTML = '<div id="infoPaneHead" class="chatBoardHead"><img src="images/tiny-closetool.gif" alt="Close" title="Close" width="20" height="20" onclick="infoObj.hide();" onmouseover="mouseOver(\'close\', this)" onmouseout="mouseOut(\'close\', this)" /><span id="chatBordHead"><img id="infoIco" src="images/loading.gif" align="top"/>Loading</span></div>';
		obj.style.display = 'block';		
				
		if (!eval('info_'+page)) {
			obj = $('info_js');
			
			if (!obj) {
				obj = create(document.body, 'script', 'info_js');
			}
			
			obj.src = 'lib/enhance/enhance.php';
			
			if (!this.loading) {
				setTimeout('infoObj.displayInfo(info_'+page+');', 200);
				this.loading = true;
			}
		} else {
			this.show(eval('info_'+page));
		}
	},
	
	unableToConnect : function () {
		$('connIco').src = disconnIco;
		popPanel($('systemMessagesPane'));
		$('iconImg'+$('from').value).src = offlineIconS;
	},
	
	connected : function () {
		$('connIco').src = connIco;
		$('iconImg'+$('from').value).src = activeIconS;
		this.hide('systemMessagesPane');
	},
	
	connecting : function () {
		$('connIco').src = connIco;		
	}
	
}

Enhance = function () {
}

Enhance.prototype = {	
	plugIns : {message : new Array(), title : new Array()},

	registerPlugIn : function (plugInCall, type) {								
		this.plugIns[type][this.plugIns[type].length] = plugInCall;
		return true;
	},
	
	enhanceMessage : function (txt) {
		this.txt = txt;		
				
		for (j=0; j<this.plugIns.message.length; j++) {			
			eval(this.plugIns.message[j]+"(this)");
		}
		
		this._addLinks();		
		
		txt = this.txt;
		
		this.txt = null;
		
		return txt;
	},	
	
	enhanceTitle : function (txt) {
		this.txt = txt;
				
		for (j=0; j<this.plugIns.title.length; j++) {
			eval(this.plugIns.title[j]+"(this)");
		}
		
		txt = this.txt;
		
		this.txt = null;
		
		return txt;
	},

	_addLinks : function () {
		text = this.txt;		
		
		var mailRegExp = /(([a-zA-Z0-9])+([\.a-zA-Z0-9_-])*@([a-zA-Z0-9])+(\.[a-zA-Z0-9_-]+)+)/g;
		var mailReplacement = '<a href="mailto:$1" target="_blank"><img src="images/email.png" border="0" align="top" class="ico" />$1</a>';
	
		var linkRegExp = /((http(s)*:\/\/)+(([a-zA-Z0-9])+(\.[a-zA-Z0-9_-]+)+)(\S*))/g;
		var linkReplacement = '<a href="http$3://$4$7" target="_blank"><img src="images/link.png" border="0" align="top" class="ico" />$1</a>';
	
		formatted = text.replace(linkRegExp, linkReplacement);
		formatted = formatted.replace(mailRegExp, mailReplacement);
	
		this.txt = formatted;
	}
}

MessageArchive = function () {
}

MessageArchive.prototype = {
	prevMessages : new Array(),
	messagePointer : 0,

	addToPrevMessages : function (message, to) {	
		this.prevMessages[this.messagePointer] = EncipherText(message, password);
		this.messagePointer++;	 
	},

	moveToPrev : function (to) {
		objMessage = $(to).message;
	
		if ((this.messagePointer > 0) && this.okToChange(objMessage)) {
			this.messagePointer--;
			this.putMessageInText(this.prevMessages[this.messagePointer], objMessage);
		}
	},

	moveToNext : function (to) {
		objMessage = $(to).message;
	
		i = this.prevMessages.length-1;
	
		if ((this.messagePointer < i) && this.okToChange(objMessage)) {
			this.messagePointer++;
			this.putMessageInText(this.prevMessages[this.messagePointer], objMessage);
		}
	},

	putMessageInText : function (cipher, objMessage) {		
	
		objMessage.value = DecipherText(cipher, password);
	
		objMessage.focus();
		objMessage.select();
	
	},

	okToChange : function (objMessage) {
	
		evalText = objMessage.value;
		evalTextEncrypted = EncipherText(evalText, password);
	
		if (isEmpty(evalText) || (evalTextEncrypted == this.prevMessages[this.messagePointer])) {
			return true;
		}
	
		return false;
	}
}

Delivery = function () {
}

Delivery.prototype = {	
	deliveryColors : {0 : '#FF5E5E', 1 : '#0066FF'},
	
	markDelivery : function (statuses) {
		
		for (timex in statuses) {			
			$("message["+timex+"]").style.color = this.deliveryColors[statuses[timex]];				
		}
	
		if (cookieObj.readCookie("muteStatus") != "mute") {
			soundManager.play('delivery');	
		}
		
	}

}

Console = function () {
}

Console.prototype = {
	removeTimers : new Array(),
	effects : new Array(),
	summary : new Array(),
	buttonList : new Array(),
	
	registerButton : function (idPrefix, atributes) {
		this.buttonList[idPrefix] = atributes;
		//img, title, alt, onClick
	},
	
	addButtons : function (name) {
		objParent = $('imageControl'+name);
		
		for (idPrefix in this.buttonList) {
			atributes = this.buttonList[idPrefix];			
			if (typeof(atributes) == 'object') {				
				obj = create(objParent, 'img', idPrefix+name, null, false, atributes);
			}
		}
	},
	
	addConsole : function (name) {	
	
		if (this.effects[name]) this.effects[name].cancel;
		
		if (!(console = $(name))) {
	
			objParent = $("consoleArea");
	
			form = create(objParent, "form", name, "", false);			
	
			form.innerHTML = '<div class="chatTable" id="chatTable'+name+'"><div class="chatBoardHead" id="chatBoardHead'+name+'"><img src="images/tiny-closetool.gif" alt="Close" title="Close" width="20" height="20" onclick="consoleObj.closeChatConsole(\''+name+'\')" onmouseover="mouseOver(\'close\', this)" onmouseout="mouseOut(\'close\', this)" /><img src="images/tiny-minimize.gif" alt="Minimize" title="Minimize" width="20" height="20" id="min'+name+'"/><span id="chatBordHead"><img id="consoleIconImg'+name+'" src="'+offlineIconS+'"/>'+name+'</span></div><div id="chatBoard'+name+'" class="chatBoard" onclick="scroll2Bottom(this);"></div><div class="flashMessages" id="flash'+name+'" ></div><div class="imageControl" id="imageControl'+name+'"></div><div class="chatControls" id="chatControls'+name+'"><textarea name="message" id="message" class="message" cols="12" rows="2" onkeypress="chk_enter(event, this);" onkeyup="enablePost(this); chkArrow(event, this);" onchange="enablePost(this);" onfocus="enablePost(this);" title="'+name+'"></textarea>\n<input type="button" name="enter" id="enter" class="enter" value="<-" onclick="messageObj.addMessageToQue(this);" disabled="disabled" title="'+name+'"/></div></div>';			
			
			this.addButtons(name);
			btnMinmimize = $('min'+name);
			btnMinmimize.onclick = this.minimizeChatConsole;
			btnMinmimize.onmouseover = this.minimizeMouseOver;
			btnMinmimize.onmouseout = this.minimizeMouseOut;
			
			freshConsole = new YAHOO.util.DD('chatTable'+name);
			freshConsole.setHandleElId('chatBoardHead'+name);
			
			this.appear(name);
		
		} else {
			if (this.removeTimers[name]) {
				clearTimeout(this.removeTimers[name]);
				this.appear(name);
			}
			console.focus();
		}
	},
	
	appear : function (user) {		
		
	},
	
	closeChatConsole : function (name) {	
		if (this.effects[name]) this.effects[name].cancel;
		this.effects[name] = new Effect.Fade(name);		
		this.removeTimers[name] = setTimeout("remove('"+name+"')", 300);
		
		consoleObj.summary[name] = null;
	},
	
	minimizeMouseOut : function (e) {
		var recoverName = /min/;
	
		obj = getEventSrc(e);
	
		objId = obj.id;
	
		name = objId.replace(recoverName, "")
	
		if (name == objId) {
			obj.src = restoreIcon;
		} else {
			obj.src = minIcon;
		}
	},

	minimizeMouseOver : function (e) {
		var recoverName = /min/;
	
		obj = getEventSrc(e);
	
		objId = obj.id;
	
		name = objId.replace(recoverName, "")
	
		if (name == objId) {
			obj.src = restoreIconMO;
		} else {
			obj.src = minIconMO;
		}	
	},
	
	minimizeChatConsole : function (e) {
		var recoverName = /min/;
		
		obj = getEventSrc(e);
		
		objId = obj.id;
		
		name = objId.replace(recoverName, "");
		
		obj.title = 'Restore';
		obj.alt = 'restore';
		obj.src = restoreIconMO;
		obj.id = 'max'+name;
		
		obj.onclick = restoreChatConsole;
		
		resMinConsole('none', name, false);			
		
		looseTweenConsoleCommon(name);
		
		if (e) {
			stopEvent(e);
		}
	},

	restoreChatConsole : function (e) {
		var recoverName = /max/;
		
		obj = getEventSrc(e);
		
		objId = obj.id;
		
		name = objId.replace(recoverName, "");
		
		obj.title = 'Minimize';
		obj.alt = 'Minimize';
		obj.src = minIconMO;
		
		obj.id = 'min'+name;
		
		obj.onclick = minimizeChatConsole;
		
		resMinConsole('block', name, false);
		
		looseTweenConsoleCommon(name);
		
		if (e) {
			stopEvent(e);
		}
	},

	resMinConsole : function (state, name, xlimit) {	
		$('chatBoard'+name).style.display = state;
		if (xlimit == false) {
			$('chatControls'+name).style.display = state;
			$('imageControl'+name).style.display = state;
		}
	},
	
	tweenConsole : function (name) {
		
		this.looseTweenConsoleCommon(name)	
			
		obj = $('chatBoard'+name);
	
		obj.onfocus = this.looseTweenConsole;
		obj.onclick = this.looseTweenConsole;		
	
		obj = $(name).message;
	
		obj.onfocus = this.looseTweenConsoleMessage;	
		obj.onkeydown = this.looseTweenConsoleMessage;	
		
		obj = $('chatBoardHead'+name);
	
		obj.onfocus = this.looseTweenConsole;
		obj.onclick = this.looseTweenConsole;	
		
		obj.className = 'chatBoardHeadTween';
		
		//obj.style.backgroundImage = "url('themes/backgrounds/"+theme+"images/consoleHead_sp.gif')";		
		
	},

	looseTweenConsole : function (e) {
		var recoverName = /^chatBoard(Head){0,1}/;
	
		obj = getEventSrc(e);
	
		objId = obj.id;
	
		name = objId.replace(recoverName, "");
			
		if (name) looseTweenConsoleCommon(name);	
	}, 

	looseTweenConsoleMessage : function (e) {
		obj = getEventSrc(e);
	
		name = obj.title;	
		
		if (name) looseTweenConsoleCommon(name);	
	},

	looseTweenConsoleCommon : function (name) {
			
		looseTween();
				
		obj = $('chatBoardHead'+name);
		
		if (!obj) return false;
		
		obj.className = 'chatBoardHead';		
		//obj.style.backgroundImage = "url('themes/backgrounds/"+theme+"images/consoleHead_a.gif')";
				
		obj.onfocus = null;
		obj.onclick = null;
	
		obj = $('chatBoard'+name);
	
		obj.onfocus = null;
		obj.onclick = null;
	
		obj = $(name).message;
	
		obj.onfocus = null;
		obj.onkeydown = null;
		
	}
}

Cookies = function () {
}

Cookies.prototype = {
	
	createCookie : function (name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		
		document.cookie = name+"="+value+expires+"; path=/";
	},
	
	readCookie : function (name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	},
	
	eraseCookie : function (name) {
		this.createCookie(name,"",-1);
	}	
}

Message = function () {
}

Message.prototype = {
	
	counter : 0,
	queCounter : 0,
	threshold : 200,
	sleepLength : 10,
	procCount : 0,
		
	submitQue : function (mes) {		
		
		xajax_chat_process(xajax.getFormValues('que'));
		
		if (mes) {
			clearQue('timeQue[]');
			clearQue('messageQue[]');
			clearQue('toQue[]');
		}
		clearQue('buddyRequest[]');
		clearQue('buddyApprove[]');
		clearQue('buddyReject[]');
		clearQue('buddyRemove[]');
		clearQue('buddyDelete[]');
		clearQue('buddyDeleteReq[]');
		clearQue('buddyStatusMes[]');
	},
	
	processQue : function () {
		if (((this.queCounter > 0) || (this.counter >= threshold)) && (this.procCount <= 0)) {			
			this.counter = 0;
			if (this.queCounter > 0) { 				
				submitQue(true);
				this.queCounter = 0;
			} else {				
				submitQue();				
			}
		} else {
			this.counter++;
		}		
		setTimeout('messageObj.processQue()', this.sleepLength);
	},
	
	clearQue : function (sId) {
		queCounter = this.queCounter;
		while ($(sId)) {
			remove(sId);			
			this.queCounter--;				
		}		
	},
	
	addMessageToQue : function (obj) {
		to = obj.title;
		
		form = $(to);
		
		d = new Date();
		
		time = d.getTime();	
		message = form.message.value;
		
		create(document.que, "input", "timeQue[]", time, true);
		create(document.que, "input", "messageQue[]", hex2b64(EncipherText(escape(message), password)), true);		
		create(document.que, "input", "toQue[]", to, true);	
		
		this.queCounter++;
				
		this.addLocMesToBoard(time, message, to);
		
		form.message.value = "";
			
		form.message.focus();
		
		messageArchiveObj.addToPrevMessages(message, to);
		
		return true;	
	},
	
	addMessagesToBoard : function (messages) {
		$("processing").style.visibility = 'visible';		
		
		for (time in messages) {				
			
			for (kfrom in messages[time]) break;			
			
			if (messages[time].fl) {				
				message = messages[time][kfrom];
			} else {				
				message = unescape(DecipherText(b64tohex(unescape(messages[time][kfrom])), password));
			}
			
			if (!(chatBoard = $("chatBoard"+kfrom))) {
				consoleObj.addConsole(kfrom);
				chatBoard = $("chatBoard"+kfrom)
			}
			
			create(chatBoard, "label", "message["+kfrom+time+"]", "", false);	
			
			if ((consoleObj.summary[kfrom] && (consoleObj.summary[kfrom] != 1)) || !consoleObj.summary[kfrom]) {			
				$("message["+kfrom+time+"]").innerHTML = "<b>"+kfrom.replace(regExp, "'")+" :</b> ";
			}
			
			$("message["+kfrom+time+"]").innerHTML += this.wrap(enhanceObj.enhanceMessage(message.replace(regExp, "'"))+"<br/>");
			
			chatBor = $("chatBoard"+kfrom);
			chatTable = $("chatTable"+kfrom);
			
			consoleObj.summary[kfrom] = 1;
			
			resMinConsole('block', kfrom, true);
			
			scroll2Bottom(chatBor);
			
			consoleObj.tweenConsole(kfrom);

		}
		
		$("processing").style.visibility = 'hidden';
		
		notify(kfrom, message);		
		
	},
	
	addLocMesToBoard : function (time, message, to) {	
		
		form = $(to);
		
		if (proc == false) {
			//message = form.message.value;	
		
			chatBoard = $("chatBoard"+to);
			
			create(chatBoard, "label", "message["+time+"]", "", false);		
			
			messageElement = $("message["+time+"]");			
			
			if (consoleObj.summary[to] != 0) {		
				messageElement.innerHTML = "<b>"+document.que.from.value+" :</b> ";
			}
			
			messageElement.innerHTML += this.wrap(enhanceObj.enhanceMessage(message)+"<br/>");			
			
			messageElement.style.color = '#A9A9A9';
		
			form.reset();
		
			chatBor = $("chatBoard"+to);
			
			consoleObj.summary[to] = 0;
		
			scroll2Bottom(chatBor);
			
			form.message.disabled = '';		
		
			form.message.focus();	
		} else {
			setTimeout('addLocMesToBoard('+time+', '+message+', '+to+')', 500);
		}
		
	},
	
	wrap : function(txt) {
		regExp = /\n/g;
		
		return txt.replace(regExp, "<br>");
	}	
}

Themes = function () {
}

Themes.prototype = {
	
	detectChange : function (e) {
		obj = getEventSrc(e);
	
		name = obj.id;
		
		themesObj._changeCommon(name);
	},
	
	_changeCommon : function (themeName) {		
		
		$('styleChat').href = 'themes/backgrounds/'+themeName+'/css/chat.css';
		$('styleUsers').href = 'themes/backgrounds/'+themeName+'/css/users.css';
		$('styleContainer').href = 'themes/backgrounds/'+themeName+'/css/container.css';
		
		cookieObj.createCookie("theme", themeName, false);
		
		theme = themeName+"/";		
		themeColor = "themes/backgrounds/"+theme+"images/consoleHead.gif";
		YAHOO.widget.Module.IMG_ROOT = "themes/icons/"+theme;
	}
}

Buddy = function () {
}

Buddy.prototype = {
	defaultText : "Buddy's Username",
	
	clear : function (obj) {
		if (obj.value == this.defaultText) {
			obj.value = "";
			$('btnAddBuddy').disabled = false;
		}
	},
	revert : function (obj) {
		if (obj.value.trim() == "") {
			obj.value =  this.defaultText;
			$('btnAddBuddy').disabled = true;
		}
	},	
	
	allow : function () {
		create(document.que, "input", "buddyApprove[]", this.buddy, true);
		this.hide();
		remove("simpledialogBuddyApprove["+this.buddy+"]");
	},
	
	block : function () {
		create(document.que, "input", "buddyReject[]", this.buddy, true);
		this.hide();
		remove("simpledialogBuddyApprove["+this.buddy+"]");
	},
	
	remove : function (buddy) {
		create(document.que, "input", "buddyRemove[]", buddy, true);
	},
	
	del : function (buddy) {
		create(document.que, "input", "buddyDelete[]", buddy, true);
	},
	
	delReq : function (buddy) {
		create(document.que, "input", "buddyDeleteReq[]", buddy, true);
	},
	
	addBuddyRequest : function () {
		obj = $('buddyId');
		
		value = obj.value.trim();
		
		if ((value == this.defaultText) || (value == "")) return false;
		
		create(document.que, "input", "buddyRequest[]", value, true);
		obj.value="";
		this.revert(obj);
	},
	
	approveBuddy : function (username) {	
		
		if ($("simpledialogBuddyApprove["+username+"]")) return false;
		
		title = docTitle+" - New Buddy";
		txt = username+" wants to add you as a buddy.";
		
		d = new Date();		
		time = d.getTime();	
		
		YAHOO.MOHA.Dialog.approve = new YAHOO.widget.SimpleDialog("simpledialogBuddyApprove["+username+"]", 
			 { fixedcenter: true,
			   visible: false,
			   close: false,
			   draggable: true,			  
			   text: txt,			  
			   icon: YAHOO.widget.SimpleDialog.ICON_INFO,
			   constraintoviewport: false,
			   buttons: [ {text:"Allow", handler:this.allow, isDefault:true}, {text:"Block", handler:this.block} ]  			
			 } );
		
		YAHOO.MOHA.Dialog.approve.setHeader(title);
		YAHOO.MOHA.Dialog.approve.buddy = username;
		
		// Render the Dialog
		YAHOO.MOHA.Dialog.approve.render(document.body);
		
		YAHOO.MOHA.Dialog.approve.show();
	},
	
	approveBuddyQue : function (buddies) {
		for (i=0; i<buddies.length; i++) {
			this.approveBuddy(buddies[i]);
		}
	}
}

Evnt = Class.create();

Evnt.prototype = {
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

UserOptions = Class.create();

UserOptions.prototype = {
	recoverName : new Array(),
	name : false,
	timer : null,
	panel : $('userOptionPane'),
	panelHTML : $('userOptionPane'),
	chatButton : $('userOptionChat'),
	removeButton : $('userOptionRemove'),	
	
	initialize : function () {
		
		this.recoverName[0] = /^userDet/;		
		this.recoverName[1] = /^iconImg/;	
		this.recoverName[2] = /^stuserDet/;		
		
		this.panel = new YAHOO.widget.Overlay(this.panel, {constraintoviewport: true,  effect:{effect:YAHOO.widget.ContainerEffect.FADE,duration:0.25}});		
		
		YAHOO.util.Event.addListener(this.panelHTML, 'mouseover' , this.panelMouseOver, this, true);
		YAHOO.util.Event.addListener(this.panelHTML, 'mouseout' , this.panelMouseOut, this, true);	
		YAHOO.util.Event.addListener(this.chatButton, 'click' , this.chat, this, true);	
		YAHOO.util.Event.addListener(this.removeButton, 'click' , this.remove, this, true);			
		
		updateEvent.subscribe(this.updateInfo, this, true);
	},
	
	recoverUser : function (id) {
		for (i=0; i<this.recoverName.length; i++) {
			if (this.recoverName[i].test(id)) {				
				return id.replace(this.recoverName[i], "");
			}
		}
		
		return false;
	},
	
	lableMouseOver : function (e) {
		evt = new Evnt(e);
		
		srcObj = evt.getEventSrc();
		
		this.name = this.recoverUser(srcObj.id).toLowerCase();	
		
		$('userOptionPaneStatus').style.display = "none";
		this.chatButton.disabled = true;		
		this.removeButton.disabled = true;			
		
		$('userOptionPaneName').innerHTML = this.name;		
		
		this.updateInfo();
		
		this.clearTimer();		
	},
	
	updateInfo : function () {
		if (!this.name) return;
		
		this.chatButton.disabled = true;		
		this.removeButton.disabled = true;			
		
		if (userListArr2[this.name][1]) {			
			$('userOptionPaneStatus').innerHTML = userListArr2[this.name][1];
			$('userOptionPaneStatus').style.display = "block";
		}
		
		if (userListArr2[this.name][0] && ((userListArr2[this.name][0] == 1) || (userListArr2[this.name][0] == 2)) && (!$(userListArr[this.name]))) {
			this.chatButton.disabled = false;			
		}			
		
		if (userListArr2[this.name][0] && (userListArr2[this.name][0] != 4)) {
			this.removeButton.disabled = false;	
		}
	},
	
	lableMouseOut : function () {		
		this.startTimer();
	},
	
	panelMouseOver : function () {	
		this.clearTimer();
	},
	
	panelMouseOut : function () {		
		this.startTimer();
	},
	
	startTimer : function () {
		this.timer = setTimeout('oUserOpt.hidePanel()', 500);
	},
	
	clearTimer : function () {
		if (this.timer)	clearTimeout(this.timer);
		
		this.showPanel();
	},
	
	hidePanel : function () {	
		this.name = false;
		oUserOpt.panel.hide();
	},
	
	showPanel : function () {
		
		pos = YAHOO.util.Dom.getXY('userDet'+this.name);	
		
		pos[0] -= 208;
		pos[1] += 3;
		
		this.panel.moveTo(pos[0], pos[1]);		
		
		this.panel.show();
	},
	
	chat : function () {		
		consoleObj.addConsole(userListArr[this.name]);
	},
	
	remove : function () {
		buddyObj.delReq(this.name);
		this.hidePanel();
	}
}

CustomSelect  = Class.create();

CustomSelect.prototype = {
	panel : $('statusList'),
	panelHTML : $('statusList'),
	timer : null,
	selectBtn : $('statusSelectBtn'),
	inputBox : $('statusSelectInput'),
	defaultMessages : ['Available', 'Busy', 'Offline'], 
	statusNames : ['Active', 'Away', 'Inactive'], 
	recoverName : new Array(),
	itemId : false,
	state : false,
	locked : false,
	
	initialize : function () {
		this.recoverName[0] = /^st/;		
		
		this.panel = new YAHOO.widget.Overlay(this.panel, {constraintoviewport: true,  effect:{effect:YAHOO.widget.ContainerEffect.FADE,duration:0.25}});			
		
		this.panel.hide();

		
		items = document.getElementsByClassName('stActive');
		
		if (items) 
			for (i=0; i<items.length; i++) this.itemId = items[i];
		
		this.panel.hideEvent.subscribe(this.clearHide, this, true);
		this.panel.showEvent.subscribe(this.clearTimer, this, true);
		
		YAHOO.util.Event.addListener(this.panelHTML, 'mouseout', this.hide, this, true);
		YAHOO.util.Event.addListener(this.panelHTML, 'mouseover', this.clearTimer, this, true);
		YAHOO.util.Event.addListener(this.panelHTML, 'click', this.clickEvent, this, true);
		YAHOO.util.Event.addListener(this.selectBtn, 'click', this.show, this, true);		
		YAHOO.util.Event.addListener(this.inputBox, 'blur', this.specialMes, this, true);
		YAHOO.util.Event.addListener(this.inputBox, 'focus', this.lock, this, true);
	},
	
	lock : function () {
		this.locked = true;
	},
	
	recoverStatus : function (id) {
		for (i=0; i<this.recoverName.length; i++) {
			if (this.recoverName[i].test(id)) {				
				return id.replace(this.recoverName[i], "");
			}
		}
		
		return false;
	},
	
	recoverStatusCode : function (name) {		
		for (i=0; i<this.statusNames.length; i++) {
			if (this.statusNames[i] == name) {
				return i+1;
			}			
		}
		
		return false;
	},
	
	clickEvent : function (e) {
		
		evnt = new Evnt(e);
		
		obj = evnt.getEventSrc();
		value = obj.innerHTML;
		
		this.inputBox.value = value;
				
		if (!this.isDefault(value)) {			
			this.inputBox.focus();
			this.inputBox.select();		
			
			this.itemId = obj;				
		}
		
		name = this.recoverStatus(obj.className);
		
		this.state = this.recoverStatusCode(name);
		
		this.panel.hide();
		
		this.status(this.state, false, obj);
	},
	
	specialMes : function (message) {
		if (!this.itemId) return;		
		
		if (!this.locked ) {
			this.inputBox.value = message;
		}
		
		if (!message || (typeof(message) != 'string') || (message == "")) {
			message = this.inputBox.value;	
			this.locked = false;
		}
		
		this.status(this.state, message, this.itemId);
	},
	
	status : function(state, custMes, obj) {		
		if (!state && !custMes && (state !== 0)) {
			this.hide();
			return false;
		}
		
		args = new Array();	
		
		args[0] = selfState[0];
		args[1] = "";		
		
		if (this.name) {			
			args[1] = this.name;
		}
		
		if (state || (state === 0)) {
			args[0] = state;
		} else {
			state = args[0];
		}
				
		if (custMes) {
			args[2] = custMes;
			obj.innerHTML = custMes;
			cookieObj.createCookie("custStatusMes", custMes, false);
		}
		
		create(document.que, "input", "buddyStatusMes[]", args.toString(), true);		
		
		if (this.name) {			
			aBuddyView[this.name.toLowerCase()][0] = state;			
		} else {
			selfState[0] = state;
		}
		
		this.hide();
	},
	
	isDefault : function (value) {
		for (i=0; i<this.defaultMessages.length; i++) {
			if (this.defaultMessages[i] == value) {
				return true;
			}
		}
		
		return false;
	},
	
	show : function () {
		YAHOO.util.Event.addListener(this.selectBtn, 'mouseout', this.hide, this, true);
		YAHOO.util.Event.addListener(this.selectBtn, 'mouseover', this.clearTimer, this, true);
		this.panel.show();		
	},
	
	clearTimer : function () {
		if (this.timer)
			clearTimeout(this.timer);
	},
	
	clearHide : function () {
		YAHOO.util.Event.removeListener(this.selectBtn, 'mouseout');
		YAHOO.util.Event.removeListener(this.selectBtn, 'mouseover');
	},
	
	hide : function () {
		this.timer = setTimeout('custSel.panel.hide()', 500);
	}
}

function TextTween(obj, property, txt, origional, interval) {
	
	var sysTimer = false;
	instance = 1;	
		
	this.play = function () {
		sysTimer = setTimeout('animate();', interval*1000);		
	};
	
	this.stop = function () {		
		if (sysTimer) {
			clearTimeout(sysTimer);
		}
		revert();
	};
	
	animate = function () {			
		instance = 1-instance;		
		switch (instance) {
			default:
			case 0 : revert(); break;
			case 1 : change(); break;
		}
		sysTimer = setTimeout('animate();', interval*1000);				
	};
	
	change = function () {		
		obj[property] = unescape(txt);
	};
	
	revert = function () {		
		obj[property] = unescape(origional);		
	};
}

YAHOO.namespace("MOHA.Dialog");

window.alert = function (txt, title) {
	
	if (!title) {
		title = docTitle;
	} else {
		title = docTitle+" - "+title;
	}
	
	var handleOk = function() {		
		this.hide();
	};
	
	d = new Date();		
	time = d.getTime();	
	
	YAHOO.MOHA.Dialog.alert = new YAHOO.widget.SimpleDialog("simpledialogAlert["+time+"]", 
			 { fixedcenter: true,
			   visible: false,
			   draggable: true,			  
			   text: txt,
			   modal: true,
			   icon: YAHOO.widget.SimpleDialog.ICON_ALARM,
			   constraintoviewport: false,
			   buttons: [ { text:"OK", handler:handleOk, isDefault:true } ]
			 } );
	YAHOO.MOHA.Dialog.alert.setHeader(title);
	
	kl = new YAHOO.util.KeyListener(document, {keys:27}, {fn: YAHOO.MOHA.Dialog.alert.hide, scope: YAHOO.MOHA.Dialog.alert, correctScope:true});	
	YAHOO.MOHA.Dialog.alert.cfg.queueProperty("keylisteners", kl);
	
	// Render the Dialog
	YAHOO.MOHA.Dialog.alert.render(document.body);	
	
	YAHOO.MOHA.Dialog.alert.show();	
}

updateProgress("scripts/classes.js");
