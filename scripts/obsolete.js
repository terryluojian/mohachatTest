// JavaScript Document

UserOptions = Class.create();

UserOptions.prototype = {
	activeList : $('userListActive'),
	oContextMenu : null,
	oStatusMenu : null,
	name : false,
	statusMenuItems : [{text: "Default", url: "javascript:oUserOpt.clickEventStatus(0)", checked: false, selected:false},
					   {text: "Available", url: "javascript:oUserOpt.clickEventStatus(1)", checked: false, selected:false},			 
					   {text: "Busy", url: "javascript:oUserOpt.clickEventStatus(2)", checked: false, selected:false},
					   {text: "Offline", url: "javascript:oUserOpt.clickEventStatus(3)", checked: false, selected:false},
					   {text: "Custom", url: "javascript:oUserOpt.clickEventStatus(4)", checked: false, selected:false}
					  ],
	menuItems : [{text: "Chat", url: "javascript:oUserOpt.clickEvent(0)", checked: false, selected:true},				 
				 {text: "Remove", url: "javascript:oUserOpt.clickEvent(1)", checked: false},
				 {text: "Block", url: "javascript:oUserOpt.clickEvent(2)", checked: false},
				 {text: "Status", submenu: {id: "statuses"}, checked: false}
				],	
	loadingItem : [{text: "None", disabled:true}],
																	   
	recoverName : new Array(),
	userMenu : null,
	defaultMes : "Custom",
	
	/* Initialize */
	initialize : function () {
		
		this.recoverName[0] = /^userDet/;		
		this.recoverName[1] = /^iconImg/;	
		this.recoverName[2] = /^chatBoardHead/;
		this.recoverName[3] = /^stuserDet/;
		
		this.oContextMenu = new YAHOO.widget.Menu("userOptionsConMenu", 
												  {	autosubmenudisplay:true,
												  	showdelay:100,
												  	lazyLoad:true,
												   	constraintoviewport:true											   
												  });	
		
		this.oContextMenu.addItems(this.menuItems);
		
		this.oContextMenu.clickEvent.subscribe(this.clickEvent, this, true);	
		this.oContextMenu.hideEvent.subscribe(this.resetName, this, true);
		
		this.oContextMenu.render(document.body);
		
		this.oStatusMenu = new YAHOO.widget.Menu("statusConMenu", 
												  {lazyLoad:true,
												   constraintoviewport:true
												  });
		
		this.oStatusMenu.addItems(this.statusMenuItems);		
		
		this.oStatusMenu.showEvent.subscribe(this.statusMenuRender, this, true);	
		this.oStatusMenu.hideEvent.subscribe(this.resetName, this, true);
		
		this.oStatusMenu.render(document.body);	
		
		this.userMenu = new YAHOO.widget.Menu("userListActiveMenu", 
												  {lazyLoad:true,
												   constraintoviewport:true
												  });
		
		this.userMenu.clickEvent.subscribe(this.userMenuHide, this, true);
		
		this.userMenu.addItems(this.loadingItem);		
		this.userMenu.render(document.body);
	},
	
	userMenuHide : function () {
		this.userMenu.hide();
	},
	
	spUserMenuShow : function(e) {
		
		if (!this.sp(e)) return false;
		
		this.userMenuShow(e);
	},
	
	userMenuShow : function (e) {
		evnt = new Evnt(e);
		
		obj = evnt.getEventSrc();
		objId = obj.id;		
		
		if (objId != "") return false;
		
		while (this.userMenu.getItem(0)) this.userMenu.removeItem(0);
				
		if (userListArr1 && (userListArr1.length > 0)) {
			this._parseMenuUsers();
			this.userMenu.addItems(userListArr1);
		} else {
			this.userMenu.addItems(this.loadingItem);
		}
		
		pos = evnt.getXY(objId);
		pos[0] += 15;
		
		YAHOO.util.Dom.setXY("userListActiveMenu", pos);
		
		this.userMenu.render();
		this.userMenu.show();
		
		evnt.destroy();
	},
	
	_parseMenuUsers : function () {
		for (i=0; i<userListArr1.length; i++) {
			if (YAHOO.util.Dom.inDocument(userListArr1[i].text)) {
				userListArr1[i].disabled = true;
				userListArr1[i].checked = true;
			}
		}
	},
	
	statusShow : function (e) {
		
		evnt = new Evnt(e);	
				
		obj = evnt.getEventSrc();
		objId = obj.id;
		
		name = this.recoverUser(objId);
		
		pos = evnt.getXY(objId);
		pos[0] += 15;
		
		YAHOO.util.Dom.setXY("statusConMenu", pos);
		
		oUserOpt.oContextMenu.setInitialSelection();
		oUserOpt.oStatusMenu.show();		
		evnt.destroy();
	},
	
	sp : function (e) {
		evnt = new Evnt(e);	
		
		if (!evnt.ctrlPressed) return false;
		
		evnt.destroy();
		
		return true;
	},
	
	spShow : function (e) {
		
		if (!this.sp(e)) return false;
		
		this.show(e);
	},
	
	recoverUser : function (id) {
		for (i=0; i<this.recoverName.length; i++) {
			if (this.recoverName[i].test(id)) {				
				return objId.replace(this.recoverName[i], "");
			}
		}
		
		return false;
	},
	
	show : function (e) {
		evnt = new Evnt(e);		
		
		obj = evnt.getEventSrc();
		objId = obj.id;		
		
		name = this.recoverUser(objId).toLowerCase();
		
		pos = evnt.getXY(objId);
		pos[0] += 15;
		
		YAHOO.util.Dom.setXY("userOptionsConMenu", pos);
		
		oUserOpt.name = name;
		oUserOpt.oContextMenu.removeItem(0);
		oUserOpt.oContextMenu.removeItem(1);
		oUserOpt.oContextMenu.removeItem(1);
		
		state = true;
		check = false;
		
		objLabel = $('userDet'+name);
		
		if ((objLabel.title == 'Active') || (objLabel.title == 'Inactive')) {
			state = false;
		}	
		
		if (YAHOO.util.Dom.inDocument(userListArr[name])) {
			check = true;
			state = true;
		}
		
		this.menuItems[0].checked = check;
		this.menuItems[0].disabled = state;	
		
		state = false;		
		
		if ((obj.title == 'Pending')) {
			state = true;
		}
		
		statusMenuItems = this.statusMenuShow();
		
		this.menuItems[2].disabled = state;
		this.menuItems[3].disabled = state;	
				
		this.menuItems[3].submenu.itemdata = statusMenuItems;
		
		oUserOpt.oContextMenu.insertItem(this.menuItems[0], 0);
		oUserOpt.oContextMenu.insertItem(this.menuItems[2], 2);
		oUserOpt.oContextMenu.insertItem(this.menuItems[3], 3);
				
		oUserOpt.oContextMenu.setInitialSelection();
		oUserOpt.oContextMenu.show();
		
		evnt.destroy();
	},
	
	statusMenuShow : function () {	
		selfState[0] = selfState[0] || 1;
		buddySelf = selfState[0];
		if (this.name) buddySelf = aBuddyView[this.name.toLowerCase()][0];
		
		statusMenuItems = this.statusMenuItems;
		
		for (i=0; i<this.statusMenuItems.length; i++) {		
			statusMenuItems[i].checked = false;
			statusMenuItems[i].selected = false;
		}
		//confirm(buddySelf+" "+selfState[0]);
		statusMenuItems[buddySelf].checked = true;
		statusMenuItems[selfState[0]].selected = true;
		
		statusMenuItems[4].disabled = true;
		
		return statusMenuItems;
	},
	
	statusMenuRender : function () {
		selfState[0] = selfState[0] || 1;
		buddySelf = selfState[0];
		if (this.name) buddySelf = aBuddyView[this.name.toLowerCase()][0];
		
		statusMenuItems = this.statusMenuItems;
		
		for (i=0; i<this.statusMenuItems.length; i++) {		
			statusMenuItems[i].checked = false;
			statusMenuItems[i].selected = false;
			statusMenuItems[i].disabled = false;
			this.oStatusMenu.removeItem(0);
		}
		
		if (selfState[1]) {
			statusMenuItems[4].checked = true;
		}
		
		statusMenuItems[buddySelf].checked = true;
		statusMenuItems[selfState[0]].selected = true;			
		
		this.oStatusMenu.addItems(statusMenuItems);
		this.oStatusMenu.removeItem(0);
		
		this.oStatusMenu.render();
	},
	
	clickEvent : function (eventNo) {
		switch (eventNo) {
			case 0 : oUserOpt.chat();					
					 break;
			case 1 : oUserOpt.remove();					
					 break;
			case 2 : oUserOpt.block();					
					 break;					
		}		
	},
	
	clickEventStatus : function (eventNo) {		
		switch (eventNo) {
			case 1 : oUserOpt.status(1);					
					 break;
			case 2 : oUserOpt.status(2);					
					 break;
			case 3 : oUserOpt.status(3);					
					 break;
			case 4 : oUserOpt.status(false, this.revert(prompt('Please enter the custom status message', this.clear(this.statusMenuItems[4].text))));					
					 break;
			case 0 : oUserOpt.status(0);
					 break;
					
		}				
	},
	
	revert : function (txt) {
		if (txt && (txt.trim() == "")) {
			return false;
		}
		
		return txt;
	},	
	
	clear : function (txt) {
		if (txt && (txt.trim() == this.defaultMes)) {
			return "";
		}
		
		return txt;
	},	
	
	status : function(state, custMes) {
		if (!state && !custMes && (state !== 0)) {
			oUserOpt.hide();
			return false;
		}
		
		args = new Array();	
		
		args[0] = selfState[0];
		args[1] = "";		
		
		if (this.name) {
			/*if (state !== 0) {
				state = aBuddyView[this.name.toLowerCase()][0];		
			}*/
			args[1] = this.name;
		}
		
		if (state || (state === 0)) {
			args[0] = state;
		} else {
			state = args[0];
		}
				
		if (custMes) {
			args[2] = custMes;
			this.statusMenuItems[4].text = custMes;
			cookieObj.createCookie("custStatusMes", custMes, false);
		}
		
		create(document.que, "input", "buddyStatusMes[]", args.toString(), true);
		
		if (this.name) {			
			aBuddyView[this.name.toLowerCase()][0] = state;			
		} else {
			selfState[0] = state;
		}
		
		oUserOpt.hide();
	},
	
	remove : function () {
		buddyObj.delReq(this.name);
		oUserOpt.hide();
	},
	
	block : function () {
		buddyObj.buddy = this.name;
		buddyObj.hide = this.hide;
		this.remove();
		buddyObj.block();
		oUserOpt.hide();
	},
	
	chat : function () {
		consoleObj.addConsole(userListArr[this.name]);
		oUserOpt.hide();
	},
	
	hide : function () {		
		oUserOpt.oContextMenu.hide();
		oUserOpt.oStatusMenu.hide();
	},
	
	resetName : function () {
		this.name = false;
	}
}


