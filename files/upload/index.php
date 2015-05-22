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
 
function return_bytes($val) {
   $val = trim($val);
   $last = strtolower($val{strlen($val)-1});
   switch($last) {
       // The 'G' modifier is available since PHP 5.1.0
       case 'g':
           $val *= 1024;
       case 'm':
           $val *= 1024;
       case 'k':
           $val *= 1024;
   }

   return $val;
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<title>Upload Files</title>
<link href="../css/upload.css" rel="stylesheet" type="text/css" />

<link href="../../images/disk.png" rel="icon" type="image/png" />
</head>
<script language="javascript">
function upload() {
	if (document.getElementById('to').value == "") {
		alert('Please close this window and try again');
	}
	
	if (document.getElementById('fiel').value == "") {
		alert('Please select a file to continue');
		
		return false;
	}
	
	document.getElementById("Submit").disabled = "disabled";
	document.getElementById("fiel").readonly = "readonly";	
}
</script>
<body>
<h3>Choose File To Send</h3>
<form id="uploadFile" enctype="multipart/form-data" method="post" action="process.php" onsubmit="return upload();">
  <input type="hidden" name="MAX_FILE_SIZE" value="<?php echo return_bytes(ini_get('upload_max_filesize')); ?>" />
  <input type="file" name="file" id="fiel"/>
  <input type="submit" id="Submit" value="Send" />
  <input type="hidden" id="to" name="to" value="<?php echo $_REQUEST['to']; ?>"/>[<?php echo ini_get('upload_max_filesize'); ?> Max]
</form>
<script language="javascript">
//document.getElementById('to').value = window['to'];
</script>
</body>
</html>
