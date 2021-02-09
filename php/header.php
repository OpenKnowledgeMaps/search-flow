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
<link rel="stylesheet" href="<?php echo $searchflow_path ?>css/search-flow.css">
<script type="text/javascript" src="<?= $searchflow_path ?>lib/browser-detect.js"></script>
<script>
    var browser = BrowserDetect.browser;
    var is_supported_browser = false;
    if ((browser === "Firefox" || browser === "Safari" || browser === "Chrome")) {
        is_supported_browser = true;
    }
</script>