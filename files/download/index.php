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

	if (isset($_GET['file']) && isset($_GET['name'])) {

		$root = realpath(dirname(__FILE__)."/../../")."/";
		define('ROOT', $root, 1);

		require_once ROOT.'lib/chat/Files.php';

		$fileObj = new Files($_COOKIE['user']);

		$fileObj->download($_GET['file'], $_GET['name']);

	} else {
		header("HTTP/1.0 404 Not Found");
		exit();
	}
