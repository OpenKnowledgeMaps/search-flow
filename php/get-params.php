<?php

// Returns parameter or false in case of error/filter failure
function getParam($param, $where = INPUT_GET, $filter = FILTER_SANITIZE_STRING
                    , $return_false_nonexistent = false
                    , $return_false_null = false
                    , $options = array()) {
    
   $boolean_filter = $filter === FILTER_VALIDATE_BOOLEAN;
    
   $return_param = filter_input($where, $param, $filter, $options);
    
    if(!$boolean_filter && $return_param === false) {
        die("An error ocurred while retrieving the following parameter: " . $param);
    } else if($boolean_filter && $return_param === null) {
        return false;
    }

    if($return_param === false) {
        if($filter === FILTER_VALIDATE_BOOLEAN) {
            return false;
        } else if ($return_false_nonexistent === true) {
            return false;
        } else {
            die("The following parameter does not exist: ". $param);
        }
    }
    
    if($return_false_null) {
        if($return_param === null) {
            return false;
        }
    }

    return $return_param;
}

?>

