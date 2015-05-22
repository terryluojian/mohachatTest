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

class Enhance {

	/**
	 * Class constants
	 */

	public $mapFile = 'info.map';
	public $path	= 'info/';

	public function __construct() {

		$this->path = ROOT.$this->path;

		$cont = file_get_contents($this->path."/".$this->mapFile);

		$lines = preg_split('/\n/', $cont);

		for ($i=0; $i<count($lines); $i++) {
			$line = preg_split('/,/', $lines[$i]);

			$files[$line[0]] = array('title' => trim($line[1]), 'icon' => trim($line[2]), 'content' => trim($line[3]));
		}

		$this->files = $files;
	}

	public function buildInfoPages() {

		$infoPages = null;

		foreach ($this->files as $item => $cont) {
			$infoPages[] = $this->_buildInfoPage($item);
		}

		if (is_array($infoPages)) {
			return implode("\n", $infoPages);
		}

		return false;
	}

	private function _buildInfoPage($item) {
		$files = $this->files;

		$file = $files[$item];

		$str = rawurlencode(file_get_contents($this->path."/".$file['content']));

		$infoPage = "var info_$item={title:'{$file['title']}',icon:'{$file['icon']}',content:'$str'};";

		return $infoPage;
	}
}
