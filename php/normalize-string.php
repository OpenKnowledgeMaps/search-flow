<?php

/**
 * This function decodes special HTML characters.
 * @param string $str - String that should be normalized
 * @return string - Normalized string
 */
function normalize_string(string $str): string {
    $normalized_string = html_entity_decode($str, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $normalized_string = stripslashes($normalized_string);
    return $normalized_string;
}

?>