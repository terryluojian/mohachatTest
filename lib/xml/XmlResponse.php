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

require_once ROOT.'lib/chat/Chat.php';
require_once ROOT.'lib/chat/Buddy.php';
require_once ROOT.'lib/PEAR/Crypt/Xtea.php';

/**
 * Generates XML Response that will be sent to the client
 *
 */
class XmlResponse {

	/*
	 * Class atributes
	 *
	 **/

	private $user;
	private $last;
	private $lastTime;
	private $response;
	private $objBuddy;
	private $startTime;

	public function __construct($postArr) {
		$start = false;
		if (!isset($_SESSION['last'])) {
			$this->last = 1;
			$start = true;
		} else {
			$this->last = $_SESSION['last'];
		}
		if (!isset($_SESSION['last-time'])) {
			$this->lastTime = $this->last-20000;
			$start = true;
		} else {
			$this->lastTime = $_SESSION['last-time'];
		}

		if ($start) {
			$this->response = "<stream key='".KEY."' >";
		} else {
			$this->response = "";
		}

		if (!isset($_COOKIE['user'])) {
			$this->response .= "<error type='1' /></stream>";
			session_destroy();
		} else {
			$this->user = $_COOKIE['user'];
			$this->objBuddy = new Buddy($this->user);
			$this->objChat = new Chat();
			$this->crypt = new Crypt_Xtea();
			$this->processRequest($postArr);
			$this->buildResponse();
			$this->objBuddy->poll();
		}

		$_SESSION['last-time'] = $this->lastTime;
		$_SESSION['last'] = $this->last;
		$_SESSION['start-time'] = $this->startTime;
	}

	public function getResponse() {
		return $this->response;
	}

	public function buildResponse() {
		$this->response .= "<verse from='{$_SERVER['HTTP_HOST']}' to='{$_COOKIE['user']}'>";
		$statusMes = $this->objBuddy->retrieveSelf();

		if (!empty($statusMes[1])) {
			$this->response .= "<customStatus><![CDATA[{$statusMes[1]}]]></customStatus>";
		}

		$this->_buildUserResponse();
		$this->_buildPendingBuddyResponse();
		$this->_buildDeliveryResponse();
		$this->_buildMessages();
		$this->response .= "</verse>";
	}

	private function _buildUserResponse() {
		$users = $this->objBuddy->retrieveUsers();

		if (is_array($users) && (count($users) > 0)) {
			$this->response .= "<users>";
			foreach ($users as $user=>$activity) {
				if (!empty($user)) {
					$this->response .= "<user activity='{$activity[0]}' >";
					$this->response .= "<name><![CDATA[{$user}]]></name>";
					$this->response .= $this->_userStatus($activity);
					$this->response .= "</user>";
				}
			}
			$this->response .= "</users>";
		}
	}

	private function _userStatus($activity) {
		if (isset($activity[1]) && !empty($activity[1])) {
			$userList = "<message><![CDATA[{$activity[1]}]]></message>";
		} else {
			$userList = "";
		}
		return $userList;
	}

	private function _buildPendingBuddyResponse() {
		$buddyList = $this->objBuddy->fetchPendingBuddies();

		if (is_array($buddyList) && (count($buddyList) > 0)) {
			$this->response .= "<pending>";
			foreach ($buddyList as $buddy) {
				$this->response .= "<buddy><![CDATA[$buddy]]></buddy>";
			}
			$this->response .= "</pending>";
		}
	}

	private function _buildMessages() {
		$query = $this->objChat->retrieve($this->user, $this->lastTime, $this->last);
		$this->startTime = microtime(true)*100;

		if ($query)	{
			if ($this->objChat->dbObj->numberOfRows($query) > 0) {
				$this->response .= "<messages>";

				while ($row = $this->objChat->dbObj->fetchAssoc($query)) {

					$message = base64_encode($this->crypt->encrypt($row['message'], KEY));
					$fromx = $row['from'];
					$time = $row['postedTime'];
					$flash = $row['flash'];

					$this->last = $row['ID'];
					$this->startTime = microtime(true)*100;
					if ($flash == 1) {
						$flash = "flash='1'";
					} else {
						$flash = "";
					}
					$this->response .= "<message time='$time' from='$fromx' $flash >";
					$this->response .= "<body><![CDATA[$message]]></body>";
					$this->response .= "</message>";
				}
				$this->response .= "</messages>";
			}
		} else if ($mysqlErr = $this->objChat->dbObj->errno) {
			$this->response .= "<error type='0' time='{$_SESSION['start-time']}' >". $this->objChat->error."</error>";
		}
	}

