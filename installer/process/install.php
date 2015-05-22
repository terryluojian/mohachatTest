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

	$errors = null;
	$done = null;

	require_once('databases/'.$_POST['dbms'].'/install.php');

	$confSource = file_get_contents('../config/configuration.php-auto');

	$patterns = array(	"/#dbms/",
						"/#databaseHost/",
						"/#databaseName/",
						"/#databaseUser/",
						"/#databasePassword/",
						"/#usersTable/",
						"/#usernameField/",
						"/#passwordField/",
						"/#title/",
						"/#registration/",
						"/#forgotPasswordLink/",
						"/#registerLink/",
						"/#loginLink/",
						"/#archive/",
						"/#tablePrefix/");

	$replacements = array($_SESSION['dbInfo']['dbX'],
						 $_POST['dbHost'],
						 $_SESSION['dbInfo']['databaseName'],
						 $_SESSION['dbInfo']['dbUsername'],
						 $_SESSION['dbInfo']['dbPassword'],
						 $_SESSION['dbInfo']['userTable'],
						 $_SESSION['dbInfo']['userNameField'],
						 $_SESSION['dbInfo']['passwordField'],
						 $_SESSION['config']['chatTitle'],
						 $_SESSION['config']['registration'],
						 $_SESSION['config']['forgotPasswordLink'],
						 $_SESSION['config']['registerLink'],
						 $_SESSION['config']['loginLink'],
						 ($_SESSION['config']['archive'] == true)? "true" : "false",
						 $_SESSION['dbInfo']['tablePrefix']
						);

	$confSource = preg_replace($patterns, $replacements, $confSource);

	if (!@file_put_contents('../config/configuration.php', $confSource)) {
		$errors[] = 'Failed to write the configuration file';
	} else {
		$done[] = "Wrote configuration file";
	}

	$htSource = file_get_contents('../files/download/a.htaccess');

	$root = explode("/installer/", $_SERVER['REQUEST_URI']);

	$root = $root[0];

	$htSource = preg_replace('/#root/', $root, $htSource);

	if (!@file_put_contents('../files/download/.htaccess', $htSource)) {
		$errors[] = 'Failed to write the file download .htaccessfile file';
	}  else {
		$done[] = "Wrote .htaccess file";
	}

if (is_array($errors)) {
?>
<ul style="color:#FF0000">
	<li>
<?php
	echo implode("</li><li>", $errors);
?>
	</li>
</ul>
<?php } ?>
<ul>
	<li>
<?php
	echo implode("</li><li>", $done);
?>
	</li>
</ul>