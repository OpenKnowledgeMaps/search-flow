<?php
function loadConfigFile() {
    $LOCAL_INI_FILE = dirname(__FILE__) . "/../config_local.ini";
    $DEFAULT_INI_FILE = dirname(__FILE__) . "/../config.ini";
    
    $ini_array = array();
    
    if(file_exists($LOCAL_INI_FILE)) {
        $ini_array = parse_ini_file($LOCAL_INI_FILE, true);
    } else if(file_exists($DEFAULT_INI_FILE)) {
        $ini_array = parse_ini_file($DEFAULT_INI_FILE, true);
    } else {
        die("No config file found at " . $LOCAL_INI_FILE);
    }
    
    return $ini_array;
}

function loadConfigOption($ini_array, $key, $section = null) {
    $current_array = $ini_array;
    
    if($section != null) {
        if(isset($ini_array[$section])) {
            $current_array = $ini_array[$section];
        } else {
            die("Config section is not set: $section");
        }
    }
    
    if(isset($current_array[$key])) {
        return $current_array[$key];
    } else {
        die("Config option is not set: $key");
    }
}

?>
