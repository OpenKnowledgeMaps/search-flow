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

    // PHP 8.1+: filter must be int, not null
    // This if statement check that it is int or using FILTER_DEFAULT
    if ($filter !== null) {
        $return_param = !empty($options)
            ? filter_input($where, $param, $filter, ['options' => $options])
            : filter_input($where, $param, $filter);
    } else {
        $return_param = filter_input($where, $param, FILTER_DEFAULT);
    }

    if (!$boolean_filter && $return_param === false) {
        die("An error occurred while retrieving the following parameter: {$param}");
    } else if ($boolean_filter && $return_param === null) {
        return false;
    }

    if ($return_param === false) {
        if ($filter === FILTER_VALIDATE_BOOLEAN) {
            return false;
        } else if ($return_false_nonexistent === true) {
            return false;
        } else {
            die("The following parameter does not exist: {$param}");
        }
    }

    if ($return_false_null && $return_param === null) {
        return false;
    }

    return $return_param;
}

?>

