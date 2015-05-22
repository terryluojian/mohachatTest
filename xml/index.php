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

	ob_start();

	header("Cache-Control: no-cache, must-revalidate");
	header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

	session_start();
	if (session_id()) {
		$key = substr(session_id(), 0, 16);
	} else {
		$key = "0123456789abcdef";
	}
	$root = realpath(dirname(__FILE__)."/../")."/";
	define('ROOT', $root, 1);
	define('KEY', $key);

	require_once ROOT.'lib/xml/XmlResponse.php';

	//set_error_handler("errHandler");

	header('X-do-not-compress-this: yes');
	header('Content-type: application/xml');

	echo "<?xml version='1.0'?>\r\n";

	function chat_process($postArr) {
		$xmlResponseObj = new XmlResponse($postArr);

		return $xmlResponseObj->getResponse();
	}

	echo chat_process($_REQUEST);

	ob_flush();
