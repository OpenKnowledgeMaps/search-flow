<?php

require 'vendor/autoload.php';


/* This script converts a json in a file "object.json" in the same directory
 * into an associative PHP array.
 * 
 * Requires composer - install VarExporter with "composer install" in this
 * directory.
 * 
 * Note: the script tries to fix certain problems of JavaScript JSON such as
 * missing quotes for keys. However, it cannot fix double commas or commas
 * after the last item in an array or object. These you have to fix yourself,
 * as they will result in a null output.
 * 
 */
use Brick\VarExporter\VarExporter;

$json = file_get_contents("object.json");
$json = preg_replace(["/\\\\'/", '/("(.*?)"|(\w+))(\s*:\s*(".*?"|.))/s'], ["'", '"$2$3"$4'], $json);
$array = json_decode($json, true);

echo "<pre>" . VarExporter::export($array, VarExporter::INLINE_NUMERIC_SCALAR_ARRAY) . "</pre>";

?>