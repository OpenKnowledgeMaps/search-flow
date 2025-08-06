<?php

require_once __DIR__ . '../../../php/get-params.php';
require_once __DIR__ . '/../../php/normalize-string.php';
require_once __DIR__ . '/../../php/sanitize-string.php';

$service = getParam("service", INPUT_GET, FILTER_DEFAULT, true);
$service = normalize_string($service);
$service = sanitize_string($service, true);

$vis_type = getParam("vis_type", INPUT_GET, FILTER_DEFAULT, true, true);
$vis_type = normalize_string($vis_type);
$vis_type = sanitize_string($vis_type, true);

if (substr($service, -2) === 'sg' || $vis_type === 'timeline' || (isset($post_array) && isset($post_array["vis_type"]) && $post_array["vis_type"] === 'timeline')) {
    include('streamgraph.php');
} else {
    include('knowledge-map.php');
}

?>