var calcDivHeight = function (debug, fit_to_page) {

    let height = $(window).height();
    let width = $(window).width();
    let calculated_height = 0;
    let calculation_method = "";
    
    if(fit_to_page) {
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
    } else {
        if(height <= 670 || width < 904 || (width >= 985 && width  < 1070)) {
            calculation_method = "Height calculation min_height";
            calculated_height = 670;    
        } else if (width >= 904 && width <= 984) {
            calculation_method = "Height calculation no. 1";
            calculated_height = 670 + (width - 904);
        } else if (width >= 1070 && width < 1400) {
            calculation_method = "Height calculation no. 2";
            calculated_height = 670 + (width - 1070)/2;
        } else if (width > 1400 && width < 1600) {
            calculation_method = "Height calculation no. 3";
            let calc_width = 835 + (width - 1400)
            calculated_height = (calc_width > 897)?(897):(calc_width);
        }  else {
            calculation_method = "Height calculation default";
            calculated_height = $(window).height();
        }
    }
    
    if(debug) {
        console.log("Fit to page: " +fit_to_page);
        console.log("Height: " +height);
        console.log("Width: " +width);
        console.log("Calculation method: " +calculation_method);
        console.log("Calculated height: " +calculated_height);
    }
    
    return calculated_height;
}

