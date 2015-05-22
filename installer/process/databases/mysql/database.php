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
	$createUser = true;
	$selectErr = null;

	$connected = @mysql_connect($_POST['dbHost'], $dbUser, $dbPass);
	$connErr = mysql_error();

	if (isset($_POST['createDBUser']) && !empty($_POST['createDBUser'])) {
		$user = $connected;
	} else {
		$user = true;
	}

	$selectErr = 'No privilege to create database';
	$dbSelected = $connected;
	$tables = $connected;

	if ($authType == 'blank') {
		$dbUser = '%';
	}

	if ($connected) {
		$SQL = sprintf("SELECT * FROM mysql.user WHERE `User` = '%s' AND (`Host` = '%s' OR `Host` = '%%') LIMIT 1", $dbUser, $_POST['dbHost']);
		$query = mysql_query($SQL);

		$privRow = mysql_fetch_assoc($query);

		$tables = (($privRow['Create_priv'] == 'Y') || ($privRow['Super_priv'] == 'Y'))? true : false;

		$dbSelected = (@mysql_select_db($_POST['databaseName']))? true : (($privRow['Create_priv'] == 'Y') || ($privRow['Super_priv'] == 'Y'))? 'create' : false;
		if ($dbSelected) {
			$selectErr = "";
		}

		if (!@mysql_connect($_POST['dbHost'], $_POST['dbUsername'], $_POST['dbPassword'])) {
			if (isset($_POST['createDBUser']) && !empty($_POST['createDBUser'])) {
				$user = ($privRow['Grant_priv'] == 'Y')? true : false;
			} else {
				$createUser = 'create';
			}
		} else {
			$createUser = true;
			$selectErr = false;
		}

		if (($dbSelected == 'create') && isset($_POST['createDatabase']) && ($_POST['createDatabase'] == 1)) {
			$dbSelected = true;
		}
	} else {
		$createUser = true;
		$selectErr = false;
	}
