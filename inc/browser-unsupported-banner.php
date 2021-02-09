<?php
include_once dirname(__FILE__). '../../conf/config.php';
include_once dirname(__FILE__). '../../php/header.php';
?>

<div class="alert alert-warning" id="desktop-warning" style="display:none">

    <a class="close" data-dismiss="alert">&times;</a>

    You are using <strong>an unsupported browser</strong>. This website was successfully tested 
    with the latest versions of <strong>Firefox, Chrome, Safari, Opera, and Edge</strong>.
    We strongly suggest <strong>to switch to one of the supported browsers.</strong>

</div>

<script>
    if (!is_supported_browser) {
            $("#desktop-warning").css("display", "block");
    }
</script>