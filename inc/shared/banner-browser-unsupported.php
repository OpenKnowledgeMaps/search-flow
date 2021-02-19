<?php
include_once dirname(__FILE__). '../../../conf/config.php';
include_once dirname(__FILE__). '../../../php/header.php';
?>

<div class="alert alert-warning" id="desktop-warning" style="display:none">

    <a class="close" data-dismiss="alert">&times;</a>
    <span id="browser-warning-text"></span>
</div>

<script>
    $('#browser-warning-text').html(search_flow_config.banner_texts.browser_unsupported_warning);
    
    if (!is_supported_browser) {
            $("#desktop-warning").css("display", "block");
    }
</script>