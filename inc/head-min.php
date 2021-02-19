<?php
include_once dirname(__FILE__) . '../../php/load-config.php';

$ini_array = loadConfigFile();
$is_debug = loadConfigOption($ini_array, "debug", "general");
$searchflow_path = loadConfigOption($ini_array, "searchflow_path", "general");

$LIB_PATH = $searchflow_path . "lib/";
?>

<link rel="stylesheet" href="<?php echo $LIB_PATH ?>font-awesome.min.css" >
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<link rel="stylesheet" href="<?php echo $LIB_PATH ?>bootstrap.min.css">