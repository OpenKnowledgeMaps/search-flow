var calcDivHeight = function (debug) {

    let height = $(window).height();
    let width = $(window).width();
    let calculated_height = 0;
    let calculation_method = "";

    if(height <= 730 || width < 904 || (width >= 985 && width  < 1070)) {
        calculation_method = "Height calculation min_height";
        calculated_height = 689;              
     } else if (width >= 904 && width <= 984) {
         calculation_method = "Height calculation no. 1";
        calculated_height = 670 + (width - 904);
    } else if (height >= 890 && width >= 1070 && width < 1400) {
        calculation_method = "Height calculation no. 2";
        calculated_height = 670 + (width - 1070)/2;
    } else if (width >= 1441 && height >= 1053) {
        calculation_method = "Height calculation large";
        calculated_height = 1000; 
    } else if (height >= 988 && height < 1053 && width >= 1404 && width < 1435) {
        calculation_method = "Height calculation no. 3";
        calculated_height = 670 + (width - 1170);
    }  else {
        calculation_method = "Height calculation default";
        calculated_height = $(window).height() - $("header").outerHeight();
    }
    
    if(debug) {
        console.log("Height: " +height);
        console.log("Width: " +width);
        console.log("Calculation method: " +calculation_method);
        console.log("Calculated height: " +calculated_height);
    }
    
    return calculated_height;
}

