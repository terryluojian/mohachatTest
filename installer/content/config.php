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
<script type="text/javascript" src="scripts/config.js"></script>
<style type="text/css">
#rowForgotPasswordLink, #rowRegisterLink {
	display: none;
}
</style>
<h1>Configuration</h1>
<table border="0" cellspacing="0" cellpadding="5">
  <tr>
    <th>User Interface</th>
  </tr>
  <tr>
    <td>Title </td>
    <td>:</td>
    <td><input name="chatTitle" type="text" id="chatTitle" value="MOHA Chat" /></td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td>Login Link </td>
    <td>:</td>
    <td><input name="loginLink" type="text" id="loginLink" value="login/" /></td>
    <td>relative to MOHA Chat root or absolute URL</td>
  </tr>
  <tr>
    <td>Registration </td>
    <td>:</td>
    <td>
    	<label><input name="registration" type="radio" id="registration" value="0" checked="checked" onchange="swapRegtype();"  onclick="swapRegtype();"/> Internal </lable>
    	<label><input name="registration" type="radio" id="registration" value="1" onchange="swapRegtype();" onclick="swapRegtype();"/> External </lable>
    </td>
    <td>Select external if you want to use your own registration page</td>
  </tr>
  <tr id="rowForgotPasswordLink">
    <td>Forgot Password Link </td>
    <td>:</td>
    <td><input name="forgotPasswordLink" type="text" id="forgotPasswordLink" value="/login/forgot" /></td>
    <td>relative to MOHA Chat root or absolute URL</td>
  </tr>
  <tr id="rowRegisterLink">
    <td>Register Link </td>
    <td>:</td>
    <td><input name="registerLink" type="text" id="registerLink" value="/signup" /></td>
    <td>relative to MOHA Chat root or absolute URL</td>
  </tr>
   <tr>
    <th>Other</th>
  </tr>
  <tr>
    <td>Archive </td>
    <td>:</td>
    <td><input name="archive" type="checkbox" id="archive" value="true" /></td>
    <td>&nbsp;</td>
  </tr>
</table>

