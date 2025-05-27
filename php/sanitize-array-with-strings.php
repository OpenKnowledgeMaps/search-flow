<?php

include_once dirname(__FILE__) . '/sanitize-if-string.php';

/**
 * Safely encodes string for HTML context in array.
 * @param mixed $value - Array with strings.
 * @param int $flags - Flags of the htmlspecialchars in-built function.
 * @param string $encoding - Encoding format.
 * @return string[] - Array with encoded strings.
 */
function sanitize_array_with_strings(mixed $value, int $flags = ENT_QUOTES | ENT_SUBSTITUTE, string $encoding = 'UTF-8'): mixed {
    if (is_array($value)) {
        return array_map(fn($v) => sanitize_array_with_strings($v, $flags, $encoding), $value);
    }

    // Fallback if value is not array
    return sanitize_if_string($value);
}

?>