<?php

/**
 * This function converts any string received from the client to the uniform
 * formatting (especially useful with strings that contained special characters that were replaced
 * with special codes from the encoding table). In the further, with this string the rest of the
 * server should work without problems. Also, this feature makes XSS attacks impossible because it removes
 * HTML tags from the string.
 * @param string $str - String that should be converted.
 * @return string - Converted string.
 */
function normalizeAndSanitizeString(string $str): string {
    // Remove special codes from the encoding table (&quot; -> ")
    $normalizedString = html_entity_decode($str, ENT_QUOTES | ENT_HTML5, 'UTF-8');

    // Remove escaping
    $normalizedString = stripslashes($normalizedString);

    // Prevent XSS from embedded HTML tags
    $normalizedString = strip_tags($normalizedString);

    return $normalizedString;
}

?>