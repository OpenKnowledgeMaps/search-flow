"use strict";


import {DEFAULT_FROM, DEFAULT_TO} from "../options/timespan.js";

const e = React.createElement;

const InlineDatePicker = ({name, label, value, setValue, defaultValue}) => {

    function clearValue(name) {
        if (name === "from") {
            setValue(DEFAULT_FROM)
        }
        if (name === "to") {
            setValue(DEFAULT_TO)
        }
    }

    return e(
        "div",
        {
            className: "inline_date_picker filter-label",
        },
        e("strong", {style: {width: 50}}, label),
        e("div", {style: {position: "relative", width: "100%", right: 0}},
            e("input", {
                    id: `${name}-date-field`,
                    name: name,
                    className: "date-field",
                    type: "date",
                    value: value,
                    onChange: (e) => {
                        setValue(e.target.value)
                    },
                },
            ),
            // (value !== defaultValue && value) &&
            e("i", {
                id: `${name}-clear-date`,
                style: {fontSize: 14, position: "absolute", left: 100, top: 18},
                className: "fa fa-times-circle custom-icons",
                onClick: () => {
                    clearValue(name)
                }
            }),

            e("i", {
                style: {fontSize: 14, position: "absolute", right: 15, top: 18},
                className: "fa fa-calendar custom-icons",
            }),
        ),
    );
//     return e(
//         "span",
//         {className: "inline_date_picker"},
//         e("strong", null, label + ": "),
//         e("input", {
//             type: "date",
//             value,
//             onChange: (e) => setValue(e.target.value),
//         })
//     );
};

export default InlineDatePicker;
