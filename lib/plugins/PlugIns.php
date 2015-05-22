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

require_once(ROOT.'lib/conf/ini.php');
require_once ROOT."lib/PEAR/HTTP/Request.php";

class PlugIns {

	const PLUGINS_DIR = "plugins/";
	const PLUGINS_DIR_CACHE = "cache/";

	public $result;
	public $info;
	private $time;

	public function __construct() {
		// clean files older than one day from proxy cache works only in *nix
		exec('find '.ROOT.self::PLUGINS_DIR_CACHE.' -type f -mtime +1 -exec rm -f {} \\; &');
	}

	public function loadAllPlugins() {
		$plugIns = null;

		$d = dir(ROOT.self::PLUGINS_DIR);
		while (false !== ($entry = $d->read())) {
		  if (($entry[0] != '.') && is_dir($entry)) {
		  	$plugIns[] = $entry;
		  }
		}
		$d->close();

		return $plugIns;
	}

	public function brokerRequest($url, $life=1800) {
		if (is_file(ROOT.self::PLUGINS_DIR_CACHE.".".urlencode($url).'.cache')) {
			$contents = file_get_contents(ROOT.self::PLUGINS_DIR_CACHE.".".urlencode($url).'.cache');
			$plugInsObj = new PlugIns();
			$plugInsObj = unserialize($contents);

			if ($plugInsObj->time < time()-$life) {
				return $this->fetchURL($url);
			} else {
				$this->result = $plugInsObj->result;
				$this->info = $plugInsObj->info;
			}
		} else {
			return $this->fetchURL($url);
		}

        return true;
	}

	public function fetchURL($url, $cache=true) {

		$ch =& new HTTP_Request($url);

		$ch->addHeader('User-Agent', $_SERVER['HTTP_USER_AGENT']);

		$res = $ch->sendRequest();

		if (PEAR::isError($res)) {
			return false;
		}

		$this->result = $ch->getResponseBody();
		$this->info = $ch->getResponseHeader();

		$this->info['http_code'] = $ch->getResponseCode();
		$this->info['content_type'] = $ch->getResponseHeader('content-type');

        $this->time = time();

        if ($this->info['http_code'] == 200) {
        	if ($cache) {
	        	$contents = serialize($this);
	       		file_put_contents(ROOT.self::PLUGINS_DIR_CACHE.".".urlencode($url).'.cache', $contents);
        	}
			return true;
        }

		return false;
	}

	public function removeUpDir($str) {
		return preg_replace('/[\.]+\.\//', "", $str);
	}
}
