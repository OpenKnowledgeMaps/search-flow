<?php
include_once dirname(__FILE__). '../../../conf/config.php';
include_once dirname(__FILE__). '../../../php/header-head.php';

$docker_internal = loadConfigOption($ini_array, "docker_internal", "general");
$headstart_path_docker_internal = loadConfigOption($ini_array, "headstart_path_docker_internal", "general");

$id = getParam("id", INPUT_GET, FILTER_SANITIZE_STRING, true);
if ($search_flow_config["enable_default_id"] && ($id === false || $id === "")) {
    $id = $search_flow_config["default_id"];
}

$vis_type = getParam("vis_type", INPUT_GET, FILTER_SANITIZE_STRING, true, true);
$has_vis_type = ($vis_type === false)?(false):(true);

$protocol_server = getParam("HTTPS", INPUT_SERVER, FILTER_SANITIZE_STRING, true, true);
$protocol = $protocol_server !== false && $protocol_server !== 'off' ? 'https:' : 'http:';

$custom_title = 
        ($search_flow_config["enable_custom_title"])
            ?(getParam("custom_title", INPUT_GET, FILTER_SANITIZE_STRING, true, true))
            :(false);

$has_custom_title = ($custom_title !== false)?(true):(false);

$is_embed = getParam("embed", INPUT_GET, FILTER_VALIDATE_BOOLEAN, true) || $search_flow_config["force_embed"];

if($search_flow_config["vis_load_context"]) {
    if ($docker_internal) {
        $context_json = curl_get_contents($protocol . $headstart_path_docker_internal . "server/services/getContext.php?vis_id=$id");
    } else {
        $context_json = curl_get_contents($protocol . $headstart_path . "server/services/getContext.php?vis_id=$id");
    }
    $context = json_decode($context_json);

    $service = setVariableFromContext($context
                                        , "service"
                                        , $search_flow_config["enable_default_service"]
                                        , $search_flow_config["default_service"]);
    // zika map fix (service is in wrong format there)
    if ($service !== null && substr($service, 0, 4) === "PLOS") {
        $service = "plos";
    }

    $query = setVariableFromContext($context
                                        , "query"
                                        , $search_flow_config["enable_default_query"]
                                        , $search_flow_config["default_query"]);

    $query = preg_replace("/\\\\\"/", "&quot;", $query);
    $query = preg_replace("/\\\'/", "&apos;", $query);
    
    $timestamp = setVariableFromContext($context, "timestamp");
    
    $publication_year = ($timestamp !== null)
                                ? ((new DateTime($timestamp))->format('Y'))
                                 : ("n.d.");
    // Set the $custom_title_from_context variable based on the context
    $custom_title_from_context = setVariableFromContext($context, "custom_title");
//    $custom_title_from_context = $custom_title['custom_title'];

    var_dump('$context');
    var_dump($context);
    var_dump('$context->custom_title');
    var_dump($context->custom_title);
    var_dump('$custom_title_from_context ');
    var_dump('$custom_title_from_context = ', $custom_title_from_context);

    if ($custom_title_from_context !== null) {
        $custom_title_from_context = preg_replace("/\\\\\"/", "&quot;", $custom_title_from_context);
        $custom_title_from_context = preg_replace("/\\\'/", "&apos;", $custom_title_from_context);
        $custom_title = $custom_title_from_context;
        // Determine if $custom_title is not null
        $has_custom_title = (bool)$custom_title;
    }

}

function curl_get_contents($url) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    $data = curl_exec($ch);
    curl_close($ch);
    return $data;
}

function setVariableFromContext($context, $var, $enable_default = false, $default = null) {
    
    $ret_val = (isset($context) && property_exists($context, $var) && $context->{$var} !== null) 
                ? ($context->{$var}) 
                : (null);

    if($ret_val === null && $enable_default) {
        $ret_val = $default;
    }
    
    return $ret_val;
    
}

$citation_vis_type = $vis_type === "timeline" ? "Streamgraph" : "Knowledge Map";
$citation_title = $has_custom_title ? $custom_title : $query;
$citation_meta_string = $citation_vis_type . " for research on " . $citation_title;
?>

<!-- Zotero add-on metadata -->
<meta name="citation_author" content="Open Knowledge Maps" />
<meta name="citation_title" content="<?php echo $citation_meta_string ?>" />
<meta name="citation_date" content="<?php echo $timestamp !== null ? (new DateTime($timestamp))->format('Y-m-d') : "" ?>" />
