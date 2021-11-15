<?php
include_once dirname(__FILE__). '../../../php/get-params.php';

$service = getParam("service", INPUT_GET, FILTER_SANITIZE_STRING, true);

if (substr($service, -2) === 'sg') {
    include('streamgraph.php');
} else {
    include('knowledge-map.php');
}
?>