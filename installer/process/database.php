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

	$authType = "blank";
	if (isset($_POST['privilegedUsername']) && !empty($_POST['privilegedUsername'])) {
		$dbUser = $_POST['privilegedUsername'];
		$dbPass = $_POST['privilegedPassword'];
		$authType = "privileged";
	} else if (isset($_POST['dbUsername']) && !empty($_POST['dbUsername'])) {
		$dbUser = $_POST['dbUsername'];
		$dbPass = $_POST['dbPassword'];
		$authType = "db";
	}

	if (isset($_POST['dbX'])) {
		$_POST['dbms'] = $_POST['dbX'];
	} else {
		$_POST['dbms'] = 'mysql';
	}

	require_once('databases/'.$_POST['dbms'].'/database.php');

	if (isset($_SESSION['page']) && ($_SESSION['page'] == 'installing')) {
		require_once('install.php');
	} else {
		require_once('testDb.php');
	}
