"use strict";


import {DEFAULT_FROM, DEFAULT_TO, PUBMED_DEFAULT_FROM} from "../options/timespan.js";

const {useState, createElement: e} = React;


const InlineDatePickerTo = ({service, name, value, setValueTo}) => {

    const [toDate, setToDate] = useState(value);

    const handleToChange = (event) => {
        setToDate(event.target.value);
        setValueTo(event.target.value)
    };

    function clearValue() {
        setToDate(DEFAULT_TO);
        setValueTo(DEFAULT_TO)
    }

    return e("div",
        {
            className: "inline_date_picker filter-label",
        },
        e("div", {className: "time-labels"}, name.toUpperCase()),
        e("div", {style: {position: "relative", width: "100%", right: 0}},
            e("input", {
                    id: `${name}-date-field`,
                    name: name,
                    required: true,
                    className: "date-field",
                    type: "date",
                    value: toDate,
                    "aria-label": name.toUpperCase(),
                    min: (service === "pubmed" ? PUBMED_DEFAULT_FROM : DEFAULT_FROM),
                    onChange: handleToChange,
                },
            ),
            toDate !== DEFAULT_TO &&
            e("i", {
                id: `${name}-clear-date`,
                className: "fa fa-times-circle custom-icons clear-date-btn",
                "aria-label": "Clear date",
                tabIndex: "0",
                role: "button",
                onClick: () => {
                    clearValue()
                },
                onKeyDown: (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        clearValue();
                        e.preventDefault();
                    }
                },
            }),
        ),
    );
};

export default InlineDatePickerTo;
