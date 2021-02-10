<?php 
include_once dirname(__FILE__). '../../conf/config.php';
include_once dirname(__FILE__). '../../php/header.php';

if ($detect->isMobile()): 
?>

    <div class="alert alert-warning" id="desktop-warning">

        <a class="close" data-dismiss="alert">&times;</a>

        <span id="mobile-notice-text"></span>

    </div>

<?php endif; ?>

<script>
    $('#mobile-notice-text').html(search_flow_config.banner_texts.mobile_warning);
</script>
