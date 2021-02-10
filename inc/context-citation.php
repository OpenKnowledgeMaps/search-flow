<?php
include_once dirname(__FILE__). '../../conf/config.php';
include_once dirname(__FILE__). '../../php/header.php';
?>

<div class="cite-map">
    <p id="citation-intro">
    <div class="citation">
        <?php echo $citation ?>
    </div>
</div>

<script>
$("#citation-intro").html(search_flow_config.context_texts.citation_intro);
</script>
