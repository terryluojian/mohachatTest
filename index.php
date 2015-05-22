<?php
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

define('ROOT', dirname(__FILE__), 1);

require_once(ROOT.'/lib/conf/conf.php');

$confObj = new conf();

if (!isset($_COOKIE['user']) || empty($_COOKIE['user'])) {
	header('location: '.$confObj->getLoginLink());
}

require_once(ROOT.'/lib/xajax/xajax_core/xajax.inc.php');
require_once(ROOT."/lib/enhance/Themes.php");

$xajax = new xajax('process.php');
$themesObj = new Themes();

$theme = $themesObj->getTheme();

$xajax->registerFunction("chat_process");
$xajax->registerFunction("chat_start");
$xajax->registerFunction("signout");

$scriptFiles = array(	"scripts/error.js",
						"scripts/jsbn.js",
						"scripts/base64.js",
						"scripts/soundmanager.js",
						"scripts/enhance.php",
						"scripts/yahoo/yahoo-min.js",
						"scripts/event/event-min.js",
						"scripts/dom/dom-min.js",
						"scripts/animation/animation-min.js",
						"scripts/dragdrop/dragdrop-min.js",
						"scripts/container/container-min.js",
						"scripts/connection/connection-min.js",
						"scripts/scriptaculous/prototype.js",
						"scripts/scriptaculous/scriptaculous.js",
						"scripts/user.js",
						"scripts/classes.js",
						"scripts/misc.js",
						"scripts/xtea.js",
						"scripts/process.js");

foreach ($scriptFiles as $scriptFile) {
	$scriptFileSize[] = filesize($scriptFile);
}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--
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
-->
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo $confObj->getTitle(); ?></title>

<link href="themes/backgrounds/default/css/progress.css" rel="stylesheet" type="text/css" />
<link href="themes/backgrounds/default/css/chat.css" rel="stylesheet" type="text/css" />
<link href="themes/backgrounds/default/css/users.css" rel="stylesheet" type="text/css" />

<!-- Yahoo! UI -->
<link  href="themes/backgrounds/default/css/container.css" rel="stylesheet" type="text/css" />
<link  href="scripts/menu/assets/menu.css" rel="stylesheet" type="text/css" />

<!-- Theme -->
<link href="themes/backgrounds/<?php echo $theme; ?>css/progress.css" rel="stylesheet" type="text/css" />
<link href="themes/backgrounds/<?php echo $theme; ?>css/chat.css" rel="stylesheet" type="text/css" id="styleChat" />
<link href="themes/backgrounds/<?php echo $theme; ?>css/users.css" rel="stylesheet" type="text/css" id="styleUsers" />
<link  href="themes/backgrounds/<?php echo $theme; ?>css/container.css" rel="stylesheet" type="text/css" id="styleContainer" />

<link href="images/comments.png" rel="shortcut icon" type="image/png" />
<script language="javascript">
<!--
totalJsSize = <?php echo array_sum($scriptFileSize); ?>;
jsSize= new Array();
jsSize = {
<?php
	$jsSizeStr = "";
	for ($i=0; $i<count($scriptFileSize); $i++) {
		$jsSizeStr .= "\t'{$scriptFiles[$i]}' : {$scriptFileSize[$i]},\n";
	}

	$jsSizeStr = substr($jsSizeStr, 0, -2)."\n";

	echo $jsSizeStr;
?>

};

var loadedScripts = new Array();

function doProgress(sum) {
	curWidth = parseInt(document.getElementById("mask").offsetWidth);
	curLeft = parseInt(document.getElementById("mask").offsetLeft);
	curWidth=curWidth-sum;
	curLeft=curLeft+sum;

	if(curWidth <= 0) {
		$("mContainer").style.display = "none";
		$("mask").style.display = "none";
		return true;
	}

	if (!curLeft) {
		return false;
	}

	if ((curWidth+curLeft) != 200) {
		curWidth-=(curWidth+curLeft)-200;
	}

	document.getElementById("mask").style.left = curLeft + "px";

	document.getElementById("mask").style.width = curWidth + "px";
	document.getElementById("progressIndicator").innerHTML = Math.floor((curLeft / parseInt(document.getElementById("gradient").offsetWidth))*100) + "%";

	return true;
}

function updateProgress(done) {
	loadedFile(done);

	if (!jsSize[done]) return false;

	doProgress(Math.ceil(jsSize[done]/totalJsSize*201));
}

function loadedFile(name) {
	loadedScripts[name] = true;
}
-->
</script>
<?php
$xajax->printJavascript("scripts");
?>
</head>
<body>
<noscript>
<h3>You need a JavaScript enabled browser.</h3>
</noscript>
<div id="sound"></div>
<div id="logo"></div>
<div class="options"><span class="images"><img src="images/nocolor.gif" id="blue" title="Blue" alt="Blue" /><img src="images/nocolor.gif" id="orange" title="Orange" alt="Orange" /><img src="images/nocolor.gif" id="black" title="Black" alt="Black" /><img src="images/btnMute.gif" id="mute" title="Mute - Disabled" alt="Mute"/></span><span onclick="signout();">Sign Out</span></div>
<div class="status" id="status"> Loading...</div>
<div class="status1" id="processing"> Processing...</div>

