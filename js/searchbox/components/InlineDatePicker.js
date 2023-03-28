"use strict";


import {DEFAULT_FROM, DEFAULT_TO, PUBMED_DEFAULT_FROM} from "../options/timespan.js";

const e = React.createElement;

const InlineDatePicker = ({service, name, label, value, setValue}) => {

    function clearValue(name) {
        if (name === "from") {
            service === "pubmed"
                ? setValue(PUBMED_DEFAULT_FROM)
                : setValue(DEFAULT_FROM)
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
                    onChange: (e) => {
                        setValue(e.target.value)
                    },
                },
            ),
            // (value !== defaultValue) &&
            e("i", {
                id: `${name}-clear-date`,
                style: {fontSize: 14, position: "absolute", left: 115, top: 18},
                className: "fa fa-times-circle custom-icons",
                onClick: () => {
                    clearValue(name)
                }
            }),

            e("i", {
                style: {fontSize: 14, position: "absolute", right: 15, top: 18},
                className: "fa fa-calendar custom-icons",
                // className: "fa-regular fa-calendar-days custom-icons",
            }),
        ),
    );
};

export default InlineDatePicker;
