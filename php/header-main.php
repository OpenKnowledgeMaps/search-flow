<!-- Requires header-head.php -->

<link rel="stylesheet" href="<?php echo $searchflow_path ?>css/search-flow.css">
<script type="text/javascript" src="<?= $searchflow_path ?>lib/browser-detect.js"></script>
<script>
    var browser = BrowserDetect.browser;
    var is_supported_browser = false;
    if ((browser === "Firefox" || browser === "Safari" || browser === "Chrome")) {
        is_supported_browser = true;
    }
</script>

