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

PlugIns = Class.create();

PlugIns.prototype = {
	list : new Array(),
	path : 'plugins/',
	depPath : 'dependencies/',
	url : 'plugins/process.php',
	plugIn : null,

	initialize : function () {
	},

	loadScripts : function () {
		for (i=0; i<this.list.length; i++) {
			 require_once(this.path+this.list[i]+"/"+this.list[i]+".js");
		}
	},

	brokerRequest : function (url, query, plugIn) {
		sUrl = this.url+"?broker="+url;

		for (key in query) {
			sUrl += "&"+key+"="+query[key];
		}

		this.plugIn = plugIn;
		this.plugIn.connecting.apply(this.plugIn);

		this.request = importXML(sUrl, {success:this.brokerSuccessHandler,
										failure:this.brokerFailureHandler,
										scope:this});
	},

	askRequest : function (url, query, plugIn) {
		sUrl = this.url+"?ask="+url;

		for (key in query) {
			sUrl += "&"+key+"="+escape(query[key]);
		}

		this.plugIn = plugIn;
		plugIn.connecting.apply(this.plugIn);

		this.request = importXML(sUrl, {success:this.brokerSuccessHandlerAsk,
										failure:this.brokerFailureHandlerAsk,
										scope:this});
	},

	brokerSuccessHandler : function (o) {
		this.plugIn.doneConn.apply(this.plugIn);
		try {
			this.plugIn.remoteContent(o);
		} catch (e) {
			this.brokerFailureHandler();
		}
	},

	brokerFailureHandler : function (){
		this.plugIn.doneConn.apply(this.plugIn);
		this.plugIn.remoteContent(false);
	},

	brokerSuccessHandlerAsk : function (o) {
		this.plugIn.doneConn.apply(this.plugIn);
		try {
			this.plugIn.remoteContentAsk(o);
		} catch (e) {
			this.brokerFailureHandlerAsk();
		}
	},

	brokerFailureHandlerAsk : function (){
		this.plugIn.doneConn.apply(this.plugIn);
		this.plugIn.remoteContentAsk(false);
	}
}

function importXML(url, optionArr) {
	if (document.implementation && document.implementation.createDocument) {
		xmlDoc = document.implementation.createDocument("", "", null);
		xmlDoc.onload = function () {
			optionArr.success.apply(optionArr.scope, [xmlDoc]);
		}
	} else if (window.ActiveXObject) {
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.onreadystatechange = function () {
			if (xmlDoc.readyState == 4)optionArr.success.apply(optionArr.scope, [xmlDoc]);
		};
 	} else {
		alert('Your browser can\'t handle this script');
		return;
	}
	xmlDoc.load(url);

	return xmlDoc;
}

plugInObj = new PlugIns();

loadedFile('scripts/plugins.js');