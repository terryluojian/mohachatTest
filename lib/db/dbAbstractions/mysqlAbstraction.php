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

/**
 * Class handles DB interactions for mysql
 *
 */
class sqlAbstraction {

	const DB_LOG_PATH = 'lib/logs/';
	const DB_LOG_FILE = 'sqlError.log';

	public $dbmsType = 'mysql';
	public $backQuote = "`";

	private $result;

	/**
	 * Class constructor
	 *
	 */
	public function __construct() {
		//nothing to do
	}

	/**
	 * Class distructor
	 *
	 */
	public function __destruct() {
		//nothing to do
	}

	/**
	 * Query last_insert_id
	 */
	public function lastInsertId($table) {
		return "LAST_INSERT_ID()";
	}

	/**
	 * Optimize the table
	 */
	public function vacuum($table) {
		$query = sprintf("OPTIMIZE TABLE {$this->backQuote}%s{$this->backQuote}", $table);

		$this->result = $this->execute($query);

		return $this->result;
	}

	/**
	 * Set the encoding to utf8
	 *
	 * UTF8 supports characters of all languages
	 */
	protected function _setEncoding() {
		$query_utf = sprintf("SET NAMES utf8;");
		$this->result = $this->execute($query_utf);

		if (!$this->result) {
			$this->_captureError();
		}
	}

	/**
	 * Connect to the database
	 *
	 */
	protected function _connect() {
		$this->dbConnection = mysql_connect($this->dbHost, $this->dbUser, $this->dbPass);

		if (!$this->dbConnection) {
			$this->result = $this->dbConnection;
			$this->_captureError();
		}

		$this->_setEncoding();
		$this->_selectDb();
	}

	/**
	 * Select the database
	 *
	 */
	private function _selectDb() {
		$this->result = mysql_select_db($this->dbName, $this->dbConnection);

		if (!$this->result) {
			$this->_captureError();
		}
	}

	/**
	 * Executes the SQL query
	 *
	 * @param String $query
	 */
	public function execute($query) {
		$this->result = mysql_query($query, $this->dbConnection);

		if (!$this->result) {
			$this->_captureError();

			return false;
		}

		return $this->result;
	}

	/**
	 * Capture and record any query errors.
	 */
	protected function _captureError() {
		$errno = mysql_errno($this->dbConnection);
		$error = mysql_error($this->dbConnection);

		$this->errno = $errno;
		$this->error = $error;

		$errorMessage = date('r')." MySQL Error # $errno\r\n\t $error\r\n";

		error_log($errorMessage, 3, ROOT.self::DB_LOG_PATH.self::DB_LOG_FILE);
	}

	/**
	 * Fetch an associate array per row
	 *
	 * @param Result Identifier $result
	 */
	public function fetchAssoc($result) {
		if ($result) {
			return mysql_fetch_assoc($result);
		}
		return false;
	}

	/**
	 * Fetch an array per row
	 *
	 * @param Result Identifier $result
	 */
	public function fetchRow($result) {
		if ($result) {
			return mysql_fetch_row($result);
		}
		return false;
	}

	/**
	 * Number of rows affected by the last INSERT, DELETE or UPDATE
	 *
	 */
	public function affectedRows() {
		return mysql_affected_rows($this->dbConnection);
	}

	/**
	 * Number of rows SELECTed
	 */
	public function numberOfRows($query) {
		if ($query) {
			return mysql_num_rows($query);
		}
		return 0;
	}
}
