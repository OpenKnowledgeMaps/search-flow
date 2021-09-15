<?php
include_once dirname(__FILE__). '../../../conf/config.php';
include_once dirname(__FILE__). '../../../php/header-head.php';

$id = getParam("id", INPUT_GET, FILTER_SANITIZE_STRING, true);
if($id === false || $id === "") {
    if($search_flow_config["enable_default_id"]) {
        $id = $search_flow_config["default_id"];
    } else {
        die("No or invalid visualization ID provided");
    }
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
    $context_json = curl_get_contents($protocol . $headstart_path . "server/services/getContext.php?vis_id=$id");
    $context = json_decode($context_json);

    $service = setVariableFromContext($context
                                        , "service"
                                        , $search_flow_config["enable_default_service"]
                                        , $search_flow_config["default_service"]);

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
?>