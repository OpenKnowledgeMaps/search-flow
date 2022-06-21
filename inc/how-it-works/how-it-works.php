<?php
include_once dirname(__FILE__). '../../../php/get-params.php';

$service = getParam("service", INPUT_GET, FILTER_SANITIZE_STRING, true);
$vis_type = getParam("vis_type", INPUT_GET, FILTER_SANITIZE_STRING, true, true);

if (substr($service, -2) === 'sg' || $vis_type === 'timeline') {
    include('streamgraph.php');
} else {
    include('knowledge-map.php');
}
?>