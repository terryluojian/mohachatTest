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
<h1>Confirm</h1>
<p>Please confirm that the following details are correct. When you press <b>[Next]</b> installation will start.</p>
<table border="0" cellspacing="0" cellpadding="5">
  <tr class="dbInfo">
    <th>Database information</th>
  </tr>
  <tr class="dbInfo">
    <td>Database Host </td>
    <td>:</td>
    <td><?php echo $_SESSION['dbInfo']['dbHost']?></td>
  </tr>
  <tr class="dbInfo">
    <td>Database name </td>
    <td>:</td>
    <td><?php echo $_SESSION['dbInfo']['databaseName']?></td>
  </tr>
  <tr class="dbInfo">
    <td>Table prefix </td>
    <td>:</td>
    <td><?php echo $_SESSION['dbInfo']['tablePrefix']?></td>
  </tr>
  <tr class="dbUser">
   <th>Database user</th>
  </tr>
  <tr class="dbUser">
    <td>Username</td>
    <td>:</td>
    <td><?php echo $_SESSION['dbInfo']['dbUsername']?></td>
  </tr>
<?php
	if (!(isset($_SESSION['dbInfo']['notPrivileged']) && ($_SESSION['dbInfo']['notPrivileged'] == 1))) {
?>
  <tr class="privilegedUser">
    <th>Privileged user</th>
	<th></th>
	<th></th>
  </tr>
  <tr class="privilegedUser">
    <td>Username</td>
    <td>:</td>
    <td><?php echo $_SESSION['dbInfo']['privilegedUsername']?></td>
  </tr>
<?php
	}
	if (!(isset($_SESSION['dbInfo']['noUsertable']) && ($_SESSION['dbInfo']['noUsertable'] == 1))) {
?>
  <tr class="userTable">
   <th>User table</th>
   <th></th>
   <th></th>
  </tr>
  <tr class="userTable">
    <td>Table name </td>
    <td>:</td>
    <td><?php echo $_SESSION['dbInfo']['userTable']?></td>
  </tr>
  <tr class="userTable">
    <td>Username field </td>
    <td>:</td>
    <td><?php echo $_SESSION['dbInfo']['userNameField']?></td>
  </tr>
  <tr class="userTable">
    <td>Password field </td>
    <td>:</td>
    <td><?php echo $_SESSION['dbInfo']['passwordField']?></td>
  </tr>
<?php } ?>
  <tr>
    <th>User Interface</th>
  </tr>
  <tr>
    <td>Title </td>
    <td>:</td>
    <td><?php echo $_SESSION['config']['chatTitle']?></td>
  </tr>
  <tr>
    <td>Login Link </td>
    <td>:</td>
    <td><?php echo $_SESSION['config']['loginLink']?></td>
  </tr>
  <tr>
    <td>Registration </td>
    <td>:</td>
    <td><?php echo ($_SESSION['config']['registration'] == 0)?'Internal':'External'; ?></td>
  </tr>
  <?php if ($_SESSION['config']['registration'] == 1) { ?>
  <tr>
    <td>Forgot Password Link </td>
    <td>:</td>
    <td><?php echo $_SESSION['config']['forgotPasswordLink']?></td>
  </tr>
  <tr>
    <td>Register Link </td>
    <td>:</td>
    <td><?php echo $_SESSION['config']['registerLink']?></td>
  </tr>
  <?php } ?>
   <tr>
    <th>Other</th>
  </tr>
  <tr>
    <td>Archive </td>
    <td>:</td>
    <td><?php echo ($_SESSION['config']['archive'] == true)? 'Yes' : 'No'; ?></td>
  </tr>
</table>
