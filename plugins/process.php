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

$root = realpath(dirname(__FILE__)."/../")."/";
define('ROOT', $root, 1);

require_once(ROOT.'/lib/conf/conf.php');

$confObj = new conf();

if (!isset($_COOKIE['user']) || empty($_COOKIE['user'])) {
	header('location: ../'.$confObj->getLoginLink());
}

require_once ROOT."lib/plugins/PlugIns.php";

if (isset($_REQUEST['broker'])) {
	$q = null;
	foreach ($_GET as $key=>$value) {
		if ($key != "broker") {
			$q[] = "{$key}={$value}";
		}
	}

	$plugInsObj = new PlugIns();

	$_REQUEST['broker'] = $plugInsObj->removeUpDir($_REQUEST['broker']);

	if (!is_file(ROOT."plugins/".$_REQUEST['broker'].".php")) {
		exit(0);
	}
	require_once ROOT."plugins/".$_REQUEST['broker'].".php";

	$brokerPath = explode('/', $_REQUEST['broker']);

	$brokerClass = $brokerPath[count($brokerPath)-1];

	$brokerObj = eval("return new $brokerClass();");

	$url = $brokerObj->getUrl();

	if (isset($q)) {
		$url .= "?".implode("&", $q);
	}

	$plugInsObj->brokerRequest($url);

	if (empty($plugInsObj->result)) {
		if ($plugInsObj->info['http_code'] == 0) {
			$plugInsObj->info['http_code'] = 404;
		}
		header("HTTP/1.0 {$plugInsObj->info['http_code']} Not Found");
		ob_flush();
		exit(0);
	}

	header("Content-Type: {$plugInsObj->info['content_type']}");

	echo $plugInsObj->result;
} else if (isset($_REQUEST['ask'])) {
	$plugInsObj = new PlugIns();
	$_REQUEST['ask'] = $plugInsObj->removeUpDir($_REQUEST['ask']);
	if (is_file(ROOT."plugins/".$_REQUEST['ask'])) {
		require_once ROOT."plugins/".$_REQUEST['ask'];
	}
}

ob_flush();
