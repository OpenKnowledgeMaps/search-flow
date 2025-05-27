<?php

/**
 * Purpose of the function: HTML/XSS string cleaning and special characters decoding.
 * The function processes the data before sending it to some API and further for
 * processing on the server.
 * @param string $str - String that should be converted.
 * @return string - Converted string.
 */
function normalize_and_sanitize(string $str): string {
    // Remove special codes from the encoding table (&quot; -> ")
    $normalizedString = html_entity_decode($str, ENT_QUOTES | ENT_HTML5, 'UTF-8');

    // Remove escaping
    $normalizedString = stripslashes($normalizedString);

    // Prevent XSS from embedded HTML tags
    $normalizedString = strip_tags($normalizedString);

    return $normalizedString;
}

?>