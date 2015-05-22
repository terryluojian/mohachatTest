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

	$connected = @pg_connect("host={$_POST['dbHost']} dbname=clear user={$dbUser} password={$dbPass}");
	$connErr = "Failed to connect";

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
		$SQL = sprintf("SELECT * from pg_user WHERE \"usename\" = '%s' LIMIT 1", $dbUser);
		$query = pg_query($SQL);

		$privRow = pg_fetch_assoc($query);
		$tables = (($privRow['usecreatedb'] == 't') || ($privRow['usesuper'] == 't'))? true : false;

		$dbSelected = (@pg_connect("host={$_POST['dbHost']} dbname={$_POST['databaseName']} dbname={$_POST['databaseName']} user={$dbUser} password={$dbPass}"))? true : (($privRow['usecreatedb'] == 't') || ($privRow['usesuper'] == 't'))? 'create' : false;
		$selectErr = mysql_error();

		if (!@pg_connect("host={$_POST['dbHost']} dbname=clear user={$dbUser} password={$dbPass}")) {
			if (isset($_POST['createDBUser']) && !empty($_POST['createDBUser'])) {
				$user = ($privRow['usesuper'] == 't')? true : false;
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
