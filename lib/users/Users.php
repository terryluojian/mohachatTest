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
require_once(ROOT.'lib/conf/conf.php');
require_once(ROOT.'lib/users/PWSecurity.php');

class Users{

	public $usersTable;
	public $usernameField;
	public $passwordField;
	public $error = false;

	public $dbObj = null;

	public function __construct() {
		$confObj = new conf();

		$this->usersTable = $confObj->usersTable;
		$this->usernameField = $confObj->usernameField;
		$this->passwordField = $confObj->passwordField;

		$dbClass = new DB();

		$dbClass->dbConn();

		$this->dbObj = $dbClass;
	}

	public function getUser($user, $password) {

		$sqlString = sprintf("SELECT * FROM %s WHERE {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} = '%s' AND {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} = '%s' LIMIT 1", $this->usersTable, $this->usernameField, $user, $this->passwordField, $password);

		$query = $this->dbObj->execute($sqlString);

		if (!$query) {
			$this->error = $this->dbObj->error;

			return false;
		}

		if ($row = $this->dbObj->fetchAssoc($query)) {
			return $row;
		} else {
			return false;
		};
	}

	public function getUID($user) {

		$sqlString = sprintf("SELECT * FROM %s WHERE {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} = '%s' ", $this->usersTable, $this->usernameField, $user);

		$query = $this->dbObj->execute($sqlString);

		if ($row = $this->dbObj->fetchAssoc($query)) {
			return true;
		} else {
			return false;
		};
	}

	public function authenticate($user, $password) {
		$objPWSecurity = new PWSecurity();

		$password = $objPWSecurity->cryptPW($password);
		$userExist = $this->getUser($user, $password);

		if ($userExist) {
			setcookie('valid', md5($_SERVER['REMOTE_ADDR']), (time()+86400), '/');
			setcookie('user', $userExist[$this->usernameField], (time()+86400), '/');
			return true;
		} else {
			setcookie('valid', '', time()-3600, '/');
			setcookie('user', '', time()-3600, '/');
			return false;
		};

	}

	public function register($user, $password) {
		$objPWSecurity = new PWSecurity();

		$password = $objPWSecurity->cryptPW($password);

		$sqlString = sprintf("INSERT INTO %s ({$this->dbObj->backQuote}%s{$this->dbObj->backQuote}, {$this->dbObj->backQuote}%s{$this->dbObj->backQuote}) VALUES ('%s', '%s');", $this->usersTable, $this->usernameField, $this->passwordField, $user, $password);

		$query = $this->dbObj->execute($sqlString);

		if ($query) {
			return true;
		} else {
			if ($this->dbObj->errno == 1062) {
				$this->error = "Username already exsist";
			}
			return false;
		}
	}
}
