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

require_once(ROOT.'lib/conf/conf.php');

$confObj = new conf();

require_once(ROOT."lib/db/dbAbstractions/{$confObj->dbms}Abstraction.php");

/**
 * Class handles DB connection
 *
 */
class DB extends sqlAbstraction {

	const DB_LOG_PATH = 'lib/logs/';
	const DB_LOG_FILE = 'sqlError.log';

	public $tablePrefix;
	public $errno;
	public $error;

	protected $dbConnection=null;

	protected $dbHost;
	protected $dbUser;
	protected $dbPass;
	protected $dbName;

	/**
	 * Get the DB connection
	 *
	 * @return Resource Id
	 */
	public function getDbConnection() {
		return $this->dbConnection;
	}

	/**
	 * Sets the DB Connection
	 *
	 * @param Resource Id $dbConnection
	 */
	public function setDbConnection($dbConnection) {
		$this->dbConnection = $dbConnection;
	}

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
		$this->setDbConnection(null);
	}

	/**
	 * Connects to the DB
	 *
	 * @return Resource Id
	 */
	public function dbConn() {

		$confObj = new conf();

		$this->dbHost = $confObj->getDbHost();
		$this->dbUser = $confObj->getDbUser();
		$this->dbPass = $confObj->getDbPass();
		$this->dbName = $confObj->getDbName();

		$dbConnection = $this->_connect();

		$this->tablePrefix = $confObj->tablePrefix;

		return 	$dbConnection;
	}
}
