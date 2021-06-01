<?php
include_once dirname(__FILE__) . '../../php/load-config.php';
include_once dirname(__FILE__). '../../php/get-params.php';
require_once dirname(__FILE__). '../../lib/MobileDetect/Mobile_Detect.php';

$ini_array = loadConfigFile();
$is_debug = loadConfigOption($ini_array, "debug", "general");
$searchflow_path = loadConfigOption($ini_array, "searchflow_path", "general");
$headstart_path = loadConfigOption($ini_array, "headstart_path", "general");

$detect = new Mobile_Detect;
?>