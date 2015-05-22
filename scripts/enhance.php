<?php

ob_start();

$root = realpath(dirname(__FILE__)."/../")."/";
define('ROOT', $root, 1);

require_once ROOT."lib/enhance/enhance.php";
require_once ROOT."lib/enhance/smiley.php";
require_once ROOT."lib/enhance/Themes.php";
require_once ROOT."lib/conf/conf.php";

$obj = new smiley();

echo $obj->buildJavaScript();

$obj = new Enhance();
$objConf = new Conf();
$objTheme = new Themes();

echo $obj->buildInfoPages();

echo 'upload_max_filesize = "'.ini_get('upload_max_filesize').'";';

echo 'var docTitle = "'.$objConf->getTitle().'";';

echo "theme = '{$objTheme->getTheme()}';";

echo "updateProgress('scripts/enhance.php');";

ob_flush();

?>