<?php

include_once dirname(__FILE__) . '/sanitize-string.php';

/**
 * Sanitizing string if it was passed. If received value is not a string it
 * will be returned without any changes.
 * @param mixed $value - Possible string to be sanitized.
 * @return mixed - Sanitized string or other received value without changes.
 */
function sanitize_if_string(mixed $value): mixed {
  // Check that received value is a string
  if (is_string($value)) {
      return sanitize_string($value);
  }

  // If value is not a string it will be returned without changes
  return $value;
}

?>