/** From users **/


YAHOO.widget.MenuItem.prototype.IMG_ROOT = "scripts/menu/assets/";

//  Change the path to the submenu indicator images for each menu item

YAHOO.widget.MenuItem.prototype.SUBMENU_INDICATOR_IMAGE_PATH = "menuarorght8_nrm_1.gif";
YAHOO.widget.MenuItem.prototype.SELECTED_SUBMENU_INDICATOR_IMAGE_PATH = "menuarorght8_hov_1.gif";
YAHOO.widget.MenuItem.prototype.DISABLED_SUBMENU_INDICATOR_IMAGE_PATH = "menuarorght8_dim_1.gif";


//  Change the path to the checkmark images for each menu item
                
YAHOO.widget.MenuItem.prototype.CHECKED_IMAGE_PATH = "menuchk8_nrm_1.gif";
YAHOO.widget.MenuItem.prototype.SELECTED_CHECKED_IMAGE_PATH = "menuchk8_hov_1.gif";
YAHOO.widget.MenuItem.prototype.DISABLED_CHECKED_IMAGE_PATH = "menuchk8_dim_1.gif";


// Change the path to the submenu images for each menu bar item

YAHOO.widget.MenuBarItem.prototype.SUBMENU_INDICATOR_IMAGE_PATH = "menuarodwn8_nrm_1.gif";
YAHOO.widget.MenuBarItem.prototype.SELECTED_SUBMENU_INDICATOR_IMAGE_PATH = "menuarodwn8_hov_1.gif";
YAHOO.widget.MenuBarItem.prototype.DISABLED_SUBMENU_INDICATOR_IMAGE_PATH = "menuarodwn8_dim_1.gif";

	
	YAHOO.util.Event.on(userLabelLi, "contextmenu", oUserOpt.show, oUserOpt, true);		
	YAHOO.util.Event.on(userLabelLi, "click", oUserOpt.spShow, oUserOpt, true);
	
/** From process **/


	YAHOO.util.Event.on(document, "contextmenu", oUserOpt.userMenuShow, oUserOpt, true);		
	YAHOO.util.Event.on(document, "click", oUserOpt.spUserMenuShow, oUserOpt, true);
	
	
	oUserOpt.status(false, oUserOpt.revert(cookieObj.readCookie("custStatusMes")));