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

header("Content-Type:text/xml");
?>
<dbCheck>
	<connection authType="<?php echo $authType; ?>"><?php echo ($connected)? 'done' : rawurlencode($connErr); ?></connection>
	<database modify="<?php echo $dbSelected; ?>"><?php echo (isset($selectErr) && !empty($selectErr))?rawurlencode($selectErr):'done'; ?></database>
	<users modify="<?php echo $createUser; ?>"><?php echo ($user)? 'done' : 'No privilege to create user'; ?></users>
	<tables><?php echo ($tables)? 'done' : 'No privilege to create tables'; ?></tables>
</dbCheck>