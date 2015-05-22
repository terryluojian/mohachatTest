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

	$passed = true;
	if (version_compare(phpversion(), '5.1.1', 'gt')) {
		$class = 'green';
		$txt = phpversion();
	} else if (version_compare(phpversion(), '5.0.0', 'gt')) {
		$class = 'yellow';
		$txt = phpversion().' (Recommended 5.1.1 or greater)';
	} else {
		$class = 'red';
		$txt = phpversion().' (Should be 5.1.1 or greater)';
		$passed = false;
	}

	$sysCheckRes['PHP version'] = array($class, $txt);

	if (version_compare(mysql_get_client_info(), '4.1.1', 'gt')) {
		$class = 'green';
		$txt = mysql_get_client_info();
	} else if (version_compare(phpversion(), '4.1.0', 'gt')) {
		$class = 'yellow';
		$txt = mysql_get_client_info().' (Recommended 4.1.1 or greater)';
	} else {
		$class = 'red';
		$txt = mysql_get_client_info().' (Should be 4.1.1 or greater)';
		$passed = false;
	}

	$sysCheckRes['MySQL client'] = array($class, $txt);

	if (is_writable('../config/') == 1) {
		$class = 'green';
		$txt = 'Yes';
	} else if (is_writable('../config/') == 0) {
		$class = 'red';
		$txt = 'No';
		$passed = false;
	}

	$sysCheckRes['Configuration file writable'] = array($class, $txt);

	if (is_writable('../files/download/.htaccess') == 1) {
		$class = 'green';
		$txt = 'Yes';
	} else if (is_writable('../files/download/.htaccess') == 0) {
		$class = 'red';
		$txt = 'No';
		$passed = false;
	}

	$sysCheckRes['.htaccess file writable'] = array($class, $txt);

	if (ini_get('session.gc_maxlifetime') >= 1440) {
		$class = 'green';
		$txt = ini_get('session.gc_maxlifetime').'s';
	} else if (ini_get('session.gc_maxlifetime') >= 300) {
		$class = 'yellow';
		$txt = ini_get('session.gc_maxlifetime').'s (Recommended 1440s or greater)';
	} else {
		$class = 'red';
		$txt = ini_get('session.gc_maxlifetime').'s (Should be 1440s or greater)';
		$passed = false;
	}

	$sysCheckRes['Maximum session lifetime'] = array($class, $txt);

	if ($passed) {
		$passed = 'true';
	} else {
		$passed = 'false';
	}
?>

<h1>Pre-requisities</h1>
<p>Please do not proceed if any of the following appear red. If any of the following appear yellow it is possible that your installation of MOHA Chat will not function properly.</p>

<p>
	<ul>
		<?php foreach ($sysCheckRes as $key =>  $currRes) { ?>
		<li class="<?php echo $currRes[0]; ?>"><?php echo "$key : $currRes[1]"; ?></li>
		<?php } ?>
	</ul>
</p>
<script language="javascript">
	passed = <?php echo $passed; ?>;
</script>