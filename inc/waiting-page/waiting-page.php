<?php
include_once dirname(__FILE__) . '../../../php/load-config.php';
include_once dirname(__FILE__) . '../../../php/get-params.php';
include_once dirname(__FILE__) . '../../../conf/config.php';

$ini_array = loadConfigFile();
$is_debug = loadConfigOption($ini_array, "debug", "general");
$searchflow_path = loadConfigOption($ini_array, "searchflow_path", "general");
$search_form_page = $search_flow_config["search_form_page"];
$headstart_path = loadConfigOption($ini_array, "headstart_path", "general");
$enable_get_requests = loadConfigOption($ini_array, "enable_get_requests", "general");
$vis_page = $search_flow_config["vis_page"];
$filter_options = $search_flow_config["filter_options"];

// Log to the browser console
function logToConsole($data)
{
    $output = $data;
    if (is_array($output)) {
        // $output = implode(',', $output);
        $output = http_build_query($output, '', ', ');
    }
    echo "<script>console.log('Debug Objects: " . $output . "' );</script>";
}

// This fixes a bug in iOS Safari where an inactive tab would forget the post 
// parameters - usually when the user opens a different tab while waiting for
// a map to be created.
$service = getParam("service", INPUT_GET, FILTER_SANITIZE_STRING, true);
$id_param = getParam("id", INPUT_GET, FILTER_SANITIZE_STRING, true);
if ($id_param === false) {
    $id_param = "";
}

$is_embed = getParam("embed", INPUT_GET, FILTER_VALIDATE_BOOLEAN, true) || $search_flow_config["force_embed"];

if (
    isset($_SESSION['post']) && isset($_SESSION['post'][$id_param]) && isset($_SESSION['post'][$id_param]["unique_id"])
    && $_SESSION['post'][$id_param]["unique_id"] === $id_param
) {
    $_POST = $_SESSION['post'][$id_param];
}

function packParamsJSON($params_array, $post_params)
{

    if ($params_array === null) {
        return null;
    }

    $output_array = array();

    foreach ($params_array as $entry) {
        if (array_key_exists($entry, $post_params)) {
            $output_array[$entry] = $post_params[$entry];
        }
    }

    return json_encode($output_array);
}

function createID($string_array)
{
    $string_to_hash = implode(" ", $string_array);
    return md5($string_to_hash);
}

function createGetRequestArray($get_query, $service, $filter_options, $get_q_advanced)
{
    global $search_flow_config, $is_embed;

    $ret_array = [
        "q" => $get_query
    ];
    if ($get_q_advanced !== false) {
        $ret_array["q_advanced"] = $get_q_advanced;
    }

    // Check for params from search form
    if (array_key_exists("options_" . $service, $filter_options)) {
        $current_options = $filter_options["options_" . $service];
        foreach ($current_options["dropdowns"] as $options) {
            $param = $options["id"];

            if ($options["multiple"] === true) {
                $param_get = getParam($param, INPUT_GET, FILTER_SANITIZE_STRING, true, true, FILTER_REQUIRE_ARRAY);
            } else {
                $param_get = getParam($param, INPUT_GET, FILTER_SANITIZE_STRING, true, true);
            }

            if ($param_get !== false) {
                $ret_array[$param] = $param_get;
            } else {
                if ($options["id"] === "time_range" || $options["id"] === "year_range") {

                    $range = ($options["id"] === "time_range") ? ("time_range") : ("year_range");
                    $is_custom_date = false;

                    $param_from = getParam("from", INPUT_GET, FILTER_SANITIZE_STRING, true, true);
                    $param_to = getParam("to", INPUT_GET, FILTER_SANITIZE_STRING, true, true);

                    if ($param_from === false) {
                        $ret_array["from"] = $current_options["start_date"];
                    } else {
                        $ret_array["from"] = $param_from;
                        $is_custom_date = true;
                    }

                    if ($param_to === false) {
                        $date = new DateTime();

                        if (isset($current_options["end_date"])) {
                            $to_date = $current_options["end_date"];
                        } else if ($range === "time_range") {
                            $to_date = $date->format("Y-m-d");
                        } else if ($range === "year_range") {
                            $to_date = $date->format("Y");
                        }

                        $ret_array["to"] = $to_date;
                    } else {
                        $ret_array["to"] = $param_to;
                        $is_custom_date = true;
                    }

                    if ($is_custom_date) {
                        $ret_array[$range] = $is_embed ? "custom-range" : "user-defined";
                    }

                } else if ($options["multiple"] === true) {
                    $id_array = [];
                    foreach ($options["fields"] as $field) {
                        if (isset($field["selected"]) && $field["selected"] === true) {
                            $id_array[] = $field["id"];
                        }
                    }
                    $ret_array[$param] = $id_array;
                } else {
                    $ret_array[$param] = $options["fields"][0]["id"];
                }
            }
        }
    }

    // Check for params from search form
    if (isset($search_flow_config["optional_get_params"][$service])) {
        foreach ($search_flow_config["optional_get_params"][$service] as $optional_param => $optional_param_type) {
            if ($optional_param_type === "array") {
                // force string to array conversion for backward compatibility of GET-API
                $param_get = getParam($optional_param, INPUT_GET, FILTER_SANITIZE_STRING, true, true, FILTER_FORCE_ARRAY);
            } else {
                $param_get = getParam($optional_param, INPUT_GET, FILTER_SANITIZE_STRING, true, true);
            }
            // prevent double string sanitization for q_advanced
            if ($param_get !== false && $optional_param != "q_advanced") {
                $ret_array[$optional_param] = $param_get;
            }
        }
    }

    return $ret_array;
}

