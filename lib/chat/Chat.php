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

require_once(ROOT.'lib/conf/ini.php');
require_once(ROOT.'lib/db/DB.php');

/**
 * Manages chat at persistent layer
 *
 */
class Chat {

	/**
	 * Field names of the chat table
	 */
	const CHAT_FIELD_CHAT_ID = 'ID';
	const CHAT_FIELD_CHAT_TIME = 'time';
	const CHAT_FIELD_CHAT_MESSAGE = 'message';
	const CHAT_FIELD_CHAT_TO = 'to';
	const CHAT_FIELD_CHAT_FROM = 'from';
	const CHAT_FIELD_CHAT_POSTEDTIME = 'postedTime';
	const CHAT_FIELD_CHAT_FLASH = 'flash';
	const CHAT_FIELD_CHAT_CHECKED = 'checked';

	const CHAT_TIME_MICRO_FACTOR = 1000000;

	public $conn = null;

	public $chatTable;
	public $chatPollTable;
	public $archiveTable;

	public $dbObj = null;

	private $archive;

	public function __construct() {

		$dbClass = new DB();

		$dbClass->dbConn();

		$this->dbObj = $dbClass;

		$conn = $dbClass->getDbConnection();

		$this->conn = $conn;

		$confObj = new conf();

		$this->archive = $confObj->getArchive();

		if (!defined('PREFIX')) {
			define('PREFIX', $confObj->tablePrefix);
		}

		$this->chatTable = PREFIX."chat_moha";
		$this->chatPollTable = PREFIX."chat_moha_poll";
		$this->archiveTable = PREFIX."chat_moha_archive";
	}

