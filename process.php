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
	$root = dirname(__FILE__)."/";
	define('ROOT', $root, 1);
	define('KEY', $key);

	require_once ROOT.'lib/xajax/xajax_core/xajax.inc.php';
	require_once ROOT.'lib/chat/Chat.php';
	require_once ROOT.'lib/chat/Buddy.php';
	require_once ROOT.'lib/PEAR/Crypt/Xtea.php';

	set_error_handler("errHandler");

	header('X-do-not-compress-this: yes');

	function errHandler($errno, $errstr, $errfile, $errline, $errcontext) {

		 $objResponse = new xajaxResponse();

		 $message = '';

		 switch ($errno) {

      		case E_WARNING:	$message  = "<b>Warning : <b> <br />";
							$message .= $errstr."<br />";
							$message .= $errfile." : ".$errline."<br />";
							//$message .= $errcontext."<br />";
							break;
      		case E_ERROR:   $message  = "<b>Fatal Error : <b> <br />";
							$message .= $errstr."<br />";
							$message .= $errfile." : ".$errline."<br />";
							//$message .= $errcontext."<br />";
							break;

      		case E_PARSE:	$message  = "<b>Parser Error : <b> <br />";
							$message .= $errstr."<br />";
							$message .= $errfile." : ".$errline."<br />";
							//$message .= $errcontext."<br />";
							break;
		}

		$objResponse->script("err('".time().' : failed '.$message."', 'process.php', 1);");

	return $objResponse;
	}

	function chat_start() {

		$objResponse = new xajaxResponse();

		if (isset($_COOKIE['user'])) {
			$_SESSION['start-time'] = microtime(true)*Chat::CHAT_TIME_MICRO_FACTOR;
			$_SESSION['last-time'] = $_SESSION['start-time']-200*Chat::CHAT_TIME_MICRO_FACTOR;
			setcookie('user', $_COOKIE['user']);

			$objBuddy = new Buddy($_COOKIE['user']);

			$objBuddy->regUser($_COOKIE['user']);

			$objResponse = userList($objResponse, $objBuddy);

			$objResponse->script("startup('".KEY."');");

			$objResponse = buddyView($objResponse, $objBuddy);

			$objResponse->script('selfState='.$objBuddy->retrieveSelf());

		} else {
			$objResponse->script('signout(true);');
		}

	return $objResponse;
	}

	function chat_process($postArr) {
		$password = "226911459";

		$from = $postArr['from'];

		$objResponse = new xajaxResponse();

		$objChat = new Chat();
		$objBuddy = new Buddy($from);
		$crypt = new Crypt_Xtea();

		if (isset($postArr['messageQue']) && is_array($postArr['messageQue'])) {
			for ($i=0; $i<count($postArr['messageQue']); $i++) {

				$time = $postArr['timeQue'][$i];
				$messages = $postArr['messageQue'][$i];

				$messages = base64_decode($messages);

				$messages = rawurldecode($crypt->decrypt($messages, KEY));

				$messages = strip_tags($messages);

				$to = $postArr['toQue'][$i];

				if (!$objChat->post($time, $messages, $from, $to)) {
					$objResponse->script("err('".time().' : Server was unable to record your message \"'.$messages."\"', 'AJAX Call', 'Sending');");
					return $objResponse;
				}
			}

		}

		if (isset($postArr['buddyApprove']) && is_array($postArr['buddyApprove'])) {
			for ($i=0; $i<count($postArr['buddyApprove']); $i++) {

				$buddy = $postArr['buddyApprove'][$i];

				if (!$objBuddy->approve($buddy) && ($objBuddy->dbObj->errno != 1062)) {
					$objResponse->script("err('".time().' : Your buddy '.$buddy." could not be added.', 'AJAX Call', 'Add Buddy');");
					return $objResponse;
				}
			}
		}

		if (isset($postArr['buddyReject']) && is_array($postArr['buddyReject'])) {
			for ($i=0; $i<count($postArr['buddyReject']); $i++) {

				$buddy = $postArr['buddyReject'][$i];

				if (!$objBuddy->reject($buddy) && ($objBuddy->dbObj->errno != 1062)) {
					$objResponse->script("err('".time().' : '.$buddy." could not be blocked.', 'AJAX Call', 'Add Buddy');");
					return $objResponse;
				}
			}
		}

		if (isset($postArr['buddyRemove']) && is_array($postArr['buddyRemove'])) {
			for ($i=0; $i<count($postArr['buddyRemove']); $i++) {

				$buddy = $postArr['buddyRemove'][$i];

				if (!$objBuddy->remove($buddy)) {
					$objResponse->script("err('".time().' : '.$buddy." could not be removed.', 'AJAX Call', 'Add Buddy');");
					return $objResponse;
				}
			}
		}

		if (isset($postArr['buddyDelete']) && is_array($postArr['buddyDelete'])) {
			for ($i=0; $i<count($postArr['buddyDelete']); $i++) {

				$buddy = $postArr['buddyDelete'][$i];

				if (!$objBuddy->del($buddy)) {
					$objResponse->script("err('".time().' : Your buddy '.$buddy." could not be deleted.', 'AJAX Call', 'Add Buddy');");
					return $objResponse;
				}
			}
		}

		if (isset($postArr['buddyDeleteReq']) && is_array($postArr['buddyDeleteReq'])) {
			for ($i=0; $i<count($postArr['buddyDeleteReq']); $i++) {

				$buddy = $postArr['buddyDeleteReq'][$i];

				if (!$objBuddy->delReq($buddy)) {
					$objResponse->script("err('".time().' : Your buddy '.$buddy." could not be deleted.', 'AJAX Call', 'Add Buddy');");
					return $objResponse;
				}
			}
		}

		if (isset($postArr['buddyRequest']) && is_array($postArr['buddyRequest'])) {
			for ($i=0; $i<count($postArr['buddyRequest']); $i++) {

				$buddy = $postArr['buddyRequest'][$i];

				if (!$objBuddy->add($buddy) && ($objBuddy->dbObj->errno != 1062)) {
					$objResponse->script("err('".time().' : Your buddy '.$buddy." could not be added.', 'AJAX Call', 'Add Buddy');");
					return $objResponse;
				}
			}
		}

		if (isset($postArr['buddyStatusMes']) && is_array($postArr['buddyStatusMes'])) {
			for ($i=0; $i<count($postArr['buddyStatusMes']); $i++) {

				$args = explode(',', $postArr['buddyStatusMes'][$i]);

				if (!($res = $objBuddy->setStatus($args)) && ($objBuddy->dbObj->errno != 1062)) {
					$objResponse->script("err('".time()." : Setting the status failed.', 'AJAX Call', 'Add Status');");
					return $objResponse;
				}
			}
		}

		$ltime = $_SESSION['start-time'];
		$lid = isset($_SESSION['last'])? $_SESSION['last'] : 1;

		$query = $objChat->retrieve($from, $ltime, $lid);

		$_SESSION['start-time'] = microtime(true)*Chat::CHAT_TIME_MICRO_FACTOR;

		if ($query)	{

			if ($objChat->dbObj->numberOfRows($query) > 0) {
				$messages = "var messages = {";

				while ($row = $objChat->dbObj->fetchAssoc($query)) {

					$message = base64_encode($crypt->encrypt($row['message'], KEY));
					$fromx = $row['from'];
					$time = $row['postedTime'];
					$flash = $row['flash'];

					$_SESSION['last'] = $row['ID'];
					$_SESSION['start-time'] = microtime(true)*Chat::CHAT_TIME_MICRO_FACTOR;

					$messages .= $time." : {".$fromx." : '".$message."'";

					if ($flash == 1) {
						$messages .= ",fl:1";
					}

					$messages .= "}, ";
				}

				$messages = substr($messages, 0, -2);

				$messages .= "};";

				$objResponse->script($messages);

				$objResponse->script('messageObj.addMessagesToBoard(messages);');
			}

		} else if ($mysqlErr = $objChat->dbObj->errno) {
			$time_f = microtime(true)*Chat::CHAT_TIME_MICRO_FACTOR;
			$objResponse->script("err('".time().' : Failed to receive '.$_SESSION['start-time']." ".$objChat->dbObj->error."', 'AJAX Call', 'Receiving');");
		}

		$ltime = $_SESSION['last-time'];

		$_SESSION['last-time'] = (microtime(true)*Chat::CHAT_TIME_MICRO_FACTOR)-50*Chat::CHAT_TIME_MICRO_FACTOR;

		$query = $objChat->procUndelivered($from, $ltime);

		if ($query)	{
			$row = $query;

			if (is_array($row) && (count($row) > 0)) {
				$statusArr = "var dStatuses = {";
				for ($i=0; $i < count($row); $i++) {
					$time = $row[$i]['postedTime'];
					$status = $row[$i]['checked'];
					$statusArr .= $time." : ".$status.", ";
				}

				$statusArr = substr($statusArr, 0, -2);

				$statusArr .= "};";

				$objResponse->script($statusArr);

				$objResponse->script('deliveryObj.markDelivery(dStatuses);');
			}

		}

		if (isset($_COOKIE['user'])) {
			$objBuddy->poll();
		} else {
			$objResponse->script('signout(true);');
		}

		$objResponse = userList($objResponse, $objBuddy);
		$objResponse = pendingBuddyList($objResponse, $objBuddy);

		$objResponse->script('selfState='.userStatusObj($objBuddy->retrieveSelf(), true));

	return $objResponse;
	}

	function userList($objResponse, $objBuddy) {

		$users = $objBuddy->retrieveUsers();

		if (is_array($users) && (count($users) > 0)) {

			$userList = "var users = {";

			foreach ($users as $user=>$activity) {
				if (!empty($user)) {
					$userList .= $user.":".userStatusObj($activity);
				}
			}

			$userList = substr($userList, 0, -1);

			$userList .= "};";

			$objResponse->script($userList);

			$objResponse->script('setUserStates(users);');

		}

		return $objResponse;
	}

	function userStatusObj($activity, $final=false) {
		$userList = "[".$activity[0];

		if (isset($activity[1]) && !empty($activity[1])) {
			$userList .= ",'".truncateStatMes($activity[1])."'";
		}

		$userList .="]";

		if (!$final) {
			$userList .=",";
		}

		return $userList;
	}

	function truncateStatMes($txt) {
		/*if (strlen($txt) > 17) {
			$txt = substr($txt, 0, 17)."...";
		}*/
		return $txt;
	}

	function pendingBuddyList($objResponse, $objBuddy=false) {
		$buddyList = $objBuddy->fetchPendingBuddies();

		if (is_array($buddyList) && (count($buddyList) > 0)) {

			$userList = "var pendingBuddies = new Array(";

			foreach ($buddyList as $buddy) {
				$userList .= "'".$buddy."', ";
			}

			$userList = substr($userList, 0, -2);

			$userList .= ");";

			$objResponse->script($userList);

			$objResponse->script('buddyObj.approveBuddyQue(pendingBuddies);');
		}

		return $objResponse;
	}

	function signout() {
		$objResponse = new xajaxResponse();

		if (isset($_COOKIE['user'])) {
			$objBuddy = new Buddy($_COOKIE['user']);
			$pollTime = microtime(true)*Chat::CHAT_TIME_MICRO_FACTOR - 100*Chat::CHAT_TIME_MICRO_FACTOR;
			$objBuddy->poll($pollTime);
		}

		setcookie('user', null, time()-3600, '/');
		setcookie('user', null, time()-3600);
		unset($_COOKIE['user']);

		$confObj = new conf();

		$objResponse->script("location.replace('".$confObj->getLoginLink()."');");
		return $objResponse;
	}

	function buddyView($objResponse, $objBuddy) {
		$buddyList = $objBuddy->buddyView();

		if (is_array($buddyList) && (count($buddyList) > 0)) {

			$userList = "var aBuddyView = new Array();";
			$userList = "aBuddyView = {";

			for ($i=0; $i<count($buddyList); $i++) {
				$userList .= $buddyList[$i]['UID'].":[";
				$userList .= $buddyList[$i]['cust_status'].",'".$buddyList[$i]['cust_status_message']."'";
				$userList .= "], ";
			}

			$userList = substr($userList, 0, -2);

			$userList .= "};";

			//$objResponse->script('confirm("'.$userList.'");');
			$objResponse->script($userList);
		}

		return $objResponse;
	}

	$xajax = new xajax();

	$xajax->registerFunction("chat_process");
	$xajax->registerFunction("chat_start");
	$xajax->registerFunction("signout");

	$xajax->processRequest();

	ob_flush();
