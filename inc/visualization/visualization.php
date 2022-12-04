<!DOCTYPE html>
<?php
include_once dirname(__FILE__). '../../../conf/config.php';
include_once dirname(__FILE__). '../../../php/header-main.php';

if ($detect->isMobile()):
?>
    <script>
        //Enable overflow on mobile so you can pinch and zoom
        $(document).ready(function () {
            $(".overflow-vis").css("overflow-y", "visible");
        })
    </script>
<?php endif; ?>

<script src="<?php echo $searchflow_path ?>js/visualization.js"></script>
<script>
    <?php if (!$is_embed): ?>
        $(document).ready( function () {
            $(window).on("resize", function () {
                let debug = <?php echo ($is_debug)?("true"):("false") ?>
                
                let div_height = calcDivHeight(debug
                                                , search_flow_config.vis_page_options.fit_to_page);
                $("#visualization").css("min-height", div_height + "px")
            });
            $(window).trigger('resize');
        });
    <?php endif ?>
</script>


<div class="overflow-vis">

    <div id="visualization" style="background-color:white;"></div>

</div>
<script>
    var div_height = calcDivHeight(<?php echo ($is_debug)?("true"):("false") ?>
                                    , search_flow_config.vis_page_options.fit_to_page);

    <?php if (!$is_embed): ?>
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
<script>
    if("options_<?php echo $service ?>" in search_flow_config.search_options.filter_options) {
        data_config.options = search_flow_config.search_options.filter_options.options_<?php echo $service ?>.dropdowns;
    }
    <?php if($has_custom_title): ?>
            data_config.create_title_from_context_style = "custom";
            data_config.custom_title = "<?php echo $custom_title?>";       
    <?php endif ?>

    <?php if($has_vis_type && $vis_type === "timeline"): ?>
        data_config.is_streamgraph = true;
        data_config.show_area = false;
        data_config.faqs_button = false;
    <?php endif; ?>

    <?php if($is_embed): ?>
        data_config.credit_embed = true;
    <?php endif ?>
</script>