	/**
	 * Posts a message
	 *
	 * @param int $time
	 * @param String $message
	 * @param String $from
	 * @param String $to
	 * @return boolean
	 */
	public function post($time, $message, $from, $to="moha", $flash=0) {

		$time_f = microtime(true)*self::CHAT_TIME_MICRO_FACTOR;

		$message = addslashes($message);

		$sqlString = sprintf("INSERT INTO {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} ({$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_TIME."{$this->dbObj->backQuote} , {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_MESSAGE."{$this->dbObj->backQuote}, {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_FROM."{$this->dbObj->backQuote}, {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_TO."{$this->dbObj->backQuote}, {$this->dbObj->backQuote}postedTime{$this->dbObj->backQuote}, {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_FLASH."{$this->dbObj->backQuote}) VALUES ('%s', '%s', '%s', '%s', '%s', %d)", $this->chatTable, $time_f, $message, $from, $to, $time, $flash);

		$query = $this->dbObj->execute($sqlString);

		if (!$query) {
			return false;
		}

	return true;
	}

	/**
	 * Retrieves a list of messages since last check
	 *
	 * @param String $to
	 * @param int $ltime
	 * @return Resource Indentifier
	 */
	public function retrieve($to, $ltime, $lid) {

		$ltime_f = $ltime;
		$time_f = microtime(true)*self::CHAT_TIME_MICRO_FACTOR;

		$sqlString = sprintf("SELECT * FROM {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} WHERE {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_TIME."{$this->dbObj->backQuote} BETWEEN %s AND %s AND {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_ID."{$this->dbObj->backQuote} != '%s' AND {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_TO."{$this->dbObj->backQuote} = '%s' AND {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_CHECKED."{$this->dbObj->backQuote} = 0 ORDER BY {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_TIME."{$this->dbObj->backQuote} ASC", $this->chatTable, $ltime_f, $time_f, $lid, $to);

		$query = $this->dbObj->execute($sqlString);

		$sqlString = sprintf("UPDATE {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} SET {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_CHECKED."{$this->dbObj->backQuote} = '1' WHERE {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_TIME."{$this->dbObj->backQuote} BETWEEN %s AND %s AND {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_ID."{$this->dbObj->backQuote} != '%s' AND {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_TO."{$this->dbObj->backQuote} = '%s' AND {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_CHECKED."{$this->dbObj->backQuote} = 0", $this->chatTable, $ltime_f, $time_f, $lid, $to);

		$query1 = $this->dbObj->execute($sqlString);

	return $query;
	}

	/**
	 * Handles undelivered messeges and returns
	 * a list of undelivered messages
	 *
	 * @param String $from
	 * @param String $ltime
	 * @return mixed[][]
	 */
	public function procUndelivered($from, $ltime) {

		$resArr = null;

		$time = microtime(true)*self::CHAT_TIME_MICRO_FACTOR;

		$sqlString = sprintf("SELECT * FROM {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} WHERE {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_TIME."{$this->dbObj->backQuote} BETWEEN %s AND %s AND {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_FROM."{$this->dbObj->backQuote} = '%s' AND {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_CHECKED."{$this->dbObj->backQuote} = 1 ORDER BY {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_TIME."{$this->dbObj->backQuote} ASC", $this->chatTable, $ltime, $time, $from);
		$query = $this->dbObj->execute($sqlString);

		if ($query)
			while ($row = $this->dbObj->fetchAssoc($query)) {
				$resArr[] = $row;
			}

		$sqlString = sprintf("UPDATE {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} SET {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_CHECKED."{$this->dbObj->backQuote} = '2' WHERE {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_TIME."{$this->dbObj->backQuote} BETWEEN %s AND %s AND {$this->dbObj->backQuote}from{$this->dbObj->backQuote} = '%s' AND {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_CHECKED."{$this->dbObj->backQuote} = 1", $this->chatTable, $ltime, $time, $from);
		$query1 = $this->dbObj->execute($sqlString);

		$time = $ltime+20*self::CHAT_TIME_MICRO_FACTOR;

		$sqlString = sprintf("SELECT * FROM {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} WHERE {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_TIME."{$this->dbObj->backQuote} BETWEEN %s AND %s AND {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_FROM."{$this->dbObj->backQuote} = '%s' AND {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_CHECKED."{$this->dbObj->backQuote} = 0 ORDER BY {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_TIME."{$this->dbObj->backQuote} ASC", $this->chatTable, $ltime, $time, $from);
		$query = $this->dbObj->execute($sqlString);

		if ($query)
			while ($row = $this->dbObj->fetchAssoc($query)) {
				$resArr[] = $row;
			}

		$sqlString = sprintf("UPDATE {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} SET {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_CHECKED."{$this->dbObj->backQuote} = '2' WHERE {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_TIME."{$this->dbObj->backQuote} BETWEEN %s AND %s AND {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_FROM."{$this->dbObj->backQuote} = '%s' AND {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_CHECKED."{$this->dbObj->backQuote} = 0", $this->chatTable, $ltime, $time, $from);
		$query1 = $this->dbObj->execute($sqlString);

		$this->_clean();

	return $resArr;
	}

	/**
	 * Deletes unecessary messages
	 * and optimizes the table
	 *
	 * Archives the old messages.
	 *
	 * Archiving
	 * ---------
	 * Could be disabled with the archive setting.
	 *
	 */
	private function _clean() {

		if ($this->archive) {
			$sqlString = sprintf("INSERT INTO {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} SELECT * FROM {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} WHERE {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_CHECKED."{$this->dbObj->backQuote} = '2'", $this->archiveTable, $this->chatTable);
			$query1 = $this->dbObj->execute($sqlString);
		}

		$time = (microtime(true)*self::CHAT_TIME_MICRO_FACTOR)-200*self::CHAT_TIME_MICRO_FACTOR;

		if ($this->archive) {
			$sqlString = sprintf("INSERT INTO {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} SELECT * FROM {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} WHERE {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_TIME."{$this->dbObj->backQuote} < %s", $this->archiveTable, $this->chatTable, $time);
			$query1 = $this->dbObj->execute($sqlString);
		}

		$sqlString = sprintf("DELETE FROM {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} WHERE {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_CHECKED."{$this->dbObj->backQuote} = '2' OR {$this->dbObj->backQuote}".self::CHAT_FIELD_CHAT_TIME."{$this->dbObj->backQuote} < %s", $this->chatTable, $time);
		$query1 = $this->dbObj->execute($sqlString);

		if ($this->dbObj->affectedRows() > 0) {
			$this->dbObj->vacuum($this->chatTable);
		}

		$sqlString = sprintf("DELETE FROM {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} WHERE {$this->dbObj->backQuote}".Buddy::BUDDY_FIELD_POLL_TIME."{$this->dbObj->backQuote} < %s", $this->chatPollTable, $time);
		$query1 = $this->dbObj->execute($sqlString);

		if ($this->dbObj->affectedRows() > 0) {
			$this->dbObj->vacuum($this->chatPollTable);
		}
	}
}
