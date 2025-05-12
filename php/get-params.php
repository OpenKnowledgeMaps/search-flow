<?php

// Returns parameter or false (in case of error/filter failure)
function getParam(
    string $param,
    int $where = INPUT_GET,
    ?int $filter = FILTER_DEFAULT,
    bool $return_false_nonexistent = false,
    bool $return_false_null = false,
    array $options = []
) {
    $boolean_filter = $filter === FILTER_VALIDATE_BOOLEAN;

    $has_options = !empty($options);
    $filter_value = $filter ?? FILTER_DEFAULT;

    $return_param = $has_options
        ? filter_input($where, $param, $filter_value, ['options' => $options])
        : filter_input($where, $param, $filter_value);

    // Return false if parameter is not exists or is not equals to flag (for example - not an array)
    if ($return_param === false) {
        // ..., but if this parameter was required — die()
        if (!$boolean_filter && !$return_false_nonexistent) {
            die("An error occurred while retrieving the following parameter: " . $param);
        }

        return false;
    }

    // If its required to return false when param is equal null
    if ($return_false_null && $return_param === null) {
        return false;
    }

    return $return_param;
}

?>

