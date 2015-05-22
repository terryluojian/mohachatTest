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

?>
<h1>License</h1>
<textarea name="license" readonly="true" rows="30" cols="75">
<?php include_once('../LICENSE.TXT'); ?>
</textarea>
<?php

?>
<p>
	<label><input name="licenseResp" id="licenseResp" type="radio" value="accept" onchange="enableX();" onclick="enableX();" /> I accept the license</label>
	<label><input name="licenseResp" id="licenseResp"  type="radio" value="decline" onchange="enableX();" onclick="enableX();" /> Decline</label>
</p>

<script language="javascript">
function validate () {
	if (getRadioGroup("licenseResp").value == 'decline') {
		$('q').value = 'declined';
	}

	return true;
}

function enableX() {
	$('next').disabled = false;
	if (getRadioGroup("licenseResp").value == 'decline') {
		$('next').disabled = true;
	}
}

passed = false;
</script>

