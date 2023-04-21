"use strict";


import {DEFAULT_FROM, DEFAULT_TO, PUBMED_DEFAULT_FROM} from "../options/timespan.js";

const e = React.createElement;


const InlineDatePicker = ({service, name, label, value, setValue}) => {


    // console.log("enter value", value);
    // console.log("enter service", service);
    // const [stabValue, setStabValue] = React.useState(value);
    // const [stabService, setStabService] = React.useState(service);


    // for now not using this function but keeping it here for future use
    // if (stabService !== service) {
    //     if (name === "from") {
    //         if (service === "pubmed") {
    //             setValue(PUBMED_DEFAULT_FROM)
    //             setStabValue(PUBMED_DEFAULT_FROM)
    //         } else if (service === "base") {
    //             setValue(DEFAULT_FROM)
    //             setStabValue(DEFAULT_FROM)
    //         }
    //     }
    //     setStabService(service)
    // }

    // for now not using this function but keeping it here for future use
    // function clearValue(name) {
    //     if (name === "from") {
    //         if (service === "pubmed") {
    //             setValue(PUBMED_DEFAULT_FROM)
    //             setStabValue(PUBMED_DEFAULT_FROM)
    //         } else if (service === "base") {
    //             setValue(DEFAULT_FROM)
    //             setStabValue(DEFAULT_FROM)
    //
    //         }
    //     }
    //     if (name === "to") {
    //         setValue(DEFAULT_TO)
    //         setStabValue(DEFAULT_TO)
    //     }
    // }

    // for now not using this function but keeping it here for future use
    // for determining whether to show the clear date icon

    function isEqual(name, stabValue) {
        console.log("stabValue", stabValue);
        if (name === "to") {
            if (stabValue === DEFAULT_TO) {
                return true;
            }
        }
        if (name === "from") {
            if (service === "pubmed") {
                if (stabValue === PUBMED_DEFAULT_FROM) {
                    return true;
                }
            } else if (service === "base") {
                if (stabValue === DEFAULT_FROM) {
                    return true;
                }
            }
        }
        return false;
    }


    return e(
        "div",
        {
            className: "inline_date_picker filter-label",
        },
        e("div", {className: "time-labels"}, label),
        e("div", {style: {position: "relative", width: "100%", right: 0}},
            e("input", {
                    id: `${name}-date-field`,
                    name: name,
                    required: true,
                    className: "date-field",
                    // 'dateformat': "YYYY-MM-DD",
                    // 'data-date-format': "YYYY MMMM DD",
                    type: "date",
                    value: value,
                // value: stabValue,
                    onChange: (e) => {
                        setValue(e.target.value)
                        // setStabValue(e.target.value)
                    },
                },
            ),

            // hiding clear date for now, but keeping it here for future use

            // !isEqual(name, stabValue) &&
            // e("i", {
            //     id: `${name}-clear-date`,
            //     style: {fontSize: 14, position: "absolute", left: 115, top: 18},
            //     className: "fa fa-times-circle custom-icons",
            //     onClick: () => {
            //         clearValue(name)
            //     }
            // }),
        ),
    );
};

export default InlineDatePicker;
