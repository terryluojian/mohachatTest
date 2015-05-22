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

require_once(ROOT.'lib/db/DB.php');
require_once(ROOT.'lib/users/Users.php');
require_once(ROOT.'lib/chat/Chat.php');

/**
 * Manages buddies at persistent layer
 *
 */
class Buddy {

	/**
	 * Field names of the buddy table
	 */
	const BUDDY_FIELD_BUDDY_UID = 'UID';
	const BUDDY_FIELD_BUDDY_BID = 'BID';
	const BUDDY_FIELD_BUDDY_STATUS = 'status';
	const BUDDY_FIELD_BUDDY_CUST_STATUS = 'cust_status';
	const BUDDY_FIELD_BUDDY_CUST_STATUS_MESSAGE = 'cust_status_message';

	/**
	 * Field names of the poll table
	 */
	const BUDDY_FIELD_POLL_UID = 'UID';
	const BUDDY_FIELD_POLL_TIME = 'time';
	const BUDDY_FIELD_POLL_CUST_STATUS = 'cust_status';
	const BUDDY_FIELD_POLL_CUST_STATUS_MESSAGE = 'cust_status_message';

	public $conn = null;
	public $buddyTable;
	public $pollTable;

	private $username;

	public $dbObj = null;

	public function __construct($username) {

		$dbClass = new DB();

		$dbClass->dbConn();

		$this->dbObj = $dbClass;

		$conn = $dbClass->getDbConnection();

		$this->conn = $conn;
		$this->username = $username;

		if (!defined('PREFIX')) {
			define('PREFIX', $dbClass->tablePrefix);
		}

		$this->buddyTable = PREFIX."chat_moha_buddy";
		$this->pollTable = PREFIX."chat_moha_poll";
	}

	public function __distruct() {
		$this->conn = false;
		$this->dbObj = false;
	}

