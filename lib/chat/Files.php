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

/**
 * Manages chat at persistent layer
 *
 */
class Files {

	/**
	 * Field names of the file upload table
	 */
	const FILES_FIELD_UP_ID = 'id';
	const FILES_FIELD_UP_NAME = 'name';
	const FILES_FIELD_UP_FROM = 'from';
	const FILES_FIELD_UP_MIME = 'mime';
	const FILES_FIELD_UP_SIZE = 'size';

	/**
	 * Field names of the file table
	 */
	const FILES_FIELD_FILE_CONTENT = 'content';
	const FILES_FIELD_FILE_ID = 'id';
	const FILES_FIELD_FILE_PART = 'part';

	public $conn = null;
	public $from = null;

	public $fileTable;
	public $fileArchiveTable;

	public $dbObj = null;

	public function __construct($from) {

		$dbClass = new DB();

		$dbClass->dbConn();

		$this->dbObj = $dbClass;

		$conn = $dbClass->getDbConnection();

		$this->conn = $conn;
		$this->from = $from;

		if (!defined('PREFIX')) {
			define('PREFIX', $dbClass->tablePrefix);
		}

		$this->fileTable = PREFIX."chat_moha_file_up";
		$this->fileArchiveTable = PREFIX."chat_moha_file_hist";
	}

	/**
	 * Upload file
	 *
	 * @param mixed $file
	 * @return boolean
	 */
	public function upload($fileArr) {

		if (is_uploaded_file($fileArr['tmp_name'])) {
			$content = base64_encode(gzdeflate(file_get_contents($fileArr['tmp_name']), 9));
			$name = preg_replace('/ /', "_", html_entity_decode($fileArr['name'], ENT_COMPAT, 'UTF-8'));
			$mime = $fileArr['type'];
			$size = $fileArr['size'];

			if ($size > 0) {
				$sqlString = sprintf("INSERT INTO {$this->dbObj->backQuote}%s{$this->dbObj->backQuote}  ({$this->dbObj->backQuote}".self::FILES_FIELD_UP_NAME."{$this->dbObj->backQuote} , {$this->dbObj->backQuote}".self::FILES_FIELD_UP_FROM."{$this->dbObj->backQuote}, {$this->dbObj->backQuote}".self::FILES_FIELD_UP_MIME."{$this->dbObj->backQuote}, {$this->dbObj->backQuote}".self::FILES_FIELD_UP_SIZE."{$this->dbObj->backQuote}) VALUES ('%s', '%s', '%s', '%s')", $this->fileTable, $name, $this->from, $mime, $size);

				$query = $this->dbObj->execute($sqlString);

				if ($query) {

					$sqlString = sprintf("SELECT {$this->dbObj->backQuote}".self::FILES_FIELD_UP_ID."{$this->dbObj->backQuote}, {$this->dbObj->backQuote}".self::FILES_FIELD_UP_NAME."{$this->dbObj->backQuote} FROM {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} WHERE {$this->dbObj->backQuote}".self::FILES_FIELD_UP_ID."{$this->dbObj->backQuote} = %s", $this->fileTable, $this->dbObj->lastInsertId($this->fileTable));

					$query = $this->dbObj->execute($sqlString);

					$row = $this->dbObj->fetchRow($query);

					$contents = str_split($content, 1047000);

					for ($i=0; $i < count($contents); $i++) {
						$content = $contents[$i];
						$sqlString = sprintf("INSERT INTO {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} ({$this->dbObj->backQuote}".self::FILES_FIELD_FILE_CONTENT."{$this->dbObj->backQuote}, {$this->dbObj->backQuote}".self::FILES_FIELD_FILE_ID."{$this->dbObj->backQuote}, {$this->dbObj->backQuote}".self::FILES_FIELD_FILE_PART."{$this->dbObj->backQuote}) VALUES ('%s', %s, %s)", $this->fileArchiveTable, $content, $row[0], $i);
						$query = $this->dbObj->execute($sqlString);

						if (!$query) {
							//echo $sqlString;
							return false;
						}
					}

					return $row;
				}
			}
		}

		return false;
	}

	public function download($id, $name) {

		$sqlString = sprintf("SELECT * FROM {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} WHERE {$this->dbObj->backQuote}".self::FILES_FIELD_UP_ID."{$this->dbObj->backQuote} = %s AND {$this->dbObj->backQuote}".self::FILES_FIELD_UP_NAME."{$this->dbObj->backQuote} = '%s' LIMIT 1", $this->fileTable, $id, $name);

		$query = $this->dbObj->execute($sqlString);

		if ($query && ($this->dbObj->numberOfRows($query) > 0)) {
			$row = $this->dbObj->fetchAssoc($query);

			header("Expires: 0");
			header("Content-Type: ".$row[self::FILES_FIELD_UP_MIME]);
			header("Content-Disposition: attachment; filename={$row[self::FILES_FIELD_UP_NAME]};");
			header("Content-Length: ".$row[self::FILES_FIELD_UP_SIZE]);

			$sqlString = sprintf("SELECT {$this->dbObj->backQuote}".self::FILES_FIELD_FILE_CONTENT."{$this->dbObj->backQuote} FROM {$this->dbObj->backQuote}%s{$this->dbObj->backQuote} WHERE {$this->dbObj->backQuote}".self::FILES_FIELD_FILE_ID."{$this->dbObj->backQuote} = %s ORDER BY {$this->dbObj->backQuote}".self::FILES_FIELD_FILE_PART."{$this->dbObj->backQuote} ASC", $this->fileArchiveTable, $id);

			$query = $this->dbObj->execute($sqlString);
			$content = "";

			while ($row = $this->dbObj->fetchAssoc($query)) {
				$content .= base64_decode($row[self::FILES_FIELD_FILE_CONTENT]);
			}

			$cont = gzinflate($content);

			if ($cont) {
				echo $cont;
			}
		} else {
			header("HTTP/1.1 404 Not Found");
			exit();
		}
	}
}
