<?php
include_once dirname(__FILE__) . '../../lib/load-config.php';
include_once dirname(__FILE__). '../../lib/get-params.php';

$ini_array = loadConfigFile();
$is_debug = loadConfigOption($ini_array, "debug", "general");
$searchflow_path = loadConfigOption($ini_array, "searchflow_path", "general");
$headstart_path = loadConfigOption($ini_array, "headstart_path", "general");

// This fixes a bug in iOS Safari where an inactive tab would forget the post 
// parameters - usually when the user opens a different tab while waiting for
// a map to be created.
$service = getParam("service", INPUT_GET, FILTER_SANITIZE_STRING, true);
$id_param = getParam("id", INPUT_GET, FILTER_SANITIZE_STRING, true);
if($id_param === false) {
    $id_param = "";
}

if(isset($_SESSION['post']) && isset($_SESSION['post'][$id_param]) && isset($_SESSION['post'][$id_param]["unique_id"]) 
        && $_SESSION['post'][$id_param]["unique_id"] === $id_param) {
    $_POST = $_SESSION['post'][$id_param];
}

function packParamsJSON($params_array, $post_params) {

    if($params_array === null) {
        return null;
    }

    $output_array = array();

    foreach ($params_array as $entry) {
        $current_params = $post_params[$entry];
        $output_array[$entry] = $current_params;
    }

    return json_encode($output_array);
}

function createID($string_array) {
    $string_to_hash = implode(" ", $string_array);
    return md5($string_to_hash);
}

$unique_id = "";
$dirty_query = "";

if(!empty($_POST)) {
    $post_array = $_POST;
    $dirty_query = $post_array["q"];
    
    if(!isset($post_array["unique_id"])) {
        $query = addslashes(trim(strtolower(strip_tags($dirty_query))));
        
        $date = new DateTime();
        $post_array["today"] = $date->format('Y-m-d');

        $params_array = array();
        switch ($service) {
            case "base":
                $params_array = array("from", "to", "document_types", "sorting", "min_descsize");
                break;
            
            case "pubmed":
                $params_array = array("from", "to", "sorting");
                if(isset($post_array["article_types"])) {
                    $params_array[] = "article_types";
                }
                break;
            
            case "doaj":
                $params_array = array("from", "to", "today", "sorting");
                break;
            
            case "plos":
                $params_array = array("article_types", "journals", "from", "to", "sorting");
                break;
        }

        $params_json = packParamsJSON($params_array, $post_array);
        $unique_id = createID(array($query, $params_json));

        $post_array["q"] = $query;
        $post_array["unique_id"] = $unique_id;
        $_SESSION['post'][$unique_id] = $post_array;
    } else {
        $unique_id = $post_array["unique_id"];
    }
    
    $post_data = json_encode($post_array);
}
?>

<style>
#progressbar .ui-widget-header {
    background: #e55137;
    border: 1px solid #DDDDDD;
    color: #333333;
    font-weight: bold;
}
</style>
<script src="<?php echo $searchflow_path ?>js/search.js"></script>
<script>
<?php
    if(isset($post_data)) {
        echo "var post_data = " . $post_data . ";\n";
    }

?>
</script>

<div id="progress" class="mittig">
    <!-- screen while knowledge map is loading -->
    <div id="active_state" class="search_active_state" style="text-align: center;">

        <h3 id="waiting-title" class="waiting-title2"></h3>

        <div id="progressbar"></div>

        <p id="status" class="animated-ellipsis">
        </p>
    </div>

    <!-- screen when knowledge map has failed -->
    <div id="error_state" class="search_error_state nodisplay" style="text-align: left !important;">
        <h3 class="waiting-title" id="error-title" style="color: #e55137;"></h3>
        <p id="error-reason"></p>
        <p id="error-remedy"></p>
        <p id="error-more-info"></p>

        <div id="new_search_form" class="noresults-search-form nodisplay">
            <h3 id="try-again-title" class="waiting-title"></h3>
            <script>
                var search_term_focus = true;
                var show_filters = true;
            </script>
            <?php
                $default_lib = $service;
                $search_query = htmlspecialchars(stripslashes($dirty_query));
                include(dirname(__FILE__). '/search-form.php');
            ?>
            <script>
                $("#searchform").attr("target", "");
            </script>  
        </div>

        <p id="error-contact"></p>
        <p class="try-now" style="text-align: left !important; margin:30px 0 0;">
            <a id="error-resolution" class="donate-now nodisplay"></a>
        </p>
    </div>
</div>

 <script>
            $("#waiting-title").html(waiting_page_texts.waiting_title);
            $("#status").html(waiting_page_texts.status_waiting);
            $("#try-again-title").html(waiting_page_texts.try_again_title);
            
            var service = "<?php echo $service ?>";
            var unique_id = "<?php echo (isset($unique_id)?($unique_id):("")) ?>";
            
            //If the page is called without any data or the ID is missing, redirect to index page
            if(typeof post_data === "undefined" || unique_id === "") {
                errorOccurred();
                redirectToIndex();
                throw new Error("No post data or ID missing");
            }
            
            const params = new URLSearchParams(location.search);
            params.set('id', unique_id);
            window.history.replaceState({}, '', `${location.pathname}?${params}`);

            var script = "";
            var vis_page = "";
            var milliseconds_progressbar = 800;
            var max_length_search_term_short = 115;
            var timeout = 120000;

            var search_aborted = false;
            var error_occurred = false;
            
            var not_enough_results_links = add_not_enough_results_links;
            
            search_options.options.find(function(item) {
                if (item.id === service) {
                    script = item.script;
                    milliseconds_progressbar = item.milliseconds_progressbar;
                    max_length_search_term_short = item.max_length_search_term_short;
                    timeout = item.timeout;
                }
            });

            let search_term = getPostData(post_data, "q", "string").replace(/[\\]/g, "");
            let search_term_short = getSearchTermShort(search_term);

            writeSearchTerm('search_term', search_term_short, search_term);

            executeSearchRequest("<?php echo $headstart_path ?>server/services/" + script, post_data, service, search_term_short, search_term, timeout);

            var check_fallback_interval = null;
            var check_fallback_timeout = 
                            window.setTimeout(function () {
                                check_fallback_interval = window.setInterval(fallbackCheck, 4000
                                , "<?php echo $headstart_path ?>server/services/getLastVersion.php?service=" + service + "&vis_id="
                                , unique_id);
                            }, 10000);
                            
            const tick_interval = 1;
            const tick_increment = 2;

            $("#progressbar").progressbar();
            $("#progressbar").progressbar("value", 2);

            var progessbar_timeout = window.setTimeout(tick_function, tick_interval * milliseconds_progressbar);
           
        </script>