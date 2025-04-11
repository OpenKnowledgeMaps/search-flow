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
<?php
    // Getting parsed url with parts such as host or path that can be used later
    $hs_url = parse_url($headstart_path);

    // Relative path to the headstart.php
    $rel_path = rtrim($hs_url['path'], '/') . '/dist/headstart.php';

    // Getting absolute path to the current file
    $current_path = dirname(__FILE__);

    // TODO: Remove after functionality review
    error_log("(visualization.php) current_path: " . $current_path);
    error_log("(visualization.php) hs_url: " . print_r($hs_url, true));

    // Defining amount of levels in the headstart path
    $path_parts = explode('/', trim($hs_url['path'], '/'));
    $extra_levels = max(count($path_parts) - 1, 0); // minus one, because headstart is the root

    // Defining relative root with basic level up ('/../../../') and
    // defined amount of levels in the headstart path
    $relative_root = $current_path . str_repeat('/..', 3 + $extra_levels);

    // Defining project root
    $project_root = realpath($relative_root);

    // TODO: Remove after functionality review
    error_log("visualization.php: project_root = " . $project_root);

    // Preparing the full path to the headstart.php file
    $headstart_full_path = $project_root . $rel_path;

    // TODO: Remove after functionality review
    error_log("visualization.php: computed path = " . $headstart_full_path);

    // Check that headstart.php exists or showing understandable error in the logs
    if (!file_exists($headstart_full_path)) {
        error_log("ERROR: headstart.php not found at $headstart_full_path");
    } else {
        include $headstart_full_path;
    }
?>
<script type="text/javascript">
    $(document).ready(function () {
        headstart.start();
    })
</script>
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

