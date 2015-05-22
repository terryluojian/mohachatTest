<?php

/**
 * Configuration class
 *
 */
class conf {

	/**
	 * Class atributes
	 *
	 */

	private $dbHost;
	private	$dbName;
	private	$dbUser;
	private	$dbPass;
	private $version = '0.1.1';
	private	$title;

	private $registration;
	private $regLink;
	private $forgotPWDLink;
	private $longinLink;

	public $usersTable;
	public $usernameField;
	public $passwordField;

	public $loaded = false;

	public $pwAlgo;

	public $tablePrefix;

	public $dbms='mysql';

	private $archive;

	/**
	 * Fetch DB host
	 *
	 * @return String
	 */
	public function getDbHost() {
		return $this->dbHost;
	}

	/**
	 * Fetch DB name
	 *
	 * @return String
	 */
	public function getDbName() {
		return $this->dbName;
	}

	/**
	 * Fetch DB user
	 *
	 * @return String
	 */
	public function getDbUser() {
		return $this->dbUser;
	}

	/**
	 * Fetch DB password
	 *
	 * @return String
	 */
	public function getDbPass() {
		return $this->dbPass;
	}

	/**
	 * Fetch version
	 *
	 * @return String
	 */
	public function getVersion() {
		return $this->version;
	}

	/**
	 * Fetch title
	 *
	 * @return String
	 */
	public function getTitle() {
		return $this->title;
	}

	/**
	 * Fetch forgotPWDLink
	 *
	 * @return String
	 */
	public function getForgotPWDLink() {
		return $this->forgotPWDLink;
	}

	/**
	 * Fetch registration
	 *
	 * @return String
	 */
	public function getRegistration() {
		return $this->registration;
	}

	/**
	 * Fetch regLink
	 *
	 * @return String
	 */
	public function getRegLink() {
		return $this->regLink;
	}

	/**
	 * Fetch loginLink
	 *
	 * @return String
	 */
	public function getLoginLink() {
		return $this->loginLink;
	}

	/**
	 * Fetch archive flag
	 *
	 * @return boolean
	 */
	public function getArchive() {
		return $this->archive;
	}

	/**
	 * Sets the DB host
	 *
	 * @param String $dbHost
	 */
	public function setDbHost($dbHost) {
		$this->dbHost = $dbHost;
	}

	/**
	 * Sets the DB name
	 *
	 * @param String $dbName
	 */
	public function setDbName($dbName) {
		$this->dbName = $dbName;
	}

	/**
	 * Sets the DB user
	 *
	 * @param String $dbUser
	 */
	public function setDbUser($dbUser) {
		$this->dbUser = $dbUser;
	}

	/**
	 * Sets the DB pass
	 *
	 * @param String $dbPass
	 */
	public function setDbPass($dbPass) {
		$this->dbPass = $dbPass;
	}

	/**
	 * Sets the Title
	 *
	 * @param String $dbPass
	 */
	public function setTitle($title) {
		$this->title = $title;
	}

	/**
	 * Sets the forgotPWDLink
	 *
	 * @param String $forgotPWDLink;
	 */
	public function setForgotPWDLink($forgotPWDLink) {
		$this->forgotPWDLink = $forgotPWDLink;
	}

	/**
	 * Sets the regLink;
	 *
	 * @param String $regLink
	 */
	public function setRegLink($regLink) {
		$this->regLink = $regLink;
	}


	/**
	 * Sets the registration;
	 *
	 * @param String $registration
	 */
	public function setRegistration($registration) {
		$this->registration = $registration;
	}

	/**
	 * Set login link;
	 *
	 * @param String $loginLink
	 */
	public function setLoginLink($loginLink) {
		$this->loginLink = $loginLink;
	}

	/**
	 * Set archive flag;
	 *
	 * @param boolean $archive
	 */
	public function setArchive($archive) {
		$this->archive = $archive;
	}

	/**
	 * Class constructor
	 *
	 */
	public function __construct($modifier="./") {

		if (@include(ROOT.'/config/configuration.php')) {

			$this->loaded = true;

			$this->setDbHost($databaseHost);
			$this->setDbName($databaseName);
			$this->setDbUser($databaseUser);
			$this->setDbPass($databasePassword);

			$this->setTitle($title);

			$this->setForgotPWDLink($forgotPasswordLink);
			$this->setRegLink($registerLink);
			$this->setLoginLink($loginLink);

			$this->setRegistration($registration);

			$this->setArchive($archive);

			$this->usersTable = $usersTable;
			$this->usernameField = $usernameField;
			$this->passwordField = $passwordField ;

			$this->tablePrefix = $tablePrefix;

			$this->pwAlgo = $pwAlgo;

			$this->dbms = $dbms;

		} else {
			$this->_unavailable($modifier);
			exit(0);
		}
	}

	private function _unavailable($modifier) {
		header('HTTP/1.1 307 Temporary Redirect');
		header('Location: '.$modifier.'unavailable.html');
	}
}
