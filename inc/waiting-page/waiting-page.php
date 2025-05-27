<?php
include_once dirname(__FILE__) . '../../../php/load-config.php';
include_once dirname(__FILE__) . '../../../php/get-params.php';
include_once dirname(__FILE__) . '../../../php/sanitize-string.php';
include_once dirname(__FILE__) . '../../../php/sanitize-if-string.php';
include_once dirname(__FILE__) . '../../../conf/config.php';
include_once dirname(__FILE__) . '../../../php/sanitize-recursive.php';
include_once dirname(__FILE__) . '../../../php/normalizeAndSanitizeString.php';

/**
 * Connect objects with configuration and get the
 * necessary settings from these objects
 */
$ini_array = loadConfigFile();
$is_debug = loadConfigOption($ini_array, "debug", "general");
$searchflow_path = loadConfigOption($ini_array, "searchflow_path", "general");
$search_form_page = $search_flow_config["search_form_page"];
$headstart_path = loadConfigOption($ini_array, "headstart_path", "general");
$enable_get_requests = loadConfigOption($ini_array, "enable_get_requests", "general");
$vis_page = $search_flow_config["vis_page"];
$filter_options = $search_flow_config["filter_options"];

/**
 * The function accepts a value of any type. If the value is a string,
 * it passes it to the normalizeAndSanitizeString function and returns
 * the result of its work (a string without HTML encoding and tags).
 * @param mixed $value - Some value.
 * @return mixed - Initial value or formatted string.
 */
function normalizeAndSanitizeIfValueIsString(mixed $value): mixed {
    if (!is_string($value)) {
        return $value;
    }

    return normalizeAndSanitizeString($value);
}

/**
 * This function allows to output logs to the BROWSER console.
 * @param mixed $data - data that should be displayed in a browser.
 * @return void - This function is not returning anything.
 */
function logToConsole($data)
{
    $output = $data;
    if (is_array($output)) {
        // $output = implode(',', $output);
        $output = http_build_query($output, '', ', ');
    }
    echo "<script>console.log('Debug Objects: " . $output . "' );</script>";
}

// TODO: Discuss what is exactly a bugfix and how lines 61-73 are connected to it.
// Maybe only lines 68-73 are related to this? (if statement).
/**
 * This fixes a bug in iOS Safari where an inactive tab would forget
 * the post parameters - usually when the user opens a different tab
 * while waiting for a map to be created.
 *
 */
$is_embed = getParam("embed", INPUT_GET, FILTER_VALIDATE_BOOLEAN, true) || $search_flow_config["force_embed"];
$service_raw = getParam("service", INPUT_GET, FILTER_DEFAULT, true);
$id_param_raw = getParam("id", INPUT_GET, FILTER_DEFAULT, true);

$service = sanitize_string($service_raw);
$id_param = sanitize_string($id_param_raw);

if (
    isset($_SESSION['post']) && isset($_SESSION['post'][$id_param]) && isset($_SESSION['post'][$id_param]["unique_id"])
    && $_SESSION['post'][$id_param]["unique_id"] === $id_param
) {
    $_POST = $_SESSION['post'][$id_param];
}

/**
 * This function accepts two arrays: parameters ($params_array) and parameters
 * from $_POST ($post_params). It returns a new array with parameters in json format.
 * This new array contains the parameters that were in the parameters array from $_POST.
 * If parameters from the first received array ($params_array) were not found in the second
 * array ($post_params), they are ignored.
 * @param mixed $params_array - Array of parameters whose occurrence should be checked.
 * @param mixed $post_params - Array of all possible parameters.
 * @return string|null - This function can return a variety of value options:
 * null: If $params_array is null, the function returns null;
 * string: If $output_array is not empty and is successfully encoded into JSON, json_encode returns a string.
 * bool: If json_encode fails to encode the array (for example, if there are encoding
 * problems), the function returns false.
 */
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

/**
 * This function generates the id for the visualization based on an array of strings.
 * @param mixed $string_array - Array with strings;
 * @return string - Visualization id.
 */
function createID($string_array)
{
    $string_to_hash = implode(" ", $string_array);
    return md5($string_to_hash);
}

