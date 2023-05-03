"use strict";


import {DEFAULT_FROM, DEFAULT_TO, PUBMED_DEFAULT_FROM} from "../options/timespan.js";

const e = React.createElement;


const InlineDatePicker = ({service, name, label, value, setValue}) => {

    // decision to use stabValue and stabService is made for show/hide normally the clear-date functionality:
    const [stabValue, setStabValue] = React.useState(value);
    const [stabService, setStabService] = React.useState(service);

    function setDefaultFrom() {
        if (service === "pubmed") {
            setValue(PUBMED_DEFAULT_FROM)
            setStabValue(PUBMED_DEFAULT_FROM)
        } else if (service === "base") {
            setValue(DEFAULT_FROM)
            setStabValue(DEFAULT_FROM)
        }
    }

    function setDefaultTo() {
        setValue(DEFAULT_TO)
        setStabValue(DEFAULT_TO)
    }

    if (stabService !== service) {
        if (name === "from") {
            setDefaultFrom()
        } else if (name === "to") {
            setDefaultTo()
        }
        setStabService(service)
    }

    // for now not using this function but keeping it here for future use
    function clearValue(name) {
        if (name === "from") {
            setDefaultFrom()
        }
        if (name === "to") {
            setDefaultTo()
        }
    }

    // for determining whether to show the clear date icon

    function isEqual(name, stabValue) {
        switch (name) {
            case "to":
                return stabValue === DEFAULT_TO;
            case "from":
                return stabValue === (service === "pubmed" ? PUBMED_DEFAULT_FROM : DEFAULT_FROM);
            default:
                return false;
        }
    }

    return e("div",
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
                    type: "date",
                    value: stabValue,
                    "aria-label": label,
                    min: (service === "pubmed" ? PUBMED_DEFAULT_FROM : DEFAULT_FROM),
                    max: DEFAULT_TO,
                    onChange: (e) => {
                        setValue(e.target.value)
                        setStabValue(e.target.value)
                    },
                },
            ),
            !isEqual(name, stabValue) &&
            e("i", {
                id: `${name}-clear-date`,
                className: "fa fa-times-circle custom-icons clear-date-btn",
                "aria-label": "Clear date",
                tabIndex: "0",
                role: "button",
                onClick: () => {
                    clearValue(name)
                },
                onKeyDown: (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        clearValue(name);
                        e.preventDefault();
                    }
                },
            }),
        ),
    );
};

export default InlineDatePicker;