$request_type = getParam("type", INPUT_GET, FILTER_SANITIZE_STRING, true, true);
switch ($service) {
    case "openaire":
        $get_query = getParam("project_id", INPUT_GET, FILTER_SANITIZE_STRING, true, true, FILTER_FLAG_NO_ENCODE_QUOTES);
        break;
    case "orcid":
        $get_query = getParam("orcid", INPUT_GET, FILTER_SANITIZE_STRING, true, true, FILTER_FLAG_NO_ENCODE_QUOTES);
        break;
    default:
        $get_query = getParam("q", INPUT_GET, FILTER_SANITIZE_STRING, true, true, FILTER_FLAG_NO_ENCODE_QUOTES);
        break;
}

$get_q_advanced = getParam("q_advanced", INPUT_GET, FILTER_SANITIZE_STRING, true, true, FILTER_FLAG_NO_ENCODE_QUOTES);
$unique_id = "";
$dirty_query = "";
$dirty_q_advanced = "";
$post_array = array();
$has_sufficient_data = false;

if (!empty($_POST)) {
    $post_array = $_POST;
    if (array_key_exists("q", $post_array)) {
        $dirty_query = $post_array["q"];
    }
    if (array_key_exists("q_advanced", $post_array)) {
        $dirty_q_advanced = $post_array["q_advanced"];
    }
    if (array_key_exists("orcid", $post_array)) {
        $dirty_query = $post_array["orcid"];
    }
    $has_sufficient_data = true;
}

# this is where the request is translated from GET request to POST
if (
    $enable_get_requests && $request_type === "get"
    && $service !== false && $service !== null
) {

    $post_array = createGetRequestArray($get_query, $service, $filter_options, $get_q_advanced);
    $dirty_query = $get_query;
    $has_sufficient_data = true;
}

if ($has_sufficient_data) {
    if (!isset($post_array["unique_id"])) {
        $query = addslashes(trim(strtolower(strip_tags($dirty_query))));

        $date = new DateTime();
        $post_array["today"] = $date->format('Y-m-d');

        $params_array = $search_flow_config["params_arrays"][$service];
        if (isset($search_flow_config["optional_get_params"][$service])) {
            foreach ($search_flow_config["optional_get_params"][$service] as $optional_param) {
                foreach ($search_flow_config["optional_get_params"][$service] as $optional_param => $optional_param_type) {
                    $params_array[] = $optional_param;
                }
            }
        }
        if ($service === "base") {
            // re-establish historic order for backwards ID compatibility
            // from, to, document_types, sorting, min_descsize, repo, coll, vis_type, lang_id, q_advanced, exclude_date_filters, custom_title, custom_clustering
            $historic_params_order = array("from", "to", "document_types", "sorting", "min_descsize", "repo",
            "coll", "vis_type", "lang_id", "q_advanced", "exclude_date_filters", "custom_title", "custom_clustering");
            $reordered_params = array();
            foreach($historic_params_order as $param) {
                if (isset($post_array[$param])) {
                    $reordered_params[] = $param;
                    }
                }
            foreach($params_array as $param) {
                if (!in_array($param, $reordered_params)) {
                    $reordered_params[] = $param;
                    }
            }
            $params_array = $reordered_params;
        }
        $params_json = packParamsJSON($params_array, $post_array);
        if (!empty($query)) {
            $unique_id = createID(array($query, $params_json));
        }
        if (empty($query)) {
            $unique_id = createID(array($params_json));
        }
        if ($service == "openaire") {
            $query = addslashes(trim(strip_tags($dirty_query)));
            $unique_id = createID(array($query, $params_json));
        }
        $post_array["q"] = $query;
        $post_array["unique_id"] = $unique_id;
        $_SESSION['post'][$unique_id] = $post_array;
    } else {
        $unique_id = $post_array["unique_id"];
    }

    $post_array["service"] = $service;
    $post_array["optradio"] = $service;
    $post_array["embed"] = $is_embed;
    $post_data = json_encode($post_array);
}
?>

<script src="<?php echo $searchflow_path ?>js/search.js?v=2023-04-24"></script>
<script>
    <?php if (isset($post_data)): ?>
        var post_data = <?php echo $post_data; ?>;
    <?php endif; ?>
</script>