/**
 * This function forms an array of GET request parameters based on input data and settings.
 * @param mixed $get_query - Query string.
 * @param mixed $service - Service (BASE, PubMed, ORCID, etc.).
 * @param mixed $filter_options - Predefined in the config filter options.
 * @param mixed $get_q_advanced - Advanced query string.
 * @return array<array|string>|array{q: mixed}
 */
function createGetRequestArray($get_query, $service, $filter_options, $get_q_advanced)
{
    global $search_flow_config, $is_embed;

    /**
     * Creation of the array that will be returned back from the function.
     * Also the query string is added into it and advanced query string too,
     * if it is defined
     */
    $ret_array = [
        "q" => $get_query
    ];
    if ($get_q_advanced !== false) {
        $ret_array["q_advanced"] = $get_q_advanced;
    }

    // TODO: Ask question why it is working? Because there are only options_plos index in the $filter_options
    // error_log("Service: " . print_r($service, true));
    /**
     * Check if parameters related to the $service in $filter_options are exists.
     */
    if (array_key_exists("options_" . $service, $filter_options)) {
        // error_log("Full key: options_$service");
        // error_log("Filter options: " . print_r($filter_options, true));
        $current_options = $filter_options["options_" . $service];
        // error_log("Current options: " . print_r($current_options, true));

        /**
         * For each parameter:
         * - If the parameter allows multiple selections, retrieves an array of values with getParam, applying filters.
         * - If the parameter is not an array, treats it as a string.
         * - Parameters are cleared using sanitize_recursive or sanitize_string.
         * - If the value of the parameter is not false, adds it to the array.
         * - If the value is false and the parameter is a time range or a range of years, processes the time parameters
         * from and to, setting default or custom dates.
         */
        foreach ($current_options["dropdowns"] as $options) {
            $param = $options["id"];

            if ($options["multiple"] === true) {
                $param_get = getParam($param, INPUT_GET, FILTER_DEFAULT, true, true, ['flags' => FILTER_REQUIRE_ARRAY]);
            } else {
                $param_get = getParam($param, INPUT_GET, FILTER_DEFAULT, true, true);
            }

            // Sanitize parameter
            if (is_array($param_get)) {
                $param_get = sanitize_recursive($param_get);
            } elseif (is_string($param_get)) {
                $param_get = sanitize_string($param_get);
            }

            if ($param_get !== false) {
                $ret_array[$param] = $param_get;
            } else {
                if ($options["id"] === "time_range" || $options["id"] === "year_range") {

                    $range = ($options["id"] === "time_range") ? ("time_range") : ("year_range");
                    $is_custom_date = false;

                    $param_from_raw = getParam("from", INPUT_GET, FILTER_DEFAULT, true, true);
                    $param_to_raw = getParam("to", INPUT_GET, FILTER_DEFAULT, true, true);

                    $param_from = sanitize_if_string($param_from_raw);
                    $param_to = sanitize_if_string($param_to_raw);

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

    /**
     * Checks for additional optional parameters in $search_flow_config.
     * Retrieves them with getParam and adds them to the array if they are
     * not false and are not q_advanced.
     */
    if (isset($search_flow_config["optional_get_params"][$service])) {
        foreach ($search_flow_config["optional_get_params"][$service] as $optional_param => $optional_param_type) {
            if ($optional_param_type === "array") {
                // force string to array conversion for backward compatibility of GET-API
                $param_get = getParam($optional_param, INPUT_GET, FILTER_DEFAULT, true, true, ['flags' => FILTER_FORCE_ARRAY]);
            } else {
                $param_get = getParam($optional_param, INPUT_GET, FILTER_DEFAULT, true, true);
            }
            // prevent double string sanitization for q_advanced
            if ($param_get !== false && $optional_param != "q_advanced") {
                $ret_array[$optional_param] = $param_get;
            }
        }
    }

    return $ret_array;
}

/**
 * Code below is getting the request type (e.g. GET).
 * Type will be received from the request URL, so it will be sanitized before use.
 */
$request_type_raw = getParam("type", INPUT_GET, FILTER_DEFAULT, true, true);
$request_type = sanitize_if_string($request_type_raw);

/**
 * Depending on the service that should be used we are retrieving the query value
 * from the different URL parameters. Then it is sanitizing too.
 */
switch ($service) {
    case "openaire":
        $get_query_raw = getParam("project_id", INPUT_GET, FILTER_DEFAULT, true, true, ['flags' => FILTER_FLAG_NO_ENCODE_QUOTES]);
        break;
    case "orcid":
        $get_query_raw = getParam("orcid", INPUT_GET, FILTER_DEFAULT, true, true, ['flags' => FILTER_FLAG_NO_ENCODE_QUOTES]);
        break;
    default:
        $get_query_raw = getParam("q", INPUT_GET, FILTER_DEFAULT, true, true, ['flags' => FILTER_FLAG_NO_ENCODE_QUOTES]);
        break;
}

$get_query = normalizeAndSanitizeIfValueIsString($get_query_raw);

// TODO: Ask to explain what is q_advanced and for what is used for?
/**
 * Retrieving the advanced query from the request too. And sanitizing it.
 */
$get_q_advanced_raw = getParam("q_advanced", INPUT_GET, FILTER_DEFAULT, true, true, ['flags' => FILTER_FLAG_NO_ENCODE_QUOTES]);
$get_q_advanced = normalizeAndSanitizeIfValueIsString($get_q_advanced_raw);

/**
 * Defining the variables with default values
 */
$unique_id = "";
$dirty_query = "";
$dirty_q_advanced = "";
$post_array = array();
$has_sufficient_data = false; // Flag that says that all data processed

/**
 * If $_POST array is not empty, then it will be assign to the $post_array variable.
 * And we will get the query (-advance too) string from it.
 */
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
/**
 * If get requests are enabled and the request is GET then post array will be created
 * from it or from the predefined configuration parameters. It is possible only if $service
 * is defined from the $_POST request parameters.
 */
if (
    $enable_get_requests && $request_type === "get"
    && $service !== false && $service !== null
) {

    $post_array = createGetRequestArray($get_query, $service, $filter_options, $get_q_advanced);
    $dirty_query = $get_query;
    $has_sufficient_data = true;
}

/**
 * If all data was provided and script was possible to process everything correctly...
 */
if ($has_sufficient_data) {
    /**
     * Checks that visualization id is not created and creates it using createID function.
     * Or retrieve it from the request parameters.
     */
    if (!isset($post_array["unique_id"])) {
        /**
         * Preparing the query string and date of the visualization creation.
         */
        $query = addslashes(trim(strtolower(strip_tags($dirty_query))));

        $date = new DateTime();
        $post_array["today"] = $date->format('Y-m-d');

        /**
         * Then retrieve an array of mandatory parameters for the specified service and
         * add optional parameters to it, if they exist.
         */
        $params_array = $search_flow_config["params_arrays"][$service];
        if (isset($search_flow_config["optional_get_params"][$service])) {
            foreach ($search_flow_config["optional_get_params"][$service] as $optional_param) {
                foreach ($search_flow_config["optional_get_params"][$service] as $optional_param => $optional_param_type) {
                    $params_array[] = $optional_param;
                }
            }
        }

        /**
         * Re-establish historic order for backwards ID compatibility:
         * [from, to, document_types, sorting, min_descsize, repo, coll, vis_type, lang_id, q_advanced, exclude_date_filters, custom_title, custom_clustering].
         */
        if ($service === "base") {
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

    function sanitizeQuery(input) {
        // Decode HTML entities
        const htmlDecoded = new DOMParser().parseFromString(input, "text/html").documentElement.textContent;

        // Remove backslashes
        const unescaped = htmlDecoded.replace(/\\(["'])/g, '$1');

        // Remove HTML tags (basic XSS strip)
        const tagStripped = unescaped.replace(/<[^>]*>/g, '');

        return tagStripped;
    }

    let search_term = sanitizeQuery(getPostData(post_data, "q", "string"));
    if (post_data["q_advanced"] === false) {
        post_data["q_advanced"] = "undefined";
    }
    let search_term_advanced = sanitizeQuery(getPostData(post_data, "q_advanced", "string"));
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