<div id="mContainer">
	<div id="progressIndicator">0%</div>
	<div id="gradient"></div>
	<div id="mask"></div>
</div>

<div id="pageBody" style="visibility:hidden;">
<div id="consoleArea">
</div>
<div class="userTable" id="userTable">
  	<div class="chatBoardHead" id="userTableHead">
		<img src="images/tiny-minimize.gif" alt="Minimize" title="Minimize" width="20" height="20" onclick="minimizeUserList()" onmouseover="mouseOver('minimize', this)" onmouseout="mouseOut('minimize', this)" id="userMin"/>
		<span id="chatBordHead"><img id="infoIco" src="images/users_icon.gif" align="top"/>Buddies</span>
	</div>
	<ul id="userListActive">
	  <li id="userDet<?php echo $_COOKIE['user']; ?>" title="Active" class="userDet"><img src="images/Active.gif" id="iconImg<?php echo $_COOKIE['user']; ?>" /><?php echo $_COOKIE['user']; ?>
	  <span class="custCombo">
	  	<input id="statusSelectInput" type="text" value="Available" /><img src="scripts/customSelect/downbox.gif" align="absbottom" id="statusSelectBtn"/>
		<ul id="statusList">
			<li class="stActive">Available</li>
			<li class="stActive">Custom Message</li>
			<li class="stAway">Busy</li>
			<li class="stAway">Custom Message</li>
			<li class="stInactive">Offline</li>
		</ul>
	  </span>
	  </li>
	</ul><ul id="userListInactive"></ul><ul id="userListOffline"></ul>
	<div id="addBuddy"><input type="text" id="buddyId" value="Buddy's Username" onfocus="buddyObj.clear(this);" onblur="buddyObj.revert(this);" /> <input type="submit" id="btnAddBuddy" value="Add" onclick="buddyObj.addBuddyRequest();" disabled="disabled" /></div>
</div>
</div>
<form name="que" id="que" method="post" onsubmit="return false;" >
	<input type="hidden" name="from" id="from" value="<?php echo $_COOKIE['user']; ?>"/>
</form>

<div id="leftBottom">
	<div id="logPanel">
		<div id="infoPaneHead" class="chatBoardHead">
			<img src="images/tiny-closetool.gif" alt="Close" title="Close" width="20" height="20" onclick="infoObj.hide('logPanel');" onmouseover="mouseOver('close', this)" onmouseout="mouseOut('close', this)" />
			<span id="chatBordHead">
				<img id="infoIco" src="images/exclamation.png" align="top"/>Errors</span>
		</div>
		<div id="log" class="innerPane"></div>
	</div>
	<div id="transLogPanel">
		<div id="infoPaneHead" class="chatBoardHead">
			<img src="images/tiny-closetool.gif" alt="Close" title="Close" width="20" height="20" onclick="infoObj.hide('transLogPanel');" onmouseover="mouseOver('close', this)" onmouseout="mouseOut('close', this)" />
			<span id="chatBordHead">
				<img id="infoIco" src="images/transmit_error.png" align="top"/>Errors</span>
		</div>
		<div id="transLog" class="innerPane"></div>
	</div>
</div>

<div id="systemMessagesPane">
	<div id="systemMessages" class="chatBoardHead"><span id="chatBordHead"><img src="images/disconnect.gif" align="top" id="connIco"/> Unable to Connect</span></div>
</div>

<div id="smileyTablePane"></div>

<div id="userOptionPane">
	<div class="userOptionPaneName">
		<span class="userOptControls">
			<input type="button" id="userOptionChat" value="Chat" />
		</span>
		<span id="userOptionPaneName"></span>
	</div>
	<div id="userOptionPaneStatus" class="statusMessage"></div>
	<div class="userOptControls">
		<input type="button" id="userOptionRemove" value="Remove" />
	</div>
</div>

<div id="widgetPane"></div>

<?php for ($i=0; $i<count($scriptFiles); $i++) { ?>
<script language="javascript" type="text/javascript" src="<?php echo $scriptFiles[$i]; ?>"></script>
<?php } ?>

<div class="copyright"><span onclick="infoObj.displayInfo('about');">MOHA Chat <?php echo $confObj->getVersion(); ?> S.H.Mohanjith &copy; 2006-2008</span>
<span onclick="infoObj.displayInfo('encryption');"><img src="images/secure-padlock.gif" alt="Messages are encrypted" title="Messages are encrypted"  align="bottom"/></span>
<img src="images/transmit_blue.png" alt="Connection" title="Idle"  align="bottom" id="transmissionStat"/>
</div>
</body>
</html>