<div id="progress" class="waiting-page center-div">
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


        <?php if ($service != "openaire") { ?>
            <p id="error-more-info"></p>
        <?php } ?>

        <div id="new_search_form" class="noresults-search-form nodisplay">
            <?php
            if ($service == "openaire") {
            } else { ?>
                <h3 id="try-again-title" class="waiting-title"></h3>
            <?php } ?>
            <?php
            if ($service == "openaire") {
            } else {
                $default_lib = $service;
                $search_query = htmlspecialchars(stripslashes($dirty_query));
                // TODO: right now orcid doens't support options
                $open_options = ($service !== 'orcid');
                if ($is_embed && substr($service, 0, 6) !== "triple") {
                    include(dirname(__FILE__) . '/../search-form/new-search-form.php');
                } else {
                    include(dirname(__FILE__) . '/../search-form/search-form.php');
                }
            }
            ?>
            <script>
                $("#searchform").attr("target", "");
            </script>
        </div>

        <p id="error-contact"></p>
        <?php
        if ($service == "openaire") {
        } else { ?>
            <p class="try-now" style="text-align: left !important; margin:30px 0 0;">
                <a id="error-resolution-link" class="basic-button nodisplay"></a>
            <p id="error-resolution-countdown" class="error-countdown nodisplay">
                <span class="count-label"></span> <span class="count-value"></span>
            </p>
            </p>
        <?php } ?>
    </div>

</div>

<script>
    const params = new URLSearchParams(location.search);
    var service = params.get("service");
    var unique_id = "<?php echo $unique_id ?? '' ?>";

    if (typeof post_data !== "undefined" && post_data.orcid && service === 'orcid') {
        $("#waiting-title").html(
            `Your knowledge map for <span class="bold">researcher ${post_data.orcid}</span> is being created!`
        );
    } else {
        $("#waiting-title").html(search_flow_config.waiting_page_texts.waiting_title);
    }

    $("#status").html(search_flow_config.waiting_page_texts.status_waiting);
    $("#try-again-title").html(search_flow_config.waiting_page_texts.try_again_title);

    //If the page is called without any data or the ID/service parameter is missing, redirect to index page            
    if (typeof post_data === "undefined" || unique_id === "" || service === null) {
        errorOccurred();

        const is_triple = typeof service === "string" && service.startsWith("triple");
        const embed_mode = <?php echo $is_embed ? "true" : "false"; ?> && !is_triple;
        let form_address = "<?php echo $search_form_page; ?>";
        if (embed_mode) {
            // best effort: pass all query params to the search box component
            form_address = `embedded_searchbox${window.location.search}`;
        }

        redirectToIndex(form_address, embed_mode, service);
        throw new Error("No post data or ID missing");
    }

    params.set('id', unique_id);
    window.history.replaceState({}, '', `${location.pathname}?${params}`);

    var script = "";
    var vis_page = "<?php echo $vis_page ?>";
    var milliseconds_progressbar = 800;
    var max_length_search_term_short = 115;
    var timeout = 120000;

    var search_aborted = false;
    var error_occurred = false;

    var not_enough_results_links = search_flow_config.waiting_page_options.add_not_enough_results_links;

    search_flow_config.search_options.options.find(function (item) {
        if (item.id === service) {
            script = item.script;
            milliseconds_progressbar = item.milliseconds_progressbar;
            max_length_search_term_short = item.max_length_search_term_short;
            timeout = item.timeout;
            $(".vis_type_name").text(post_data && post_data.vis_type === "timeline" ? "streamgraph" : "knowledge map");
        }
        // this manual injection is necessary at this point because we can't add it in search_options.php as a 
        // normal service, because we don't want it to show up in the search box for now.
        if (service === "openaire") {
            script = "searchOpenAire.php";
            timeout = 240000;
        }
        if (service === "orcid") {
            script = "searchORCID.php";
            timeout = 600000;
        }
    });

    let search_term = getPostData(post_data, "q", "string").replace(/[\\]/g, "");
    if (post_data["q_advanced"] === false) {
        post_data["q_advanced"] = "undefined";
    }
    let search_term_advanced = getPostData(post_data, "q_advanced", "string").replace(/[\\]/g, "");
    let terms = [search_term, search_term_advanced].filter(element => {
        return element !== '';
    });
    let search_term_short = getSearchTermShort(terms.join(" and "));

    // take search_term(s) and write them to the element with id #search_term
    writeSearchTerm('search_term', search_term_short, terms.join(" "));
    if (service === "openaire") {
        $("#waiting_title_query_prefix").text("project ");
    }
    if (service === "orcid") {
        $("#waiting_title_query_prefix").text("researcher ");
    }


    executeSearchRequest("<?php echo $headstart_path ?>server/services/" + script, post_data, service, search_term_short, search_term, timeout, vis_page);

    var check_fallback_interval = null;
    var check_fallback_timeout =
        window.setTimeout(function () {
            check_fallback_interval = window.setInterval(fallbackCheck, 4000
                , "<?php echo $headstart_path ?>server/services/getLastVersion.php?service=" + service + "&vis_id="
                , unique_id
                , vis_page
                , service
                , post_data);
        }, 10000);

    const tick_interval = 1;
    const tick_increment = 2;

    $("#progressbar").progressbar();
    $("#progressbar").progressbar("value", 2);

    var progressbar_timeout = window.setTimeout(tick_function, tick_interval * milliseconds_progressbar);

</script>