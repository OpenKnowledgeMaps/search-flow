<?php

/**
 * Retrieves an input parameter from GET or POST with optional flags and error handling.
 *
 * @param string $param - The name of the parameter (e.g., 'q', 'document_types').
 * @param int $where - The input source: INPUT_GET or INPUT_POST.
 * @param int|null $filter - PHP filter (e.g., FILTER_SANITIZE_STRING, FILTER_VALIDATE_BOOLEAN).
 * @param bool $return_false_nonexistent - If true, return false when the parameter is missing (instead of process dying).
 * @param bool $return_false_null - If true, return false when the value is null.
 * @param array $options - Filter options (e.g., ['flags' => FILTER_REQUIRE_ARRAY]).
 *
 * @return mixed - The filtered value (string, array, boolean) or false/null based on flags.
 */
function getParam(
    string $param,
    int $where = INPUT_GET,
    ?int $filter = FILTER_DEFAULT,
    bool $return_false_nonexistent = false,
    bool $return_false_null = false,
    array $options = []
): mixed {
    // Special case: if we're using FILTER_VALIDATE_BOOLEAN, filter_input returns null (not false) when missing
    $boolean_filter = $filter === FILTER_VALIDATE_BOOLEAN;

    /**
     * Call filter_input with or without options:
     * - Returns string/int/array if the parameter exists and passes filtering.
     * - Returns false if filtering fails or value is invalid.
     * - Returns null only for FILTER_VALIDATE_BOOLEAN when input is missing.
     *
     * IMPORTANT: $options should use 'flags' directly: ['flags' => FILTER_REQUIRE_ARRAY].
     */
    $return_param = !empty($options)
        ? filter_input($where, $param, $filter ?? FILTER_DEFAULT, $options)
        : filter_input($where, $param, $filter ?? FILTER_DEFAULT);

    /**
     * If the filter is not BOOLEAN and the parameter is missing (false), and we’re not allowed to return false,
     * then process will be killed.
     */
    if (!$boolean_filter && $return_param === false && !$return_false_nonexistent) {
        die("An error occurred while retrieving the following parameter: " . $param);
    }

    /**
     * If we're using FILTER_VALIDATE_BOOLEAN and the result is null (not provided),
     * we explicitly return false to unify missing-boolean handling.
     */
    if ($boolean_filter && $return_param === null) {
        return false;
    }

    /**
     * If parameter is missing and user has allowed fallback with $return_false_nonexistent — return false.
     */
    if ($return_param === false && $return_false_nonexistent) {
        return false;
    }

    /**
     * If the flag $return_false_null is true and result is null — return false.
     */
    if ($return_false_null && $return_param === null) {
        return false;
    }

    // Otherwise, return the valid value
    return $return_param;
}

?>