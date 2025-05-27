<?php

/**
 * HTML special characters escaping for safe output.
 * @param mixed $value - Value that must be encoded.
 * @param int $flags - Flags of the htmlspecialchars in-built function.
 * @param string $encoding - Encoding format.
 * @param string $default - Default value that will be returned if $value is not a string.
 * @return string - Encoded string or $default.
 */
function sanitize_string(
  mixed $value,
  int $flags = ENT_QUOTES | ENT_SUBSTITUTE,
  string $encoding = 'UTF-8',
  string $default = ''): string {
    return is_string($value) ? htmlspecialchars($value, $flags, $encoding) : $default;
}

?>