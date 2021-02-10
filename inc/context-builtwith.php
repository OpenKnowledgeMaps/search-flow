<?php 
include_once dirname(__FILE__). '../../conf/config.php';
include_once dirname(__FILE__). '../../php/header.php';
?>

<div class="builtwith" id="builtwith">
</div>

<script>
    $("#builtwith").html('<?= $builtwith_string ?>')
</script>
