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

	if (($dbSelected == "create") && !@pg_connect("host={$_POST['dbHost']} user={$dbUser} password={$dbPass}")) {
		$SQL = "CREATE DATABASE {$_POST['databaseName']};";

		if (!@pg_query($SQL)) {
			$errors[] = pg_last_error();
		} else {
			$done[] = "Created database {$_POST['databaseName']}";
		}
	}

	$connect = pg_connect("host={$_POST['dbHost']} dbname={$_POST['databaseName']} user={$dbUser} password={$dbPass}");

	if (!@$connect) {
		$errors[] = pg_last_error();
	}

	if (isset($_POST['createDBUser']) && ($_POST['createDBUser'] == 1)) {

		$SQL = sprintf("CREATE USER %s WITH PASSWORD '%s';", $_POST['dbUsername'], trim($_POST['dbPassword']));
		$SQL1 = sprintf("GRANT %s TO %s GRANTED BY %s;", $dbUser, $_POST['dbUsername'], $dbUser);
		$SQL2 = sprintf("GRANT ALL ON DATABASE %s TO %s;", $_POST['databaseName'], $_POST['dbUsername']);

		if (!@pg_query($SQL) || !@pg_query($SQL1) || !@pg_query($SQL2)) {
			$errors[] = pg_last_error();
		} else {
			$done[] = "Created user {$_POST['dbUsername']}";
		}
	}

	$dbScript = file_get_contents('../dist/PostgreSQL/dbScript_auto.sql');

	$lines = explode(';', $dbScript);
	$i=0;
	foreach ($lines as $line) {
		$line = trim($line);
		$i++;
		if (isset($line) && $line && !empty($line)) {
			$line = preg_replace('/#pref_/', $_POST['tablePrefix'], $line);
			$line .= ";";
			pg_send_query($connect, $line);
			$res = @pg_get_result($connect);
			if (!$res && !(pg_result_error_field($res, PGSQL_DIAG_SQLSTATE) == "42P07")) {
				$errors[] = pg_result_error_field($res, PGSQL_DIAG_MESSAGE_PRIMARY);
			} else {
				$done[] = "Created table - $i";
			}
		}
	}

	if (isset($_SESSION['config']['registration']) && ($_SESSION['config']['registration'] == 0)) {
		$line = sprintf("CREATE TABLE \"%s\" (
				  \"%s\" character varying(30) NOT NULL PRIMARY KEY,
				  \"%s\" character varying(32) NOT NULL
				);",
				$_SESSION['dbInfo']['userTable'],
				$_SESSION['dbInfo']['userNameField'],
				$_SESSION['dbInfo']['passwordField']);
		pg_send_query($connect, $line);
		$res = @pg_get_result($connect);
		if (!$res && !(pg_result_error_field($res, PGSQL_DIAG_SQLSTATE) == "42P07")) {
			$errors[] = pg_result_error_field($res, PGSQL_DIAG_MESSAGE_PRIMARY);
		} else {
			$done[] = "Created {$_SESSION['dbInfo']['userTable']} table";
		}
	}
