<?php

include_once dirname(__FILE__) . '../../../php/get-params.php';
include_once dirname(__FILE__) . '../../../php/sanitize-string.php';

$service_raw = getParam("service", INPUT_GET, null, true);
$vis_type_raw = getParam("vis_type", INPUT_GET, null, true, true);

$service = sanitize_string($service_raw);
$vis_type = sanitize_string($vis_type_raw);

$is_vis_type_is_timeline = $vis_type === 'timeline';
$is_service_name_contains_sg_letters = substr($service, -2) === 'sg';
$is_post_array_contains_timeline_vis_type = (isset($post_array) && isset($post_array['vis_type']) && $post_array['vis_type'] === 'timeline');

if (
  $is_vis_type_is_timeline ||
  $is_service_name_contains_sg_letters ||
  $is_post_array_contains_timeline_vis_type
) {
  include('streamgraph.php');
} else {
  include('knowledge-map.php');
}

?>