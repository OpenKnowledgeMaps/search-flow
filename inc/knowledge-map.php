<!DOCTYPE html>
<?php
include '../lib/load-config.php';
include '../lib/get-params.php';

$ini_array = loadConfigFile();
$is_debug = loadConfigOption($ini_array, "debug", "general");
$headstart_path = loadConfigOption($ini_array, "headstart_path", "general");

$is_embed = getParam("embed", INPUT_GET, FILTER_VALIDATE_BOOLEAN, true);
?>

<div id="visualization" class="headstart"></div>
<script type="text/javascript" src="../js/knowledge-map.js"></script>
<script>
        $(document).ready(function () {
            headstart.start();
        })

</script>

<script>
    <?php if ($is_embed): ?>

        $(document).ready( function () {
            $(window).on("resize", function () {
                let debug = <?php echo ($is_debug)?("true"):("false") ?>
                
                let div_height = calcDivHeight(debug);
                $("#visualization").css("height", div_height + "px")
            });
            $(window).trigger('resize');
        });

    <?php endif ?>
</script>
