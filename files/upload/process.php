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

	$root = realpath(dirname(__FILE__)."/../../")."/";
	define('ROOT', $root, 1);

	require_once ROOT.'lib/chat/Files.php';
	require_once ROOT.'lib/chat/Chat.php';

	function failure($error="") {
?>
		<h3>Upload Failed</h3>
<?php
		echo mysql_error().'<br/>';
		echo $error.'<br/>';

		exit(0);
	}

	$fileObj = new Files($_COOKIE['user']);

	if (isset($_FILES['file'])) {
		$file = $fileObj->upload($_FILES['file']);
	} else {
		failure("File too big or no file selected");
	}

	if ($file) {
		$objChat = new Chat();

		$time = microtime(true)*100;
		$message = "file{get:".$file[0].",name:".preg_replace('/ /', "_", $_FILES['file']['name'])."};";
		$to = $_POST['to'];
		$from = $_COOKIE['user'];

?>
<link href="../css/upload.css" rel="stylesheet" type="text/css" />
<h3>Sending the file</h3>
<script language="javascript">
if (opener) {
	obj = opener.document.getElementById('<?php echo $to;?>').message;

	obj.value =  "<?php echo $message; ?>";
	opener.messageObj.addMessageToQue(obj);
} else {
	alert('Filed to send file.');
}

window.close();
//parent.fileObj.hide('<?php echo $to;?>');
</script>
<?php
		//}
	} else {
		failure("Couldn't upload");
	}
