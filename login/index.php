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
	if (isset($_COOKIE['user']) && !empty($_COOKIE['user'])) {
		header('location: ../');
	}

	$root = realpath(dirname(__FILE__)."/../")."/";
	define('ROOT', $root, 1);

	require_once(ROOT.'/lib/xajax/xajax_core/xajax.inc.php');
	require_once(ROOT."/lib/enhance/Themes.php");
	require_once(ROOT.'/lib/conf/conf.php');

	$xajax = new xajax('process.php');
	$confObj = new conf("../");
	$themesObj = new Themes();

	$theme = $themesObj->getTheme();

	$xajax->registerFunction("authenticate");

	$username = isset($_REQUEST['username'])?'value="'.$_REQUEST['username']."'":"";
	$password = isset($_REQUEST['password'])?'value="'.$_REQUEST['password']."'":"";

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Sign In - <?php echo $confObj->getTitle(); ?></title>

<link href="../themes/backgrounds/default/css/login.css" rel="stylesheet" type="text/css" />

<link href="../themes/backgrounds/<?php echo $theme; ?>css/login.css" rel="stylesheet" type="text/css" id="styleLogIn" />

<link href="../images/key.png" rel="shortcut icon" type="image/png" />
</head>
<?php
$xajax->printJavascript("./");
?>
<script type="text/javascript">
function updateProgress() {
}
</script>
<script type="text/javascript" src="../scripts/scriptaculous/prototype.js"></script>
<script type="text/javascript" src="../scripts/scriptaculous/scriptaculous.js"></script>
<body>
<div id="logo"></div>
<noscript>
<h3>You need use a JavaScript enabled browser.</h3>
</noscript>
<div id="chatHoursPanel">
	<h4 class="warning">Warning</h4>
	<b>Chat has sound effects.</b><br/>
	If you are using a headset remember to reduce the volume of the headset or mute sounds of the chat once you sign in.<br />
	<b>Loud sounds could impair your hearing.</b>
</div>
<div id="progressx"><div id="message">Processing...</div><img src="../images/processing.gif"/></div>
<div id="logInBox">
	<h1>Sign In</h1>
	<p id="messages"></p>
	<form id="login" name="login" method="post" onsubmit="loginProc(); return false;">
  		<label for="username">Username : <input type="text" name="username" id="username" class="input" <?php echo $username; ?>/></label>
  		<label for="password">Password : <input type="password" name="password" id="password" class="input" <?php echo $password; ?>/></label><br/>
  		<label class="buttonlbl">
			<input type="submit" name="Submit" value="Sign In" class="button"/>
			<?php if ($confObj->getRegistration() == 0) { ?>
			<input type="button" name="Register" value="Register" class="button" onclick="registerX(); return false;" />
			<input type="hidden" name="register" id="register" value="0" />
			<?php } ?>
		</label>
	</form>
	<?php if ($confObj->getRegistration() == 1) { ?>
	<div class="otherOpt">
		<a href="<?php echo $confObj->getForgotPWDLink(); ?>">Forgot your password?</a>
		<a href="<?php echo $confObj->getRegLink(); ?>">New user?</a>
	</div>
	<?php } ?>
</div>
<script language="javascript" type="text/javascript" src="../scripts/login.js"></script>
<?php
	if (isset($_REQUEST['username'])) {
?>
<script language="javascript">
loginProc();
</script>
<?php
	}
?>
<div class="copyright"><a href="http://mohachat.org/" target="_blank">MOHA Chat</a> <?php echo $confObj->getVersion(); ?> S.H.Mohanjith &copy; 2006-2008</div>
</body>
</html>