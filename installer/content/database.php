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
<script type="text/javascript" src="scripts/yahoo-min.js"></script>
<script type="text/javascript" src="scripts/connection-min.js"></script>
<script type="text/javascript" src="scripts/database.js"></script>
<h1>Database Configuration</h1>
<table border="0" cellspacing="0" cellpadding="5">
  <tr class="dbInfo">
    <th>Database information</th>
  </tr>
  <tr class="dbInfo">
    <td>Database Server(DBMS) </td>
    <td>:</td>
    <td>
    	<select name="dbX" id="dbX">
    		<option value="mysql" selected >MySQL</option>
    		<option value="pg">PostgreSQL</option>
    	</select>
    </td>
    <td>&nbsp;</td>
  </tr>
  <tr class="dbInfo">
    <td>Database Host </td>
    <td>:</td>
    <td><input name="dbHost" type="text" id="dbHost" value="localhost" /></td>
    <td>&nbsp;</td>
  </tr>
  <tr class="dbInfo">
    <td>Database name </td>
    <td>:</td>
    <td><input name="databaseName" type="text" id="databaseName" value="moha_chat" /></td>
    <td><label><input name="createDatabase" type="checkbox" id="createDatabase" value="1" onchange="checkBoxChk(event);"  onclick="checkBoxChk(event);" />
      Create </label></td>
  </tr>
  <tr class="dbInfo">
    <td>Table prefix </td>
    <td>:</td>
    <td><input name="tablePrefix" type="text" id="tablePrefix" value="mh_ch_" /></td>
    <td id="dbInfoErr">&nbsp;</td>
  </tr>
  <tr class="dbUser">
   <th>Database user</th>
  </tr>
  <tr class="dbUser">
    <td>Username</td>
    <td>:</td>
    <td><input name="dbUsername" type="text" id="dbUsername" value="mohachat" /></td>
    <td><label><input name="createDBUser" type="checkbox" id="createDBUser" value="1" onchange="checkBoxChk(event);"  onclick="checkBoxChk(event);"/>
      Create </label></td>
  </tr>
  <tr class="dbUser">
    <td>Password</td>
    <td>:</td>
    <td><input name="dbPassword" type="password" id="dbPassword" /></td>
    <td id="dbErr">&nbsp;</td>
  </tr>
  <tr class="privilegedUser">
    <th>Privileged user</th>
	<th></th>
	<th><label><input name="notPrivileged" type="checkbox" id="notPrivileged" value="1" onchange="checkBoxChk(event);"  onclick="checkBoxChk(event);" /> Don't have</label></th>
  </tr>
  <tr class="privilegedUser">
    <td>Username</td>
    <td>:</td>
    <td><input name="privilegedUsername" type="text" id="privilegedUsername" value="root" /></td>
    <td>&nbsp;</td>
  </tr>
  <tr class="privilegedUser">
    <td>Password</td>
    <td>:</td>
    <td><input name="privilegedPassword" type="password" id="privilegedPassword" /></td>
    <td id="privErr">&nbsp;</td>
  </tr>
  <tr class="userTable">
   <th>User table</th>
   <th></th>
   <th><input name="noUsertable" type="hidden" id="noUsertable" value="0" onchange="checkBoxChk(event);"  onclick="checkBoxChk(event);" />
     </th>
  </tr>
  <tr class="userTable">
    <td>Table name </td>
    <td>:</td>
    <td><input name="userTable" type="text" id="userTable" value="users" /></td>
    <td>For tables in other databases use <code>database_name.table_name</code>
		<br />
	 <b>Please note : </b>You need to have privileges to access the other database.</td>
  </tr>
  <tr class="userTable">
    <td>Username field </td>
    <td>:</td>
    <td><input name="userNameField" type="text" id="userNameField" value="Username" /></td>
    <td>&nbsp;</td>
  </tr>
  <tr class="userTable">
    <td>Password field </td>
    <td>:</td>
    <td><input name="passwordField" type="text" id="passwordField" value="Password" /></td>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
    <td><input name="testDB" type="button" id="testDB" value="Test" onclick="test();"/>
    <input name="cancelTest" type="button" id="cancelTest" value="Cancel" disabled="disabled" onclick="finishTest();"/></td>
    <td>&nbsp;</td>
  </tr>
</table>
<script language="javascript">
	passed=false;
</script>
