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

/**
 * Solely concerned with hashing the password string with
 * any desired algo or custom function.
 *
 * If custom function, please have it in here and set
 * pwAlgo variable in the configuration file to to
 * $this->yourFunctionName.
 */
class PWSecurity {

	private $pwAlgo;

	public function __construct() {
		$confObj = new conf();

		$this->pwAlgo = $confObj->pwAlgo;
	}

	/**
	 * Work horse function which does the hashing
	 *
	 * @param String Password in plain text
	 */
	public function cryptPW($plain) {
		return eval("return {$this->pwAlgo}(".'$plain'.");");
	}
}
