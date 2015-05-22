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

if (is_file('../config/configuration.php')) {
	header('Location: ../');
	exit(0);
}

ob_start();
session_start();

require_once('process.php');

$page = 'welcome';
if (isset($_SESSION['page'])) {
	switch ($_SESSION['page']) {
		case 'license' : $page = 'license';
						 break;
		case 'preReq' : $page = 'preReq';
						 break;
		case 'database' : $page = 'database';
						 break;
		case 'config' : $page = 'config';
						 break;
		case 'confirm': $page = 'confirm';
						break;
		case 'installing': $page = 'installing';
						break;
	}
}

$pages = array('welcome'=>0, 'license'=>1, 'preReq'=>2, 'database'=>3, 'config'=>4, 'confirm'=>5, 'installing'=>6);
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
<title>MOHA Chat :: Web Installer</title>
<link href="../css/installer.css" rel="stylesheet" type="text/css" />
<link href="../images/bricks.png" rel="shortcut icon" type="text/css" />

</head>
<script language="javascript">
	page = <?php echo $pages[$page]; ?>;
	passed = true;
</script>
<script type="text/javascript" src="scripts/process.js"></script>
<body>
<div id="loading">&nbsp;</div>
<form id="response" name="response" method="post" action="" >
<div id="main">
	<div id="content"><?php include_once("content/$page.php"); ?></div>

	<div id="controllers">
		<input type="hidden" name="q" id="q" value="<?php echo $page; ?>"/>
		<input type="button" name="back" id="back" value="Back" tabindex="3" onclick="goBack();"/>
		<input type="button" name="next" id="next" value="Next" tabindex="1" onclick="nextX();"/>
	</div>
</div>
</form>

<ul id="overallProgress">
	<li id="stepwelcome" class="current">Welcome</li>
	<li id="steplicense" class="pending">License</li>
	<li id="steppreReq" class="pending">Pre-requisities</li>
	<li id="stepdatabase" class="pending">Database</li>
	<li id="stepconfig" class="pending">Configuration</li>
	<li id="stepconfirm" class="pending">Confirm</li>
	<li id="stepinstalling" class="pending">Installing</li>
</ul>

<a id="logo" href="http://mohachat.org"><img src="../themes/backgrounds/default/images/logo.gif" border="0"/></a>

<div id="footer">MOHA Chat Installer 0.1.1 S.H.Mohanjith &copy; 2006-2008</div>
</body>
</html>
