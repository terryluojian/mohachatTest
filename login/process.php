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

	$root = preg_replace('/login$/', "/", dirname(__FILE__));
	define('ROOT', $root, 1);

	require_once(ROOT.'lib/xajax/xajax_core/xajax.inc.php');
	require_once ROOT."lib/users/Users.php";

	set_error_handler("errHandler");


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

		$objResponse->append("chatBoard","innerHTML", $message);
		$objResponse->script("alert('Encountered an error. Operation incomplete.\n Details are available in the chat area.');");


	return $objResponse;
	}

	function authenticate($postArr) {

		$objResponse = new xajaxResponse();

		$user = $postArr['username'];
		$password = $postArr['password'];

		$userObj = new Users();

		if (isset($postArr['register']) && ($postArr['register'] == 1)) {
			$result = $userObj->register($user, $password);

			if (!$result) {
				$objResponse->script("failed();");
				$objResponse->assign('messages', 'innerHTML', '<span class="err">'.$userObj->error.'</span>');
				return $objResponse;
			}
		}

		$result = $userObj->authenticate($user, $password);

		if ($result === null) {
			$objResponse->script("failed();");
			$objResponse->assign('messages', 'innerHTML', '<span class="err">Account not activated</span>');
		} else if ($result) {
			$objResponse->assign('message', 'innerHTML', 'Redirecting...');
			$objResponse->script("location.replace('../');");
		} else {
			$objResponse->script("failed();");
			$objResponse->assign('messages', 'innerHTML', '<span class="err">Password or Username invalid</span>');
		}

		return $objResponse;
	}

	$xajax = new xajax('process.php');

	$xajax->registerFunction("authenticate");

	$xajax->processRequest();
