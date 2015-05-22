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
 * Class handles DB interactions for postgresql
 *
 */
class sqlAbstraction {

	const DB_LOG_PATH = 'lib/logs/';
	const DB_LOG_FILE = 'sqlError.log';

	public $dbmsType = 'pg';
	public $backQuote = "\"";

	private $result;

	private $errorCodeTranslation = array('23505' => '1062');

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
		return "currval('{$table}_id_seq'::regclass)";
	}

	/**
	 * Optimize the table
	 */
	public function vacuum($table) {
		$query = sprintf("VACUUM FULL {$this->backQuote}%s{$this->backQuote}", $table);

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
		$this->dbConnection = pg_connect("host={$this->dbHost} dbname={$this->dbName} user={$this->dbUser} password={$this->dbPass}");

		if (!$this->dbConnection) {
			$this->result = $this->dbConnection;
			$this->_captureError();
		}
	}


	/**
	 * Executes the SQL query
	 *
	 * @param String $query
	 */
	public function execute($query) {
		$this->result = @pg_query($this->dbConnection, $query);

		if (!$this->result) {
			pg_send_query($this->dbConnection, $query);

			$this->result = pg_get_result($this->dbConnection);

			$this->_captureError();

			return false;
		}

		return $this->result;
	}

	/**
	 * Capture and record any query errors.
	 */
	protected function _captureError() {
		if (!$this->result) {
			$errno = 0;
			$error = null;

			return;
		}

		$errno = pg_result_error_field($this->result, PGSQL_DIAG_SQLSTATE);
		$error = pg_result_error_field($this->result, PGSQL_DIAG_MESSAGE_PRIMARY);

		if (isset($this->errorCodeTranslation[$errno])) {
			$errno = $this->errorCodeTranslation[$errno];
		}

		$this->errno = $errno;
		$this->error = $error;

		$errorMessage = date('r')." PostgreSQL Error # $errno\r\n\t $error\r\n";

		error_log($errorMessage, 3, ROOT.self::DB_LOG_PATH.self::DB_LOG_FILE);
	}

	/**
	 * Fetch an associate array per row
	 *
	 * @param Result Identifier $result
	 */
	public function fetchAssoc($result) {
		if ($result) {
			return pg_fetch_assoc($result);
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
			return pg_fetch_row($result);
		}
		return false;
	}

	/**
	 * Number of rows affected by the last INSERT, DELETE or UPDATE
	 *
	 */
	public function affectedRows() {
		return pg_affected_rows($this->result);
	}

	/**
	 * Number of rows SELECTed
	 */
	public function numberOfRows($result) {
		if ($result) {
			return pg_num_rows($result);
		}
		return 0;
	}
}
