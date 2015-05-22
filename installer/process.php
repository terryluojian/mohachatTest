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

	if (isset($_REQUEST['q'])) {
		switch($_REQUEST['q']) {
			case 'welcome' : session_destroy();
							 break;
			case 'license' : $_SESSION['page'] = 'license';
							 break;
			case 'preReq' : $_SESSION['page'] = 'preReq';
							 break;
			case 'database': $_SESSION['page'] = 'database';
							 break;
			case 'config' : $_SESSION['page'] = 'config';
							if (isset($_POST['dbHost'])) {
								$_SESSION['dbInfo'] = $_POST;
							}
							 break;
			case 'confirm': $_SESSION['page'] = 'confirm';
							if (isset($_POST['chatTitle'])) {
								$_SESSION['config'] = $_POST;
							}
							 break;
			case 'installing': $_SESSION['page'] = 'installing';
							 break;
			case 'finish' : session_destroy();
							header('Location: ./../');
							exit(0);
							break;
		}

		header('Location: ./');
	}
