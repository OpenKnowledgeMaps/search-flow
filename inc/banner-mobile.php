<?php 
include_once dirname(__FILE__). '../../conf/config.php';
include_once dirname(__FILE__). '../../php/header.php';

if ($detect->isMobile() || $search_flow_config["banner_alternate_desktop_warning"]): 
?>

    <div class="alert alert-warning" id="desktop-warning">

        <a class="close" data-dismiss="alert">&times;</a>

        <span id="mobile-notice-text"></span>

    </div>

<?php endif; ?>

<script>
    <?php if ($detect->isMobile()): ?>
        $('#mobile-notice-text').html(search_flow_config.banner_texts.mobile_warning);
    <?php elseif ($search_flow_config["banner_alternate_desktop_warning"]): ?>
        $('#mobile-notice-text').html(search_flow_config.banner_texts.alternate_desktop_warning);
    <?php endif; ?>
</script>
