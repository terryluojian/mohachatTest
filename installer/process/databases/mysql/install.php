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

	if (!$connected) {
		$errors[] = $connErr;
	}

	if (($dbSelected == "create") && !@mysql_select_db($_POST['databaseName'])) {
		$SQL = "CREATE DATABASE {$_POST['databaseName']};";

		if (!@mysql_query($SQL)) {
			$errors[] = mysql_error();
		} else {
			$done[] = "Created database {$_POST['databaseName']}";
		}
	}

	if (!@mysql_select_db($_POST['databaseName'])) {
		$errors[] = mysql_error();
	}

	if (isset($_POST['createDBUser']) && ($_POST['createDBUser'] == 1)) {
		$SQL = sprintf("GRANT SELECT , INSERT , UPDATE , DELETE , CREATE , DROP , FILE , INDEX , ALTER , CREATE TEMPORARY TABLES ON * . * TO '%s'@'%s' IDENTIFIED BY '%s' WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0;",$_POST['dbUsername'], $_POST['dbHost'], $_POST['dbPassword']);

		if (!@mysql_query($SQL)) {
			$errors[] = mysql_error();
		} else {
			$done[] = "Created user {$_POST['dbUsername']}";
		}
	}

	$dbScript = file_get_contents('../dist/MySQL/dbScript_auto.sql');

	$lines = explode(';', $dbScript);
	$i=0;
	foreach ($lines as $line) {
		$line = trim($line);
		$i++;
		if (isset($line) && $line && !empty($line)) {
			$line = preg_replace('/#pref_/', $_POST['tablePrefix'], $line);

			if (!@mysql_query($line) && !(mysql_errno() == 1050)) {
				$errors[] = mysql_error();
			} else {
				$done[] = "Created table - $i";
			}
		}
	}

	if (isset($_SESSION['config']['registration']) && ($_SESSION['config']['registration'] == 0)) {
		$line = sprintf("CREATE TABLE `%s` (
						  `%s` varchar(30) NOT NULL,
						  `%s` varchar(32) NOT NULL,
						  PRIMARY KEY  (`%s`)
						) ENGINE=MyISAM DEFAULT CHARSET=utf8;",
						$_SESSION['dbInfo']['userTable'],
						$_SESSION['dbInfo']['userNameField'],
						$_SESSION['dbInfo']['passwordField'],
						$_SESSION['dbInfo']['userNameField']);

		if (!@mysql_query($line) && !(mysql_errno() == 1050)) {
			$errors[] = mysql_error();
		} else {
			$done[] = "Created {$_SESSION['dbInfo']['userTable']} table";
		}
	}

