<?php

/**
 * This function remove HTML tags from the string and decoding special chars.
 * @param string $str - String that should be sanitized
 * @param bool|null $is_replace_quotes - Flag that configure is quotes should be decoded
 * @return string - Sanitized string
 */
function sanitize_string(string $str, bool $is_replace_quotes = false): string {
    $processed_string = strip_tags($str);
    $processed_string = htmlspecialchars($processed_string, ENT_NOQUOTES, 'UTF-8');

    // For backward compatibility with FILTER_SANITIZE_STRING
    if ($is_replace_quotes) {
        $processed_string = str_replace("'", '&#39;', $processed_string);
        $processed_string = str_replace('"', '&#34;', $processed_string);
    }

    return $processed_string;
}

?>