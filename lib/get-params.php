<?php

// Returns parameter or false in case of error/filter failure
function getParam($param, $where = INPUT_GET, $filter = FILTER_SANITIZE_STRING
                    , $return_false_nonexistent = false) {
    
    $local_filter = $filter | FILTER_NULL_ON_FAILURE; 
    
    $return_param = filter_input($where, $param, $local_filter);
    
    if($return_param === NULL) {
        die("An error ocurred while retrieving the following parameter:" . $param);
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
    
    return $return_param;
}

?>

