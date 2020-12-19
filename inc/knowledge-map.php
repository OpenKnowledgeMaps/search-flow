<!DOCTYPE html>
<?php
include_once dirname(__FILE__) . '../../lib/load-config.php';
include_once dirname(__FILE__). '../../lib/get-params.php';

$ini_array = loadConfigFile();
$is_debug = loadConfigOption($ini_array, "debug", "general");
$headstart_path = loadConfigOption($ini_array, "headstart_path", "general");
$searchflow_path = loadConfigOption($ini_array, "searchflow_path", "general");

$embed = getParam("embed", INPUT_GET, FILTER_VALIDATE_BOOLEAN, true);
?>
<script src="<?php echo $searchflow_path ?>js/knowledge-map.js"></script>
<script>
    <?php if (!$embed): ?>
        $(document).ready( function () {
            $(window).on("resize", function () {
                let debug = <?php echo ($is_debug)?("true"):("false") ?>
                
                let div_height = calcDivHeight(debug, fit_to_page);
                $("#visualization").css("height", div_height + "px")
            });
            $(window).trigger('resize');
        });
    <?php endif ?>
</script>


<div class="overflow-vis">

    <div id="visualization" style="background-color:white;"></div>

</div>
<script>
    var div_height = calcDivHeight(<?php echo ($is_debug)?("true"):("false") ?>, fit_to_page);

    <?php if (!$embed): ?>
        $(".overflow-vis").css("min-height", div_height + "px")
        $("#visualization").css("min-height", div_height + "px")
    <?php endif ?>
</script>
<script type="text/javascript" src="<?php echo $headstart_path ?>dist/headstart.js"></script>
<script type="text/javascript">
    $(document).ready(function () {
        headstart.start();
    })
</script>

<link rel="stylesheet" href="<?php echo $headstart_path ?>dist/headstart.css">

<?php if($has_custom_title): ?>
    <script>
        data_config.create_title_from_context_style = "custom";
        data_config.custom_title = "<?php echo $custom_title?>";
    </script>          
<?php endif ?>

<?php if($embed): ?>
    <script>
        data_config.credit_embed = true;
    </script>
<?php endif ?>

