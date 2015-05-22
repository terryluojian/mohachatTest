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
 * Builds all SQL query strings involved
 * in the chat
 *
 */
class sql {

	public function __construct() {
		//nothing to do
	}

	public function simpleSelect($selectTable, $selectFileds, $selectConditions=null, $orderBy=null, $order="ASC") {
		$sqlString = "SELECT {$this->_buildList($selectFileds)}
						FROM {$selectTable} ";
		if (isset($selectConditions)) {
			$sqlString .= "WHERE {$this->_buildList($selectFileds, 'AND')} ";
		}
		if (isset($orderBy)) {
			$sqlString .= "ORDER BY {$orderBy} {$order}";
		}

		return $sqlString;
	}

	public function simpleUpdate($updateTable, $updateFields, $updateValues, $updateConditions=null) {
		$sqlString = "UPDATE {$selectTable}
						SET {$this->_buildValueFieldList($updateFields, $updateValues)} ";
		if (isset($updateCondition)) {
			$sqlString .= "WHERE {$this->_buildList($updateCondition, 'AND')}";
		}

		return $sqlString;
	}

	public function simpleInsert($insertTable, $insertValues, $insertFields=null) {
		$sqlString = "INSERT INTO {$insertTable} ";
		if (isset($inserFields)) {
			$sqlString .= "({$this->_buildList($insertFields)}) ";
		}
		$insertValues = $this->_escapeArray($insertValues);
		$sqlString .= "VALUES ({$this->_buildList($insertValues)}) ";

		return $sqlString;
	}

	private function _buildValueFieldList($arrFileds, $arrValues) {
		$sqlString = "";
		if (isset($arrFileds) && is_array($arrFileds) && isset($arrValues) && is_array($arrValues)) {
			for ($i=0; $i<count($arrFileds); $i++) {
				$sqlString .= "{$arrFileds[$i]} = ".mysql_real_escape_string($arrValues[$i]).", ";
			}
			$sqlString = substr($sqlString, 0, -2);
		}

		return "{$sqlString} ";
	}

	private function _escapeArray($arr) {
		foreach ($arr as $key=>$value) {
			$arr[$key] = mysql_real_escape_string($arr);
		}

		return $arr;
	}

	private function _buildList($arrList, $seperator=",") {
		return implode("$seperator ", $arrList);
	}

}
