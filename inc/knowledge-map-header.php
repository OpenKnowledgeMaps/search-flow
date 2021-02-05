<?php
include_once dirname(__FILE__) . '../../lib/load-config.php';
include_once dirname(__FILE__). '../../lib/get-params.php';
include_once dirname(__FILE__). '../../conf/config.php';

$ini_array = loadConfigFile();
$headstart_path = loadConfigOption($ini_array, "headstart_path", "general");

$id_get = getParam("id", INPUT_GET, FILTER_SANITIZE_STRING, true);
$id = ($id_get !== false && $id_get !== "") ? ($id_get) : ($search_flow_config["vis_default_id"]);

$protocol_server = getParam("HTTPS", INPUT_SERVER, FILTER_SANITIZE_STRING, true, true);
$protocol = $protocol_server !== false && $protocol_server !== 'off' ? 'https:' : 'http:';

$custom_title = 
        ($search_flow_config["enable_custom_title"])
            ?(getParam("custom_title", INPUT_GET, FILTER_SANITIZE_STRING, true, true))
            :(false);

$has_custom_title = ($custom_title !== false)?(true):(false);

$is_embed = getParam("embed", INPUT_GET, FILTER_VALIDATE_BOOLEAN, true);

$context_json = curl_get_contents($protocol . $headstart_path . "server/services/getContext.php?vis_id=$id");
$context = json_decode($context_json);

$query = (isset($context) && $context->query !== null) ? ($context->query) : ($search_flow_config["vis_default_id"]);
$query = preg_replace("/\\\\\"/", "&quot;", $query);
$query = preg_replace("/\\\'/", "&apos;", $query);

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
?>