	public function add($buddyname, $status=4) {

		if (strtolower($buddyname) == strtolower($this->username)) return;

		$objUser = new Users();

		if (!$objUser->getUID($buddyname)) return false;

		$sqlString = sprintf("INSERT INTO {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} ({$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_UID."{$this->dbObj->backQuote}, {$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_BID."{$this->dbObj->backQuote}, {$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_STATUS."{$this->dbObj->backQuote}) VALUES ('%s', '%s', %s)", $this->buddyTable, $this->username, $buddyname, $status);

		$query = $this->dbObj->execute($sqlString);

		if (!$query && ($status == 3) && ($this->dbObj->errno == 1062)) {
			return $this->_change($this->username, $buddyname, $status=3);
		}

		return $query;
	}

	public function fetchBuddies() {

		$sqlString = sprintf("SELECT {$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_CUST_STATUS."{$this->dbObj->backQuote}, {$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_CUST_STATUS_MESSAGE."{$this->dbObj->backQuote}, {$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_BID."{$this->dbObj->backQuote}, {$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_STATUS."{$this->dbObj->backQuote} FROM {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} WHERE {$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_UID."{$this->dbObj->backQuote} = '%s' AND {$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_STATUS."{$this->dbObj->backQuote} != -1", $this->buddyTable, $this->username);

		$query = $this->dbObj->execute($sqlString);

		if (!$query) return null;

		$buddyList = null;

		while ($row = $this->dbObj->fetchRow($query)) {
			$buddyList[strtolower($row[2])] = $row;
			$buddyList[strtolower($row[2])][0] = 3;
			if (($row[3] > 3) || ($row[3] < 1)){
				$buddyList[strtolower($row[2])][0] = $row[3];
			}
			$buddyList[strtolower($row[2])][2] = $row[0];
		}

		return $buddyList;
	}

	public function fetchPendingBuddies() {

		$sqlString = sprintf("SELECT {$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_UID."{$this->dbObj->backQuote} FROM {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} WHERE {$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_BID."{$this->dbObj->backQuote} = '%s' AND {$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_STATUS."{$this->dbObj->backQuote} = 4", $this->buddyTable, $this->username);

		$query = $this->dbObj->execute($sqlString);

		if (!$query) return null;

		$buddyList = null;

		while ($row = $this->dbObj->fetchRow($query)) {
			$buddyList[] = $row[0];
		}

		return $buddyList;
	}

	public function approve($buddyname) {
		$this->add($buddyname, $status=3);
		return $this->_change($buddyname, $this->username, $status=3);
	}

	public function reject($buddyname) {
		return $this->_change($buddyname, $this->username, $status=0);
	}

	public function delReq($buddyname) {
		return $this->_change($this->username, $buddyname, $status=5);
	}

	public function del($buddyname) {
		return $this->_delete($buddyname);
	}

	private function _change($username, $buddyname, $status=4) {

		$objUser = new Users();

		if (!$objUser->getUID($buddyname)) return false;

		$sqlString = sprintf("UPDATE {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} SET {$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_STATUS."{$this->dbObj->backQuote} = %s WHERE {$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_UID."{$this->dbObj->backQuote} = '%s' AND {$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_BID."{$this->dbObj->backQuote} = '%s'", $this->buddyTable, $status, $username, $buddyname);

		$query = $this->dbObj->execute($sqlString);

		return $query;
	}

	public function remove($buddyname) {
		return $this->_change($this->username, $buddyname, $status=-1);
	}

	private function _delete($buddyname) {
		$objUser = new Users();

		if (!$objUser->getUID($buddyname)) return false;

		$sqlString = sprintf("DELETE FROM {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} WHERE {$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_UID."{$this->dbObj->backQuote} = '%s' AND {$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_BID."{$this->dbObj->backQuote} = '%s'", $this->buddyTable, $this->username, $buddyname);
		$query = $this->dbObj->execute($sqlString);

		return $query;
	}

	public function setStatus($args) {
		$status = $args[0];

		$custMes = "NULL";
		if (isset($args[2])) {
			$custMes = "'".$args[2]."'";
		}

		if (isset($args[1]) && !empty($args[1])) {
			$sqlString = sprintf("UPDATE {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} SET {$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_CUST_STATUS."{$this->dbObj->backQuote} = %s, {$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_CUST_STATUS_MESSAGE."{$this->dbObj->backQuote} = %s WHERE {$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_BID."{$this->dbObj->backQuote} = '%s' AND {$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_UID."{$this->dbObj->backQuote} = '%s'", $this->buddyTable, $status, $custMes, $this->username, $args[1]);
		} else {
			$sqlString = sprintf("UPDATE {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} SET {$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_CUST_STATUS."{$this->dbObj->backQuote} = %s, {$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_CUST_STATUS_MESSAGE."{$this->dbObj->backQuote} = %s WHERE {$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_UID."{$this->dbObj->backQuote} = '%s' ", $this->pollTable, $status, $custMes, $this->username);
		}

		$query = $this->dbObj->execute($sqlString);

		return $sqlString;
	}

	public function buddyView() {

		$sqlString = sprintf("SELECT {$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_UID."{$this->dbObj->backQuote}, {$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_CUST_STATUS."{$this->dbObj->backQuote}, {$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_CUST_STATUS_MESSAGE."{$this->dbObj->backQuote} FROM {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} WHERE {$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_BID."{$this->dbObj->backQuote} = '%s' AND {$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_STATUS."{$this->dbObj->backQuote} = 3 ORDER BY {$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_UID."{$this->dbObj->backQuote} ASC", $this->buddyTable, $this->username);

		$query = $this->dbObj->execute($sqlString);

		if (!$query) return false;

		$buildArr = null;

		while ($row = $this->dbObj->fetchAssoc($query)) {
			$row[self::BUDDY_FIELD_BUDDY_UID] = strtolower($row[self::BUDDY_FIELD_BUDDY_UID]);
			$buildArr[] = $row;
		}

		return $buildArr;
	}

	/**
	 * Record the last poll for the sake of
	 * getting active users
	 *
	 * @param String $userId
	 * @return boolean
	 */
	public function poll($time=false) {

		$userId = $this->username;

		if (!$time) {
			$time = microtime(true)*Chat::CHAT_TIME_MICRO_FACTOR;
		}

		$sqlString = sprintf("UPDATE {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} SET {$this->dbObj->backQuote}".self::BUDDY_FIELD_POLL_TIME."{$this->dbObj->backQuote} = %s WHERE {$this->dbObj->backQuote}".self::BUDDY_FIELD_POLL_UID."{$this->dbObj->backQuote} = '%s'", $this->pollTable, $time, $userId);

		$query1 = $this->dbObj->execute($sqlString);

		if ($this->dbObj->affectedRows() == 0) {
			$sqlString = sprintf("INSERT INTO {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} ({$this->dbObj->backQuote}".self::BUDDY_FIELD_POLL_TIME."{$this->dbObj->backQuote}, {$this->dbObj->backQuote}".self::BUDDY_FIELD_POLL_UID."{$this->dbObj->backQuote}) VALUES ( %s, '%s')", $this->pollTable, $time, $userId);

			$query1 = $this->dbObj->execute($sqlString);
		}

		if ($this->dbObj->affectedRows() > 0) {
			return true;
		}

		return false;
	}

	/**
	 * Registers the user in the user table
	 *
	 * @param String $userId
	 */
	public function regUser() {
		$userId = $this->username;

		$this->poll();
	}

	/**
	 *
	 *
	 *
	 */
	private function _deterStatus($dynamic, $static, $buddy) {
		if ($dynamic == 3) return 3;
		if ($buddy == 3) return 3;

		if ($buddy > 3) return $buddy;

		if ($static == 0) $static = $dynamic;
		if ($buddy == 0) $buddy = $static;

		return $buddy;
	}

	/**
	 *
	 *
	 *
	 */
	public function retrieveSelf() {

		$sqlString = sprintf("SELECT {$this->dbObj->backQuote}".self::BUDDY_FIELD_POLL_CUST_STATUS."{$this->dbObj->backQuote}, {$this->dbObj->backQuote}".self::BUDDY_FIELD_POLL_CUST_STATUS_MESSAGE."{$this->dbObj->backQuote} FROM {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} WHERE {$this->dbObj->backQuote}".self::BUDDY_FIELD_POLL_UID."{$this->dbObj->backQuote} = '%s' LIMIT 1", $this->pollTable, $this->username);

		$query = $this->dbObj->execute($sqlString);

		$row = $this->dbObj->fetchRow($query);

		if (empty($row[0])) {
			$row[0] = 1;
		}

		return $row;
	}

	/**
	 *
	 *
	 */
	public function retrieveUsers() {

		$time = microtime(true)*Chat::CHAT_TIME_MICRO_FACTOR;

		$query = $this->_retrieveActiveUsers($time);

		$resArr = null;

		$resArr = $this->fetchBuddies();

		while ($row = $this->dbObj->fetchAssoc($query)) {
			if (isset($resArr[strtolower($row[self::BUDDY_FIELD_POLL_UID])])) {
				$buddyStaticStatus = $resArr[strtolower($row[self::BUDDY_FIELD_POLL_UID])][2];
				$buddyStatus = $resArr[strtolower($row[self::BUDDY_FIELD_POLL_UID])];
				unset($resArr[strtolower($row[self::BUDDY_FIELD_POLL_UID])]);

				$resArr[$row[self::BUDDY_FIELD_POLL_UID]][1] = $row[self::BUDDY_FIELD_POLL_CUST_STATUS_MESSAGE];
				if (!empty($buddyStatus[1])) {
					$resArr[$row[self::BUDDY_FIELD_POLL_UID]][1] = $buddyStatus[1];
				}

				$resArr[$row[self::BUDDY_FIELD_POLL_UID]][0] = $this->_deterStatus(1, $row[self::BUDDY_FIELD_POLL_CUST_STATUS], $buddyStaticStatus);
			} else {
			    $resArr[$row[self::BUDDY_FIELD_POLL_UID]][0] = 1;
			}
		}

		$query = $this->_retrieveInactiveUsers($time);

		while ($row = $this->dbObj->fetchAssoc($query)) {
			if (isset($resArr[strtolower($row[self::BUDDY_FIELD_POLL_UID])])) {
				$buddyStaticStatus = $resArr[strtolower($row[self::BUDDY_FIELD_POLL_UID])][2];
				$buddyStatus = $resArr[strtolower($row[self::BUDDY_FIELD_POLL_UID])];
				unset($resArr[strtolower($row[self::BUDDY_FIELD_POLL_UID])]);

				$resArr[$row[self::BUDDY_FIELD_POLL_UID]][1] = $row[self::BUDDY_FIELD_POLL_CUST_STATUS_MESSAGE];
				if (!empty($buddyStatus[1])) {
					$resArr[$row[self::BUDDY_FIELD_POLL_UID]][1] = $buddyStatus[1];
				}

				$resArr[$row[self::BUDDY_FIELD_POLL_UID]][0] = $this->_deterStatus(2, $row[self::BUDDY_FIELD_POLL_CUST_STATUS], $buddyStaticStatus);
			} else {
			    $resArr[$row[self::BUDDY_FIELD_POLL_UID]][0] = 2;
			}
		}

		$query = $this->_retrieveOfflineUsers($time);

		while ($row = $this->dbObj->fetchAssoc($query)) {
			if (isset($resArr[strtolower($row[self::BUDDY_FIELD_POLL_UID])])) {
				$buddyStaticStatus = $resArr[strtolower($row[self::BUDDY_FIELD_POLL_UID])][2];
				unset($resArr[strtolower($row[self::BUDDY_FIELD_POLL_UID])]);
				$resArr[$row[self::BUDDY_FIELD_POLL_UID]][0] = $this->_deterStatus(3, $row[self::BUDDY_FIELD_POLL_CUST_STATUS], $buddyStaticStatus);
			} else {
			    $resArr[$row[self::BUDDY_FIELD_POLL_UID]][0] = 3;
			}
		}

		if (is_array($resArr)) {
			asort($resArr);
		}

		return $resArr;
	}

	/**
	 * retrieves all active users
	 *
	 * @return Resource Indentifier
	 */
	private function _retrieveActiveUsers($time) {

		$time_e = $time-50*Chat::CHAT_TIME_MICRO_FACTOR;

		$sqlString = sprintf("SELECT a.{$this->dbObj->backQuote}".self::BUDDY_FIELD_POLL_UID."{$this->dbObj->backQuote}, a.{$this->dbObj->backQuote}".self::BUDDY_FIELD_POLL_CUST_STATUS."{$this->dbObj->backQuote}, a.{$this->dbObj->backQuote}".self::BUDDY_FIELD_POLL_CUST_STATUS_MESSAGE."{$this->dbObj->backQuote} FROM ({$this->dbObj->backQuote}%s{$this->dbObj->backQuote} a LEFT JOIN {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} b ON (a.{$this->dbObj->backQuote}".self::BUDDY_FIELD_POLL_UID."{$this->dbObj->backQuote} = b.{$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_BID."{$this->dbObj->backQuote})) WHERE a.{$this->dbObj->backQuote}".self::BUDDY_FIELD_POLL_TIME."{$this->dbObj->backQuote} BETWEEN %s AND %s AND b.{$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_UID."{$this->dbObj->backQuote} = '%s' AND b.{$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_STATUS."{$this->dbObj->backQuote} = 3 ORDER BY a.{$this->dbObj->backQuote}".self::BUDDY_FIELD_POLL_UID."{$this->dbObj->backQuote} ASC", $this->pollTable, $this->buddyTable, $time_e, $time, $this->username);

		$query = $this->dbObj->execute($sqlString);

		return $query;
	}

	/**
	 * retrieves all inactive users
	 *
	 * @return Resource Indentifier
	 */
	private function _retrieveInactiveUsers($time) {

		$time_e = $time-100*Chat::CHAT_TIME_MICRO_FACTOR;
		$time =  $time-50*Chat::CHAT_TIME_MICRO_FACTOR;

		$sqlString = sprintf("SELECT a.{$this->dbObj->backQuote}".self::BUDDY_FIELD_POLL_UID."{$this->dbObj->backQuote}, a.{$this->dbObj->backQuote}".self::BUDDY_FIELD_POLL_CUST_STATUS."{$this->dbObj->backQuote}, a.{$this->dbObj->backQuote}".self::BUDDY_FIELD_POLL_CUST_STATUS_MESSAGE."{$this->dbObj->backQuote} FROM ({$this->dbObj->backQuote}%s{$this->dbObj->backQuote} a LEFT JOIN {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} b ON (a.{$this->dbObj->backQuote}".self::BUDDY_FIELD_POLL_UID."{$this->dbObj->backQuote} = b.{$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_BID."{$this->dbObj->backQuote})) WHERE a.{$this->dbObj->backQuote}".self::BUDDY_FIELD_POLL_TIME."{$this->dbObj->backQuote} BETWEEN %s AND %s AND b.{$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_UID."{$this->dbObj->backQuote} = '%s' AND b.{$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_STATUS."{$this->dbObj->backQuote} = 3 ORDER BY a.{$this->dbObj->backQuote}".self::BUDDY_FIELD_POLL_UID."{$this->dbObj->backQuote} ASC", $this->pollTable, $this->buddyTable, $time_e, $time, $this->username);

		$query = $this->dbObj->execute($sqlString);

		return $query;
	}

	/**
	 * retrieves all offiline users
	 *
	 * @return Resource Indentifier
	 */
	private function _retrieveOfflineUsers($time) {

		$time_e = $time-100*Chat::CHAT_TIME_MICRO_FACTOR;

		$sqlString = sprintf("SELECT a.{$this->dbObj->backQuote}".self::BUDDY_FIELD_POLL_UID."{$this->dbObj->backQuote}, a.{$this->dbObj->backQuote}".self::BUDDY_FIELD_POLL_CUST_STATUS."{$this->dbObj->backQuote}, a.{$this->dbObj->backQuote}".self::BUDDY_FIELD_POLL_CUST_STATUS_MESSAGE."{$this->dbObj->backQuote} FROM ({$this->dbObj->backQuote}%s{$this->dbObj->backQuote} a JOIN {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} b ON (a.{$this->dbObj->backQuote}".self::BUDDY_FIELD_POLL_UID."{$this->dbObj->backQuote} = b.{$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_BID."{$this->dbObj->backQuote})) WHERE a.{$this->dbObj->backQuote}".self::BUDDY_FIELD_POLL_TIME."{$this->dbObj->backQuote} < %s AND b.{$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_UID."{$this->dbObj->backQuote} = '%s' AND b.{$this->dbObj->backQuote}".self::BUDDY_FIELD_BUDDY_STATUS."{$this->dbObj->backQuote} = 3 ORDER BY a.{$this->dbObj->backQuote}".self::BUDDY_FIELD_POLL_UID."{$this->dbObj->backQuote} ASC", $this->pollTable, $this->buddyTable, $time_e, $this->username);

		$query = $this->dbObj->execute($sqlString);

		return $query;
	}

}