	private function _buildDeliveryResponse() {
		$from = $this->user;
		$ltime = $this->lastTime;
		$this->lastTime = (microtime(true)*100)-5000;
		$row = $this->objChat->procUndelivered($from, $ltime);

		if ($row)	{
			if (is_array($row) && (count($row) > 0)) {
				$this->response .= "<delivery>";
				for ($i=0; $i < count($row); $i++) {
					$time = $row[$i]['postedTime'];
					$status = $row[$i]['checked'];
					$this->response .= "<message time='$time' status='$status' />";
				}

				$this->response .= "</delivery>";
			}
		}
	}

	public function processRequest($postArr) {
		$from = isset($postArr['from'])?$postArr['from']:$this->user;

		if (isset($postArr['messageQue']) && is_array($postArr['messageQue'])) {
			for ($i=0; $i<count($postArr['messageQue']); $i++) {

				$time = $postArr['timeQue'][$i];
				$messages = $postArr['messageQue'][$i];

				$messages = base64_decode($messages);

				$messages = rawurldecode($this->crypt->decrypt($messages, KEY));

				$messages = strip_tags($messages);

				$to = $postArr['toQue'][$i];

				if (!$this->objChat->post($time, $messages, $from, $to)) {
					$this->response .= "<error type='2' time='".time()."' >Server was unable to record your message \"".$messages."\"</error>";
				}
			}

		}

		if (isset($postArr['buddyApprove']) && is_array($postArr['buddyApprove'])) {
			for ($i=0; $i<count($postArr['buddyApprove']); $i++) {

				$buddy = $postArr['buddyApprove'][$i];

				if (!$this->objBuddy->approve($buddy) && ($this->objBuddy->dbObj->errno != 1062)) {
					$this->response .= "<error type='2' time='".time()."' >Your buddy $buddy could not be added.</error>";
				}
			}
		}

		if (isset($postArr['buddyReject']) && is_array($postArr['buddyReject'])) {
			for ($i=0; $i<count($postArr['buddyReject']); $i++) {

				$buddy = $postArr['buddyReject'][$i];

				if (!$this->objBuddy->reject($buddy) && ($this->objBuddy->dbObj->errno != 1062)) {
					$this->response .= "<error type='2' time='".time()."' >$buddy could not be blocked.</error>";
				}
			}
		}

		if (isset($postArr['buddyRemove']) && is_array($postArr['buddyRemove'])) {
			for ($i=0; $i<count($postArr['buddyRemove']); $i++) {

				$buddy = $postArr['buddyRemove'][$i];

				if (!$this->objBuddy->remove($buddy)) {
					$this->response .= "<error type='2' time='".time()."' >$buddy could not be removed.</error>";
				}
			}
		}

		if (isset($postArr['buddyDelete']) && is_array($postArr['buddyDelete'])) {
			for ($i=0; $i<count($postArr['buddyDelete']); $i++) {

				$buddy = $postArr['buddyDelete'][$i];

				if (!$this->objBuddy->del($buddy)) {
					$this->response .= "<error type='2' time='".time()."' >$buddy could not be deleted.</error>";
				}
			}
		}

		if (isset($postArr['buddyDeleteReq']) && is_array($postArr['buddyDeleteReq'])) {
			for ($i=0; $i<count($postArr['buddyDeleteReq']); $i++) {

				$buddy = $postArr['buddyDeleteReq'][$i];

				if (!$this->objBuddy->delReq($buddy)) {
					$this->response .= "<error type='2' time='".time()."' >$buddy could record delete request.</error>";
				}
			}
		}

		if (isset($postArr['buddyRequest']) && is_array($postArr['buddyRequest'])) {
			for ($i=0; $i<count($postArr['buddyRequest']); $i++) {

				$buddy = $postArr['buddyRequest'][$i];

				if (!$this->objBuddy->add($buddy) && ($this->objBuddy->dbObj->errno != 1062)) {
					$this->response .= "<error type='2' time='".time()."' >$buddy could not be added.</error>";
				}
			}
		}

		if (isset($postArr['buddyStatusMes']) && is_array($postArr['buddyStatusMes'])) {
			for ($i=0; $i<count($postArr['buddyStatusMes']); $i++) {

				$args = explode(',', $postArr['buddyStatusMes'][$i]);

				if (!$this->objBuddy->setStatus($args) && ($this->objBuddy->dbObj->errno != 1062)) {
					$this->response .= "<error type='2' time='".time()."' >Setting custom status failed</error>";
				}
			}
		}
	}
}
