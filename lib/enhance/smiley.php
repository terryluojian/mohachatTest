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

class smiley {

	/**
	 * Class constants
	 *
	 */

	public $smileyDataFile = 'lib/enhance/smiley.in';


	public function __construct() {

		$filename = ROOT.$this->smileyDataFile;
		$handle = fopen($filename, 'r');

		$content = fread($handle, filesize($filename));

		fclose($handle);

		$lines = preg_split('/\n/', $content);

		for ($i=0; $i<count($lines); $i++) {
			$line = preg_split('/,/', $lines[$i]);

			$smileys[0][trim($line[0])] = trim($line[1]);
			$smileys[1][trim($line[0])] = rawurlencode(trim(preg_replace('/"/', "", $line[2])));
		}

		$this->smileys = $smileys;
	}

	public function buildJavaScript() {

		$imgArr = $this->smileys[0];
		$nameArr = $this->smileys[1];
		$keys = array_keys($imgArr);

		if (is_array($keys)) {
			$outStr = "var smiley = { ";
			$i = 0;
			foreach ($keys as $key) {
				$outStr .= $imgArr[$key].":{key:'".$key."',rep:'".$nameArr[$key]."'}, ";
				$i++;
			}

			$outStr = substr($outStr, 0, -2);

			$outStr .= "};";
		} else {
			$outStr = "";
		}

		return $outStr;
	}

}
