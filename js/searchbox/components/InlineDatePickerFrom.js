"use strict";


import {DEFAULT_FROM, DEFAULT_TO, PUBMED_DEFAULT_FROM} from "../options/timespan.js";

const {useState, useEffect, createElement: e} = React;


const InlineDatePickerFrom = ({service, name, valueBase, valuePubmed, setValue}) => {

    const [fromDate, setFromDate] = useState('');

    useEffect(() => {
        if (service === "base") {
            setFromDate(valueBase);
        }
        if (service === "pubmed") {
            setFromDate(valuePubmed);
        }
    }, [service]);


    const handleFromChange = (event) => {
        setFromDate(event.target.value);
        setValue(event.target.value)
    };

    function clearValue() {
        if (service === "base") {
            setFromDate(DEFAULT_FROM);
            setValue(DEFAULT_FROM)
        }
        if (service === "pubmed") {
            setFromDate(PUBMED_DEFAULT_FROM);
            setValue(PUBMED_DEFAULT_FROM)
        }
    }

    function isEqual(service) {
        switch (service) {
            case "base":
                return fromDate === DEFAULT_FROM;
            case "pubmed":
                return fromDate === PUBMED_DEFAULT_FROM;
            default:
                return false;
        }
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
                    value: fromDate,
                    "aria-label": name.toUpperCase(),
                    min: (service === "pubmed" ? PUBMED_DEFAULT_FROM : 'false'),
                    max: DEFAULT_TO,
                    onChange: handleFromChange,
                },
            ),
            !isEqual(service) &&
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
                        clearValue();
                        e.preventDefault();
                    }
                },
            }),
        ),
    );
};

export default InlineDatePickerFrom;
